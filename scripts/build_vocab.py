# -*- coding: utf-8 -*-
"""Сборка учебного словаря из сырого словарного дампа.

Делает:
  1. чистит OCR-мусор и обрезанные переводы;
  2. склеивает падежные/родовые/спрягаемые формы в одну запись
     «kuća / kući / kuću - дом»;
  3. выбирает ядро 3500 пар по частотности и тематическим квотам;
  4. остаток складывает в отдельный файл «еще-больше-слов.txt» с теми же темами.

Запуск:
    python scripts/build_vocab.py

Исходник: scripts/vocab_sources/сербско-русские_пары.raw.txt
Частотные списки кешируются в scripts/.cache/ (скачиваются при первом запуске).
"""
from __future__ import annotations

import math
import re
import sys
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "scripts"
VOCAB = ROOT / "src" / "data" / "vocab"
RAW = SCRIPTS / "vocab_sources" / "сербско-русские_пары.raw.txt"
CORE_OUT = VOCAB / "сербско-русские_пары.txt"
EXTRA_OUT = VOCAB / "еще-больше-слов.txt"
CACHE = SCRIPTS / ".cache"

CORE_TARGET = 3500
CORE_SR_MAX = 50000
CORE_RU_MAX = 50000

PHRASES = "🗨️ Разговорные фразы"
PREPOSITIONS = "📍 Предлоги в моделях"
COLORS = "🌈 Цвета"
VERBS = "🏃 Глаголы общего значения"
ADJECTIVES = "🎨 Прилагательные общего значения"
ADVERBS = "💬 Наречия"
OTHER = "📦 Прочие существительные"

THEMES = [
    "🍎 Еда и кухня",
    "⚽ Спорт",
    "🏙️ Улица и город",
    "🏠 Дом и квартира",
    "👕 Одежда и обувь",
    "👨‍👩‍👧‍👦 Семья и люди",
    "🧑‍⚕️ Тело и здоровье",
    "🌳 Природа и погода",
    "🐾 Животные и растения",
    "💼 Работа и профессии",
    "📚 Школа и образование",
    "🛒 Магазины и деньги",
    "📱 Техника и связь",
    "✈️ Путешествия и отдых",
    "⏰ Числа, время и меры",
    "😊 Чувства, характер и общение",
    "🔗 Служебные слова",
    VERBS,
    ADJECTIVES,
    ADVERBS,
    OTHER,
    PREPOSITIONS,
    PHRASES,
    COLORS,
]

# Тема -> вес для отбора в ядро (бытовые темы важнее словарных редкостей).
THEME_WEIGHT = defaultdict(lambda: 2.4)
for t in THEMES[:15] + [THEMES[16], PHRASES]:
    THEME_WEIGHT[t] = 3.0
for t in (THEMES[15], VERBS, ADJECTIVES, ADVERBS, OTHER, PREPOSITIONS, COLORS):
    THEME_WEIGHT[t] = 2.2
THEME_WEIGHT[OTHER] = 1.0

# Минимум в ядре для маленьких, но полезных тем.
CORE_FLOOR = {PREPOSITIONS: 14, COLORS: 10, PHRASES: 100}
# Потолки, чтобы «Прочие» и глаголы не съедали ядро.
CORE_CAP = {OTHER: 900, VERBS: 450}
# Минимум для обычной темы (если в ней есть столько чистых слов).
MIN_PER_THEME = 60

# Словарные пометы — такие строки не нужны в карточках.
TAGS = {
    "карт", "грам", "физ", "мед", "хим", "мат", "биол", "ист", "лит", "муз",
    "спорт", "воен", "юр", "экон", "филос", "психол", "анат", "бот", "зоол",
    "геог", "геол", "мин", "тех", "жарг", "диал", "вульг", "презр", "ирон",
    "ласк", "уменьш", "увел", "собир", "отвлеч", "кач", "действ", "сост",
    "страд", "возвр", "сов", "несов", "перех", "неперех", "однокр", "мн",
    "ед", "ж", "м", "ср", "pl", "sg", "praep", "adv", "adj", "n", "v",
    "см", "смт", "тж", "т", "п", "срзн", "разг", "книжн", "устар", "поэт",
    "библ", "миф", "лингв", "софт", "прог", "полит", "фин", "бухг", "сельс",
    "стр", "авиа", "мор", "жд", "авто", "охот", "рыб", "горн", "металл",
    "фото", "кино", "театр", "архит", "рел", "церк", "лог", "этн", "фольк",
    "нар", "посл", "погов", "афор", "шутл", "пренебр", "восх", "употр",
}

