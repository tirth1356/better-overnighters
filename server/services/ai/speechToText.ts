import { AIError } from './groqClient.ts';
import type { Language } from './types.ts';

/**
 * Speech-to-text through Groq's hosted Whisper.
 *
 * Only used where the browser has no Web Speech API — most people never reach
 * this path. Kept beside groqClient.ts because it is the same provider and the
 * same key, but it posts audio rather than chat messages.
 */
const GROQ_STT_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

export function sttModelName(): string {
  return process.env.GROQ_STT_MODEL || 'whisper-large-v3-turbo';
}

export async function transcribe(
  audio: Uint8Array,
  contentType: string,
  language: Language,
): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new AIError('GROQ_API_KEY is not configured', 503);

  // Whisper picks the file type from the name, so keep the extension honest.
  const ext = contentType.includes('wav') ? 'wav' : contentType.includes('ogg') ? 'ogg' : 'webm';
  const form = new FormData();
  form.append('file', new Blob([audio], { type: contentType }), `speech.${ext}`);
  form.append('model', sttModelName());
  form.append('language', language);
  // Nudge the model towards the words this feature actually expects to hear.
  form.append('prompt', 'The speaker is saying whether they have taken or skipped a medicine dose.');

  const res = await fetch(GROQ_STT_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new AIError(`Groq transcription failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  const body = (await res.json()) as { text?: string };
  if (typeof body.text !== 'string') throw new AIError('Groq returned no transcript');
  return body.text.trim();
}
