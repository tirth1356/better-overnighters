import { FlaskConical } from 'lucide-react';
import type { AIMeta } from '../../lib/ai';
import './ai.css';

/** Mock answers must never look real — this is the visible tell. */
export default function AiBanner({ meta }: { meta: AIMeta }) {
  if (meta.source !== 'mock') return null;
  return (
    <div className="ai-banner" role="status">
      <FlaskConical size={18} aria-hidden="true" />
      Development mock — no GROQ_API_KEY is configured, so this text is sample content, not a real
      AI reading of your document.
    </div>
  );
}