RU_FUNC = {
    "я", "ты", "он", "она", "оно", "мы", "вы", "они", "меня", "тебя", "его",
    "её", "ее", "нас", "вас", "их", "мне", "тебе", "ему", "ей", "нам", "вам",
    "им", "мой", "моя", "моё", "мое", "мои", "твой", "твоя", "твоё", "твое",
    "твои", "наш", "наша", "наше", "наши", "ваш", "ваша", "ваше", "ваши",
    "свой", "своя", "своё", "свое", "свои", "этот", "эта", "это", "эти",
    "тот", "та", "то", "те", "себя", "себе", "кто", "что", "какой", "какая",
    "какое", "какие", "который", "которая", "которое", "которые", "чей",
    "чья", "чьё", "чье", "чьи", "где", "куда", "откуда", "когда", "зачем",
    "почему", "отчего", "сколько", "столько", "весь", "вся", "всё", "все",
    "сам", "сама", "само", "сами", "каждый", "любой", "иной", "никто",
    "ничто", "некто", "нечто", "некий", "и", "а", "но", "или", "да", "нет",
    "не", "ни", "хотя", "если", "чтобы", "как", "чем", "ли", "будто",
    "словно", "точно", "тоже", "также", "только", "лишь", "даже", "именно",
    "прямо", "почти", "едва", "чуть", "вдруг", "вовсе", "уже", "ещё", "еще",
    "теперь", "тогда", "потом", "затем", "после", "перед", "около", "вокруг",
    "через", "сквозь", "вместо", "ввиду", "насчёт", "вследствие",
    "благодаря", "согласно", "несмотря", "вроде", "кроме", "мимо", "вдоль",
    "поперёк", "наподобие", "относительно", "без", "в", "до", "для", "за",
    "из", "к", "ко", "на", "над", "о", "об", "от", "по", "под", "при", "про",
    "с", "со", "у", "конечно", "разумеется", "действительно", "вероятно",
    "может", "наверное", "пожалуй", "приблизительно", "примерно", "особенно",
    "специально", "нарочно", "случайно", "нечаянно", "наряду", "вперёд",
    "назад", "вверх", "вниз", "внутрь", "наружу", "отсюда", "туда", "сюда",
    "оттуда", "здесь", "там", "тут", "повсюду", "везде", "никуда", "нигде",
    "как-то", "куда-то", "где-то", "когда-то", "что-то", "кто-то",
    "какой-то", "как-нибудь", "где-нибудь", "куда-нибудь", "когда-нибудь",
    "что-нибудь", "кто-нибудь", "какой-нибудь", "заодно", "навсегда",
    "навеки", "навек", "впредь", "впоследствии", "прежде", "раньше", "позже",
    "заранее", "загодя", "поспешно", "так", "этак", "иначе", "по-другому",
}

SR_FUNC = {
    "ja", "ti", "on", "ona", "ono", "mi", "vi", "oni", "se", "ga", "mu",
    "joj", "ih", "im", "me", "te", "nas", "vas", "njih", "njega", "njemu",
    "njoj", "ovaj", "ova", "ovo", "ovi", "taj", "ta", "to", "te", "onaj",
    "koji", "koja", "koje", "čiji", "neki", "svaki", "sve", "svi", "sva",
    "biti", "je", "su", "sam", "si", "smo", "ste", "ću",
    "ćeš", "će", "ćemo", "ćete", "da", "ne", "ni", "i", "a", "ali", "ili",
    "ako", "kad", "gde", "kuda", "odakle", "zašto", "kako", "šta", "ko",
    "što", "jer", "dok", "pa", "uz", "iz", "na", "u", "o", "po", "do", "od",
    "za", "sa", "bez", "pred", "pod", "nad", "pri", "kroz", "mimo", "prema",
    "kod", "zbog", "radi", "osim", "umesto", "između", "iznad", "ispod",
    "pored", "oko", "posle", "pre", "tokom",
}

# Явные англицизмы-заголовки, не являющиеся сербскими словами.
ENGLISH_ONLY = {
    "apple", "house", "home", "name", "game", "road", "river", "school",
    "life", "sun", "time", "love", "food", "water", "book", "dog", "cat",
    "man", "woman", "good", "bad", "big", "small", "new", "old", "night",
    "work", "money", "friend", "city", "country", "world", "hand", "head",
    "eye", "door", "window", "table", "chair", "bread", "milk", "meat",
    "fish", "fruit", "tree", "flower", "moon", "sky", "sea", "mountain",
    "street", "market", "shop", "doctor", "teacher", "child", "boy", "girl",
    "mother", "father", "brother", "sister", "family", "word", "language",
    "number", "year", "month", "week", "hour", "minute", "hot", "cold",
    "please", "thanks", "hello", "welcome", "key", "all",
}

BAD_END = re.compile(
    r"(^|\s)(на|в|во|с|со|по|из|изо|от|до|для|под|подо|над|при|о|об|обо|"
    r"к|ко|у|за|про|через|без|между|перед|пред|около|после|кроме|вместо|"
    r"сквозь|вдоль|мимо|ради|благодаря|согласно|несмотря|вроде|наподобие|"
    r"относительно|вследствие|ввиду|насчёт|и|а|но|или|что|как|чем|это|же|"
    r"ли|бы)$",
    re.IGNORECASE,
)

