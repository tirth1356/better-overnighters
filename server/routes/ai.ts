import { Router, raw } from 'express';
import { compareReports, explainMedicalReport, extractPrescription, transcribeSpeech } from '../services/ai/index.ts';
import { isLanguage } from '../services/ai/prompts.ts';
import type { Language } from '../services/ai/types.ts';

/** Nothing bigger than this is worth sending to a model in one request. */
const MAX_TEXT = 40_000;

class BadRequest extends Error {
  status = 400;
}

function text(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new BadRequest(`"${field}" is required`);
  }
  if (value.length > MAX_TEXT) throw new BadRequest(`"${field}" is too long (max ${MAX_TEXT} characters)`);
  return value;
}

function language(value: unknown): Language {
  if (value === undefined) return 'en';
  if (!isLanguage(value)) throw new BadRequest('"language" must be one of: en, hi, gu');
  return value;
}

export const aiRouter = Router();

/** Used by Person 2's report UI. */
aiRouter.post('/explain-report', async (req, res, next) => {
  try {
    const { reportText, language: lang, context } = req.body ?? {};
    res.json(
      await explainMedicalReport({
        reportText: text(reportText, 'reportText'),
        language: language(lang),
        context: typeof context === 'string' ? context.slice(0, 500) : undefined,
      }),
    );
  } catch (err) {
    next(err);
  }
});

/** OCR'd prescription text in, draft medicine rows out. */
aiRouter.post('/extract-prescription', async (req, res, next) => {
  try {
    res.json(await extractPrescription(text(req.body?.prescriptionText, 'prescriptionText')));
  } catch (err) {
    next(err);
  }
});

aiRouter.post('/compare-reports', async (req, res, next) => {
  try {
    const { earlier, later, language: lang } = req.body ?? {};
    res.json(
      await compareReports({
        earlier: { label: String(earlier?.label ?? 'Earlier'), text: text(earlier?.text, 'earlier.text') },
        later: { label: String(later?.label ?? 'Later'), text: text(later?.text, 'later.text') },
        language: language(lang),
      }),
    );
  } catch (err) {
    next(err);
  }
});

/**
 * Speech-to-text for browsers without the Web Speech API.
 *
 * The audio arrives as a raw body rather than multipart: one recording, one
 * request, no upload parser to add. Capped well below anything a dose command
 * needs, so a stray large upload cannot tie up the model.
 */
const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

aiRouter.post(
  '/transcribe',
  raw({ type: ['audio/*', 'application/octet-stream'], limit: MAX_AUDIO_BYTES }),
  async (req, res, next) => {
    try {
      const audio = req.body as Buffer;
      if (!Buffer.isBuffer(audio) || audio.length === 0) {
        throw new BadRequest('Expected an audio body');
      }
      const lang = language(typeof req.query.language === 'string' ? req.query.language : undefined);
      const contentType = req.get('content-type') ?? 'audio/webm';
      res.json(await transcribeSpeech(audio, contentType, lang));
    } catch (err) {
      next(err);
    }
  },
);
