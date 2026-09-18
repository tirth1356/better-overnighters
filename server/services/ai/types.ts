export type Language = 'en' | 'hi' | 'gu';

export interface ExplainReportInput {
  reportText: string;
  language: Language;
  /** Optional context, e.g. "65 year old, known hypothyroidism". */
  context?: string;
}

export interface ExplainReportOutput {
  summary: string;
  terms: { term: string; meaning: string }[];
  parameters: { name: string; value: string; meaning: string; flag: 'normal' | 'attention' | 'unclear' }[];
  questionsForDoctor: string[];
  disclaimer: string;
}

export interface ExtractedMedicine {
  medicineName: string;
  dosage: string;
  frequency: number;
  times: string[];
  duration: string;
  beforeAfterFood: 'before_food' | 'after_food' | 'with_food' | 'any';
}

export interface ExtractPrescriptionOutput {
  doctorName: string;
  medicines: ExtractedMedicine[];
  /** Fields the model could not read with confidence. */
  unreadable: string[];
}

export interface CompareReportsInput {
  earlier: { label: string; text: string };
  later: { label: string; text: string };
  language: Language;
}

export interface CompareReportsOutput {
  summary: string;
  changes: { parameter: string; from: string; to: string; direction: 'up' | 'down' | 'same'; note: string }[];
  questionsForDoctor: string[];
  disclaimer: string;
}

/** Every AI response says which engine produced it — mock answers must be obvious. */
export interface AIMeta {
  source: 'groq' | 'mock';
  model: string;
}

export type AIResult<T> = T & { meta: AIMeta };
