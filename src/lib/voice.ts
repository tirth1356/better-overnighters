import type { DoseSlot } from './schedule';

/**
 * Turns what a person said into a dose action.
 *
 * Built for grandparents: the phrase does not have to be exact, and it can be
 * English, Hindi or Gujarati. Matching is deliberately keyword-based rather
 * than a model call — logging a dose must work instantly, offline, and must
 * never be invented by an LLM.
 */
export type VoiceAction = 'taken' | 'skipped';

export interface VoiceIntent {
  action: VoiceAction | null;
  /** The dose this refers to, when the phrase identified one. */
  slot?: DoseSlot;
  /** Set when the words matched an action but not which dose. */
  ambiguous?: boolean;
  /** The doses the phrase narrowed to, for the UI to offer as a choice. */
  candidates?: DoseSlot[];
  transcript: string;
}

/** "I took it" in the three supported languages, plus common variants. */
const TAKEN_WORDS = [
  // English
  'taken', 'took', 'take', 'had it', 'had my', 'done', 'finished', 'swallowed', 'yes',
  // Hindi (Devanagari + common romanisation)
  'लिया', 'ली', 'लि', 'खा', 'खाया', 'खाई', 'पी', 'पिया', 'ले लिया', 'हो गया', 'हाँ', 'हा',
  'liya', 'le liya', 'kha liya', 'khaya', 'ho gaya',
  // Gujarati
  'લીધી', 'લીધું', 'લીધો', 'લઈ', 'ખાધી', 'ખાધું', 'પીધી', 'થઈ ગયું', 'હા',
  'lidhi', 'lidhu', 'khadhi', 'lai lidhi',
];

const SKIPPED_WORDS = [
  'skip', 'skipped', 'skipping', 'not taken', "didn't take", 'did not take', 'no', 'missed',
  'नहीं', 'नही', 'छोड़', 'छोड़ा', 'छोड़ दिया', 'nahi', 'nahin', 'chhod',
  'નથી', 'નહીં', 'છોડી', 'છોડ્યું', 'nathi', 'chhodi',
];

/** Words that point at a time of day, so "morning tablet" finds the 8am dose. */
const MORNING = ['morning', 'breakfast', 'सुबह', 'subah', 'नाश्ता', 'સવાર', 'savar', 'સવારે'];
const AFTERNOON = ['afternoon', 'lunch', 'noon', 'दोपहर', 'dopahar', 'બપોર', 'bapor'];
const EVENING = ['evening', 'night', 'dinner', 'bedtime', 'शाम', 'रात', 'shaam', 'raat',
  'સાંજ', 'રાત', 'saanj', 'raat'];

const hasAny = (text: string, words: string[]) => words.some((w) => text.includes(w));

/** Hour bands used to resolve "morning" / "evening" against a dose time. */
function partOfDay(time: string): 'morning' | 'afternoon' | 'evening' {
  const hour = Number(time.slice(0, 2));
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

/**
 * `slots` should be the doses still open for the selected day. A phrase that
 * names a medicine wins; otherwise a time-of-day word narrows it; otherwise a
 * single open dose is assumed, and anything else is reported as ambiguous so
 * the UI can ask rather than guess.
 */
export function parseVoiceCommand(transcript: string, slots: DoseSlot[]): VoiceIntent {
  const text = transcript.toLowerCase().trim();
  if (!text) return { action: null, transcript };

  // "not taken" contains "taken", so skip words are checked first.
  const action: VoiceAction | null = hasAny(text, SKIPPED_WORDS)
    ? 'skipped'
    : hasAny(text, TAKEN_WORDS)
      ? 'taken'
      : null;

  if (!action) return { action: null, transcript };

  const byName = slots.filter((s) => text.includes(s.medicine.name.toLowerCase()));
  if (byName.length === 1) return { action, slot: byName[0], transcript };

  const pool = byName.length > 1 ? byName : slots;

  const wanted = hasAny(text, MORNING) ? 'morning'
    : hasAny(text, AFTERNOON) ? 'afternoon'
      : hasAny(text, EVENING) ? 'evening'
        : null;

  if (wanted) {
    const byTime = pool.filter((s) => partOfDay(s.time) === wanted);
    if (byTime.length === 1) return { action, slot: byTime[0], transcript };
    if (byTime.length > 1) return { action, ambiguous: true, candidates: byTime, transcript };
  }

  if (pool.length === 1) return { action, slot: pool[0], transcript };
  return { action, ambiguous: true, candidates: pool, transcript };
}
