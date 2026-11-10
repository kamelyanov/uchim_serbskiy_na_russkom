// Exercise and curriculum model.
// All Serbian text is stored in Latin script; Cyrillic is derived at render time.

export type { Script } from '../lib/transliterate';

export interface ChoiceExercise {
  type: 'choice';
  /** Text shown as the prompt (to translate or answer). */
  prompt: string;
  promptLang: 'ru' | 'sr';
  /** Answer options in the opposite language of the prompt. */
  options: string[];
  /** Index of the correct option. */
  answer: number;
}

export interface BuildExercise {
  type: 'build';
  /** Russian sentence shown as the prompt. */
  ru: string;
  /** Correct Serbian sentence; word bank is derived by splitting on spaces. */
  sr: string;
  /** Extra distractor tiles. */
  extra: string[];
}

export interface BlankExercise {
  type: 'blank';
  /** Russian translation shown as context. */
  ru: string;
  /** Serbian sentence before the blank. */
  before: string;
  /** Serbian sentence after the blank. */
  after: string;
  /** Correct missing word/phrase. */
  answer: string;
  /** Options including the answer. */
  options: string[];
}

export interface MatchExercise {
  type: 'match';
  /** 4-5 Serbian/Russian pairs to match. */
  pairs: { sr: string; ru: string }[];
}

export type Exercise = ChoiceExercise | BuildExercise | BlankExercise | MatchExercise;

export interface Lesson {
  id: string;
  titleRu: string;
  exercises: Exercise[];
}

/** A block of grammar tips, Duolingo/Duome guidebook style. */
export interface TipBlock {
  heading: string;
  /** Paragraphs of explanation (Russian). */
  paragraphs: string[];
  /** Example pairs shown as a two-column mini table. */
  examples: { sr: string; ru: string }[];
}

export interface Theme {
  id: string;
  titleRu: string;
  titleSr: string;
  /** Lucide icon name for the theme node. */
  icon: string;
  /** HSL triple string e.g. "160 45% 45%". Assigned in data/index.ts. */
  color: string;
  colorDeep: string;
  /** Grammar notes for this unit (Serbian rules, written in Russian). */
  tips: TipBlock[];
  lessons: Lesson[];
}

export interface Section {
  id: string;
  index: number;
  titleRu: string;
  cefr: string;
  descriptionRu: string;
  /** Units with full content. Empty for "coming soon" sections. */
  units: Theme[];
  /** Titles of planned units for coming-soon sections. */
  plannedUnits?: { titleRu: string }[];
}

export interface Progress {
  completedLessons: string[];
  xp: number;
  streak: number;
  lastPlayed: string; // YYYY-MM-DD or ''
  /** Section indexes unlocked via marathon completion. */
  unlockedSections: number[];
}
