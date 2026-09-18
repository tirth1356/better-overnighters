import type {
  CompareReportsInput, CompareReportsOutput, ExplainReportInput, ExplainReportOutput,
  ExtractPrescriptionOutput, Language,
} from './types.ts';

/**
 * Offline stand-in used when GROQ_API_KEY is absent, so the rest of the team can
 * build against the AI surfaces without a key. Every string is prefixed so a
 * mock answer can never be mistaken for a real one.
 */
const BANNER: Record<Language, string> = {
  en: '[MOCK AI — no GROQ_API_KEY configured]',
  hi: '[मॉक AI — GROQ_API_KEY सेट नहीं है]',
  gu: '[મૉક AI — GROQ_API_KEY સેટ નથી]',
};

const DISCLAIMER: Record<Language, string> = {
  en: 'This is sample text, not a diagnosis. Discuss medical decisions with a qualified healthcare professional.',
  hi: 'यह नमूना पाठ है, निदान नहीं। चिकित्सा संबंधी निर्णय योग्य डॉक्टर से ही लें।',
  gu: 'આ નમૂના લખાણ છે, નિદાન નથી. તબીબી નિર્ણય લાયક ડૉક્ટર સાથે જ ચર્ચો.',
};

/** First line of the pasted text, so the mock visibly reacts to its input. */
const firstLine = (text: string) => text.trim().split('\n')[0]?.slice(0, 80) ?? '';

export function mockExplainReport(input: ExplainReportInput): ExplainReportOutput {
  const lang = input.language;
  return {
    summary: `${BANNER[lang]} Sample explanation for a document starting with “${firstLine(input.reportText)}”. Connect a Groq API key to generate a real explanation.`,
    terms: [
      { term: 'Reference range', meaning: `${BANNER[lang]} The range a laboratory considers typical for this test.` },
      { term: 'Fasting sample', meaning: `${BANNER[lang]} A sample taken before eating, which changes some values.` },
    ],
    parameters: [
      { name: 'Sample parameter', value: 'not stated', meaning: `${BANNER[lang]} Placeholder row.`, flag: 'unclear' },
    ],
    questionsForDoctor: [
      `${BANNER[lang]} Which values in this report should I watch over the next few months?`,
      `${BANNER[lang]} Does anything here change my current medicines?`,
    ],
    disclaimer: DISCLAIMER[lang],
  };
}

export function mockExtractPrescription(text: string): ExtractPrescriptionOutput {
  return {
    doctorName: '[MOCK] Dr. Sample',
    medicines: [
      {
        medicineName: '[MOCK] Metformin',
        dosage: '500 mg',
        frequency: 2,
        times: ['08:00', '20:00'],
        duration: '30 days',
        beforeAfterFood: 'after_food',
      },
    ],
    unreadable: [`[MOCK] Nothing was actually read from: “${firstLine(text)}”`],
  };
}

export function mockCompareReports(input: CompareReportsInput): CompareReportsOutput {
  const lang = input.language;
  return {
    summary: `${BANNER[lang]} Sample comparison between “${input.earlier.label}” and “${input.later.label}”.`,
    changes: [
      { parameter: 'Sample parameter', from: 'not stated', to: 'not stated', direction: 'same', note: `${BANNER[lang]} Placeholder row.` },
    ],
    questionsForDoctor: [`${BANNER[lang]} What explains the change between these two reports?`],
    disclaimer: DISCLAIMER[lang],
  };
}
