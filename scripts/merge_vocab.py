# -*- coding: utf-8 -*-
"""Слияние двух словарей в один файл с единым стилем тем (эмодзи + название).

Читает:
  src/data/vocab/сербско-русские_пары.txt  (### Название (N), пары без примеров)
  src/data/vocab/vocab.me.txt              (# Тема: 🍎 ..., пары с примерами « | »)
Пишет результат в сербско-русские_пары.txt, vocab.me.txt удаляется.

Темы из vocab.me.txt сливаются в темы большого файла по MAP; темы вне MAP
дописываются в конец как отдельные. Дубликаты (sr, ru) удаляются глобально;
если у дубликата из vocab.me.txt есть пример, он дописывается к сохранённой паре.
"""
import re
import sys
from pathlib import Path

VOCAB = Path(__file__).resolve().parent.parent / "src" / "data" / "vocab"
BIG = VOCAB / "сербско-русские_пары.txt"
ME = VOCAB / "vocab.me.txt"

# Итоговые темы: эмодзи-название -> исходное название в большом файле (None = новая)
THEMES = [
    ("🍎 Еда и кухня", "Еда и кухня"),
    ("⚽ Спорт", "Спорт"),
    ("🏙️ Улица и город", "Улица и город"),
    ("🏠 Дом и квартира", "Дом и квартира"),
    ("👕 Одежда и обувь", "Одежда и обувь"),
    ("👨‍👩‍👧‍👦 Семья и люди", "Семья и люди"),
    ("🧑‍⚕️ Тело и здоровье", "Тело и здоровье"),
    ("🌳 Природа и погода", "Природа и погода"),
    ("🐾 Животные и растения", "Животные и растения"),
    ("💼 Работа и профессии", "Работа и профессии"),
    ("📚 Школа и образование", "Школа и образование"),
    ("🛒 Магазины и деньги", "Магазины и деньги"),
    ("📱 Техника и связь", "Техника и связь"),
    ("✈️ Путешествия и отдых", "Путешествия и отдых"),
    ("⏰ Числа, время и меры", "Числа, время и меры"),
    ("😊 Чувства, характер и общение", "Чувства, характер и общение"),
    ("🔗 Служебные слова", "Служебные слова"),
    ("🏃 Глаголы общего значения", "Глаголы общего значения"),
    ("🎨 Прилагательные общего значения", "Прилагательные общего значения"),
    ("💬 Наречия", "Наречия"),
    ("📦 Прочие существительные", "Прочие существительные"),
    ("📍 Предлоги в моделях", None),
    ("🗨️ Разговорные фразы", None),
    ("🌈 Цвета", None),
]

# Тема из vocab.me.txt -> итоговое эмодзи-название темы / None - своя тема
MAP = {
    "Еда, продукты, кухня": "🍎 Еда и кухня",
    "Дом, мебель, быт": "🏠 Дом и квартира",
    "Одежда и внешность": "👕 Одежда и обувь",
    "Транспорт и город": "🏙️ Улица и город",
    "Здоровье и тело": "🧑‍⚕️ Тело и здоровье",
    "Природа и животные": "🌳 Природа и погода",
    "Семья и люди": "👨‍👩‍👧‍👦 Семья и люди",
    "Учёба, работа, технологии": "📚 Школа и образование",
    "Работа, бизнес, деньги": "💼 Работа и профессии",
    "Эмоции и характер": "😊 Чувства, характер и общение",
    "Учёба и язык": "📚 Школа и образование",
    "Технологии и телефон": "📱 Техника и связь",
    "Путешествия и отель": "✈️ Путешествия и отдых",
    "Покупки и магазины": "🛒 Магазины и деньги",
    "Животные": "🐾 Животные и растения",
    "Природа": "🌳 Природа и погода",
    "Спорт": "⚽ Спорт",
    "Деньги и финансы": "🛒 Магазины и деньги",
    "Прилагательные": "🎨 Прилагательные общего значения",
    "Наречия и служебные слова": "🔗 Служебные слова",
    "Предлоги в моделях": None,
    "Разговорные фразы": "🗨️ Разговорные фразы",
    "Глаголы движения": "🏃 Глаголы общего значения",
    "Базовые действия": "🏃 Глаголы общего значения",
    "Покупки и быт": "🏃 Глаголы общего значения",
    "Общение": "🏃 Глаголы общего значения",
    "Другие частотные глаголы": "🏃 Глаголы общего значения",
    "Профессии": "💼 Работа и профессии",
    "Время и числа": "⏰ Числа, время и меры",
    "Цвета": "🌈 Цвета",
}

