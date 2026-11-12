// Тексты для чтения. Парсит текстовые файлы из src/data/reading/.
// Формат файла (одна строка = одно предложение):
//   Večiti derbi (Srbija)          ← первая строка без знака препинания = заголовок текста
//   <строки сербского текста, пустые строки = разбивка на абзацы>
//   Fudbalsko rivalstvo            ← строка без знака препинания = подзаголовок
//   ...
//   # Перевод:
//   <строки русского перевода строго в том же порядке, строка в строку>
// Показывается только сербский текст; русская строка всплывает в баннере
// по нажатию на слово (точный перевод предложения).

export interface ReadingLine {
  sr: string;
  ru: string;
  /** строка без знака препинания — подзаголовок */
  heading: boolean;
}

export interface ReadingParagraph {
  lines: ReadingLine[];
}

export interface ReadingText {
  id: string;
  titleRu: string;
  paragraphs: ReadingParagraph[];
}

const TRANSLATION_MARKER = /^#\s*Перевод:/i;

function isHeading(line: string): boolean {
  return !/[.!?…]$/.test(line) && line.length < 80;
}

/** Режет текст на абзацы по пустым строкам; внутри — непустые строки. */
function splitParagraphLines(raw: string): string[][] {
  const paragraphs: string[][] = [];
  let current: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) {
      if (current.length) {
        paragraphs.push(current);
        current = [];
      }
    } else {
      current.push(t);
    }
  }
  if (current.length) paragraphs.push(current);
  return paragraphs;
}

const flatten = (paras: string[][]) => paras.flat();

function parseFile(path: string, raw: string): ReadingText {
  const lines = raw.split(/\r?\n/);
  const sepIndex = lines.findIndex((l) => TRANSLATION_MARKER.test(l.trim()));
  const srRaw = (sepIndex === -1 ? lines : lines.slice(0, sepIndex)).join('\n');
  const ruRaw = sepIndex === -1 ? '' : lines.slice(sepIndex + 1).join('\n');

  const srParagraphs = splitParagraphLines(srRaw);
  const srLines = flatten(srParagraphs);
  const ruLines = flatten(splitParagraphLines(ruRaw));

  if (srLines.length !== ruLines.length) {
    console.warn(
      `[reading] ${path}: сербских строк ${srLines.length}, русских ${ruLines.length} — переводы будут привязаны по индексу с пустыми пропусками`
    );
  }

  // Заголовок текста: первая сербская строка без знака препинания
  let titleRu = path.split('/').pop()!.replace(/^\d+-/, '').replace(/\.txt$/, '');
  let start = 0;
  if (srLines.length && isHeading(srLines[0])) {
    start = 1;
    titleRu = ruLines.length && isHeading(ruLines[0]) ? ruLines[0] : srLines[0];
  }

  const ruAt = (i: number) => (i < ruLines.length ? ruLines[i] : '');
  const flags = new Array<boolean>(srLines.length);
  for (let i = start; i < srLines.length; i++) flags[i] = isHeading(srLines[i]);

  // Собираем абзацы по структуре пустых строк сербской части;
  // первая строка (заголовок текста) пропускается
  const paragraphs: ReadingParagraph[] = [];
  let cursor = 0;
  for (const paraLines of srParagraphs) {
    const linesOut: ReadingLine[] = [];
    for (const _line of paraLines) {
      const i = cursor;
      cursor++;
      if (i < start) continue;
      linesOut.push({ sr: srLines[i], ru: ruAt(i), heading: flags[i] });
    }
    if (linesOut.length) paragraphs.push({ lines: linesOut });
  }

  return { id: path, titleRu, paragraphs };
}

const files = import.meta.glob('./reading/*.txt', {
  as: 'raw',
  eager: true,
}) as Record<string, string>;

export const readingTexts: ReadingText[] = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, raw]) => parseFile(path, raw));

// ---------------------------------------------------------------------------
// Словарный поиск слова по клику: точное совпадение, затем срезка падежных
// окончаний. Словарь — все пары из вкладки «Слова» (ядро + «ещё больше»).

import { allVocabWords } from './vocab';

const dict = new Map<string, string>();
for (const w of allVocabWords) {
  const key = w.sr.toLowerCase();
  if (!dict.has(key)) dict.set(key, w.ru);
}

const SUFFIXES = ['ovima', 'evima', 'ama', 'ima', 'om', 'og', 'oj', 'em', 'eg', 'a', 'u', 'i', 'e', 'o'];

/** Чистит слово от пунктуации и кавычек по краям. */
export function cleanWord(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/[^\p{L}\p{N}]+$/u, '');
}

/** Ищет перевод слова в словаре; null — не найдено. */
export function lookupWord(raw: string): string | null {
  const w = cleanWord(raw);
  if (!w || /\d/.test(w)) return null;
  const exact = dict.get(w);
  if (exact) return exact;
  for (const suf of SUFFIXES) {
    const stem = w.slice(0, w.length - suf.length);
    if (stem.length >= 3 && w.endsWith(suf)) {
      const hit = dict.get(stem);
      if (hit) return hit;
    }
  }
  return null;
}