SERB_CHARS = re.compile(r"^[a-zčćžšđ][a-zčćžšđ /'’\-()]*$")
RU_CHARS = re.compile(r"^[а-яёА-ЯЁ][а-яёА-ЯЁ /'’\-(),.;:!?—–]*$")
SENTENCE_RE = re.compile(r"[.!?](\s|$)|\.\s|…")

SR_ENDINGS = sorted(
    {
        "ovima", "evima", "ijima", "ijem", "ijih", "ijim", "ijoj", "ijeg",
        "ovati", "evati", "ivati", "uvati", "isati", "irati", "nuti",
        "jati", "ati", "eti", "iti", "uti", "sti", "šti",
        "ošću", "šću", "ama", "jima", "ima", "ovi", "evi", "ove", "eve",
        "ova", "eva", "iju", "ija", "eta", "etu", "etom", "ić", "ica",
        "ici", "icu", "ice", "om", "em", "og", "eg", "oj", "ih", "im",
        "ac", "ak", "ek", "ka", "ko", "je", "nje", "će", "ju", "u", "a",
        "e", "i", "o", "",
    },
    key=len,
    reverse=True,
)

ALT_PAIRS = (
    ("šć", "st"), ("št", "st"), ("đ", "d"), ("ć", "t"), ("č", "k"),
    ("ž", "g"), ("š", "h"), ("c", "k"), ("z", "g"), ("lj", "l"),
    ("nj", "n"),
)


def alt_stems(stem: str) -> set[str]:
    out: set[str] = set()
    for a, b in ALT_PAIRS:
        if stem.endswith(a):
            out.add(stem[: -len(a)] + b)
    return out





def fetch_freq(lang: str, name: str) -> dict[str, int]:
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / name
    if not path.exists():
        url = (
            "https://raw.githubusercontent.com/hermitdave/FrequencyWords/"
            f"master/content/2018/{lang}/{name}"
        )
        print(f"скачиваю {url}")
        path.write_bytes(urllib.request.urlopen(url, timeout=60).read())
    out: dict[str, int] = {}
    for i, line in enumerate(path.read_text(encoding="utf-8").splitlines()):
        word = line.split()[0].lower()
        out.setdefault(word, i + 1)
    return out


def norm_ru(text: str) -> str:
    text = text.lower().replace("ё", "е")
    return re.sub(r"\s+", " ", text).strip(" .,;:!?—–-()")


def has_cyr(text: str) -> bool:
    return bool(re.search(r"[а-яё]", text.lower()))


def ru_words(text: str) -> list[str]:
    return re.findall(r"[а-яё]+", text.lower().replace("ё", "е"))


NON_VERB_RU = {"суть", "путь", "жуть", "муть", "мать", "часть", "власть", "смерть"}
PREPS = {
    "в", "во", "на", "с", "со", "по", "из", "изо", "от", "до", "для", "под",
    "подо", "над", "при", "о", "об", "обо", "к", "ко", "у", "за", "про",
    "через", "без", "между", "перед", "пред", "около", "после", "кроме",
    "вместо", "сквозь", "вдоль", "мимо", "ради", "благодаря", "согласно",
    "несмотря", "вроде", "наподобие", "относительно", "вследствие", "ввиду",
    "насчёт",
}

# Короткие слова, которые могут законно стоять в конце перевода.
SHORT_TAIL_OK = {
    "не", "же", "ли", "бы", "то", "та", "те", "тот", "эта", "эти", "все",
    "всё", "он", "она", "оно", "они", "мы", "вы", "я", "ты", "их", "им",
    "ей", "его", "ее", "её", "сам", "сама", "само", "сами", "уже", "ещё",
    "еще", "так", "как", "что", "чем", "и", "а", "но", "или", "да", "на",
    "в", "во", "с", "со", "по", "за", "до", "от", "из", "к", "ко", "у",
    "о", "об", "обо", "над", "под", "при", "про", "для", "без", "их",
}

# Заведомо неверные пары из сырого дампа (обрывки словосочетаний и т.п.).
BLACKLIST = {
    ("blaga", "мягкий климат"),
    ("crno", "красное вино"),
    ("decja", "детская игра"),
    ("dečja", "детская игра"),
    ("cveca", "свеча"),
    ("cveća", "свеча"),
    ("adela", "одежда"),
    ("baki", "парень"),
    ("biser", "глупая"),
    ("bacati", "гадать на картах"),
    ("dolaziti", "приходить в себя"),
    ("daru", "днём и ночью"),
    ("bogu", "очень далеко"),
    ("bliski", "близкий ро"),
    ("akademski", "студент"),
    ("dobio", "есть"),
    ("kan", "вероятно"),
    ("baš", "словно"),
    ("biti", "носить траур"),
    ("biti", "иметь доброе"),
    ("biti", "иметь лёгкую ру"),
    ("biti", "иметь пре"),
    ("biti", "помога"),
    ("biti", "ревно"),
    ("bacati", "заковать в кан"),
    ("bacati", "обвиня ть"),
    ("baciti", "бро"),
    ("boriti", "боро"),
    ("celu", "лоб"),
    ("bena", "дурак"),
    ("bacač", "гранатомёт"),
    ("biti", "хотеть"),
    ("biti", "желать"),
    ("bacati", "озабочивать"),
    ("braniti", "защищать диссерта"),
    ("bitka", "боевой"),
    ("celu", "всю ночь"),
    ("bio", "он"),
    ("eve", "всё в порядке"),
    ("gumena", "резиновая обувь"),
    ("beli", "белая мука"),
    ("bela", "белая мука"),
    ("belo", "белая мука"),
    ("dolaziti", "получать слово"),
    ("bati", "брат"),
}