TITLE_RE = re.compile(r"^#\s*Тема:\s*")
COUNT_RE = re.compile(r"\s*\(\d+\)\s*$")


def split_pair(line):
    """Разбор строки «sr - ru [| пример]» — зеркально парсеру src/data/vocab.ts."""
    sep = line.find(" - ")
    if sep <= 0:
        return None
    sr = line[:sep].strip()
    rest = line[sep + 3:].strip()
    example = None
    ex_sep = rest.find(" | ")
    if ex_sep != -1:
        example = rest[ex_sep + 3:].strip()
        rest = rest[:ex_sep].strip()
    if not sr or not rest:
        return None
    return sr, rest, example


def parse_big(path):
    """-> {название темы: [(sr, ru, example)]} из формата «### Название (N)»."""
    themes = {}
    current = None
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("#"):
            header = line.lstrip("#").strip()
            current = COUNT_RE.sub("", header).strip()
            themes.setdefault(current, [])
            continue
        if current is None:
            continue
        pair = split_pair(line)
        if pair:
            themes[current].append(pair)
    return themes


def parse_me(path):
    """-> [(тема, [(sr, ru, example)])] из формата «# Тема: 🍎 Название»."""
    themes = []
    current = None
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line:
            continue
        m = TITLE_RE.match(line)
        if m:
            title = m.group(0) and TITLE_RE.sub("", line).strip()
            # отрезаем эмодзи и скобки вида «(Спорт)»
            title = re.sub(r"^[^\w\d]+", "", title).strip()
            title = re.sub(r"\s*\([^)]*\)\s*$", "", title).strip()
            current = (title, [])
            themes.append(current)
            continue
        if line.startswith("#") or current is None:
            continue
        pair = split_pair(line)
        if pair:
            current[1].append(pair)
    return themes


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    big = parse_big(BIG)
    me = parse_me(ME)

    by_final = {final: [] for final, _ in THEMES}

    dup = 0
    seen = {}  # (sr, ru) lower -> (theme_final, index) для апгрейда примеров

    def add(final, sr, ru, example):
        nonlocal dup
        key = (sr.lower(), ru.lower())
        if key in seen:
            dup += 1
            t_final, idx = seen[key]
            if example:
                sr0, ru0, ex0 = by_final[t_final][idx]
                if not ex0:
                    by_final[t_final][idx] = (sr0, ru0, example)
            return
        seen[key] = (final, len(by_final[final]))
        by_final[final].append((sr, ru, example))

    for final, big_name in THEMES:
        if big_name and big_name in big:
            for sr, ru, ex in big[big_name]:
                add(final, sr, ru, ex)

    skipped = []
    for title, pairs in me:
        target = MAP.get(title)
        if target is None and title not in ("Предлоги в моделях",):
            skipped.append(title)
            continue
        final = target if target else "📍 Предлоги в моделях"
        if final not in by_final:
            skipped.append(title)
            continue
        for sr, ru, ex in pairs:
            add(final, sr, ru, ex)

    lines = []
    total = 0
    for final, _ in THEMES:
        items = by_final[final]
        if not items:
            continue
        # исходный порядок большого файла уже отсортирован; после слияния
        # пересортируем только «большие» темы, свои темы me оставляем как есть
        big_name = dict(THEMES)[final]
        if big_name:
            items = sorted(items, key=lambda p: p[0].lower())
        lines.append(f"# Тема: {final}")
        for sr, ru, ex in items:
            lines.append(f"{sr} - {ru}" + (f" | {ex}" if ex else ""))
        lines.append("")
        total += len(items)

    BIG.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    ME.unlink()

    print(f"всего слов: {total}, дубликатов удалено: {dup}")
    if skipped:
        print("темы из vocab.me.txt БЕЗ сопоставления (пропущены):", skipped)
    for final, _ in THEMES:
        if by_final[final]:
            print(f"  {final}: {len(by_final[final])}")


if __name__ == "__main__":
    sys.exit(main())
