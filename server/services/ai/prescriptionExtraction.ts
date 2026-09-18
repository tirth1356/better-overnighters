import { chat } from './groqClient.ts';
import { SAFETY_RULES } from './prompts.ts';
import { asPrescription, parseJson } from './validate.ts';
import type { ExtractPrescriptionOutput } from './types.ts';

const SHAPE = `{
  "doctorName": "as printed, or empty string",
  "medicines": [{
    "medicineName": "…",
    "dosage": "e.g. 500 mg",
    "frequency": 2,
    "times": ["08:00", "20:00"],
    "duration": "e.g. 10 days",
    "beforeAfterFood": "before_food | after_food | with_food | any"
  }],
  "unreadable": ["anything you could not read with confidence"]
}`;

/**
 * Structures OCR'd prescription text. The caller must still show the result for
 * confirmation — extraction is a draft, never an instruction.
 */
export async function extractPrescription(prescriptionText: string): Promise<ExtractPrescriptionOutput> {
  const raw = await chat(
    [
      {
        role: 'system',
        content: `You convert text scanned from a prescription into structured data.
${SAFETY_RULES}
Additional extraction rules:
- Copy medicine names and dosages exactly as written. Do not correct, expand or substitute them.
- Convert clear dosing shorthand into times only when it is unambiguous (OD -> one time, BD -> two,
  TDS -> three). Use 24-hour "HH:MM". If the time of day is not stated, return an empty times array
  and still set frequency.
- Anything you cannot read goes in "unreadable". Never fill a gap with a plausible guess.
Reply with JSON only, matching this shape:
${SHAPE}`,
      },
      { role: 'user', content: `Prescription text:\n"""\n${prescriptionText}\n"""` },
    ],
    { json: true, temperature: 0 },
  );
  return asPrescription(parseJson(raw));
}
