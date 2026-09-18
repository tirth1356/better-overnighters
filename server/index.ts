import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { aiRouter } from './routes/ai.ts';
import { aiStatus } from './services/ai/index.ts';

// Loads GROQ_API_KEY from .env. The key stays in this process — it is never sent
// to the browser and never logged.
try {
  process.loadEnvFile();
} catch {
  /* no .env locally: the mock AI service takes over */
}

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ai: aiStatus() });
});

app.use('/api/ai', aiRouter);

app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  if (status >= 500) console.error('[api]', err.message);
  res.status(status).json({ error: err.message || 'Unexpected error' });
});

const port = Number(process.env.API_PORT) || 8787;
app.listen(port, () => {
  const { configured, model } = aiStatus();
  console.log(`[api] listening on http://localhost:${port}`);
  console.log(
    configured
      ? `[api] Groq configured — model: ${model}`
      : '[api] No GROQ_API_KEY found — serving MOCK AI responses',
  );
});
