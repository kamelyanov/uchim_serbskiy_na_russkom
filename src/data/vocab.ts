// Словарь для вкладки «Слова». Парсит текстовые файлы из src/data/vocab/.
// Формат (единый для всех тем):
//   # Тема: 🍎 Название темы
//   srpska reč - русский перевод [| Пример. — Перевод примера.]
// Допускается и длинное тире вместо дефиса: «reč — перевод».
// Данные собираются скриптом scripts/build_vocab.py:
//   • сербско-русские_пары.txt — ядро (collection: 'core');
//   • еще-больше-слов.txt — дополнительные слова (collection: 'extra').

export type VocabCollection = 'core' | 'extra';

export interface VocabWord {
  /** Уникальный id: тема + сербское слово. */
  id: string;
  sr: string;
  ru: string;
  example?: string;
}

export interface VocabTheme {
  id: string;
  titleRu: string;
  description?: string;
  collection: VocabCollection;
  words: VocabWord[];
}

/** Пометки, с которых начинается словарная статья, а не перевод. */
const DICTIONARY_TAGS = new Set([
  'грам', 'карт', 'физ', 'мед', 'хим', 'мат', 'биол', 'ист', 'лит', 'муз',
  'спорт', 'воен', 'юр', 'экон', 'филос', 'психол', 'анат', 'бот', 'зоол',
  'геог', 'геол', 'тех', 'жарг', 'диал', 'вульг', 'разг', 'книжн', 'устар',
  'поэт', 'см', 'тж', 'мн', 'ед', 'сов', 'несов', 'перех', 'неперех',
]);

function slugify(title: string, index: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '');
  return `${index}-${slug || 'tema'}`;
}

/** Отбрасывает заголовки-схемы, обрывки и строки без пары. */
function isValidPair(sr: string, ru: string, isPhrases: boolean): boolean {
  if (!sr || !ru) return false;
  if (sr.includes(' + ')) return false;
  if (/\d/.test(sr)) return false;
  if (!isPhrases && /[.!?…]/.test(sr)) return false;
  if (DICTIONARY_TAGS.has(ru.split(/\s+/)[0]?.toLowerCase() ?? '')) return false;
  if (!/[a-zA-ZčćžšđČĆŽŠĐ]/.test(sr)) return false;
  if (!/[а-яёА-ЯЁ]/.test(ru)) return false;
  if (/[A-Za-z]/.test(ru)) return false;
  return true;
}

/** Ищет разделитель пары: сначала « - », затем « — ». */
function splitPair(line: string): { sr: string; rest: string } | null {
  const dash = line.indexOf(' - ');
  if (dash > 0) return { sr: line.slice(0, dash).trim(), rest: line.slice(dash + 3).trim() };
  const emDash = line.indexOf(' — ');
  if (emDash > 0) return { sr: line.slice(0, emDash).trim(), rest: line.slice(emDash + 3).trim() };
  return null;
}

function parseFile(raw: string, collection: VocabCollection): VocabTheme[] {
  const themes: VocabTheme[] = [];
  let current: VocabTheme | null = null;

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('#')) {
      const header = trimmed.replace(/^#+\s*/, '');
      if (header.startsWith('Тема:')) {
        const title = header.slice('Тема:'.length).trim();
        current = {
          id: `${collection}-${slugify(title, themes.length)}`,
          titleRu: title,
          collection,
          words: [],
        };
        themes.push(current);
      } else if (header.startsWith('Описание:') && current) {
        current.description = header.slice('Описание:'.length).trim();
      } else if (/^##/.test(trimmed) && header) {
        // заголовок вида «### Название темы (123)»
        const title = header.replace(/\s*\(\d+\)\s*$/, '').trim();
        current = {
          id: `${collection}-${slugify(title, themes.length)}`,
          titleRu: title,
          collection,
          words: [],
        };
        themes.push(current);
      }
      continue;
    }

    if (!current) continue;

    const pair = splitPair(trimmed);
    if (!pair) continue;
    const { sr } = pair;
    let rest = pair.rest;

    let example: string | undefined;
    const exSep = rest.indexOf(' | ');
    if (exSep !== -1) {
      example = rest.slice(exSep + 3).trim();
      rest = rest.slice(0, exSep).trim();
    }
    if (!isValidPair(sr, rest, current.titleRu.includes('Разговорные фразы'))) continue;

    current.words.push({ id: `${current.id}:${sr}`, sr, ru: rest, example });
  }

  return themes.filter((t) => t.words.length > 0);
}

const files = import.meta.glob('./vocab/*.txt', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const EXTRA_FILE = 'еще-больше-слов.txt';

export const vocabThemes: VocabTheme[] = Object.entries(files)
  .filter(([path]) => !path.endsWith('00-primer.txt'))
  .sort(([a], [b]) => a.localeCompare(b))
  .flatMap(([path, raw]) =>
    parseFile(raw, path.endsWith(EXTRA_FILE) ? 'extra' : 'core'),
  );

export const coreVocabThemes: VocabTheme[] = vocabThemes.filter(
  (t) => t.collection === 'core',
);

export const extraVocabThemes: VocabTheme[] = vocabThemes.filter(
  (t) => t.collection === 'extra',
);

export const allVocabWords: VocabWord[] = vocabThemes.flatMap((t) => t.words);

export const coreVocabWords: VocabWord[] = coreVocabThemes.flatMap((t) => t.words);

export const extraVocabWords: VocabWord[] = extraVocabThemes.flatMap((t) => t.words);
