import { chat } from './groqClient.ts';
import { SAFETY_RULES, languageInstruction } from './prompts.ts';
import { asExplainReport, parseJson } from './validate.ts';
import type { ExplainReportInput, ExplainReportOutput } from './types.ts';

const SHAPE = `{
  "summary": "2-4 sentences in plain language about what this document contains",
  "terms": [{ "term": "…", "meaning": "…" }],
  "parameters": [{ "name": "…", "value": "exactly as written in the report", "meaning": "what this test measures", "flag": "normal | attention | unclear" }],
  "questionsForDoctor": ["…"],
  "disclaimer": "…"
}`;

export async function explainMedicalReport(input: ExplainReportInput): Promise<ExplainReportOutput> {
  const raw = await chat(
    [
      {
        role: 'system',
        content: `You help an Indian family understand their own medical reports.
${SAFETY_RULES}
${languageInstruction(input.language)}
Use "flag" only to mirror what the report itself marks: "normal" when the report shows the value
inside its reference range, "attention" when the report marks it high/low/abnormal, and "unclear"
whenever the report gives no range. Never decide a flag yourself.
Reply with JSON only, matching this shape:
${SHAPE}`,
      },
      {
        role: 'user',
        content: `${input.context ? `Context: ${input.context}\n\n` : ''}Report text:\n"""\n${input.reportText}\n"""`,
      },
    ],
    { json: true },
  );
  return asExplainReport(parseJson(raw));
}
