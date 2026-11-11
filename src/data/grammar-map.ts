// Привязка уроков к темам грамматики (src/data/grammar.ts).
// По умолчанию — тема, соответствующая уровню модуля; OVERRIDES — точечные
// привязки по смыслу урока. Используется кнопкой «Грамматика» в уроке.

const DEFAULT_BY_SECTION: Record<string, string> = {
  s1: 'glagoli-prezent',
  s2: 'glagoli-prezent',
  s3: 'glagoli-perfekat',
  s4: 'glagoli-futur',
  s5: 'glagoli-vid',
  s6: 'glagoli-aorist',
  s7: 'glagoli-kondicional',
  s8: 'slozene-recenice',
};

const OVERRIDES: Record<string, string> = {
  // Модуль 1 (Intro)
  s1u1l2: 'predlozi', // Откуда вы — iz + родительный
  s1u1l4: 'imenice-rod-broj', // Семья
  s1u1l5: 'predlozi', // Места — u/na
  s1u1l8: 'imenice-rod-broj', // Еда и напитки
  s1u1l9: 'imenice-rod-broj', // Питомцы

  // Модуль 2 (A1)
  s2u1l2: 'glagoli-povratni', // личная жизнь
  s2u1l6: 'brojevi', // расписание, время
  s2u1l11: 'glagoli-povratni', // свидание
  s2u1l16: 'glagoli-povratni', // у врача
  s2u1l25: 'prilozi', // погода
  s2u1l5: 'pridevi-osnovno', // одежда

  // Модуль 3 (A1, прошедшее)
  s3u1l3: 'imenice-prvo-sklonjenje', // документы
  s3u1l12: 'predlozi', // где живёте
  s3u1l18: 'glagoli-modalni', // предпочтения
  s3u1l25: 'glagoli-vid', // изучение языков

  // Модуль 4 (A2, будущее)
  s4u1l6: 'glagoli-prezent', // будни
  s4u1l10: 'glagoli-prezent', // свой день
  s4u1l16: 'glagoli-imperativ', // правила
  s4u1l35: 'veznici-recce-uzvici', // причина
  s4u1l42: 'pridevi-osnovno', // мода
  s4u1l43: 'pridevi-osnovno', // начальник
  s4u1l56: 'prilozi', // природа
  s4u1l58: 'glagoli-prezent', // вечерние дела
  s4u1l22: 'glagoli-imperativ', // телефонный разговор

  // Модуль 5 (B1, вид глагола / прошедшее)
  s5u1l7: 'glagoli-perfekat', // past tense
  s5u1l13: 'glagoli-perfekat', // memories, past events
  s5u1l19: 'glagoli-perfekat', // the past
  s5u1l29: 'glagoli-perfekat', // form the past tense
  s5u1l37: 'glagoli-vid', // verb phrases
  s5u1l51: 'glagoli-perfekat', // recount experiences
  s5u1l42: 'brojevi', // transactions
  s5u1l46: 'glagoli-modalni', // wants and needs

  // Модуль 6 (B1, аорист / сложное)
  s6u1l13: 'slozene-recenice', // report what someone said
  s6u1l16: 'slozene-recenice', // repeat what you heard
  s6u1l24: 'pasiv-bezlicne', // passive voice
  s6u1l27: 'glagoli-modalni', // advice
  s6u1l37: 'glagoli-kondicional', // would have happened
  s6u1l44: 'pasiv-bezlicne', // passive voice
  s6u1l52: 'glagoli-kondicional', // wishes
  s6u1l15: 'glagoli-kondicional', // suggestions

  // Модуль 7 (B2, условное)
  s7u1l10: 'glagoli-futur', // predict
  s7u1l14: 'glagoli-futur', // future
  s7u1l23: 'zamenice-prisvojne-pokazne', // belongings
  s7u1l26: 'glagoli-perfekat', // narrate past events
  s7u1l32: 'glagoli-kondicional', // regrets
  s7u1l36: 'glagoli-kondicional', // hypotheticals
  s7u1l16: 'glagoli-aorist', // reminisce

  // Модуль 8 (B2, сложные конструкции)
  s8u1l5: 'slozene-recenice', // repeat what someone said
  s8u1l6: 'glagoli-vid', // present perfect progressive
  s8u1l12: 'glagoli-kondicional', // conclusions and deductions
  s8u1l13: 'pasiv-bezlicne', // passive voice
  s8u1l21: 'glagoli-futur', // future perfect progressive
  s8u1l24: 'glagoli-imperativ', // command or request
  s8u1l28: 'pasiv-bezlicne', // past perfect passive
  s8u1l32: 'glagoli-kondicional', // speculate
};

/** Тема грамматики для урока (id вида «s4u1l10»). */
export function grammarTopicForLesson(lessonId: string): string | undefined {
  if (OVERRIDES[lessonId]) return OVERRIDES[lessonId];
  const sectionPrefix = lessonId.slice(0, 2);
  return DEFAULT_BY_SECTION[sectionPrefix];
}
