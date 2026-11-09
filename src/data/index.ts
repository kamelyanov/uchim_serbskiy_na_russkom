import type { Section } from '../types';
import { section1Units } from './section1';
import { section2Units } from './section2';
import { section3Units } from './section3';
import { section4Units } from './section4';
import { section5Units } from './section5';
import { section6Units } from './section6';
import { section7Units } from './section7';
import { section8Units } from './section8';

// Color cycle for units (derived from a multi-color education palette).
const PALETTE: [string, string][] = [
  ['158 42% 42%', '158 48% 30%'], // teal green
  ['42 85% 50%', '36 85% 40%'], // golden yellow
  ['340 55% 62%', '340 55% 45%'], // pink
  ['210 45% 50%', '210 50% 37%'], // blue
  ['8 68% 58%', '8 62% 44%'], // coral red
  ['275 30% 55%', '275 35% 40%'], // purple
  ['185 45% 38%', '185 50% 28%'], // cyan teal
  ['25 80% 53%', '25 75% 40%'], // orange
];

function withColors(units: Section['units'], offset: number): Section['units'] {
  return units.map((u, i) => {
    const [color, colorDeep] = PALETTE[(i + offset) % PALETTE.length];
    return { ...u, color, colorDeep };
  });
}

const s1 = withColors(section1Units, 0);
const s2 = withColors(section2Units, 3);
const s3 = withColors(section3Units, 5);
const s4 = withColors(section4Units, 0);
const s5 = withColors(section5Units, 3);
const s6 = withColors(section6Units, 5);
const s7 = withColors(section7Units, 0);
const s8 = withColors(section8Units, 3);

export const sections: Section[] = [
  {
    id: 'section-1',
    index: 1,
    titleRu: 'Модуль 1',
    cefr: 'Intro',
    descriptionRu: 'Начните с основных фраз и простых грамматических понятий',
    units: s1,
  },
  {
    id: 'section-2',
    index: 2,
    titleRu: 'Модуль 2',
    cefr: 'A1',
    descriptionRu: 'Выучите простые разговорные слова, фразы и грамматические конструкции',
    units: s2,
  },
  {
    id: 'section-3',
    index: 3,
    titleRu: 'Модуль 3',
    cefr: 'A1',
    descriptionRu: 'Больше основных понятий и предложений для общения на базовом уровне',
    units: s3,
  },
  {
    id: 'section-4',
    index: 4,
    titleRu: 'Модуль 4',
    cefr: 'A2',
    descriptionRu: 'Используйте предложения в разговорах на повседневные темы',
    units: s4,
  },
  {
    id: 'section-5',
    index: 5,
    titleRu: 'Модуль 5',
    cefr: 'B1',
    descriptionRu: 'Составляйте предложения на разнообразные темы',
    units: s5,
  },
  {
    id: 'section-6',
    index: 6,
    titleRu: 'Модуль 6',
    cefr: 'B1',
    descriptionRu: 'Обсуждайте более сложные темы',
    units: s6,
  },
  {
    id: 'section-7',
    index: 7,
    titleRu: 'Модуль 7',
    cefr: 'B2',
    descriptionRu: 'Говорите об абстрактных чувствах и мнениях',
    units: s7,
  },
  {
    id: 'section-8',
    index: 8,
    titleRu: 'Модуль 8',
    cefr: 'B2',
    descriptionRu: 'Уверенно общайтесь даже на более узкие темы',
    units: s8,
  },
];

// Flattened lookup helpers --------------------------------------------------

export interface LessonLocation {
  sectionIndex: number;
  unitIndex: number;
  lessonIndex: number;
  theme: Section['units'][number];
}

/** Ordered list of all playable lessons across all sections. */
export const allLessons: LessonLocation[] = [];
sections.forEach((sec, sectionIndex) => {
  sec.units.forEach((theme, unitIndex) => {
    theme.lessons.forEach((_, lessonIndex) => {
      allLessons.push({ sectionIndex, unitIndex, lessonIndex, theme });
    });
  });
});

export function findLesson(lessonId: string): LessonLocation | null {
  for (const loc of allLessons) {
    if (loc.theme.lessons[loc.lessonIndex].id === lessonId) return loc;
  }
  return null;
}

/** Global order index of a lesson in the full path (for locking logic). */
export function lessonOrder(lessonId: string): number {
  return allLessons.findIndex(
    (loc) => loc.theme.lessons[loc.lessonIndex].id === lessonId
  );
}
