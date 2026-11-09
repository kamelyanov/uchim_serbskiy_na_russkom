// Serbian Latin -> Cyrillic transliteration.
// Serbian is digraphic: every Latin word here has exactly one Cyrillic form,
// so conversion is fully deterministic (digraphs first: dž, lj, nj).

const DIGRAPHS: Record<string, string> = {
  'dž': 'џ', 'Dž': 'Џ', 'DŽ': 'Џ',
  'lj': 'љ', 'Lj': 'Љ', 'LJ': 'Љ',
  'nj': 'њ', 'Nj': 'Њ', 'NJ': 'Њ',
};

const LETTERS: Record<string, string> = {
  a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', 'đ': 'ђ', e: 'е', 'ž': 'ж',
  z: 'з', i: 'и', j: 'ј', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о',
  p: 'п', r: 'р', s: 'с', t: 'т', 'ć': 'ћ', u: 'у', f: 'ф', h: 'х',
  c: 'ц', 'č': 'ч', 'š': 'ш',
  A: 'А', B: 'Б', V: 'В', G: 'Г', D: 'Д', 'Đ': 'Ђ', E: 'Е', 'Ž': 'Ж',
  Z: 'З', I: 'И', J: 'Ј', K: 'К', L: 'Л', M: 'М', N: 'Н', O: 'О',
  P: 'П', R: 'Р', S: 'С', T: 'Т', 'Ć': 'Ћ', U: 'У', F: 'Ф', H: 'Х',
  C: 'Ц', 'Č': 'Ч', 'Š': 'Ш',
};

export function toCyrillic(latin: string): string {
  let out = latin;
  for (const [lat, cyr] of Object.entries(DIGRAPHS)) {
    out = out.split(lat).join(cyr);
  }
  return out
    .split('')
    .map((ch) => LETTERS[ch] ?? ch)
    .join('');
}

export type Script = 'latin' | 'cyrillic';

export function sr(text: string, script: Script): string {
  return script === 'cyrillic' ? toCyrillic(text) : text;
}
