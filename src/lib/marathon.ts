import type { Exercise } from '../types';
import { allLessons, sections } from '../data';

export interface MarathonPlan {
  /** The 15 randomly picked exercises for this round. */
  exercises: Exercise[];
  /** Incomplete lesson ids inside the range (first one is completed per round). */
  lessonsToComplete: string[];
  /** Total exercises available in the range. */
  available: number;
  sectionTitle: string;
  cefr: string;
  /** Accent colors from the target section's first unit. */
  color: string;
  colorDeep: string;
}

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build a marathon round: 15 random exercises from all lessons between the
 * user's current progress position and the end of the target section.
 */
export function buildMarathon(
  sectionIndex: number,
  completed: string[],
  count = 15
): MarathonPlan | null {
  const target = sections.find((s) => s.index === sectionIndex);
  if (!target || target.units.length === 0) return null;

  // Last global index that belongs to the target section (range end).
  let endIdx = -1;
  allLessons.forEach((loc, i) => {
    if (loc.sectionIndex <= sectionIndex) endIdx = i;
  });
  if (endIdx < 0) return null;

  // First incomplete lesson in global order (progress position).
  let startIdx = allLessons.findIndex(
    (loc) => !completed.includes(loc.theme.lessons[loc.lessonIndex].id)
  );
  if (startIdx === -1) startIdx = 0;

  const from = Math.min(startIdx, endIdx);
  const pool: Exercise[] = [];
  const lessonsToComplete: string[] = [];
  for (const loc of allLessons.slice(from, endIdx + 1)) {
    const lesson = loc.theme.lessons[loc.lessonIndex];
    pool.push(...lesson.exercises);
    if (!completed.includes(lesson.id)) lessonsToComplete.push(lesson.id);
  }

  return {
    exercises: shuffle(pool).slice(0, count),
    lessonsToComplete,
    available: pool.length,
    sectionTitle: target.titleRu,
    cefr: target.cefr,
    color: target.units[0].color,
    colorDeep: target.units[0].colorDeep,
  };
}
