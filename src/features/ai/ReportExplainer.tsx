import { Languages, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../../components/ui';
import { LANGUAGES, explainReport } from '../../lib/ai';
import type { Language, ReportExplanation } from '../../lib/ai';
import AiBanner from './AiBanner';
import './ai.css';

const FLAG_LABEL: Record<ReportExplanation['parameters'][number]['flag'], string> = {
  normal: 'In range',
  attention: 'Flagged',
  unclear: 'No range given',
};

/**
 * Report explanation in English, Hindi or Gujarati.
 *
 * Person 2: drop this straight into the report view and pass the extracted text
 * as `initialText` — everything below the text box is already wired to the API.
 */
export default function ReportExplainer({ initialText = '' }: { initialText?: string }) {
  const [text, setText] = useState(initialText);
  const [language, setLanguage] = useState<Language>('en');
  const [result, setResult] = useState<ReportExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async (lang: Language) => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      setResult(await explainReport(text, lang));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reach the AI service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        title="Explain a report"
        subtitle="Paste the text of a lab report or discharge summary."
        action={
          <div className="lang-switch" role="group" aria-label="Explanation language">
            {LANGUAGES.map((l) => (
              <button
                key={l.value}
                type="button"
                aria-pressed={language === l.value}
                onClick={() => {
                  setLanguage(l.value);
                  if (result) void run(l.value);
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        }
      >
        <div className="field">
          <label className="field__label" htmlFor="report-text">Report text</label>
          <textarea
            id="report-text"
            style={{ minHeight: 160 }}
            placeholder={'e.g.\nHbA1c: 7.4 % (ref 4.0–5.6)\nFasting glucose: 142 mg/dL (ref 70–100)'}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button type="button" className="btn" disabled={loading || !text.trim()} onClick={() => run(language)}>
          <Sparkles size={17} /> {loading ? 'Reading the report…' : 'Explain in simple words'}
        </button>
        {error && <p className="ai-disclaimer" role="alert">{error}</p>}
      </Card>

      {result && (
        <div style={{ marginTop: 'var(--space-5)', display: 'grid', gap: 'var(--space-5)' }}>
          <Card
            title="What this report says"
            action={<span className="pill"><Languages size={13} /> {LANGUAGES.find((l) => l.value === language)?.label}</span>}
          >
            <AiBanner meta={result.meta} />
            <p>{result.summary}</p>
          </Card>

          {result.parameters.length > 0 && (
            <Card title="Values in the report">
              <div style={{ overflowX: 'auto' }}>
                <table className="ai-table">
                  <thead>
                    <tr><th>Parameter</th><th>Value</th><th>What it measures</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {result.parameters.map((p) => (
                      <tr key={p.name}>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.value}</td>
                        <td>{p.meaning}</td>
                        <td><span className={`pill flag--${p.flag}`}>{FLAG_LABEL[p.flag]}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {result.terms.length > 0 && (
            <Card title="Terms explained">
              <div className="ai-terms">
                {result.terms.map((t) => (
                  <div key={t.term} className="ai-term">
                    <div className="ai-term__name">{t.term}</div>
                    <div className="ai-term__meaning">{t.meaning}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {result.questionsForDoctor.length > 0 && (
            <Card title="Questions to ask the doctor">
              <ul className="ai-questions">
                {result.questionsForDoctor.map((q) => <li key={q}>{q}</li>)}
              </ul>
            </Card>
          )}

          <p className="ai-disclaimer">{result.disclaimer}</p>
        </div>
      )}
    </>
  );
}
