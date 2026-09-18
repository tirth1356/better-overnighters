import type { Language } from './types.ts';

export const LANGUAGE_NAME: Record<Language, string> = {
  en: 'English',
  hi: 'Hindi (हिंदी, Devanagari script)',
  gu: 'Gujarati (ગુજરાતી script)',
};

export function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'hi' || value === 'gu';
}

/**
 * Safety rules attached to every medical prompt. Kept in one place so a change
 * applies to explanation, extraction and comparison at once.
 */
export const SAFETY_RULES = `
Hard rules you must follow:
- You are not diagnosing. Never state or imply a diagnosis, prognosis or treatment decision.
- Never invent values, units, reference ranges, dates or medicine names. Use only what the
  supplied text contains. If something is missing or unreadable, say so explicitly.
- Separate fact from interpretation: quote what the document says, then explain what that
  term generally means, and label anything beyond the document as general information.
- Explain terminology in plain words a family member without medical training can follow.
- Always end by recommending that medical decisions be discussed with a qualified
  healthcare professional.
`.trim();

export function languageInstruction(language: Language): string {
  return `Write every user-facing string in ${LANGUAGE_NAME[language]}. Generate the explanation
natively in that language — do not write English and translate it word for word. Keep medicine
names, test names and units in their standard form (Latin script is fine for those).`;
}
