import { Check, Mic, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LANGUAGES } from '@/lib/ai';
import type { Language } from '@/lib/ai';
import type { DoseSlot } from '@/lib/schedule';
import { listen, preferredEngine } from '@/lib/speech';
import { setDoseStatus } from '@/lib/store';
import { parseVoiceCommand } from '@/lib/voice';
import './voice.css';

const PROMPT: Record<Language, string> = {
  en: 'Say “I took my medicine”',
  hi: 'बोलिए “मैंने दवा ले ली”',
  gu: 'બોલો “મેં દવા લીધી”',
};

const BUTTON: Record<Language, { idle: string; listening: string }> = {
  en: { idle: 'Log a dose by voice', listening: 'Listening… tap to stop' },
  hi: { idle: 'बोलकर दवा दर्ज करें', listening: 'सुन रहे हैं… रोकने के लिए दबाएँ' },
  gu: { idle: 'બોલીને દવા નોંધો', listening: 'સાંભળી રહ્યા છીએ… રોકવા દબાવો' },
};

const pretty = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

/**
 * Log a dose by speaking, in English, Hindi or Gujarati.
 *
 * Built for the person actually taking the medicine, who may not read the
 * screen comfortably. Speech is only ever turned into one of two actions on a
 * dose that is already scheduled — it can never create or change a medicine.
 */
export default function VoiceDoseLogger({
  slots, date,
}: { slots: DoseSlot[]; date: string }) {
  const [language, setLanguage] = useState<Language>('en');
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState('');
  const [choices, setChoices] = useState<DoseSlot[]>([]);
  const [pendingAction, setPendingAction] = useState<'taken' | 'skipped'>('taken');
  const abort = useRef<AbortController | null>(null);

  useEffect(() => () => abort.current?.abort(), []);

  const open = slots.filter((s) => s.status === 'pending' || s.status === 'missed');

  const apply = (slot: DoseSlot, action: 'taken' | 'skipped') => {
    setDoseStatus(slot.medicine.id, date, slot.time, action);
    setChoices([]);
    setConfirmed(
      `${slot.medicine.name} ${slot.medicine.dosage} at ${pretty(slot.time)} — marked ${action}.`,
    );
  };

  const stop = () => {
    abort.current?.abort();
    setListening(false);
  };

  const start = async () => {
    setError('');
    setHeard('');
    setConfirmed('');
    setChoices([]);
    setListening(true);

    const controller = new AbortController();
    abort.current = controller;

    try {
      const transcript = await listen(language, controller.signal);
      setHeard(transcript);

      const intent = parseVoiceCommand(transcript, open);
      if (!intent.action) {
        setError('That did not sound like a dose. Try saying “taken” or “skipped”.');
      } else if (intent.slot) {
        apply(intent.slot, intent.action);
      } else if (intent.ambiguous) {
        setPendingAction(intent.action);
        setChoices(intent.candidates ?? open);
      } else {
        setError('There are no doses waiting to be logged right now.');
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setError(e instanceof Error ? e.message : 'Could not hear that. Please try again.');
      }
    } finally {
      setListening(false);
      abort.current = null;
    }
  };

  return (
    <div className="voice">
      <div className="voice__row">
        <button
          type="button"
          className={`voice__mic ${listening ? 'voice__mic--listening' : ''}`}
          onClick={listening ? stop : start}
          disabled={open.length === 0 && !listening}
          aria-pressed={listening}
        >
          {listening
            ? <><span className="voice__pulse" aria-hidden="true" /><Square size={18} aria-hidden="true" /> {BUTTON[language].listening}</>
            : <><Mic size={20} aria-hidden="true" /> {BUTTON[language].idle}</>}
        </button>

        <div className="voice__langs" role="group" aria-label="Speech language">
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              type="button"
              className="voice__lang"
              aria-pressed={language === l.value}
              onClick={() => setLanguage(l.value)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <p className="voice__hint">
        {open.length === 0
          ? 'Every dose for this day is already logged.'
          : `${PROMPT[language]} — or name one, like “evening Metformin taken”.`}
        {preferredEngine() === 'server' && ' Your browser cannot listen on its own, so the clip is sent to the app’s own server.'}
      </p>

      <div aria-live="polite" style={{ width: '100%', display: 'grid', gap: 'var(--space-3)' }}>
        {heard && <p className="voice__said">You said: <b>{heard}</b></p>}
        {confirmed && (
          <p className="voice__said"><Check size={16} aria-hidden="true" /> {confirmed}</p>
        )}
        {error && <p className="voice__error" role="alert">{error}</p>}

        {choices.length > 0 && (
          <>
            <p className="voice__hint">Which dose did you mean?</p>
            <div className="voice__choices">
              {choices.map((s) => (
                <button
                  key={`${s.medicine.id}-${s.time}`}
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => apply(s, pendingAction)}
                >
                  {s.medicine.name} · {pretty(s.time)}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
