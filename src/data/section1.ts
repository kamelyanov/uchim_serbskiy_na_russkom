import type { Theme } from '../types';

// Section 1 — CEFR Intro. Serbian-from-Russian unit 1.

export const section1Units: Theme[] = [
  {
    id: 's1u1',
    titleRu: 'Основные фразы',
    titleSr: 'Osnovne fraze',
    icon: 'MessageCircle',
    color: '',
    colorDeep: '',
    tips: [
      {
        heading: 'Приветствия и вежливость',
        paragraphs: [
          '«Ćao» — неформальное (привет/пока), «zdravo» — нейтральное, «dobar dan» — формальное.',
          '«Molim» — и «пожалуйста», и «прошу» (когда что-то подаёте).',
        ],
        examples: [
          { sr: 'dobro jutro', ru: 'доброе утро' },
          { sr: 'dobro veče', ru: 'добрый вечер' },
          { sr: 'doviđenja', ru: 'до свидания' },
          { sr: 'molim', ru: 'пожалуйста' },
        ],
      },
      {
        heading: 'Страны и города',
        paragraphs: [
          '«Odakle si?» — «Откуда ты?» (неформ.), «Odakle ste?» — «Откуда вы?» (вежливо). «Ja sam iz...» — «Я из...».',
          'После «iz» страна или город стоит в родительном падеже: iz Rusije, iz Moskve.',
        ],
        examples: [
          { sr: 'Ja sam iz Rusije.', ru: 'Я из России.' },
          { sr: 'Odakle si?', ru: 'Откуда ты?' },
          { sr: 'Ja sam iz Moskve.', ru: 'Я из Москвы.' },
        ],
      },
      {
        heading: 'Имя и знакомство',
        paragraphs: [
          '«Ja sam...» — «Я...» (имя). «Kako se zoveš?» — «Как тебя зовут?» (неформ.), «Kako se zovete?» — вежливо.',
          '«Drago mi je» — «Приятно познакомиться». «Ovo je...» — «Это...».',
        ],
        examples: [
          { sr: 'Ja se zovem Ana.', ru: 'Меня зовут Анна.' },
          { sr: 'Drago mi je.', ru: 'Приятно познакомиться.' },
          { sr: 'Ovo je Marko.', ru: 'Это Марко.' },
        ],
      },
      {
        heading: 'Члены семьи',
        paragraphs: [
          '«majka/mama» — мать/мама, «otac/tata» — отец/папа, «brat» — брат, «sestra» — сестра.',
          '«Imam...» — «У меня есть...», «Nemam...» — «У меня нет...».',
        ],
        examples: [
          { sr: 'Imam brata.', ru: 'У меня есть брат.' },
          { sr: 'Nemam brata.', ru: 'У меня нет брата.' },
          { sr: 'Ovo je moja mama.', ru: 'Это моя мама.' },
        ],
      },
      {
        heading: 'Где что находится',
        paragraphs: [
          '«Gde je...?» — «Где...?». «Ovde» — здесь, «tamo» — там.',
          '«u» — в (внутри): u gradu, u kući. «na» — на: na ulici, na trgu.',
        ],
        examples: [
          { sr: 'Gde je prodavnica?', ru: 'Где магазин?' },
          { sr: 'Kuća je ovde.', ru: 'Дом здесь.' },
          { sr: 'Prodavnica je na ulici.', ru: 'Магазин на улице.' },
        ],
      },
      {
        heading: 'Представьте друзей',
        paragraphs: [
          '«prijatelj» — друг, «prijateljica» — подруга. «Moj» — мой, «moja» — моя.',
          '«On je...» — «Он...», «Ona je...» — «Она...». «Dobar drug» — хороший товарищ.',
        ],
        examples: [
          { sr: 'Ovo je moj prijatelj.', ru: 'Это мой друг.' },
          { sr: 'Ona je moja prijateljica.', ru: 'Она моя подруга.' },
          { sr: 'On je dobar drug.', ru: 'Он хороший товарищ.' },
        ],
      },
      {
        heading: 'Что любишь делать',
        paragraphs: [
          '«Volim...» — «Я люблю...». После «volim» глагол стоит в инфинитиве или с «da»: volim čitati / volim da čitam.',
          '«knjiga» — книга, «muzika» — музыка, «sport» — спорт, «film» — фильм.',
        ],
        examples: [
          { sr: 'Volim sport.', ru: 'Я люблю спорт.' },
          { sr: 'Volim da čitam.', ru: 'Я люблю читать.' },
          { sr: 'Volim filmove.', ru: 'Я люблю фильмы.' },
        ],
      },
      {
        heading: 'Заказ еды',
        paragraphs: [
          '«Molim...» — «Пожалуйста, ...» (при заказе). «Hoću...» — «Я хочу...». «Račun, molim» — «Счёт, пожалуйста».',
          '«voda» — вода, «kafa» — кофе, «hleb» — хлеб, «sok» — сок.',
        ],
        examples: [
          { sr: 'Račun, molim.', ru: 'Счёт, пожалуйста.' },
          { sr: 'Hoću kafu.', ru: 'Я хочу кофе.' },
          { sr: 'Hleb, molim.', ru: 'Хлеб, пожалуйста.' },
        ],
      },
      {
        heading: 'Домашние животные',
        paragraphs: [
          '«pas» — собака, «mačka» — кошка, «ptica» — птица, «riba» — рыба.',
          '«Imam psa» — «У меня есть собака». «Volim mačke» — «Я люблю кошек».',
        ],
        examples: [
          { sr: 'Imam psa.', ru: 'У меня есть собака.' },
          { sr: 'Imam mačku.', ru: 'У меня есть кошка.' },
          { sr: 'Volim ptice.', ru: 'Я люблю птиц.' },
        ],
      },
    ],
    lessons: [
      {
        id: 's1u1l1',
        titleRu: 'Приветствия',
        titleSr: 'Pozdravi',
        exercises: [
          { type: 'choice', prompt: 'Здравствуйте', promptLang: 'ru', options: ['zdravo', 'hvala', 'da', 'doviđenja'], answer: 0 },
          { type: 'choice', prompt: 'Doviđenja', promptLang: 'sr', options: ['Спасибо', 'До свидания', 'Да', 'Пожалуйста'], answer: 1 },
          { type: 'build', ru: 'Доброе утро!', sr: 'Dobro jutro!', extra: ['veče!', 'hvala'] },
          { type: 'match', pairs: [
            { sr: 'zdravo', ru: 'здравствуйте' },
            { sr: 'hvala', ru: 'спасибо' },
            { sr: 'da', ru: 'да' },
            { sr: 'ne', ru: 'нет' },
            { sr: 'molim', ru: 'пожалуйста' },
          ] },
          { type: 'blank', ru: 'Добрый вечер!', before: 'Dobro ', after: '!', answer: 'veče', options: ['jutro', 'veče', 'noć'] },
          { type: 'choice', prompt: 'Hvala', promptLang: 'sr', options: ['Пожалуйста', 'Спасибо', 'Привет', 'Пока'], answer: 1 },
          { type: 'build', ru: 'Добрый вечер!', sr: 'Dobro veče!', extra: ['jutro!', 'hvala'] },
          { type: 'choice', prompt: 'Пока (неформ.)', promptLang: 'ru', options: ['ćao', 'dobar dan', 'izvolite', 'molim'], answer: 0 },
        ],
      },
      {
        id: 's1u1l2',
        titleRu: 'Откуда вы',
        titleSr: 'Odakle ste',
        exercises: [
          { type: 'choice', prompt: 'Откуда ты?', promptLang: 'ru', options: ['Odakle si?', 'Kako si?', 'Ko si?', 'Gde si?'], answer: 0 },
          { type: 'choice', prompt: 'Ja sam iz Rusije', promptLang: 'sr', options: ['Я из Сербии', 'Я из России', 'Я в России', 'Я русский'], answer: 1 },
          { type: 'match', pairs: [
            { sr: 'Rusija', ru: 'Россия' },
            { sr: 'Srbija', ru: 'Сербия' },
            { sr: 'Moskva', ru: 'Москва' },
            { sr: 'Beograd', ru: 'Белград' },
            { sr: 'grad', ru: 'город' },
          ] },
          { type: 'build', ru: 'Я из Москвы.', sr: 'Ja sam iz Moskve.', extra: ['Beograda', 'si'] },
          { type: 'blank', ru: 'Откуда вы?', before: 'Odakle ', after: '?', answer: 'ste', options: ['si', 'ste', 'sam'] },
          { type: 'choice', prompt: 'Srbija', promptLang: 'sr', options: ['Сербия', 'Россия', 'Город', 'Москва'], answer: 0 },
          { type: 'build', ru: 'Откуда ты?', sr: 'Odakle si?', extra: ['ste', 'iz'] },
          { type: 'choice', prompt: 'Я из Белграда', promptLang: 'ru', options: ['Ja sam iz Beograda', 'Ja sam iz Moskve', 'Ja sam u Beogradu', 'Odakle si?'], answer: 0 },
        ],
      },
      {
        id: 's1u1l3',
        titleRu: 'Представьтесь',
        titleSr: 'Predstavite se',
        exercises: [
          { type: 'choice', prompt: 'Как тебя зовут?', promptLang: 'ru', options: ['Kako se zoveš?', 'Kako si?', 'Ko je to?', 'Odakle si?'], answer: 0 },
          { type: 'choice', prompt: 'Drago mi je', promptLang: 'sr', options: ['Очень жаль', 'Приятно познакомиться', 'Как дела', 'До свидания'], answer: 1 },
          { type: 'build', ru: 'Меня зовут Анна.', sr: 'Ja se zovem Ana.', extra: ['si', 'je'] },
          { type: 'match', pairs: [
            { sr: 'ime', ru: 'имя' },
            { sr: 'drago mi je', ru: 'приятно познакомиться' },
            { sr: 'ovo je', ru: 'это' },
            { sr: 'kako se zoveš', ru: 'как тебя зовут' },
            { sr: 'ja sam', ru: 'я' },
          ] },
          { type: 'blank', ru: 'Как вас зовут?', before: 'Kako se ', after: '?', answer: 'zovete', options: ['zoveš', 'zovete', 'zovem'] },
          { type: 'choice', prompt: 'Ovo je Marko', promptLang: 'sr', options: ['Это Марко', 'Я Марко', 'Как Марко', 'Откуда Марко'], answer: 0 },
          { type: 'build', ru: 'Приятно познакомиться!', sr: 'Drago mi je!', extra: ['hvala', 'zdravo'] },
          { type: 'choice', prompt: 'Я Анна', promptLang: 'ru', options: ['Ja sam Ana', 'Ovo je Ana', 'Kako si Ana', 'Ana je'], answer: 0 },
        ],
      },
      {
        id: 's1u1l4',
        titleRu: 'Семья',
        titleSr: 'Porodica',
        exercises: [
          { type: 'choice', prompt: 'сестра', promptLang: 'ru', options: ['brat', 'sestra', 'majka', 'otac'], answer: 1 },
          { type: 'choice', prompt: 'Majka', promptLang: 'sr', options: ['Отец', 'Мать', 'Брат', 'Сестра'], answer: 1 },
          { type: 'match', pairs: [
            { sr: 'otac', ru: 'отец' },
            { sr: 'majka', ru: 'мать' },
            { sr: 'brat', ru: 'брат' },
            { sr: 'sestra', ru: 'сестра' },
            { sr: 'porodica', ru: 'семья' },
          ] },
          { type: 'build', ru: 'У меня есть брат.', sr: 'Imam brata.', extra: ['sestru', 'nemam'] },
          { type: 'blank', ru: 'У меня есть сестра.', before: '', after: ' imam sestru.', answer: 'Imam', options: ['Imam', 'Nemam', 'Je'] },
          { type: 'choice', prompt: 'Nemam brata', promptLang: 'sr', options: ['У меня есть брат', 'У меня нет брата', 'Мой брат', 'Это брат'], answer: 1 },
          { type: 'build', ru: 'Это моя мама.', sr: 'Ovo je moja mama.', extra: ['tata', 'brat'] },
          { type: 'choice', prompt: 'У меня есть сестра', promptLang: 'ru', options: ['Imam sestru', 'Nemam sestru', 'Imam brata', 'Moja sestra'], answer: 0 },
        ],
      },
      {
        id: 's1u1l5',
        titleRu: 'Места',
        titleSr: 'Mesta',
        exercises: [
          { type: 'choice', prompt: 'Где магазин?', promptLang: 'ru', options: ['Gde je prodavnica?', 'Šta je prodavnica?', 'Ko je prodavnica?', 'Kako je prodavnica?'], answer: 0 },
          { type: 'choice', prompt: 'Ovde', promptLang: 'sr', options: ['Там', 'Здесь', 'Где', 'Дом'], answer: 1 },
          { type: 'match', pairs: [
            { sr: 'grad', ru: 'город' },
            { sr: 'ulica', ru: 'улица' },
            { sr: 'kuća', ru: 'дом' },
            { sr: 'prodavnica', ru: 'магазин' },
            { sr: 'trg', ru: 'площадь' },
          ] },
          { type: 'build', ru: 'Дом здесь.', sr: 'Kuća je ovde.', extra: ['tamo', 'gde'] },
          { type: 'blank', ru: 'Магазин на улице.', before: 'Prodavnica je ', after: ' ulici.', answer: 'na', options: ['u', 'na', 'iz'] },
          { type: 'choice', prompt: 'Grad', promptLang: 'sr', options: ['Дом', 'Город', 'Улица', 'Площадь'], answer: 1 },
          { type: 'build', ru: 'Где дом?', sr: 'Gde je kuća?', extra: ['prodavnica', 'tamo'] },
          { type: 'choice', prompt: 'Магазин там', promptLang: 'ru', options: ['Prodavnica je tamo', 'Prodavnica je ovde', 'Gde je prodavnica', 'Kuća je tamo'], answer: 0 },
        ],
      },
      {
        id: 's1u1l6',
        titleRu: 'Друзья',
        titleSr: 'Prijatelji',
        exercises: [
          { type: 'choice', prompt: 'подруга', promptLang: 'ru', options: ['prijatelj', 'prijateljica', 'drug', 'sestra'], answer: 1 },
          { type: 'choice', prompt: 'Moj prijatelj', promptLang: 'sr', options: ['Моя подруга', 'Мой друг', 'Мой брат', 'Это друг'], answer: 1 },
          { type: 'match', pairs: [
            { sr: 'prijatelj', ru: 'друг' },
            { sr: 'prijateljica', ru: 'подруга' },
            { sr: 'moj', ru: 'мой' },
            { sr: 'moja', ru: 'моя' },
            { sr: 'on', ru: 'он' },
          ] },
          { type: 'build', ru: 'Это мой друг.', sr: 'Ovo je moj prijatelj.', extra: ['moja', 'prijateljica'] },
          { type: 'blank', ru: 'Она моя подруга.', before: 'Ona je moja ', after: '.', answer: 'prijateljica', options: ['prijatelj', 'prijateljica', 'drug'] },
          { type: 'choice', prompt: 'On je dobar drug', promptLang: 'sr', options: ['Он хороший товарищ', 'Она хорошая подруга', 'Мой друг', 'Это друг'], answer: 0 },
          { type: 'build', ru: 'Она моя подруга.', sr: 'Ona je moja prijateljica.', extra: ['prijatelj', 'moj'] },
          { type: 'choice', prompt: 'Это мой друг', promptLang: 'ru', options: ['Ovo je moj prijatelj', 'Ovo je moja prijateljica', 'On je prijatelj', 'Moj drug je'], answer: 0 },
        ],
      },
      {
        id: 's1u1l7',
        titleRu: 'Увлечения',
        titleSr: 'Hobiji',
        exercises: [
          { type: 'choice', prompt: 'Я люблю музыку', promptLang: 'ru', options: ['Volim muziku', 'Volim sport', 'Volim knjigu', 'Volim film'], answer: 0 },
          { type: 'choice', prompt: 'Volim da čitam', promptLang: 'sr', options: ['Я люблю читать', 'Я люблю спорт', 'Я читаю книгу', 'Я люблю музыку'], answer: 0 },
          { type: 'match', pairs: [
            { sr: 'knjiga', ru: 'книга' },
            { sr: 'muzika', ru: 'музыка' },
            { sr: 'sport', ru: 'спорт' },
            { sr: 'film', ru: 'фильм' },
            { sr: 'volim', ru: 'я люблю' },
          ] },
          { type: 'build', ru: 'Я люблю спорт.', sr: 'Volim sport.', extra: ['muziku', 'čitam'] },
          { type: 'blank', ru: 'Я люблю книги.', before: 'Volim ', after: '.', answer: 'knjigu', options: ['knjiga', 'knjigu', 'knjige'] },
          { type: 'choice', prompt: 'Film', promptLang: 'sr', options: ['Книга', 'Фильм', 'Спорт', 'Музыка'], answer: 1 },
          { type: 'build', ru: 'Я люблю читать.', sr: 'Volim da čitam.', extra: ['sport', 'muziku'] },
          { type: 'choice', prompt: 'Я люблю фильмы', promptLang: 'ru', options: ['Volim filmove', 'Volim knjige', 'Volim muziku', 'Volim sport'], answer: 0 },
        ],
      },
      {
        id: 's1u1l8',
        titleRu: 'Еда и напитки',
        titleSr: 'Hrana i piće',
        exercises: [
          { type: 'choice', prompt: 'кофе', promptLang: 'ru', options: ['voda', 'kafa', 'sok', 'hleb'], answer: 1 },
          { type: 'choice', prompt: 'Voda', promptLang: 'sr', options: ['Вода', 'Кофе', 'Сок', 'Хлеб'], answer: 0 },
          { type: 'match', pairs: [
            { sr: 'voda', ru: 'вода' },
            { sr: 'kafa', ru: 'кофе' },
            { sr: 'sok', ru: 'сок' },
            { sr: 'hleb', ru: 'хлеб' },
            { sr: 'račun', ru: 'счёт' },
          ] },
          { type: 'build', ru: 'Счёт, пожалуйста.', sr: 'Račun, molim.', extra: ['voda', 'hvala'] },
          { type: 'blank', ru: 'Я хочу воду.', before: 'Hoću ', after: '.', answer: 'vodu', options: ['voda', 'vodu', 'vode'] },
          { type: 'choice', prompt: 'Hoću kafu', promptLang: 'sr', options: ['Я хочу воду', 'Я хочу кофе', 'Я хочу сок', 'Счёт, пожалуйста'], answer: 1 },
          { type: 'build', ru: 'Я хочу сок.', sr: 'Hoću sok.', extra: ['kafu', 'vodu'] },
          { type: 'choice', prompt: 'Хлеб, пожалуйста', promptLang: 'ru', options: ['Hleb, molim', 'Voda, molim', 'Kafa, molim', 'Račun, molim'], answer: 0 },
        ],
      },
      {
        id: 's1u1l9',
        titleRu: 'Питомцы',
        titleSr: 'Kućni ljubimci',
        exercises: [
          { type: 'choice', prompt: 'кошка', promptLang: 'ru', options: ['pas', 'mačka', 'ptica', 'riba'], answer: 1 },
          { type: 'choice', prompt: 'Pas', promptLang: 'sr', options: ['Кошка', 'Собака', 'Птица', 'Рыба'], answer: 1 },
          { type: 'match', pairs: [
            { sr: 'pas', ru: 'собака' },
            { sr: 'mačka', ru: 'кошка' },
            { sr: 'ptica', ru: 'птица' },
            { sr: 'riba', ru: 'рыба' },
            { sr: 'ljubimac', ru: 'питомец' },
          ] },
          { type: 'build', ru: 'У меня есть собака.', sr: 'Imam psa.', extra: ['mačku', 'nemam'] },
          { type: 'blank', ru: 'Я люблю кошек.', before: 'Volim ', after: '.', answer: 'mačke', options: ['mačka', 'mačke', 'mačku'] },
          { type: 'choice', prompt: 'Imam mačku', promptLang: 'sr', options: ['У меня есть собака', 'У меня есть кошка', 'Я люблю кошек', 'У меня нет кошки'], answer: 1 },
          { type: 'build', ru: 'Я люблю птиц.', sr: 'Volim ptice.', extra: ['ribu', 'psa'] },
          { type: 'choice', prompt: 'У меня есть рыба', promptLang: 'ru', options: ['Imam ribu', 'Imam psa', 'Imam mačku', 'Volim ribu'], answer: 0 },
        ],
      },
    ],
  },
];
