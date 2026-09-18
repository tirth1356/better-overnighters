import type { ExplainReportOutput, ExtractPrescriptionOutput, CompareReportsOutput } from './types.ts';

/**
 * Model output is untrusted input. Every field is coerced to the expected shape
 * here; anything missing becomes an empty value rather than reaching the UI as
 * `undefined` or as a hallucinated type.
 */
export class InvalidModelOutput extends Error {}

export function parseJson(raw: string): unknown {
  // Models occasionally wrap JSON in a ```json fence despite being asked not to.
  const cleaned = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new InvalidModelOutput('Model did not return valid JSON');
  }
}

const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const strList = (v: unknown): string[] => arr(v).filter((x): x is string => typeof x === 'string');

const FLAGS = ['normal', 'attention'] as const;
const DIRECTIONS = ['up', 'down'] as const;

const DISCLAIMER =
  'This is an explanation of the document you supplied, not a diagnosis. Please discuss any medical decision with a qualified healthcare professional.';

export function asExplainReport(value: unknown): ExplainReportOutput {
  if (!value || typeof value !== 'object') throw new InvalidModelOutput('Expected an object');
  const o = value as Record<string, unknown>;
  const summary = str(o.summary);
  if (!summary) throw new InvalidModelOutput('Explanation is missing a summary');
  return {
    summary,
    terms: arr(o.terms).map((t) => {
      const x = (t ?? {}) as Record<string, unknown>;
      return { term: str(x.term), meaning: str(x.meaning) };
    }).filter((t) => t.term),
    parameters: arr(o.parameters).map((p): ExplainReportOutput['parameters'][number] => {
      const x = (p ?? {}) as Record<string, unknown>;
      return {
        name: str(x.name),
        value: str(x.value, 'not stated'),
        meaning: str(x.meaning),
        flag: FLAGS.find((f) => f === x.flag) ?? 'unclear',
      };
    }).filter((p) => p.name),
    questionsForDoctor: strList(o.questionsForDoctor),
    disclaimer: str(o.disclaimer, DISCLAIMER),
  };
}

const MEAL = ['before_food', 'after_food', 'with_food', 'any'] as const;

/** "HH:MM" in 24-hour form. Anything else is dropped rather than guessed at. */
const isTime = (v: unknown): v is string => typeof v === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);

export function asPrescription(value: unknown): ExtractPrescriptionOutput {
  if (!value || typeof value !== 'object') throw new InvalidModelOutput('Expected an object');
  const o = value as Record<string, unknown>;
  const medicines = arr(o.medicines).map((m) => {
    const x = (m ?? {}) as Record<string, unknown>;
    const times = arr(x.times).filter(isTime);
    const meal = MEAL.find((v) => v === x.beforeAfterFood) ?? 'any';
    const frequency = typeof x.frequency === 'number' && x.frequency > 0
      ? Math.round(x.frequency)
      : times.length;
    return {
      medicineName: str(x.medicineName),
      dosage: str(x.dosage),
      frequency,
      times,
      duration: str(x.duration),
      beforeAfterFood: meal,
    };
  }).filter((m) => m.medicineName);

  return {
    doctorName: str(o.doctorName),
    medicines,
    unreadable: strList(o.unreadable),
  };
}

export function asComparison(value: unknown): CompareReportsOutput {
  if (!value || typeof value !== 'object') throw new InvalidModelOutput('Expected an object');
  const o = value as Record<string, unknown>;
  const summary = str(o.summary);
  if (!summary) throw new InvalidModelOutput('Comparison is missing a summary');
  return {
    summary,
    changes: arr(o.changes).map((c): CompareReportsOutput['changes'][number] => {
      const x = (c ?? {}) as Record<string, unknown>;
      return {
        parameter: str(x.parameter),
        from: str(x.from, 'not stated'),
        to: str(x.to, 'not stated'),
        direction: DIRECTIONS.find((d) => d === x.direction) ?? 'same',
        note: str(x.note),
      };
    }).filter((c) => c.parameter),
    questionsForDoctor: strList(o.questionsForDoctor),
    disclaimer: str(o.disclaimer, DISCLAIMER),
  };
}
