import type { MealRelation } from '../types';

/**
 * Browser-side client for the AI endpoints.
 *
 * There is no API key here by design — the key lives only in the API server
 * process. Anything AI-shaped in the UI goes through this module.
 */
export type Language = 'en' | 'hi' | 'gu';

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'gu', label: 'ગુજરાતી' },
];

export interface AIMeta {
  source: 'groq' | 'mock';
  model: string;
}

export interface ReportExplanation {
  summary: string;
  terms: { term: string; meaning: string }[];
  parameters: { name: string; value: string; meaning: string; flag: 'normal' | 'attention' | 'unclear' }[];
  questionsForDoctor: string[];
  disclaimer: string;
  meta: AIMeta;
}

export interface ExtractedMedicine {
  medicineName: string;
  dosage: string;
  frequency: number;
  times: string[];
  duration: string;
  beforeAfterFood: MealRelation;
}

export interface PrescriptionExtraction {
  doctorName: string;
  medicines: ExtractedMedicine[];
  unreadable: string[];
  meta: AIMeta;
}

export interface ReportComparison {
  summary: string;
  changes: { parameter: string; from: string; to: string; direction: 'up' | 'down' | 'same'; note: string }[];
  questionsForDoctor: string[];
  disclaimer: string;
  meta: AIMeta;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`/api/ai/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const { error } = (await res.json().catch(() => ({ error: '' }))) as { error?: string };
    throw new Error(error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const explainReport = (reportText: string, language: Language, context?: string) =>
  post<ReportExplanation>('explain-report', { reportText, language, context });

export const extractPrescription = (prescriptionText: string) =>
  post<PrescriptionExtraction>('extract-prescription', { prescriptionText });

export const compareReports = (
  earlier: { label: string; text: string },
  later: { label: string; text: string },
  language: Language,
) => post<ReportComparison>('compare-reports', { earlier, later, language });