# Латиница -> кириллица для проверки «ложных друзей»/кодеков.
TRANSLIT = {
    "dž": "џ", "lj": "љ", "nj": "њ",
    "a": "а", "b": "б", "v": "в", "g": "г", "d": "д", "đ": "ђ", "e": "е",
    "ž": "ж", "z": "з", "i": "и", "j": "ј", "k": "к", "l": "л", "m": "м",
    "n": "н", "o": "о", "p": "п", "r": "р", "s": "с", "t": "т", "ć": "ћ",
    "u": "у", "f": "ф", "h": "х", "c": "ц", "č": "ч", "š": "ш",
}


def to_cyr(head: str) -> str:
    out = head.lower()
    for lat, cyr in TRANSLIT.items():
        out = out.replace(lat, cyr)
    return out


def ru_pos(ru: str) -> str:
    """Часть речи русского перевода по первому значимому слову."""
    words = ru_words(ru)
    while words and words[0] in PREPS:
        words.pop(0)
    if not words:
        return "noun"
    w = words[0]
    if w in RU_FUNC:
        return "func"
    if w in NON_VERB_RU:
        return "noun"
    if re.search(r"(ать|ять|ить|еть|оть|уть|ыть|ться|тся|ся|сь)$", w):
        return "verb"
    if w.endswith(("ый", "ий", "ой", "ая", "яя", "ое", "ее", "ые")):
        return "adj"
    return "noun"


def is_verb_ru(ru: str) -> bool:
    return ru_pos(ru) == "verb"


def is_verb(head: str, ru: str) -> bool:
    h = head.split(" / ")[0]
    return h.endswith(("ti", "ći")) or is_verb_ru(ru)


def is_adjective(ru: str) -> bool:
    return ru_pos(ru) == "adj"


def word_class(head: str, ru: str) -> str:
    if is_verb(head, ru):
        return "verb"
    if is_adjective(ru):
        return "adj"
    if norm_ru(ru) in RU_FUNC or head.split(" / ")[0] in SR_FUNC:
        return "func"
    return "noun"


def stems(head: str) -> set[str]:
    """Грубый набор основ: kuća / kući / kuću -> kuć; dobar -> dobar, dobr."""
    h = head.lower().split(" / ")[0].strip()
    out: set[str] = set()
    for end in SR_ENDINGS:
        if end and not h.endswith(end):
            continue
        stem = h[: len(h) - len(end)] if end else h
        if len(stem) >= 2:
            out.add(stem)
    if not out and len(h) >= 2:
        out.add(h)
    # беглый «а»: dobar -> dobr, težak -> težk
    for stem in list(out):
        if len(stem) >= 4 and stem[-2] == "a" and stem[-1] not in "aeiou":
            out.add(stem[:-2] + stem[-1])
    # debeo -> debel, ceo -> cel
    if h.endswith("eo"):
        out.add(h[:-2] + "el")
    # регулярные чередования: bolest / bolešću, noć / noći
    for stem in list(out):
        out |= alt_stems(stem)
    return out


def strip_preps(ru: str) -> str:
    words = ru_words(ru)
    while words and words[0] in PREPS:
        words.pop(0)
    return " ".join(words)


def ru_core_similar(a: str, b: str) -> bool:
    if a == b:
        return True
    if len(a) >= 4 and len(b) >= 4:
        if (a.startswith(b) or b.startswith(a)) and abs(len(a) - len(b)) <= 3:
            return True
    # красный / красная
    if len(a) >= 5 and len(b) >= 5 and a[:5] == b[:5] and abs(len(a) - len(b)) <= 3:
        return True
    return False


def ru_similar(a: str, b: str) -> bool:
    a, b = norm_ru(a), norm_ru(b)
    if ru_core_similar(a, b):
        return True
    sa, sb = strip_preps(a), strip_preps(b)
    if not sa or not sb or (sa == a and sb == b):
        return False
    return ru_core_similar(sa, sb)


def repair_ocr(head: str) -> str:
    return head.replace("ct", "st").replace("kj", "klj")


