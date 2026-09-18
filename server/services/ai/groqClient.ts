/**
 * The only file that knows about Groq.
 *
 * Everything else in services/ai calls `chat()` and stays provider-agnostic, so
 * swapping or adding a provider later means editing this file alone.
 */
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

export interface ChatOptions {
  /** Ask the provider for a JSON object rather than prose. */
  json?: boolean;
  temperature?: number;
}

export function isConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export function modelName(): string {
  return process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
}

export class AIError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

export async function chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new AIError('GROQ_API_KEY is not configured', 503);

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: modelName(),
      messages,
      temperature: options.temperature ?? 0.2,
      ...(options.json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!res.ok) {
    // Body may echo request details, never the key — but keep it short regardless.
    const detail = await res.text().catch(() => '');
    throw new AIError(`Groq request failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = body.choices?.[0]?.message?.content;
  if (!content) throw new AIError('Groq returned an empty response');
  return content;
}
