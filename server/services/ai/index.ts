import { isConfigured, modelName } from './groqClient.ts';
import { explainMedicalReport as groqExplain } from './medicalExplanation.ts';
import { extractPrescription as groqExtract } from './prescriptionExtraction.ts';
import { compareReports as groqCompare } from './reportComparison.ts';
import { mockCompareReports, mockExplainReport, mockExtractPrescription, mockTranscribe } from './mock.ts';
import { sttModelName, transcribe } from './speechToText.ts';
import type {
  AIResult, CompareReportsInput, Language, CompareReportsOutput, ExplainReportInput,
  ExplainReportOutput, ExtractPrescriptionOutput,
} from './types.ts';

/**
 * The AI surface the rest of the application uses. Callers never import Groq
 * directly — Person 4 can add RAG, a Copilot or another provider behind these
 * three functions without touching a single route or component.
 */
export type { Language } from './types.ts';

const withMeta = <T>(value: T, source: 'groq' | 'mock'): AIResult<T> => ({
  ...value,
  meta: { source, model: source === 'groq' ? modelName() : 'mock' },
});

export async function explainMedicalReport(
  input: ExplainReportInput,
): Promise<AIResult<ExplainReportOutput>> {
  if (!isConfigured()) return withMeta(mockExplainReport(input), 'mock');
  return withMeta(await groqExplain(input), 'groq');
}

export async function extractPrescription(
  prescriptionText: string,
): Promise<AIResult<ExtractPrescriptionOutput>> {
  if (!isConfigured()) return withMeta(mockExtractPrescription(prescriptionText), 'mock');
  return withMeta(await groqExtract(prescriptionText), 'groq');
}

export async function compareReports(
  input: CompareReportsInput,
): Promise<AIResult<CompareReportsOutput>> {
  if (!isConfigured()) return withMeta(mockCompareReports(input), 'mock');
  return withMeta(await groqCompare(input), 'groq');
}

/** Audio in, words out. Used only where the browser cannot listen itself. */
export async function transcribeSpeech(
  audio: Uint8Array,
  contentType: string,
  language: Language,
): Promise<{ text: string; meta: { source: 'groq' | 'mock'; model: string } }> {
  if (!isConfigured()) {
    return { text: mockTranscribe(language), meta: { source: 'mock', model: 'mock' } };
  }
  return {
    text: await transcribe(audio, contentType, language),
    meta: { source: 'groq', model: sttModelName() },
  };
}

export function aiStatus() {
  return { configured: isConfigured(), model: isConfigured() ? modelName() : 'mock' };
}