def suspicious_ocr(head: str) -> bool:
    # «ije» — законная иекавица; «ie» без j и «ii» — почти всегда OCR.
    if re.search(r"(?<!j)ie", head):
        return True
    if "ii" in head:
        return True
    if head.startswith("db"):
        return True
    return False


class Entry:
    __slots__ = ("head", "ru", "theme", "line", "forms", "example")

    def __init__(self, head: str, ru: str, theme: str, line: int, example: str | None = None):
        self.head = head
        self.ru = ru
        self.theme = theme
        self.line = line
        self.forms = [head]
        self.example = example

    @property
    def shown_head(self) -> str:
        return " / ".join(self.forms)

    def __repr__(self) -> str:
        return f"<{self.line}: {self.shown_head} - {self.ru}>"


PREP_RE = re.compile(r"^([a-zčćžšđ]+) \+ ([A-Za-z]+) \((.+)\)$")


def parse_raw() -> tuple[list[Entry], Counter]:
    stats: Counter = Counter()
    theme = None
    entries: list[Entry] = []
    for lineno, raw in enumerate(RAW.read_text(encoding="utf-8").splitlines(), 1):
        line = raw.strip()
        if not line:
            continue
        if line.startswith("#"):
            theme = re.sub(r"^#\s*Тема:\s*", "", line).strip()
            continue
        if theme is None:
            stats["без темы"] += 1
            continue
        idx = line.find(" - ")
        if idx <= 0:
            stats["нет разделителя"] += 1
            continue
        head = line[:idx].strip()
        rest = line[idx + 3 :].strip()

        # «u + Akuzativ (в, направление) - Idem u grad. — Я иду в город.»
        m = PREP_RE.match(head)
        if m:
            word, case, meaning = m.groups()
            entries.append(
                Entry(f"{word} ({case})", meaning, PREPOSITIONS, lineno, rest)
            )
            stats["предлог в модели"] += 1
            continue

        example = None
        for sep in (" | ", " — "):
            pos = rest.find(sep)
            if pos != -1:
                example = rest[pos + len(sep) :].strip()
                rest = rest[:pos].strip()
                break
        if not head or not rest:
            stats["пустая часть"] += 1
            continue
        entries.append(Entry(head, rest, theme, lineno, example))
    return entries, stats


def looks_like_sentence(head: str) -> bool:
    if SENTENCE_RE.search(head):
        return True
    words = head.split()
    return len(words) >= 3 and head[:1].isupper()


def clean_entries(entries: list[Entry], ru_freq_tail: dict[str, int] | None = None) -> tuple[list[Entry], Counter]:
    stats: Counter = Counter()
    out: list[Entry] = []
    ru_freq_tail = ru_freq_tail or {}
    for e in entries:
        head = repair_ocr(e.head.lower().strip())
        ru = re.sub(r"\s+", " ", e.ru).strip()
        theme = e.theme
        phrase = theme == PHRASES

        if theme not in THEMES:
            stats["неизвестная тема"] += 1
            continue
        if not head or not ru:
            stats["пусто"] += 1
            continue

        # Предложения из тематических разделов переносим в «Разговорные фразы».
        if not phrase and looks_like_sentence(head):
            theme = PHRASES
            phrase = True
            stats["предложение -> фразы"] += 1

        if phrase:
            if " + " in head or any(ch.isdigit() for ch in head):
                stats["грамматическая схема/цифры"] += 1
                continue
            if not re.search(r"[A-Za-zčćžšđČĆŽŠĐ]", head):
                stats["нелатинский заголовок"] += 1
                continue
            if not has_cyr(ru) or re.search(r"[A-Za-z]", ru):
                stats["перевод без кириллицы"] += 1
                continue
            if re.search(r"[а-яё][А-ЯЁ]", ru):
                stats["склейка в переводе"] += 1
                continue
            e.head, e.ru, e.theme = head, ru, theme
            out.append(e)
            stats["оставлено"] += 1
            continue

        if len(head) < 3 or len(head) > 40:
            stats["длина заголовка"] += 1
            continue
        if head in ENGLISH_ONLY:
            stats["англицизм"] += 1
            continue
        if " + " in head or any(ch.isdigit() for ch in head):
            stats["грамматическая схема/цифры"] += 1
            continue
        if not SERB_CHARS.match(head):
            stats["нелатинский заголовок"] += 1
            continue
        if suspicious_ocr(head):
            stats["OCR-мусор"] += 1
            continue
        if not has_cyr(ru):
            stats["перевод без кириллицы"] += 1
            continue
        if re.search(r"[A-Za-z]", ru):
            stats["латиница в переводе"] += 1
            continue
        if not RU_CHARS.match(ru):
            stats["недопустимые символы в переводе"] += 1
            continue
        if re.search(r"[.!?]\s|[.!?]$", ru) or re.search(r"[.!?]\s", head):
            stats["предложение вместо пары"] += 1
            continue
        if theme != PREPOSITIONS and BAD_END.search(ru):
            stats["обрезанный перевод"] += 1
            continue
        if len(ru) < 2:
            stats["слишком короткий перевод"] += 1
            continue
        words = ru_words(ru)
        if (head.split(" / ")[0], ru) in BLACKLIST:
            stats["чёрный список"] += 1
            continue
        if words and len(words[-1]) <= 2 and words[-1] not in SHORT_TAIL_OK:
            if theme != PREPOSITIONS:
                stats["обрезанный перевод"] += 1
                continue
        if len(words) >= 2 and words[-1] not in ru_freq_tail:
            if theme != PREPOSITIONS:
                stats["обрезанный перевод"] += 1
                continue
        if len(words) >= 2 and words[0] in {"он", "она", "оно", "они", "это", "ему", "ей", "мне", "тебе", "его", "ее", "их", "нас", "вас"}:
            stats["пример вместо перевода"] += 1
            continue
        if len(words) >= 2 and words[0] in TAGS:
            stats["словарная помета"] += 1
            continue
        if any(len(w) > 24 for w in words):
            stats["склейка в переводе"] += 1
            continue
        if re.search(r"[а-яё][А-ЯЁ]", ru):
            stats["склейка в переводе"] += 1
            continue

        # «bio - он», «all - все»: служебный перевод у содержательного слова.
        if (
            theme != PREPOSITIONS
            and head not in SR_FUNC
            and len(head) >= 4
            and norm_ru(ru) in RU_FUNC
        ):
            stats["служебный перевод у слова"] += 1
            continue

        e.head, e.ru, e.theme = head, ru, theme
        out.append(e)
        stats["оставлено"] += 1
    return out, stats


