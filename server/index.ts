import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { aiRouter } from './routes/ai.ts';
import { aiStatus } from './services/ai/index.ts';
import { recordsRouter } from './routes/records.ts';
import { dbStatus, initDb } from './services/db.ts';

// Loads GROQ_API_KEY and DATABASE_URL from .env.
try {
  process.loadEnvFile();
} catch {
  /* no .env locally: mock AI and in-memory store take over */
}

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ai: aiStatus(), db: dbStatus() });
});

app.use('/api/ai', aiRouter);
app.use('/api/records', recordsRouter);

app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  if (status >= 500) console.error('[api]', err.message);
  res.status(status).json({ error: err.message || 'Unexpected error' });
});

const port = Number(process.env.API_PORT) || 8787;
app.listen(port, () => {
  const { configured, model } = aiStatus();
  const db = dbStatus();
  console.log(`[api] listening on http://localhost:${port}`);
  console.log(
    configured
      ? `[api] Groq configured — model: ${model}`
      : '[api] No GROQ_API_KEY found — serving MOCK AI responses',
  );
  if (db.configured) {
    console.log('[api] Neon SQL configured — connecting to database...');
    initDb().catch((err) => console.warn('[api] Neon initialization deferred:', err.message));
  } else {
    console.log('[api] No DATABASE_URL found in .env — using in-memory store for reports');
  }
});
