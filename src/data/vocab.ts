// Словарь для вкладки «Слова». Парсит текстовые файлы из src/data/vocab/.
// Формат (единый для всех тем):
//   # Тема: 🍎 Название темы
//   srpska reč - русский перевод [| Пример. — Перевод примера.]
// Файл собран скриптом scripts/merge_vocab.py (слияние + удаление дубликатов).

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
  words: VocabWord[];
}

function slugify(title: string, index: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '');
  return `${index}-${slug || 'tema'}`;
}

function parseFile(raw: string): VocabTheme[] {
  const themes: VocabTheme[] = [];
  let current: VocabTheme | null = null;

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('#')) {
      const header = trimmed.replace(/^#+\s*/, '');
      if (header.startsWith('Тема:')) {
        current = {
          id: slugify(header.slice('Тема:'.length).trim(), themes.length),
          titleRu: header.slice('Тема:'.length).trim(),
          words: [],
        };
        themes.push(current);
      } else if (header.startsWith('Описание:') && current) {
        current.description = header.slice('Описание:'.length).trim();
      } else if (/^##/.test(trimmed) && header) {
        // заголовок вида «### Название темы (123)»
        const title = header.replace(/\s*\(\d+\)\s*$/, '').trim();
        current = {
          id: slugify(title, themes.length),
          titleRu: title,
          words: [],
        };
        themes.push(current);
      }
      continue;
    }

    if (!current) continue;

    const sep = trimmed.indexOf(' - ');
    if (sep <= 0) continue;
    const sr = trimmed.slice(0, sep).trim();
    let rest = trimmed.slice(sep + 3).trim();

    let example: string | undefined;
    const exSep = rest.indexOf(' | ');
    if (exSep !== -1) {
      example = rest.slice(exSep + 3).trim();
      rest = rest.slice(0, exSep).trim();
    }
    if (!sr || !rest) continue;

    current.words.push({ id: `${current.id}:${sr}`, sr, ru: rest, example });
  }

  return themes.filter((t) => t.words.length > 0);
}

const files = import.meta.glob('./vocab/*.txt', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const vocabThemes: VocabTheme[] = Object.entries(files)
  .filter(([path]) => !path.endsWith('00-primer.txt'))
  .sort(([a], [b]) => a.localeCompare(b))
  .flatMap(([, raw]) => parseFile(raw));

export const allVocabWords: VocabWord[] = vocabThemes.flatMap((t) => t.words);