def drop_phrase_stubs(entries: list[Entry]) -> tuple[list[Entry], Counter]:
    """Убирает «beli - чеснок», если есть «beli luk - чеснок»."""
    stats: Counter = Counter()
    multi = [e for e in entries if " " in e.head]
    multi_tokens = [(e, set(ru_words(e.ru))) for e in multi]
    out: list[Entry] = []
    for e in entries:
        if " " in e.head:
            out.append(e)
            continue
        tokens = set(ru_words(e.ru))
        stub = False
        for m, mt in multi_tokens:
            if not m.head.startswith(e.head + " "):
                continue
            if tokens & mt:
                stub = True
                break
        if stub:
            stats["обрывок словосочетания"] += 1
        else:
            out.append(e)
    return out, stats


def reassign_theme(e: Entry) -> Entry:
    """Приводит тему в соответствие с частью речи (только явные случаи)."""
    if e.theme in (PHRASES, PREPOSITIONS):
        return e
    pos = ru_pos(e.ru)
    words = ru_words(e.ru)

    if e.theme == VERBS and pos != "verb":
        if pos == "adj":
            e.theme = ADJECTIVES
        elif len(words) == 1 and norm_ru(e.ru).endswith(("о", "е")):
            e.theme = ADVERBS
        else:
            e.theme = OTHER
    elif e.theme == ADJECTIVES and pos != "adj":
        if pos == "verb":
            e.theme = VERBS
        elif len(words) == 1 and norm_ru(e.ru).endswith(("о", "е")):
            e.theme = ADVERBS
        else:
            e.theme = OTHER
    elif e.theme == ADVERBS:
        if pos == "adj":
            e.theme = ADJECTIVES
        elif pos == "verb":
            e.theme = VERBS
        elif pos == "noun" and not (len(words) == 1 and norm_ru(e.ru).endswith(("о", "е"))):
            e.theme = OTHER
    elif e.theme == OTHER:
        if pos == "adj":
            e.theme = ADJECTIVES
        elif pos == "verb" and e.head.split()[0].endswith(("ti", "ći")):
            e.theme = VERBS
        elif pos == "func":
            e.theme = "🔗 Служебные слова"
    return e


class DSU:
    def __init__(self, n: int):
        self.p = list(range(n))

    def find(self, x: int) -> int:
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a: int, b: int) -> None:
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.p[rb] = ra


def merge_forms(entries: list[Entry], sr_freq: dict[str, int], stats: Counter) -> list[Entry]:
    buckets: dict[tuple[str, str], list[int]] = defaultdict(list)
    keys: list[set[str]] = []
    classes: list[str] = []
    for i, e in enumerate(entries):
        cls = word_class(e.head, e.ru)
        classes.append(cls)
        st = stems(e.head)
        keys.append(st)
        for s in st:
            buckets[(cls, s)].append(i)

    dsu = DSU(len(entries))
    for (cls, _stem), ids in buckets.items():
        if len(ids) > 40:
            continue
        for a in range(len(ids)):
            for b in range(a + 1, len(ids)):
                i, j = ids[a], ids[b]
                if classes[i] != classes[j]:
                    continue
                if not ru_similar(entries[i].ru, entries[j].ru):
                    continue
                if keys[i] & keys[j]:
                    dsu.union(i, j)



    groups: dict[int, list[int]] = defaultdict(list)
    for i in range(len(entries)):
        groups[dsu.find(i)].append(i)

    merged: list[Entry] = []
    for ids in groups.values():
        if len(ids) == 1:
            merged.append(entries[ids[0]])
            continue
        ids.sort(key=lambda i: (len(entries[i].head), sr_freq.get(entries[i].head, 10**9), entries[i].head))
        base = entries[ids[0]]
        forms: list[str] = []
        for i in ids:
            h = entries[i].head
            if h not in forms:
                forms.append(h)
        base.forms = forms[:5]
        # перевод — самый частотный по русскому списку (передаётся снаружи)
        base.ru = min(
            (entries[i].ru for i in ids),
            key=lambda r: (len(ru_words(r)), len(r)),
        )
        stats["склеено форм"] += len(ids) - 1
        merged.append(base)
    return merged


