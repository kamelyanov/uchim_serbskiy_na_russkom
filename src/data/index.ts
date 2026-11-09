import type { Section } from '../types';
import { section1Units } from './section1';
import { section2Units } from './section2';
import { section3Units } from './section3';
import { section4Units } from './section4';

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
    units: [],
    plannedUnits: [
      { titleRu: 'Обсудите путешествия в одиночку' },
      { titleRu: 'Закажите доставку еды' },
      { titleRu: 'Опишите день в колледже' },
      { titleRu: 'Обсудите свой опыт работы' },
      { titleRu: 'Поговорите о домашних делах' },
      { titleRu: 'Поговорите на онлайн-встрече' },
      { titleRu: 'Пообщайтесь со старыми друзьями, используйте прошедшее время' },
      { titleRu: 'Поговорите о своём здоровье' },
      { titleRu: 'Обсудите социальные сети' },
      { titleRu: 'Опишите свой распорядок дня' },
      { titleRu: 'Расскажите сказку' },
      { titleRu: 'Опишите свадьбу' },
      { titleRu: 'Поделитесь воспоминаниями, описывайте прошлые события' },
      { titleRu: 'Поговорите об отношениях' },
      { titleRu: 'Опишите одежду' },
      { titleRu: 'Обсудите перелёт' },
      { titleRu: 'Поговорите о новостях' },
      { titleRu: 'Опишите поездку на природу' },
      { titleRu: 'Поговорите о прошлом' },
      { titleRu: 'Обсудите отношения' },
      { titleRu: 'Обсудите подготовку к вечеринке' },
      { titleRu: 'Поговорите о визите к семье, задавайте вопросы' },
      { titleRu: 'Поговорите о работе' },
      { titleRu: 'Обсудите мнения' },
      { titleRu: 'Поговорите об искусстве' },
      { titleRu: 'Опишите привычки сна' },
      { titleRu: 'Обсудите спорт' },
      { titleRu: 'Поговорите о Хэллоуине' },
      { titleRu: 'Опишите брак, образуйте прошедшее время' },
      { titleRu: 'Обсудите поход на природу' },
      { titleRu: 'Расскажите секрет' },
      { titleRu: 'Обсудите медицинские вопросы' },
      { titleRu: 'Поговорите об учёбе' },
      { titleRu: 'Поговорите о переезде' },
      { titleRu: 'Поговорите о ежедневных поездках' },
      { titleRu: 'Выразите удивление' },
      { titleRu: 'Опишите технологии, образуйте глагольные фразы' },
      { titleRu: 'Поговорите о политике' },
      { titleRu: 'Выразите страх' },
      { titleRu: 'Поговорите о фильмах' },
      { titleRu: 'Поговорите о турнире' },
      { titleRu: 'Совершайте транзакции' },
      { titleRu: 'Заводите знакомства' },
      { titleRu: 'Опишите географию' },
      { titleRu: 'Поужинайте в ресторане' },
      { titleRu: 'Прокомментируйте музыку, выражайте желания и потребности' },
      { titleRu: 'Поговорите о преступности' },
      { titleRu: 'Поговорите о развлечениях' },
      { titleRu: 'Купите нужные вещи' },
      { titleRu: 'Поговорите об исторических эпохах' },
      { titleRu: 'Перескажите свои впечатления' },
    ],
  },
  {
    id: 'section-6',
    index: 6,
    titleRu: 'Модуль 6',
    cefr: 'B1',
    descriptionRu: 'Обсуждайте более сложные темы',
    units: [],
    plannedUnits: [
      { titleRu: 'Выразите благодарность' },
      { titleRu: 'Поговорите о доме, подтверждайте информацию' },
      { titleRu: 'Поговорите об интересах' },
      { titleRu: 'Ведите разговор' },
      { titleRu: 'Поделитесь анекдотами' },
      { titleRu: 'Расскажите о последней поездке' },
      { titleRu: 'Поговорите о новостях' },
      { titleRu: 'Поговорите о телевидении' },
      { titleRu: 'Поговорите об истории, описывайте далёкое прошлое' },
      { titleRu: 'Составьте планы с друзьями' },
      { titleRu: 'Говорите о родственниках' },
      { titleRu: 'Делайте жалобы' },
      { titleRu: 'Пересказывайте чужие слова' },
      { titleRu: 'Поговорите о религии' },
      { titleRu: 'Делайте предложения' },
      { titleRu: 'Спланируйте переезд, повторяйте услышанное' },
      { titleRu: 'Извинитесь' },
      { titleRu: 'Поговорите о своих целях' },
      { titleRu: 'Договоритесь об обслуживании автомобиля' },
      { titleRu: 'Прокомментируйте еду' },
      { titleRu: 'Общайтесь с врачами' },
      { titleRu: 'Поговорите о школьной жизни' },
      { titleRu: 'Спланируйте вечеринку' },
      { titleRu: 'Поговорите о новостях, используйте страдательный залог' },
      { titleRu: 'Поговорите о дорожном движении' },
      { titleRu: 'Опишите природу' },
      { titleRu: 'Просите и давайте советы' },
      { titleRu: 'Поговорите о профессиональной жизни' },
      { titleRu: 'Поговорите о местах' },
      { titleRu: 'Поговорите об известных людях' },
      { titleRu: 'Поговорите о еде, выражайте надежды и планы' },
      { titleRu: 'Поддерживайте разговор' },
      { titleRu: 'Верните товар' },
      { titleRu: 'Делайте объявления' },
      { titleRu: 'Опишите свой дом' },
      { titleRu: 'Поговорите об ошибках' },
      { titleRu: 'Выразите страх, говорите о том, что могло бы случиться' },
      { titleRu: 'Пользуйтесь интернетом' },
      { titleRu: 'Поговорите об искусстве' },
      { titleRu: 'Опишите традиции' },
      { titleRu: 'Поужинайте в ресторане' },
      { titleRu: 'Обсудите окружающую среду' },
      { titleRu: 'Выразите предпочтения' },
      { titleRu: 'Поговорите о красоте, используйте страдательный залог' },
      { titleRu: 'Покупайте на распродажах' },
      { titleRu: 'Прокомментируйте спорт' },
      { titleRu: 'Поговорите о здоровом образе жизни' },
      { titleRu: 'Сотрудничайте на работе' },
      { titleRu: 'Решайте проблемы' },
      { titleRu: 'Поговорите о новостях' },
      { titleRu: 'Поговорите об истории' },
      { titleRu: 'Выразите пожелания' },
    ],
  },
  {
    id: 'section-7',
    index: 7,
    titleRu: 'Модуль 7',
    cefr: 'B2',
    descriptionRu: 'Говорите об абстрактных чувствах и мнениях',
    units: [],
    plannedUnits: [
      { titleRu: 'Давайте и запрашивайте разрешение' },
      { titleRu: 'Давайте советы о здоровье' },
      { titleRu: 'Обсудите переезд' },
      { titleRu: 'Давайте советы' },
      { titleRu: 'Возьмитесь за проект' },
      { titleRu: 'Поговорите о садоводстве' },
      { titleRu: 'Спланируйте поездку, выражайте предложения и возможности' },
      { titleRu: 'Пообщайтесь на встрече выпускников' },
      { titleRu: 'Поговорите о политике' },
      { titleRu: 'Предсказывайте погоду' },
      { titleRu: 'Обсудите возможные риски' },
      { titleRu: 'Обсудите обязанности' },
      { titleRu: 'Опровергайте американские клише' },
      { titleRu: 'Выразите сожаление, говорите о будущем' },
      { titleRu: 'Поговорите о колледже' },
      { titleRu: 'Вспоминайте прошлое' },
      { titleRu: 'Выразите предпочтения' },
      { titleRu: 'Общайтесь на работе' },
      { titleRu: 'Обсудите этикет' },
      { titleRu: 'Опишите симптомы' },
      { titleRu: 'Поговорите о (домашнем) ремонте' },
      { titleRu: 'Поговорите об отношениях' },
      { titleRu: 'Рассказывайте истории, описывайте принадлежности и характеристики' },
      { titleRu: 'Поговорите о целях' },
      { titleRu: 'Обменивайтесь сплетнями и слухами' },
      { titleRu: 'Пересказывайте прошлые события' },
      { titleRu: 'Делайте жалобы' },
      { titleRu: 'Обсудите причину и следствие' },
      { titleRu: 'Поговорите о телевидении' },
      { titleRu: 'Поговорите о новостях' },
      { titleRu: 'Выражайте мнения' },
      { titleRu: 'Утешьте кого-то, описывайте прошлые сожаления и ситуации' },
      { titleRu: 'Поддерживайте разговор' },
      { titleRu: 'Ведите переговоры на работе' },
      { titleRu: 'Обвиняйте кого-то' },
      { titleRu: 'Обсуждайте гипотетические ситуации' },
    ],
  },
  {
    id: 'section-8',
    index: 8,
    titleRu: 'Модуль 8',
    cefr: 'B2',
    descriptionRu: 'Уверенно общайтесь даже на более узкие темы',
    units: [],
    plannedUnits: [
      { titleRu: 'Приводите причины и обоснования' },
      { titleRu: 'Просите о чём-то в смягчённой форме' },
      { titleRu: 'Торгуйтесь при покупках' },
      { titleRu: 'Поймите местный новостной репортаж' },
      { titleRu: 'Поговорите об истории музыки, повторяйте чужие слова' },
      { titleRu: 'Используйте present perfect progressive' },
      { titleRu: 'Поговорите о том, как всё изменилось' },
      { titleRu: 'Выражайте несогласие' },
      { titleRu: 'Приводите контраргументы' },
      { titleRu: 'Выражайте досаду' },
      { titleRu: 'Обсудите планы на корпоратив' },
      { titleRu: 'Делайте выводы и умозаключения' },
      { titleRu: 'Рассказывайте истории у костра, используйте страдательный залог' },
      { titleRu: 'Опишите переезд в большой город' },
      { titleRu: 'Сориентируйтесь в поездке в парк развлечений' },
      { titleRu: 'Договоритесь о домашних делах с соседями по квартире' },
      { titleRu: 'Выражайте уверенность или неуверенность' },
      { titleRu: 'Подтверждайте информацию' },
      { titleRu: 'Выражайте добрые пожелания' },
      { titleRu: 'Поговорите о планах на поездку' },
      { titleRu: 'Используйте future perfect progressive' },
      { titleRu: 'Спланируйте вечер пятницы, образуйте глагольные фразы' },
      { titleRu: 'Проведите сделки на распродаже в гараже' },
      { titleRu: 'Реагируйте на приказ или просьбу' },
      { titleRu: 'Вежливо отклоняйте предложения' },
      { titleRu: 'Поговорите о домашних делах' },
      { titleRu: 'Пообщайтесь со старым другом' },
      { titleRu: 'Используйте past perfect passive' },
      { titleRu: 'Выражайте ограничения и оговорки' },
      { titleRu: 'Поговорите о спортивных событиях, объясняйте планы и мнения' },
      { titleRu: 'Поймите экскурсию с гидом' },
      { titleRu: 'Стройте предположения о загадках' },
      { titleRu: 'Общайтесь на магическом шоу' },
      { titleRu: 'Вспоминайте детство' },
      { titleRu: 'Объясните сложную ситуацию' },
      { titleRu: 'Выражайте облегчение и поздравления' },
    ],
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
