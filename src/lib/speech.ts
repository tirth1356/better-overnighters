import type { Language } from './ai';

/**
 * Listening, with two engines.
 *
 * Where the browser can transcribe on its own (Chrome, Edge) it does — instant,
 * free, and the words never leave the device. Everywhere else the clip is
 * recorded and sent to the server, which holds the Groq key.
 */
export type SpeechEngine = 'browser' | 'server';

const BCP47: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  gu: 'gu-IN',
};

// The API is still vendor-prefixed in most shipping browsers.
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function recognitionCtor(): (new () => SpeechRecognitionLike) | undefined {
  const w = window as unknown as Record<string, new () => SpeechRecognitionLike>;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function browserCanListen(): boolean {
  return Boolean(recognitionCtor());
}

export function preferredEngine(): SpeechEngine {
  return browserCanListen() ? 'browser' : 'server';
}

export class SpeechUnavailable extends Error {}

/** Human-readable reasons, because a grandparent sees these. */
function describe(error: string): string {
  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access was blocked. Allow the microphone and try again.';
    case 'no-speech':
      return 'Nothing was heard. Please try again.';
    case 'audio-capture':
      return 'No microphone was found.';
    case 'network':
      return 'The speech service could not be reached.';
    default:
      return 'Could not understand that. Please try again.';
  }
}

/** One utterance from the browser's own recogniser. */
function listenInBrowser(language: Language, signal: AbortSignal): Promise<string> {
  const Ctor = recognitionCtor();
  if (!Ctor) return Promise.reject(new SpeechUnavailable('No browser speech recognition'));

  return new Promise((resolve, reject) => {
    const rec = new Ctor();
    rec.lang = BCP47[language];
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
    };

    rec.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript ?? '';
      finish(() => resolve(transcript));
    };
    rec.onerror = (e) => finish(() => reject(new Error(describe(e.error))));
    rec.onend = () => finish(() => reject(new Error(describe('no-speech'))));

    signal.addEventListener('abort', () => {
      rec.abort();
      finish(() => reject(new DOMException('Aborted', 'AbortError')));
    });

    rec.start();
  });
}

/** Record a short clip and let the server transcribe it. */
async function listenViaServer(language: Language, signal: AbortSignal): Promise<string> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new SpeechUnavailable('This browser cannot record audio');
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks: Blob[] = [];

  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });
  recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
  recorder.start();

  await new Promise<void>((resolve) => {
    const stop = () => {
      if (recorder.state !== 'inactive') recorder.stop();
      resolve();
    };
    signal.addEventListener('abort', stop, { once: true });
    // A dose command is short; cap the clip so nobody records forever.
    setTimeout(stop, 6000);
  });

  await stopped;
  stream.getTracks().forEach((t) => t.stop());

  const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
  if (blob.size === 0) throw new Error('Nothing was recorded. Please try again.');

  const res = await fetch(`/api/ai/transcribe?language=${language}`, {
    method: 'POST',
    headers: { 'Content-Type': blob.type },
    body: blob,
  });
  if (!res.ok) {
    const { error } = (await res.json().catch(() => ({ error: '' }))) as { error?: string };
    throw new Error(error || 'Could not transcribe that. Please try again.');
  }
  const { text } = (await res.json()) as { text: string };
  return text;
}

export function listen(
  language: Language,
  signal: AbortSignal,
): Promise<string> {
  return browserCanListen()
    ? listenInBrowser(language, signal)
    : listenViaServer(language, signal);
}