def dedupe(entries: list[Entry], sr_freq: dict[str, int], ru_freq: dict[str, int], stats: Counter) -> list[Entry]:
    def key(e: Entry) -> tuple:
        base = e.head.split(" / ")[0]
        cyr = to_cyr(base)
        words = ru_words(e.ru)
        nr = norm_ru(e.ru)
        cognate = 1 if (len(cyr) >= 3 and (nr.startswith(cyr[:3]) or (len(cyr) >= 4 and cyr[:4] in nr))) else 0
        ru_rank = sum(ru_freq.get(w, 10**6) for w in words)
        sr_rank = min((sr_freq.get(f, 10**6) for f in e.forms), default=10**6)
        return (cognate, int(len(words) == 1), -ru_rank, -sr_rank)

    best: dict[str, Entry] = {}
    for e in entries:
        old = best.get(e.head)
        if old is None or key(e) > key(old):
            if old is not None:
                stats["дубль заголовка"] += 1
            best[e.head] = e
        else:
            stats["дубль заголовка"] += 1
    return list(best.values())


def adj_stems_from(entries: list[Entry]) -> set[str]:
    out: set[str] = set()
    for e in entries:
        if " " in e.head:
            continue
        if ru_pos(e.ru) == "adj":
            out |= stems(e.head)
    return out


def pos_ok(e: Entry, adj_stems: set[str]) -> bool:
    """Согласованность части речи заголовка и перевода."""
    if e.theme in (PHRASES, PREPOSITIONS):
        return True
    if " " in e.head:
        return True
    forms = e.head.split(" / ")
    pos = ru_pos(e.ru)
    head_verb = any(f.endswith(("ti", "ći")) for f in forms)
    head_adj = any(stems(f) & adj_stems for f in forms)
    if pos == "func":
        return forms[0] in SR_FUNC or len(forms[0]) < 4
    if pos == "verb":
        return head_verb
    if pos == "adj":
        return head_adj
    if pos == "noun":
        return not head_adj
    return True


def entry_score(e: Entry, freq_ranks: dict[str, int] | None) -> float:
    sr_rank = 10**9
    if freq_ranks is not None:
        for form in e.forms:
            sr_rank = min(sr_rank, freq_ranks.get(form, 10**9))
    sr_rank = min(sr_rank, 100000)
    words = ru_words(e.ru)
    score = THEME_WEIGHT[e.theme] * 2.0
    score -= math.log10(sr_rank + 10)
    if words:
        score += 0.9 if len(words) == 1 else 0.2
    if e.example:
        score += 0.25
    if len(e.forms) > 1:
        score += 0.2
    if len(e.ru) <= 2:
        score -= 1.5
    return score


