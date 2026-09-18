import { chat } from './groqClient.ts';
import { SAFETY_RULES, languageInstruction } from './prompts.ts';
import { asComparison, parseJson } from './validate.ts';
import type { CompareReportsInput, CompareReportsOutput } from './types.ts';

const SHAPE = `{
  "summary": "what changed between the two documents, in plain language",
  "changes": [{ "parameter": "…", "from": "value in the earlier report", "to": "value in the later report", "direction": "up | down | same", "note": "what this parameter measures" }],
  "questionsForDoctor": ["…"],
  "disclaimer": "…"
}`;

export async function compareReports(input: CompareReportsInput): Promise<CompareReportsOutput> {
  const raw = await chat(
    [
      {
        role: 'system',
        content: `You compare two medical reports for the same person and describe what moved.
${SAFETY_RULES}
${languageInstruction(input.language)}
Only compare parameters that appear in both documents. Do not say whether a change is good or bad —
describe the direction and what the parameter measures, and leave the judgement to the doctor.
Reply with JSON only, matching this shape:
${SHAPE}`,
      },
      {
        role: 'user',
        content: `Earlier report (${input.earlier.label}):\n"""\n${input.earlier.text}\n"""\n\nLater report (${input.later.label}):\n"""\n${input.later.text}\n"""`,
      },
    ],
    { json: true },
  );
  return asComparison(parseJson(raw));
}
