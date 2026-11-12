#!/usr/bin/env node
// Валидатор словарных файлов src/data/vocab/*.txt.
// Запускается автоматически перед сборкой (npm run build -> prebuild).
// Проверяет формат пар, отсутствие мусора и размер ядра.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const VOCAB_DIR = join(process.cwd(), 'src', 'data', 'vocab');
const CORE_FILE = 'сербско-русские_пары.txt';
const EXTRA_FILE = 'еще-больше-слов.txt';
const CORE_TARGET = 3500;

const SERB = /[a-zA-ZčćžšđČĆŽŠĐ]/;
const CYR = /[а-яёА-ЯЁ]/;
const examples = new Set(['00-primer.txt']);

let errors = 0;
const report = (file, line, message) => {
  errors += 1;
  console.error(`✖ ${file}:${line} — ${message}`);
};

function checkFile(name, requireTarget) {
  const raw = readFileSync(join(VOCAB_DIR, name), 'utf8');
  const lines = raw.split(/\r?\n/);

  let theme = null;
  let themeLine = 0;
  let words = 0;
  const seen = new Map();
  const themes = new Set();

  lines.forEach((rawLine, i) => {
    const lineNo = i + 1;
    const line = rawLine.trim();
    if (!line) return;

    if (line.startsWith('#')) {
      const header = line.replace(/^#+\s*/, '');
      if (!header.startsWith('Тема:')) {
        report(name, lineNo, `неизвестный заголовок: «${line}»`);
        return;
      }
      theme = header.slice('Тема:'.length).trim();
      themeLine = lineNo;
      if (!theme) report(name, lineNo, 'пустое название темы');
      if (!/\p{Extended_Pictographic}/u.test(theme)) {
        report(name, lineNo, `в названии темы нет эмодзи: «${theme}»`);
      }
      if (themes.has(theme)) report(name, lineNo, `тема повторяется: «${theme}»`);
      themes.add(theme);
      return;
    }

    if (!theme) {
      report(name, lineNo, 'строка вне темы');
      return;
    }

    const dash = line.indexOf(' - ');
    if (dash <= 0) {
      report(name, lineNo, `нет разделителя « - »: «${line}»`);
      return;
    }
    const sr = line.slice(0, dash).trim();
    const rest = line.slice(dash + 3).trim();
    const pipe = rest.indexOf(' | ');
    const ru = (pipe === -1 ? rest : rest.slice(0, pipe)).trim();

    if (!sr || !ru) {
      report(name, lineNo, `пустая часть пары: «${line}»`);
      return;
    }
    if (sr.includes(' + ') || /\d/.test(sr)) {
      report(name, lineNo, `заголовок-схема или цифры: «${sr}»`);
    }
    if (!SERB.test(sr)) {
      report(name, lineNo, `в сербской части нет латиницы: «${sr}»`);
    }
    if (!CYR.test(ru)) {
      report(name, lineNo, `в переводе нет кириллицы: «${ru}»`);
    }
    if (/[A-Za-z]/.test(ru)) {
      report(name, lineNo, `латиница в переводе: «${ru}»`);
    }
    if (/[.!?]\s/.test(ru)) {
      report(name, lineNo, `в переводе предложение, а не пара: «${ru}»`);
    }

    const prev = seen.get(sr);
    if (prev !== undefined) {
      report(name, lineNo, `дубль «${sr}» (уже был в строке ${prev})`);
    } else {
      seen.set(sr, lineNo);
    }
    words += 1;
  });

  if (!themes.size) report(name, 1, 'нет ни одной темы');
  if (theme !== null && themeLine && words === 0) {
    report(name, themeLine, 'тема без слов');
  }
  if (requireTarget && words !== CORE_TARGET) {
    report(name, 1, `в ядре ${words} пар, ожидалось ${CORE_TARGET}`);
  }
  return { words, themes: themes.size };
}

const files = readdirSync(VOCAB_DIR).filter(
  (f) => f.endsWith('.txt') && !examples.has(f),
);

for (const required of [CORE_FILE, EXTRA_FILE]) {
  if (!files.includes(required)) {
    errors += 1;
    console.error(`✖ нет обязательного файла ${required}`);
  }
}

let total = 0;
for (const name of files.sort()) {
  const { words, themes } = checkFile(name, name === CORE_FILE);
  total += words;
  console.log(`✓ ${name}: ${words} пар в ${themes} темах`);
}

if (errors) {
  console.error(`\nВалидация словаря не пройдена: ${errors} ошибок.`);
  process.exit(1);
}

console.log(`\nВалидация словаря пройдена: ${total} пар.`);