def select_core(
    entries: list[Entry], sr_freq: dict[str, int], ru_freq: dict[str, int]
) -> tuple[list[Entry], list[Entry]]:
    by_theme: dict[str, list[Entry]] = defaultdict(list)
    for e in entries:
        by_theme[e.theme].append(e)

    adj_stems = adj_stems_from(entries)
    ru_prefix: dict[str, int] = {}
    for w, rank in ru_freq.items():
        if len(w) >= 4:
            p = w[:4]
            if p not in ru_prefix or rank < ru_prefix[p]:
                ru_prefix[p] = rank

    def ru_ok_word(w: str, max_rank: int) -> bool:
        if w in ru_freq:
            return ru_freq[w] <= max_rank
        # словоформа редкого слова: принимаем, если в частотном списке
        # есть однокоренное слово с тем же началом
        return len(w) >= 4 and ru_prefix.get(w[:4], 10**9) <= max_rank

    usable: dict[str, list[Entry]] = {}
    for theme in THEMES:
        items = []
        ru_max = 50000 if theme == PHRASES else CORE_RU_MAX
        for e in by_theme[theme]:
            if not pos_ok(e, adj_stems):
                continue
            if len(e.head.split()) > 3 and theme != PHRASES:
                continue
            if len(ru_words(e.ru)) > 3 and theme != PHRASES:
                continue
            if theme in (PHRASES, PREPOSITIONS):
                sr_ok = True
            else:
                sr_ok = any(
                    f in sr_freq and sr_freq[f] <= CORE_SR_MAX for f in e.forms
                )
            ru_ok = all(ru_ok_word(w, ru_max) for w in ru_words(e.ru))
            if sr_ok and ru_ok:
                items.append(e)
        items.sort(key=lambda e: entry_score(e, sr_freq), reverse=True)
        usable[theme] = items

    counts = {t: len(usable[t]) for t in THEMES}
    floors = {
        t: min(counts[t], CORE_FLOOR.get(t, MIN_PER_THEME)) for t in THEMES
    }

    def quotas(k: float) -> dict[str, int]:
        out = {}
        for t in THEMES:
            c = counts[t]
            out[t] = min(c, max(8, round(math.sqrt(c) * k))) if c else 0
            if t in CORE_CAP:
                out[t] = min(out[t], CORE_CAP[t])
            out[t] = max(out[t], floors[t])
        return out

    lo, hi = 0.1, 100.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if sum(quotas(mid).values()) > CORE_TARGET:
            hi = mid
        else:
            lo = mid
    q = quotas(lo)

    # Если перебрали — срезаем у самых больших квот, не трогая полы.
    order = sorted(THEMES, key=lambda t: (t != OTHER, -q[t]))
    i = 0
    while sum(q.values()) > CORE_TARGET and i < 20000:
        t = order[i % len(order)]
        if q[t] > floors[t]:
            q[t] -= 1
        i += 1

    # Добираем остаток.
    while sum(q.values()) < CORE_TARGET:
        candidates = [
            t
            for t in THEMES
            if q[t] < counts[t] and q[t] < CORE_CAP.get(t, counts[t])
        ]
        if not candidates:
            break
        candidates.sort(key=lambda t: (q[t] / max(counts[t], 1), -counts[t]))
        for t in candidates:
            if sum(q.values()) >= CORE_TARGET:
                break
            q[t] += 1

    core: list[Entry] = []
    extra: list[Entry] = []
    for t in THEMES:
        core_items = usable[t][: q[t]]
        core_ids = {id(e) for e in core_items}
        core.extend(core_items)
        extra.extend(e for e in by_theme[t] if id(e) not in core_ids)
    return core, extra


def write_file(path: Path, entries: list[Entry]) -> None:
    by_theme: dict[str, list[Entry]] = defaultdict(list)
    for e in entries:
        by_theme[e.theme].append(e)
    lines: list[str] = []
    for theme in THEMES:
        items = by_theme.get(theme, [])
        if not items:
            continue
        items = sorted(items, key=lambda e: e.shown_head.lower())
        lines.append(f"# Тема: {theme}")
        for e in items:
            line = f"{e.shown_head} - {e.ru}"
            if e.example:
                line += f" | {e.example}"
            lines.append(line)
        lines.append("")
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> int:
    sr_freq = fetch_freq("sr", "sr_50k.txt")
    ru_freq = fetch_freq("ru", "ru_50k.txt")

    raw_entries, parse_stats = parse_raw()
    cleaned, clean_stats = clean_entries(raw_entries, ru_freq)
    cleaned, stub_stats = drop_phrase_stubs(cleaned)
    cleaned = [reassign_theme(e) for e in cleaned]
    merged = merge_forms(cleaned, sr_freq, clean_stats)
    merged = dedupe(merged, sr_freq, ru_freq, clean_stats)
    core, extra = select_core(merged, sr_freq, ru_freq)

    write_file(CORE_OUT, core)
    write_file(EXTRA_OUT, extra)

    print("=== ПАРСИНГ ===")
    for k, v in parse_stats.most_common():
        print(f"  {k}: {v}")
    print(f"  прочитано пар: {len(raw_entries)}")
    print("\n=== ЧИСТКА ===")
    for k, v in (clean_stats + stub_stats).most_common():
        print(f"  {k}: {v}")
    print(f"  осталось после чистки: {len(cleaned)}")
    print(f"  после склейки форм и дублей: {len(merged)}")
    print(f"\nядро: {len(core)} пар -> {CORE_OUT.name}")
    print(f"остаток: {len(extra)} пар -> {EXTRA_OUT.name}")

    print("\n=== ЯДРО ПО ТЕМАМ ===")
    c = Counter(e.theme for e in core)
    x = Counter(e.theme for e in extra)
    for t in THEMES:
        print(f"  {c[t]:4} + {x[t]:5}  {t}")

    print("\n=== ПРИМЕРЫ ЯДРА ===")
    by_theme: dict[str, list[Entry]] = defaultdict(list)
    for e in core:
        by_theme[e.theme].append(e)
    for t in THEMES:
        sample = sorted(by_theme[t], key=lambda e: e.shown_head.lower())[:8]
        if sample:
            print(f"  {t}: " + "; ".join(f"{e.shown_head} — {e.ru}" for e in sample))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
