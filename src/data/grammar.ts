// Грамматика сербского языка. Контент переработан из текстовых файлов
// src/data/grammar/*.txt в структурированные данные для вкладки «Грамматика».

export type GrammarBlock =
  | { type: 'p'; text: string }
  | { type: 'note'; text: string }
  | { type: 'table'; header: string[]; rows: string[][] }
  | { type: 'examples'; items: { sr: string; ru?: string }[] };

export interface GrammarTopic {
  id: string;
  titleRu: string;
  blocks: GrammarBlock[];
}

export interface GrammarSection {
  id: string;
  titleRu: string;
  topics: GrammarTopic[];
}

export const grammarSections: GrammarSection[] = [
  {
    id: 'zvuki',
    titleRu: 'Звуки и письмо',
    topics: [
      {
        id: 'grafika-fonetika',
        titleRu: 'Графика и фонетика',
        blocks: [
          { type: 'p', text: 'Сербский язык пишется двумя азбуками — кириллицей и латиницей. Каждой букве соответствует один звук.' },
          {
            type: 'table',
            header: ['Кириллица', 'Латиница', 'Пример'],
            rows: [
              ['А а', 'A a', 'auto'],
              ['Б б', 'B b', 'borba'],
              ['В в', 'V v', 'voda'],
              ['Г г', 'G g', 'grad'],
              ['Д д', 'D d', 'danas'],
              ['Ђ ђ', 'Đ đ', 'đak'],
              ['Е е', 'E e', 'estetika'],
              ['Ж ж', 'Ž ž', 'žut'],
              ['З з', 'Z z', 'zvono'],
              ['И и', 'I i', 'isti'],
              ['Ј ј', 'J j', 'ja, jug'],
              ['К к', 'K k', 'kada'],
              ['Л л', 'L l', 'luka'],
              ['Љ љ', 'Lj lj', 'ljubav'],
              ['М м', 'M m', 'mleko'],
              ['Н н', 'N n', 'nada'],
              ['Њ њ', 'Nj nj', 'njuška'],
              ['О о', 'O o', 'okolo'],
              ['П п', 'P p', 'pas'],
              ['Р р', 'R r', 'ruka'],
              ['С с', 'S s', 'srce'],
              ['Т т', 'T t', 'tanak'],
              ['Ћ ћ', 'Ć ć', 'ćerka'],
              ['У у', 'U u', 'usta'],
              ['Ф ф', 'F f', 'flaša'],
              ['Х х', 'H h', 'hladan'],
              ['Ц ц', 'C c', 'cifra'],
              ['Ч ч', 'Č č', 'čas'],
              ['Џ џ', 'Dž dž', 'džip'],
              ['Ш ш', 'Š š', 'širok'],
            ],
          },
          { type: 'p', text: 'В сербском 5 гласных: i, e, a, o, u. Произносятся чётко, без редукции. Слогообразующий r: trg, krst, prst, vrt, srce.' },
          { type: 'p', text: 'Парные согласные (глухой — звонкий):' },
          {
            type: 'table',
            header: ['Глухой', 'p', 't', 'k', 's', 'š', 'f', 'c', 'č', 'ć'],
            rows: [['Звонкий', 'b', 'd', 'g', 'z', 'ž', 'v', '—', 'dž', 'đ']],
          },
          { type: 'p', text: 'В конце слова звонкие не оглушаются: zub /zub/, nož /nož/. Перед глухим происходит ассимиляция: poljubac — poljupci, sveska — svezaka, težak — teška, sladak — slatka.' },
          { type: 'note', text: 'Сербские согласные не смягчаются перед i и e (в отличие от русского): novi grad, lepa žena — произносятся твёрдо. Мягкие lj, nj, ć, đ произносятся с кончиком языка у нижних зубов: ljubav, njuška, đak, ćerka.' },
          { type: 'p', text: 'Ударение музыкальное, четырёх типов: долгое нисходящее (gás), долгое восходящее (gásiti), краткое нисходящее (kònj), краткое восходящее (čìtati). Практическое правило: ударение может стоять на любом слоге, кроме последнего. Нет редукции: student, profesor, Beograd — все гласные энергичные.' },
          { type: 'p', text: 'Выделяют два произносительных варианта — экавицу и иекавицу:' },
          {
            type: 'table',
            header: ['Экавица', 'Иекавица'],
            rows: [
              ['mleko', 'mlijeko'],
              ['reka', 'rijeka'],
              ['vreme', 'vrijeme'],
              ['lep', 'lijep'],
              ['deca', 'djeca'],
              ['čovek', 'čovjek'],
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'imenice',
    titleRu: 'Существительное',
    topics: [
      {
        id: 'imenice-rod-broj',
        titleRu: 'Род и число',
        blocks: [
          { type: 'p', text: 'Род существительного определяется по окончанию:' },
          {
            type: 'table',
            header: ['Род', 'Окончание', 'Примеры'],
            rows: [
              ['Мужской', 'согласный', 'grad, student, sto, prozor'],
              ['Мужской', '-a', 'tata, sudija, čika'],
              ['Мужской', '-o', 'posao'],
              ['Мужской', 'заимствования на -o, -e, -i, -u', 'moj auto, taj mali bife, njegov kratki intervju, moskovski žuti taksi'],
              ['Женский', '-a', 'žena, kuća, škola'],
              ['Женский', 'согласный', 'kost, radost, noć'],
              ['Женский', '-o', 'so'],
              ['Женский', '-ao', 'misao'],
              ['Средний', '-o', 'selo, more, dete'],
              ['Средний', '-e', 'polje, more'],
              ['Средний', 'исключение на -a', 'doba'],
            ],
          },
          { type: 'p', text: 'Множественное число мужского рода:' },
          {
            type: 'table',
            header: ['Тип', 'Окончание', 'Примеры'],
            rows: [
              ['Многосложные', '-i', 'student — studenti, autobus — autobusi, orman — ormani'],
              ['Односложные', '-ov-i / -ev-i', 'grad — gradovi, sto — stolovi, muž — muževi, stric — stričevi'],
              ['Основа на j, lj, nj, ć, d, č, dž, š, ž', '-ev-', 'puž — puževi, malj — maljevi'],
              ['Основа на твёрдый', '-ov- (с вариантами)', 'vic — vicevi, nos — nosevi, put — putevi'],
              ['Основа на g, k, h', '-zi, -ci, -si', 'geolog — geolozi, radnik — radnici, uspeh — uspesi'],
            ],
          },
          { type: 'note', text: 'Исключения: dan — dani, sat — sati, pas — psi, konj — konji, mrav — mravi, zub — zubi, prst — prsti; gost — gosti, đak — đaci, Grk — Grci, Rus — Rusi, Čeh — Česi. С беглым a: ručak — ručkovi, posao — poslovi, ugao — uglovi, orao — orlovi, petao — petlovi.' },
          { type: 'p', text: 'Чередования: vrabac — vrapci, svetac — sveci, poljubac — poljupci, obrazac — obrasci, predak — preci. L/O: čitalac — čitaoci, gledalac — gledaoci, talac — taoci; но znalac — znalci, profesionalac — profesionalci, intelektualac — intelektualci, Belac — Belci. На -in укорачиваются: građanin — građani, Srbin — Srbi, Bugarin — Bugari, Jevrejin — Jevreji, Ciganin — Cigani, Beograđanin — Beograđani. Особые: gospodin — gospoda, vlastelin — vlastela, Turčin — Turci.' },
          { type: 'p', text: 'Женский род: мн.ч. на -e (žena — žene, sestra — sestre, kuća — kuće, jabuka — jabuke). Средний род: мн.ч. на -a (selo — sela, more — mora).' },
          { type: 'p', text: 'Особые формы множественного числа:' },
          {
            type: 'examples',
            items: [
              { sr: 'čovek — ljudi (м.р.)' },
              { sr: 'dete — deca', ru: 'ж.р., собирательное: Mala deca se igraju u parku.' },
              { sr: 'brat — braća', ru: 'ж.р., собирательное: Moja braća su bila dobra. Прилагательные — в ед.ч. ж.р., глаголы — во мн.ч.' },
            ],
          },
          { type: 'p', text: 'Собирательные существительные: ж.р. — pilad (pile), telad (tele), jagnjad (jagnje), dugmad (dugme), užad (uže), burad (bure), deca, gospoda, braća; ср.р. — drveće (drvo), cveće (cvet), lišće (list), žbunje (žbun), perje, klasje.' },
          {
            type: 'examples',
            items: [
              { sr: 'Bela jagnjad pasu na livadi.', ru: 'Белые ягнята пасутся на лугу.' },
              { sr: 'Zeleno drveće raste ispred kuće. Cveće je lepo.', ru: 'Зелёные деревья растут перед домом. Цветы красивые.' },
            ],
          },
        ],
      },
      {
        id: 'imenice-prvo-sklonjenje',
        titleRu: 'Первое склонение: мужской род',
        blocks: [
          { type: 'p', text: 'В сербском 7 падежей: N (именатив) — ko? šta?; G (генитив) — koga? čega?; D (датив) — kome? čemu?; A (аккузатив) — koga? šta?; V (вокатив) — обращение; I (инструментал) — s kim? s čim?; L (локатив) — o kome? o čemu?' },
          { type: 'p', text: 'Полная парадигма: student (одушевлённый) / grad (неодушевлённый):' },
          {
            type: 'table',
            header: ['Падеж', 'Ед.ч. (student)', 'Ед.ч. (grad)', 'Мн.ч. (studenti)', 'Мн.ч. (gradovi)'],
            rows: [
              ['N', 'student', 'grad', 'studenti', 'gradovi'],
              ['G', 'studenta', 'grada', 'studenata', 'gradova'],
              ['D', 'studentu', 'gradu', 'studentima', 'gradovima'],
              ['A', 'studenta', 'grad', 'studente', 'gradove'],
              ['V', 'studente!', 'grade!', 'studenti!', 'gradovi!'],
              ['I', 'studentom', 'gradom', 'studentima', 'gradovima'],
              ['L', 'studentu', 'gradu', 'studentima', 'gradovima'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Ovaj novi student je iz malog grada.', ru: 'Этот новый студент из маленького города.' },
              { sr: 'Dajem knjigu mom dobrom prijatelju.', ru: 'Я даю книгу моему хорошему другу.' },
              { sr: 'Vidim novog studenta. Vidim novi grad.', ru: 'Я вижу нового студента. Я вижу новый город.' },
              { sr: 'Idem s dobrim prijateljem u veliki grad.', ru: 'Я иду с хорошим другом в большой город.' },
              { sr: 'Živim u velikom gradu. Razgovaramo o novom filmu.', ru: 'Я живу в большом городе. Мы говорим о новом фильме.' },
              { sr: 'Studente, dođi ovamo! Grade, ti si lep!', ru: 'Студент, иди сюда! Город, ты прекрасен!' },
            ],
          },
          { type: 'p', text: 'Мужской род на -a (tata, sudija, čika):' },
          {
            type: 'table',
            header: ['Падеж', 'Ед.ч. (tata)', 'Мн.ч. (tate)'],
            rows: [
              ['N', 'tata', 'tate'],
              ['G', 'tate', 'tata'],
              ['D', 'tati', 'tatama'],
              ['A', 'tatu', 'tate'],
              ['V', 'tata!', 'tate!'],
              ['I', 'tatom', 'tatama'],
              ['L', 'tati', 'tatama'],
            ],
          },
          { type: 'p', text: 'Заимствования на -o, -e, -i, -u (auto, bife, taksi, intervju):' },
          {
            type: 'table',
            header: ['Падеж', 'Ед.ч. (auto)', 'Мн.ч. (auta)'],
            rows: [
              ['N', 'auto', 'auta'],
              ['G', 'auta', 'auta'],
              ['D', 'autu', 'autima'],
              ['A', 'auto', 'auta'],
              ['V', 'auto!', 'auta!'],
              ['I', 'autom', 'autima'],
              ['L', 'autu', 'autima'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Moj tata je dobar čovek. Vidim mog tatu. Idem s tatom.', ru: 'Мой папа — хороший человек. Я вижу папу. Иду с папой.' },
              { sr: 'U malom bifeu pijem kafu. Razgovaramo o zanimljivom intervjuu.', ru: 'В маленьком буфете я пью кофе. Мы говорим об интересном интервью.' },
              { sr: 'Vozim moskovski žuti taksi.', ru: 'Я вожу московское жёлтое такси.' },
            ],
          },
        ],
      },
      {
        id: 'imenice-srednji-rod',
        titleRu: 'Средний род',
        blocks: [
          { type: 'p', text: 'Полная парадигма: selo (твёрдая основа) / polje (мягкая основа):' },
          {
            type: 'table',
            header: ['Падеж', 'Ед.ч. (selo)', 'Ед.ч. (polje)', 'Мн.ч. (sela)', 'Мн.ч. (polja)'],
            rows: [
              ['N', 'selo', 'polje', 'sela', 'polja'],
              ['G', 'sela', 'polja', 'sela', 'polja'],
              ['D', 'selu', 'polju', 'selima', 'poljima'],
              ['A', 'selo', 'polje', 'sela', 'polja'],
              ['V', 'selo!', 'polje!', 'sela!', 'polja!'],
              ['I', 'selom', 'poljem', 'selima', 'poljima'],
              ['L', 'selu', 'polju', 'selima', 'poljima'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Ovo malo selo je tiho. Živim u malom selu.', ru: 'Эта маленькая деревня тихая. Я живу в маленькой деревне.' },
              { sr: 'Vidim lepo polje. Idem kroz lepo polje. Razgovaramo o lepom polju.', ru: 'Я вижу красивое поле. Иду через красивое поле. Говорим о красивом поле.' },
              { sr: 'Dete se igra u velikom dvorištu. Dajem igračku malom detetu.', ru: 'Ребёнок играет во большом дворе. Я даю игрушку маленькому ребёнку.' },
            ],
          },
          { type: 'note', text: 'Особые случаи: doba (ср.р. на -a) — Ovo je teško doba. Собирательные ср.р. drveće, cveće, lišće склоняются как ед.ч. ср.р.: Zeleno drveće raste ispred kuće. Lišće pada u jesen.' },
        ],
      },
      {
        id: 'imenice-drugo-sklonjenje',
        titleRu: 'Второе склонение: женский род на -a',
        blocks: [
          {
            type: 'table',
            header: ['Падеж', 'Ед.ч. (žena)', 'Ед.ч. (kuća)', 'Мн.ч. (žene)', 'Мн.ч. (kuće)'],
            rows: [
              ['N', 'žena', 'kuća', 'žene', 'kuće'],
              ['G', 'žene', 'kuće', 'žena', 'kuća'],
              ['D', 'ženi', 'kući', 'ženama', 'kućama'],
              ['A', 'ženu', 'kuću', 'žene', 'kuće'],
              ['V', 'ženo!', 'kućo!', 'žene!', 'kuće!'],
              ['I', 'ženom', 'kućom', 'ženama', 'kućama'],
              ['L', 'ženi', 'kući', 'ženama', 'kućama'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Ova lepa žena je moja majka. Vidim lepu ženu. Dajem knjigu lepoj ženi.', ru: 'Эта красивая женщина — моя мама. Вижу красивую женщину. Даю книгу красивой женщине.' },
              { sr: 'Idem s dobrom prijateljicom u veliku kuću. Živim u staroj kući.', ru: 'Иду с хорошей подругой в большой дом. Живу в старом доме.' },
              { sr: 'Ženo, dođi ovamo! Prijateljice, kako ste?', ru: 'Женщина, иди сюда! Подруги, как вы?' },
            ],
          },
          { type: 'p', text: 'Чередования в дативе и локативе ед.ч.:' },
          {
            type: 'table',
            header: ['Исходная форма', 'D / L'],
            rows: [
              ['ruka', 'ruci'],
              ['noga', 'nozi'],
              ['svrha', 'svrsi'],
              ['majka', 'majci'],
              ['knjiga', 'knjizi'],
              ['drugarica', 'drugarici'],
            ],
          },
          { type: 'p', text: 'Множественное число с чередованием: učenica — učenice, drugarica — drugarice, ruka — ruke, noga — noge.' },
        ],
      },
      {
        id: 'imenice-trece-sklonjenje',
        titleRu: 'Третье склонение: женский род на согласный',
        blocks: [
          {
            type: 'table',
            header: ['Падеж', 'Ед.ч. (kost)', 'Ед.ч. (noć)', 'Ед.ч. (radost)', 'Мн.ч. (kosti)'],
            rows: [
              ['N', 'kost', 'noć', 'radost', 'kosti'],
              ['G', 'kosti', 'noći', 'radosti', 'kosti'],
              ['D', 'kosti', 'noći', 'radosti', 'kostima'],
              ['A', 'kost', 'noć', 'radost', 'kosti'],
              ['V', 'kosti!', 'noći!', 'radosti!', 'kosti!'],
              ['I', 'košću / kosti', 'noću / noći', 'radošću / radosti', 'kostima'],
              ['L', 'kosti', 'noći', 'radosti', 'kostima'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Ova stara kost je slomljena. Vidim staru kost.', ru: 'Эта старая кость сломана. Вижу старую кость.' },
              { sr: 'Osećam veliku radost. S velikom radošću idem kući.', ru: 'Чувствую большую радость. С большой радостью иду домой.' },
              { sr: 'Mračna noć je pala. U mračnoj noći ne idem sam.', ru: 'Тёмная ночь наступила. В тёмную ночь не иду один.' },
              { sr: 'Teška misao mi ne da mira. Razgovaramo o teškoj misli.', ru: 'Тяжёлая мысль не даёт мне покоя. Говорим о тяжёлой мысли.' },
            ],
          },
          { type: 'note', text: 'Особенность инструментала ед.ч. — окончания -ju / -i: kost — košću / kosti; noć — noću / noći; radost — radošću / radosti; ljubav — ljubavlju / ljubavi; misao — mišlju / misli.' },
        ],
      },
    ],
  },
  {
    id: 'pridevi',
    titleRu: 'Прилагательное',
    topics: [
      {
        id: 'pridevi-osnovno',
        titleRu: 'Согласование, определённые и неопределённые формы',
        blocks: [
          { type: 'p', text: 'Прилагательное согласуется с существительным в роде и числе:' },
          {
            type: 'table',
            header: ['Род', 'Ед.ч.', 'Пример', 'Мн.ч.', 'Пример'],
            rows: [
              ['Мужской', '-∅ (согласный)', 'dobar grad', '-i', 'dobri gradovi'],
              ['Женский', '-a', 'dobra kafa', '-e', 'dobre kafe'],
              ['Средний', '-o', 'dobro pivo', '-a', 'dobra piva'],
            ],
          },
          { type: 'p', text: 'Неопределённая (краткая) форма: dobar student, lep grad, nov sto. Определённая (длинная): dobri student, lepi grad, novi sto. Неопределённая употребляется при первом упоминании и как сказуемое (Ovo je lep grad); определённая — при известном предмете и с указательными/притяжательными (Taj lepi grad mi se sviđa).' },
          { type: 'p', text: 'Полная парадигма (определённая форма):' },
          {
            type: 'table',
            header: ['Падеж', 'М.р. ед.ч.', 'Ж.р. ед.ч.', 'Ср.р. ед.ч.', 'Мн.ч. (все роды)'],
            rows: [
              ['N', 'novi grad', 'lepa žena', 'malo selo', 'novi gradovi / lepe žene / mala sela'],
              ['G', 'novog grada', 'lepe žene', 'malog sela', 'novih gradova / lepih žena / malih sela'],
              ['D', 'novom gradu', 'lepoj ženi', 'malom selu', 'novim gradovima / lepim ženama / malim selima'],
              ['A', 'novi grad / novog studenta', 'lepu ženu', 'malo selo', 'nove gradove / lepe žene / mala sela'],
              ['V', 'novi grade!', 'lepa ženo!', 'malo selo!', 'novi gradovi! / lepe žene! / mala sela!'],
              ['I', 'novim gradom', 'lepom ženom', 'malim selom', 'novim gradovima / lepim ženama / malim selima'],
              ['L', 'novom gradu', 'lepoj ženi', 'malom selu', 'novim gradovima / lepim ženama / malim selima'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Živim u novom gradu. Idem u novi grad.', ru: 'Живу в новом городе. Иду в новый город.' },
              { sr: 'Dajem knjigu lepoj ženi. Idem s lepom ženom.', ru: 'Даю книгу красивой женщине. Иду с красивой женщиной.' },
              { sr: 'Sreo sam starog prijatelja. Idem kod starog lekara.', ru: 'Встретил старого друга. Иду к старому врачу.' },
              { sr: 'Kupio sam nove knjige. Zadovoljan sam novim knjigama.', ru: 'Купил новые книги. Доволен новыми книгами.' },
            ],
          },
          { type: 'p', text: 'Притяжательные прилагательные на -ov/-ev/-in: očev stan — očevog stana — očevom stanu; majčina kuća — majčine kuće — majčinoj kući; Markov auto — Markovog auta — Markovom autu.' },
        ],
      },
      {
        id: 'pridevi-komparativ',
        titleRu: 'Степени сравнения',
        blocks: [
          { type: 'p', text: 'Сравнительная степень: основа + -ši / -ji / -iji. Превосходная: naj- + сравнительная.' },
          {
            type: 'table',
            header: ['Положительная', 'Сравнительная', 'Превосходная'],
            rows: [
              ['lep', 'lepši', 'najlepši'],
              ['star', 'stariji', 'najstariji'],
              ['mlad', 'mlađi', 'najmlađi'],
              ['jak', 'jači', 'najjači'],
              ['dobar', 'bolji', 'najbolji'],
              ['velik', 'veći', 'najveći'],
              ['mali', 'manji', 'najmanji'],
            ],
          },
          { type: 'p', text: 'Супплетивные формы: dobar — bolji — najbolji; zao — gori — najgori; velik — veći — najveći; mali — manji — najmanji.' },
          {
            type: 'examples',
            items: [
              { sr: 'Beograd je veći od Novog Sada.', ru: 'Белград больше Нови-Сада.' },
              { sr: 'On je najbolji student u našoj grupi.', ru: 'Он лучший студент в нашей группе.' },
              { sr: 'Moja starija sestra je mirnija od mene.', ru: 'Моя старшая сестра спокойнее меня.' },
              { sr: 'Danas je hladnije nego juče.', ru: 'Сегодня холоднее, чем вчера.' },
            ],
          },
          { type: 'p', text: 'Степени сравнения наречий:' },
          {
            type: 'table',
            header: ['Положительная', 'Сравнительная', 'Превосходная'],
            rows: [
              ['brzo', 'brže', 'najbrže'],
              ['lepo', 'lepše', 'najlepše'],
              ['dobro', 'bolje', 'najbolje'],
              ['mnogo', 'više', 'najviše'],
              ['malo', 'manje', 'najmanje'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'On trči brže od mene. Ona peva najlepše.', ru: 'Он бегает быстрее меня. Она поёт лучше всех.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'zamenice',
    titleRu: 'Местоимения',
    topics: [
      {
        id: 'zamenice-lice',
        titleRu: 'Личные местоимения',
        blocks: [
          {
            type: 'table',
            header: ['Падеж', 'ja', 'ti', 'on', 'ona', 'ono', 'mi', 'vi', 'oni/one/ona'],
            rows: [
              ['N', 'ja', 'ti', 'on', 'ona', 'ono', 'mi', 'vi', 'oni/one/ona'],
              ['G', 'mene/me', 'tebe/te', 'njega/ga', 'nje/je', 'njega/ga', 'nas', 'vas', 'njih/ih'],
              ['D', 'meni/mi', 'tebi/ti', 'njemu/mu', 'njoj/joj', 'njemu/mu', 'nama/nam', 'vama/vam', 'njima/im'],
              ['A', 'mene/me', 'tebe/te', 'njega/ga', 'nju/ju/je', 'njega/ga', 'nas', 'vas', 'njih/ih'],
              ['I', 'mnom(e)', 'tobom(e)', 'njim(e)', 'njom(e)', 'njim(e)', 'nama', 'vama', 'njima'],
              ['L', 'meni', 'tebi', 'njemu', 'njoj', 'njemu', 'nama', 'vama', 'njima'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Dajem knjigu tebi. Dajem ti knjigu.', ru: 'Даю книгу тебе (полная и краткая форма).' },
              { sr: 'Vidim ga. Vidim njega.', ru: 'Вижу его. Вижу именно его.' },
              { sr: 'Knjiga je na stolu. Dao sam ti je.', ru: 'Книга на столе. Я тебе её дал.' },
              { sr: 'Bez tebe ne idem. S tobom idem.', ru: 'Без тебя не иду. С тобой иду.' },
            ],
          },
          { type: 'p', text: 'Возвратное местоимение sebe / se:' },
          {
            type: 'table',
            header: ['Падеж', 'Форма'],
            rows: [
              ['G', 'sebe / se'],
              ['D', 'sebi / si'],
              ['A', 'sebe / se'],
              ['I', 'sobom'],
              ['L', 'sebi'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Umivam se. Kupujem sebi knjigu. Govorim o sebi. Ponosan sam sobom.', ru: 'Умываюсь. Покупаю себе книгу. Говорю о себе. Горжусь собой.' },
            ],
          },
        ],
      },
      {
        id: 'zamenice-prisvojne-pokazne',
        titleRu: 'Притяжательные и указательные местоимения',
        blocks: [
          { type: 'p', text: 'Притяжательные: moj, tvoj, njegov, njen, naš, vaš, njihov.' },
          { type: 'p', text: 'Парадигма moj (м.р.):' },
          {
            type: 'table',
            header: ['Падеж', 'Ед.ч.', 'Мн.ч.'],
            rows: [
              ['N', 'moj novi stan', 'moji novi stanovi'],
              ['G', 'mog novog stana', 'mojih novih stanova'],
              ['D', 'mom novom stanu', 'mojim novim stanovima'],
              ['A', 'moj novi stan', 'moje nove stanove'],
              ['V', 'moj novi stane!', 'moji novi stanovi!'],
              ['I', 'mojim novim stanom', 'mojim novim stanovima'],
              ['L', 'mom novom stanu', 'mojim novim stanovima'],
            ],
          },
          { type: 'p', text: 'Парадигма moja (ж.р.):' },
          {
            type: 'table',
            header: ['Падеж', 'Ед.ч.', 'Мн.ч.'],
            rows: [
              ['N', 'moja lepa kuća', 'moje lepe kuće'],
              ['G', 'moje lepe kuće', 'mojih lepih kuća'],
              ['D', 'mojoj lepoj kući', 'mojim lepim kućama'],
              ['A', 'moju lepu kuću', 'moje lepe kuće'],
              ['V', 'moja lepa kućo!', 'moje lepe kuće!'],
              ['I', 'mojom lepom kućom', 'mojim lepim kućama'],
              ['L', 'mojoj lepoj kući', 'mojim lepim kućama'],
            ],
          },
          { type: 'p', text: 'Указательные: ovaj, ova, ovo (этот, близко); taj, ta, to (тот, среднее); onaj, ona, ono (тот, далеко).' },
          { type: 'p', text: 'Парадигма ovaj (м.р.):' },
          {
            type: 'table',
            header: ['Падеж', 'Ед.ч.', 'Мн.ч.'],
            rows: [
              ['N', 'ovaj novi grad', 'ovi novi gradovi'],
              ['G', 'ovog novog grada', 'ovih novih gradova'],
              ['D', 'ovom novom gradu', 'ovim novim gradovima'],
              ['A', 'ovaj novi grad', 'ove nove gradove'],
              ['V', 'ovaj novi grade!', 'ovi novi gradovi!'],
              ['I', 'ovim novim gradom', 'ovim novim gradovima'],
              ['L', 'ovom novom gradu', 'ovim novim gradovima'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Ovaj novi grad mi se sviđa. Živim u ovom novom gradu.', ru: 'Этот новый город мне нравится. Живу в этом новом городе.' },
              { sr: 'Ta lepa žena je moja majka. Razgovaramo o toj lepoj ženi.', ru: 'Та красивая женщина — моя мама. Говорим о той красивой женщине.' },
              { sr: 'Onaj stari most je veoma lep.', ru: 'Тот старый мост очень красивый.' },
            ],
          },
        ],
      },
      {
        id: 'zamenice-upitne',
        titleRu: 'Вопросительные, относительные, неопределённые и отрицательные',
        blocks: [
          { type: 'p', text: 'Вопросительные: ko? šta? koji? čiji? kakav? koliki?' },
          { type: 'p', text: 'Склонение ko / šta:' },
          {
            type: 'table',
            header: ['Падеж', 'ko', 'šta'],
            rows: [
              ['N', 'ko', 'šta'],
              ['G', 'koga', 'čega'],
              ['D', 'kome', 'čemu'],
              ['A', 'koga', 'šta'],
              ['I', 's kim', 's čim'],
              ['L', 'o kome', 'o čemu'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Ko je on? Šta je ovo? S kim ideš? O kome govoriš?', ru: 'Кто он? Что это? С кем идёшь? О ком говоришь?' },
              { sr: 'Koji grad voliš? Koja knjiga je tvoja?', ru: 'Какой город любишь? Какая книга твоя?' },
            ],
          },
          { type: 'p', text: 'Относительные: koji, ko, šta, čiji, kakav.' },
          {
            type: 'examples',
            items: [
              { sr: 'Čitam knjigu koju si mi poklonio.', ru: 'Читаю книгу, которую ты мне подарил.' },
              { sr: 'Grad u kojem živim je mali.', ru: 'Город, в котором я живу, маленький.' },
              { sr: 'Onaj koji rano rani, dve sreće grabi.', ru: 'Кто рано встаёт, тому фортуна даёт.' },
            ],
          },
          { type: 'p', text: 'Неопределённые: neko, nešto, neki, nečiji, nekakav, nekoliki. Отрицательные: niko, ništa, nijedan, ničiji, nikakav, nikoliki.' },
          {
            type: 'examples',
            items: [
              { sr: 'Neko je došao. Nešto se dogodilo.', ru: 'Кто-то пришёл. Что-то случилось.' },
              { sr: 'Niko nije došao. Ništa ne znam.', ru: 'Никто не пришёл. Ничего не знаю.' },
              { sr: 'Ne razgovaram ni s kim. Ne idem nikuda.', ru: 'Не разговариваю ни с кем. Никуда не иду.' },
            ],
          },
        ],
      },
      {
        id: 'zamenice-kratke',
        titleRu: 'Краткие (безударные) формы',
        blocks: [
          { type: 'p', text: 'У личных местоимений есть полные (ударные) и краткие (безударные, энклитические) формы. Краткие употребляются, когда местоимение не выделено логическим ударением.' },
          {
            type: 'table',
            header: ['Падеж', 'ja', 'ti', 'on', 'ona', 'ono', 'mi', 'vi', 'oni/one/ona'],
            rows: [
              ['G полная', 'mene', 'tebe', 'njega', 'nje', 'njega', 'nas', 'vas', 'njih'],
              ['G краткая', 'me', 'te', 'ga', 'je', 'ga', 'nas', 'vas', 'ih'],
              ['D полная', 'meni', 'tebi', 'njemu', 'njoj', 'njemu', 'nama', 'vama', 'njima'],
              ['D краткая', 'mi', 'ti', 'mu', 'joj', 'mu', 'nam', 'vam', 'im'],
              ['A полная', 'mene', 'tebe', 'njega', 'nju', 'njega', 'nas', 'vas', 'njih'],
              ['A краткая', 'me', 'te', 'ga', 'je/ju', 'ga', 'nas', 'vas', 'ih'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Vidim ga. / Vidim njega.', ru: 'Вижу его (нейтрально) / вижу именно его (эмфаза).' },
              { sr: 'Bez tebe ne idem. S tobom idem. Prema meni.', ru: 'После предлогов — только полные формы.' },
            ],
          },
          { type: 'note', text: 'После предлогов краткие формы недопустимы: ❌ Bez te ne idem → ✅ Bez tebe ne idem. В разговорной речи допускаются na me, za te, u nj, но литературная норма — полные формы: na mene, za tebe, u njega.' },
          { type: 'p', text: 'Возвратные формы: se (акк.) — Umivam se; si (дат.) — Kupujem si knjigu; полные sebe, sebi, sobom — Volim sebe, Govorim sebi, Ponosan sam sobom.' },
          {
            type: 'table',
            header: ['Контекст', 'Форма', 'Пример'],
            rows: [
              ['После предлога', 'полная', 'bez tebe, s tobom, prema meni'],
              ['Эмфаза («именно…»)', 'полная', 'Vidim njega, ne tebe'],
              ['Нейтрально, в цепочке', 'краткая', 'Vidim ga. Dao sam ti je.'],
              ['В начале предложения', 'полная (краткая — на 2-м месте)', 'Njega vidim. / Ja ga vidim.'],
              ['С отрицанием', 'краткая после глагольной энклитики', 'Nisam ga video. Neću ti ga dati.'],
            ],
          },
          { type: 'p', text: 'Типичные ошибки:' },
          {
            type: 'table',
            header: ['Ошибка', 'Правильно', 'Почему'],
            rows: [
              ['❌ Bez te ne idem.', '✅ Bez tebe ne idem.', 'После предлога — полная форма'],
              ['❌ Ja ga sam video.', '✅ Ja sam ga video.', 'Глагольная энклитика (sam) — первая в цепочке'],
              ['❌ On je mi dao.', '✅ On mi je dao.', 'Датив (mi) — перед аккузативом (je)'],
              ['❌ Dao sam je ti.', '✅ Dao sam ti je.', 'Датив (ti) — перед аккузативом (je)'],
              ['❌ Ona se mi javila.', '✅ Ona mi se javila.', 'Датив (mi) — перед se'],
              ['❌ Vidim je ju.', '✅ Vidim je. / Vidim ju.', 'Одна форма, не обе'],
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'brojevi',
    titleRu: 'Числительные',
    topics: [
      {
        id: 'brojevi',
        titleRu: 'Количественные, порядковые, собирательные',
        blocks: [
          { type: 'p', text: 'Количественные: jedan, dva, tri, četiri, pet, šest, sedam, osam, devet, deset, jedanaest, dvanaest, trinaest, četrnaest, petnaest, dvadeset, trideset, četrdeset, pedeset, šezdeset, sedamdeset, osamdeset, devedeset, sto, dvesta, trista, četiristo, petsto, hiljada, milion.' },
          { type: 'p', text: 'Согласование с существительным:' },
          {
            type: 'table',
            header: ['Число', 'Форма существительного', 'Пример'],
            rows: [
              ['1', 'им.п. ед.ч.', 'jedan novi grad, jedna lepa žena, jedno malo selo'],
              ['2–4', 'род.п. ед.ч.', 'dva nova grada, tri lepe žene, četiri mala sela'],
              ['5+', 'род.п. мн.ч.', 'pet novih gradova, šest lepih žena, deset malih sela'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Kupio sam dva nova udžbenika. Pročitao sam tri zanimljive knjige.', ru: 'Купил два новых учебника. Прочитал три интересные книги.' },
              { sr: 'Razgovaram s dvama prijateljima. Idem prema trima kućama.', ru: 'Разговариваю с двумя друзьями. Иду к трём домам.' },
            ],
          },
          { type: 'p', text: 'Склонение dva, tri, četiri: dva grada — dvaju gradova — dvama gradovima; tri žene — triju žena — trima ženama.' },
          { type: 'p', text: 'Порядковые: prvi, drugi, treći, četvrti, peti, šesti, sedmi, osmi, deveti, deseti, jedanaesti, dvadeseti, stoti, hiljaditi.' },
          {
            type: 'examples',
            items: [
              { sr: 'Stanujem na trećem spratu. Danas je prvi maj.', ru: 'Живу на третьем этаже. Сегодня первое мая.' },
            ],
          },
          { type: 'p', text: 'Собирательные: dvoje, troje, četvoro, petoro, šestoro, desetoro; oba/obe, obadva/obadve. Количественные существительные: dvojica, trojica, četvorica, petorica (о лицах м.р.); dvojka, trojka (оценки, цифры).' },
          {
            type: 'examples',
            items: [
              { sr: 'Došlo je troje dece. Imamo dvoje male dece.', ru: 'Пришло трое детей. У нас двое маленьких детей.' },
              { sr: 'Dvojica studenata su došla.', ru: 'Пришли двое студентов.' },
              { sr: 'Dobio sam dvojku iz matematike.', ru: 'Получил двойку по математике.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'glagoli',
    titleRu: 'Глагол',
    topics: [
      {
        id: 'glagoli-prezent',
        titleRu: 'Настоящее время (prezent)',
        blocks: [
          { type: 'p', text: 'Три основных класса спряжения:' },
          {
            type: 'table',
            header: ['Класс', '1 л. ед.ч.', 'Примеры'],
            rows: [
              ['I (a-тип)', '-am', 'čitam, radim, gledam, putujem'],
              ['II (e-тип)', '-em', 'pišem, govorim, idem, nosim'],
              ['III (i-тип)', '-im', 'volim, želim, trčim'],
            ],
          },
          { type: 'p', text: 'Полная парадигма: raditi (I), pisati (II), govoriti (III):' },
          {
            type: 'table',
            header: ['Лицо', 'raditi (I)', 'pisati (II)', 'govoriti (III)'],
            rows: [
              ['ja', 'radim', 'pišem', 'govorim'],
              ['ti', 'radiš', 'pišeš', 'govoriš'],
              ['on/ona/ono', 'radi', 'piše', 'govori'],
              ['mi', 'radimo', 'pišemo', 'govorimo'],
              ['vi', 'radite', 'pišete', 'govorite'],
              ['oni/one/ona', 'rade', 'pišu', 'govore'],
            ],
          },
          { type: 'p', text: 'Глагол biti (настоящее время):' },
          {
            type: 'table',
            header: ['Лицо', 'Полная', 'Краткая', 'Отрицание'],
            rows: [
              ['ja', 'jesam', 'sam', 'nisam'],
              ['ti', 'jesi', 'si', 'nisi'],
              ['on/ona/ono', 'jeste', 'je', 'nije'],
              ['mi', 'jesmo', 'smo', 'nismo'],
              ['vi', 'jeste', 'ste', 'niste'],
              ['oni/one/ona', 'jesu', 'su', 'nisu'],
            ],
          },
          { type: 'p', text: 'Особые формы:' },
          {
            type: 'table',
            header: ['Глагол', 'Парадигма'],
            rows: [
              ['hteti', 'hoću, hoćeš, hoće, hoćemo, hoćete, hoće'],
              ['moći', 'mogu, možeš, može, možemo, možete, mogu'],
              ['morati', 'moram, moraš, mora, moramo, morate, moraju'],
              ['dati', 'dam, daš, da, damo, date, daju'],
              ['znati', 'znam, znaš, zna, znamo, znate, znaju'],
              ['ići', 'idem, ideš, ide, idemo, idete, idu'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Ja čitam zanimljivu knjigu. Ti pišeš dugo pismo.', ru: 'Я читаю интересную книгу. Ты пишешь длинное письмо.' },
              { sr: 'Ja sam student. Ona nije moja sestra.', ru: 'Я студент. Она не моя сестра.' },
              { sr: 'Hoću da idem kući. Ne mogu da dođem. Moram da radim.', ru: 'Хочу идти домой. Не могу прийти. Должен работать.' },
            ],
          },
        ],
      },
      {
        id: 'glagoli-vid',
        titleRu: 'Глагольный вид',
        blocks: [
          { type: 'p', text: 'Несовершенный вид обозначает процесс и повтор, совершенный — результат и однократность:' },
          {
            type: 'table',
            header: ['Несовершенный (процесс, повтор)', 'Совершенный (результат, однократность)'],
            rows: [
              ['pisati', 'napisati'],
              ['čitati', 'pročitati'],
              ['govoriti', 'reći'],
              ['raditi', 'uraditi'],
              ['gledati', 'pogledati'],
              ['putovati', 'otputovati'],
              ['učiti', 'naučiti'],
              ['dolaziti', 'doći'],
              ['odlaziti', 'otići'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Juče sam pisao pismo. / Juče sam napisao pismo.', ru: 'Вчера писал письмо (процесс) / вчера написал письмо (результат).' },
              { sr: 'Učio sam srpski godinu dana. / Naučio sam srpski.', ru: 'Учил сербский год / выучил сербский.' },
              { sr: 'Dolazim svaki dan. / Došao sam juče.', ru: 'Прихожу каждый день / пришёл вчера.' },
            ],
          },
          { type: 'note', text: 'С несовершенным видом — процесс и повтор: Čitam knjigu, Čitao sam knjigu. С совершенным — результат: Pročitaću knjigu, Pročitao sam knjigu.' },
        ],
      },
      {
        id: 'glagoli-imperativ',
        titleRu: 'Императив',
        blocks: [
          { type: 'p', text: 'Императив образуется от основы 3 л. мн.ч. презента: čitaju → čitaj!, pišu → piši!, idu → idi!, govore → govori!, rade → radi!' },
          {
            type: 'table',
            header: ['Лицо', 'čitati', 'pisati', 'ići'],
            rows: [
              ['ti (2 ед.)', 'čitaj!', 'piši!', 'idi!'],
              ['mi (1 мн.)', 'čitajmo!', 'pišimo!', 'idimo!'],
              ['vi (2 мн.)', 'čitajte!', 'pišite!', 'idite!'],
            ],
          },
          { type: 'p', text: 'Особые формы: biti → budi! budite!; hteti → hajde! hajdemo! hajdete!; doći → dođi! dođite!' },
          {
            type: 'examples',
            items: [
              { sr: 'Hajde da idemo zajedno! Hajde, brže!', ru: 'Пойдём вместе! Давай быстрее!' },
              { sr: 'Budi dobar! Budite pažljivi!', ru: 'Будь хорошим! Будьте осторожны!' },
              { sr: 'Ne čitaj tu knjigu! Ne govori tako! Ne idi tamo!', ru: 'Не читай эту книгу! Не говори так! Не ходи туда!' },
              { sr: 'Ne zaboravi knjigu! Ne zaboravite da pozovete majku!', ru: 'Не забудь книгу! Не забудьте позвонить маме!' },
            ],
          },
        ],
      },
      {
        id: 'glagoli-perfekat',
        titleRu: 'Перфект',
        blocks: [
          { type: 'p', text: 'Перфект — основное прошедшее время. Образование: краткая форма biti (sam, si, je, smo, ste, su) + причастие на -o (м.р.), -la (ж.р.), -lo (ср.р.), -li (мн.ч.).' },
          {
            type: 'table',
            header: ['Лицо', 'М.р.', 'Ж.р.', 'Ср.р.'],
            rows: [
              ['ja', 'sam radio', 'sam radila', '—'],
              ['ti', 'si radio', 'si radila', '—'],
              ['on/ona/ono', 'je radio', 'je radila', 'je radilo'],
              ['mi', 'smo radili', 'smo radile', 'smo radila'],
              ['vi', 'ste radili', 'ste radile', 'ste radila'],
              ['oni/one/ona', 'su radili', 'su radile', 'su radila'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Prošle nedelje sam posetio starog prijatelja.', ru: 'На прошлой неделе навестил старого друга.' },
              { sr: 'Ona je napisala dugo pismo svojoj majci.', ru: 'Она написала длинное письмо своей маме.' },
              { sr: 'Nisam bio kod kuće. Nije došao na vreme.', ru: 'Меня не было дома. Он не пришёл вовремя.' },
              { sr: 'Da li si učio srpski? Jesam, učio sam.', ru: 'Ты учил сербский? Да, учил.' },
            ],
          },
          { type: 'note', text: 'Порядок энклитик: Ja sam mu ga dao. Ona mi se javila. Knjiga je na stolu. Dao sam ti je.' },
        ],
      },
      {
        id: 'glagoli-futur',
        titleRu: 'Будущее время (futur I и II)',
        blocks: [
          { type: 'p', text: 'Futur I (независимое): краткая форма hteti (ću, ćeš, će, ćemo, ćete, će) + инфинитив. Есть полная и слитная формы:' },
          {
            type: 'table',
            header: ['Лицо', 'Полная', 'Слитная'],
            rows: [
              ['ja', 'ću čitati', 'čitaću'],
              ['ti', 'ćeš čitati', 'čitaćeš'],
              ['on/ona/ono', 'će čitati', 'čitaće'],
              ['mi', 'ćemo čitati', 'čitaćemo'],
              ['vi', 'ćete čitati', 'čitaćete'],
              ['oni/one/ona', 'će čitati', 'čitaće'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Sutra ćemo posetiti starog prijatelja.', ru: 'Завтра навестим старого друга.' },
              { sr: 'Neću doći. Nećeš moći. Nećemo stići.', ru: 'Не приду. Не сможешь. Не успеем.' },
            ],
          },
          { type: 'p', text: 'Futur II (зависимое): budem, budeš, bude, budemo, budete, budu + причастие на -o/-la/-lo. Употребляется в придаточных после будущего, условия и времени.' },
          {
            type: 'examples',
            items: [
              { sr: 'Ako budem imao vremena, doći ću.', ru: 'Если будет время, приду.' },
              { sr: 'Kada budeš završio posao, pozovi me.', ru: 'Когда закончишь работу, позвони мне.' },
              { sr: 'Ne znam da li će doći. Ako bude došao, javi mi.', ru: 'Не знаю, придёт ли. Если придёт, сообщи мне.' },
            ],
          },
        ],
      },
      {
        id: 'glagoli-aorist',
        titleRu: 'Аорист, имперфект, плюсквамперфект',
        blocks: [
          { type: 'p', text: 'Аорист — книжное прошедшее, обозначает завершённое действие (в разговоре редко). Образуется от инфинитивной основы:' },
          {
            type: 'table',
            header: ['Глагол', 'Парадигма'],
            rows: [
              ['reći', 'rekoh, reče, reče, rekosmo, rekoste, rekoše'],
              ['doći', 'dođoh, dođe, dođe, dođosmo, dođoste, dođoše'],
              ['biti', 'bih, bi, bi, bismo, biste, biše'],
              ['pisati', 'pisah, pisa, pisa, pismosmo, pisaste, pisaše'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'On reče istinu i ode.', ru: 'Он сказал правду и ушёл.' },
              { sr: 'Dođoh, videh, pobedih.', ru: 'Пришёл, увидел, победил.' },
            ],
          },
          { type: 'p', text: 'Имперфект — книжное прошедшее для длительного/повторяющегося действия. Образование: основа презента + -ah, -aše, -aše, -asmo, -aste, -ahu:' },
          {
            type: 'table',
            header: ['Глагол', 'Парадигма'],
            rows: [
              ['čitati', 'čitah, čitaše, čitaše, čitasmo, čitaste, čitahu'],
              ['pisati', 'pisah, pisaše, pisaše, pisasmo, pisaste, pisahu'],
              ['ići', 'iđah, iđaše, iđaše, iđasmo, iđaste, iđahu'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Dok ja čitah, on pisaše pismo.', ru: 'Пока я читал, он писал письмо.' },
              { sr: 'Bijaše hladna zima.', ru: 'Была холодная зима.' },
            ],
          },
          { type: 'p', text: 'Плюсквамперфект — давнопрошедшее: действие до другого прошедшего. Образование: bio/bila/bilo + причастие (bio sam radio) или bejah/ bejaše (книжн.).' },
          {
            type: 'examples',
            items: [
              { sr: 'Kada sam došao, on je već bio otišao.', ru: 'Когда я пришёл, он уже ушёл.' },
              { sr: 'Bila je već zaspala kada smo stigli.', ru: 'Она уже уснула, когда мы приехали.' },
            ],
          },
        ],
      },
      {
        id: 'glagoli-kondicional',
        titleRu: 'Кондиционал',
        blocks: [
          { type: 'p', text: 'Kondicional I: bih, bi, bi, bismo, biste, bi + причастие на -o/-la/-lo:' },
          {
            type: 'table',
            header: ['Лицо', 'М.р.', 'Ж.р.'],
            rows: [
              ['ja', 'bih radio', 'bih radila'],
              ['ti', 'bi radio', 'bi radila'],
              ['on/ona/ono', 'bi radio', 'bi radila'],
              ['mi', 'bismo radili', 'bismo radile'],
              ['vi', 'biste radili', 'biste radile'],
              ['oni/one/ona', 'bi radili', 'bi radile'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Ja bih rado putovao u Beograd.', ru: 'Я бы с удовольствием поехал в Белград.' },
              { sr: 'Da imam vremena, čitao bih knjigu.', ru: 'Если бы у меня было время, я бы читал книгу.' },
              { sr: 'Kada bih imao novca, kupio bih novi auto.', ru: 'Если бы у меня были деньги, я бы купил новую машину.' },
            ],
          },
          { type: 'p', text: 'Kondicional II (нереальное условие): bio/bila/bilo bih + причастие. Da sam bio učio, položio bih ispit. Da si bio došao, video bi ga.' },
          { type: 'note', text: 'Вежливость: Da li biste mi pomogli? Hteo bih da vas pitam nešto. Molim te, da mi pozajmiš knjigu?' },
        ],
      },
      {
        id: 'glagoli-povratni',
        titleRu: 'Возвратные глаголы, страдательные причастия, деепричастия',
        blocks: [
          { type: 'p', text: 'Возвратные глаголы образуются с частицей se (в дативе — si):' },
          {
            type: 'table',
            header: ['Инфинитив', 'Настоящее время'],
            rows: [
              ['umivati se', 'umivam se, umivaš se, umiva se…'],
              ['smejati se', 'smejem se, smeješ se, smeje se…'],
              ['zvati se', 'zovem se, zoveš se, zove se…'],
              ['radovati se', 'radujem se, raduješ se, raduje se…'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Zovem se Marko. Kako se ti zoveš?', ru: 'Меня зовут Марко. Как тебя зовут?' },
              { sr: 'Deca su se igrala u parku.', ru: 'Дети играли в парке.' },
              { sr: 'Knjiga se čita lako.', ru: 'Книга легко читается (пассивное значение).' },
            ],
          },
          { type: 'p', text: 'Страдательные причастия: основа + -n/-en/-t: napisati — napisan, otvoriti — otvoren, čitati — čitan, zaboraviti — zaboravljen. Пример: napisano pismo, otvorena vrata, pročitana knjiga, zaboravljen prijatelj.' },
          {
            type: 'examples',
            items: [
              { sr: 'Pismo je napisano. Vrata su otvorena.', ru: 'Письмо написано. Двери открыты.' },
              { sr: 'To je dobro poznat problem. On je cenjen profesor.', ru: 'Это хорошо известная проблема. Он — уважаемый профессор.' },
            ],
          },
          { type: 'p', text: 'Деепричастия: настоящее (sadašnji) на -ći — čitajući, pišući, idući, govoreći; прошедшее (prošli) на -vši/-avši — pročitavši, napisavši, došavši, rekavši.' },
          {
            type: 'examples',
            items: [
              { sr: 'Idući kući, sreo sam prijatelja.', ru: 'Идя домой, встретил друга.' },
              { sr: 'Pročitavši knjigu, vratio ju je u biblioteku.', ru: 'Прочитав книгу, вернул её в библиотеку.' },
              { sr: 'Rekavši to, izašao je iz sobe.', ru: 'Сказав это, вышел из комнаты.' },
            ],
          },
        ],
      },
      {
        id: 'glagoli-modalni',
        titleRu: 'Модальные глаголы и классы спряжения',
        blocks: [
          {
            type: 'table',
            header: ['Глагол', 'Значение', 'Парадигма'],
            rows: [
              ['moći', 'мочь', 'mogu, možeš, može, možemo, možete, mogu'],
              ['morati', 'быть должным', 'moram, moraš, mora, moramo, morate, moraju'],
              ['hteti', 'хотеть', 'hoću, hoćeš, hoće, hoćemo, hoćete, hoće'],
              ['trebati', 'нужно', 'treba mi, trebaš mi…'],
              ['smeti', 'сметь', 'smem, smeš, sme, smemo, smete, smeju'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Ne mogu da dođem. Moram da radim. Hoću da idem kući.', ru: 'Не могу прийти. Должен работать. Хочу идти домой.' },
              { sr: 'Treba mi tvoja pomoć. Ne smem to da uradim.', ru: 'Мне нужна твоя помощь. Я не смею это сделать.' },
              { sr: 'Možeš li mi pomoći? Moramo da učimo.', ru: 'Можешь мне помочь? Мы должны учиться.' },
            ],
          },
          { type: 'p', text: 'Классы спряжения (vrste promene): I (-am), II (-em), III (-im), IV — неправильные (biti, hteti, moći, morati, dati, znati, ići).' },
        ],
      },
    ],
  },
  {
    id: 'prilozi',
    titleRu: 'Наречия',
    topics: [
      {
        id: 'prilozi',
        titleRu: 'Разряды наречий',
        blocks: [
          {
            type: 'table',
            header: ['Разряд', 'Примеры'],
            rows: [
              ['Времени', 'danas, juče, sutra, sada, uvek, nikad, često, retko, rano, kasno'],
              ['Места', 'ovde, tamo, gore, dole, napred, nazad, blizu, daleko, unutra, napolju'],
              ['Образа действия', 'brzo, polako, lepo, dobro, loše, tiho, glasno, lako, teško'],
              ['Количества', 'mnogo, malo, više, manje, dovoljno, previše'],
              ['Причины', 'zato, stoga'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'Danas je lepo vreme. Juče sam bio u gradu. Sutra idem u školu.', ru: 'Сегодня хорошая погода. Вчера был в городе. Завтра иду в школу.' },
              { sr: 'On govori brzo, a ona polako. Radim dobro, ali mogu bolje.', ru: 'Он говорит быстро, а она медленно. Работаю хорошо, но могу лучше.' },
              { sr: 'Imam mnogo posla. Treba mi malo vremena.', ru: 'У меня много дел. Мне нужно немного времени.' },
              { sr: 'Zato ne idem, jer nemam vremena.', ru: 'Поэтому не иду, потому что нет времени.' },
            ],
          },
          { type: 'p', text: 'Степени сравнения наречий:' },
          {
            type: 'table',
            header: ['Положительная', 'Сравнительная', 'Превосходная'],
            rows: [
              ['brzo', 'brže', 'najbrže'],
              ['lepo', 'lepše', 'najlepše'],
              ['dobro', 'bolje', 'najbolje'],
              ['mnogo', 'više', 'najviše'],
              ['malo', 'manje', 'najmanje'],
            ],
          },
          {
            type: 'examples',
            items: [
              { sr: 'On trči brže od mene. Ona peva najlepše. Danas radim bolje nego juče.', ru: 'Он бегает быстрее меня. Она поёт лучше всех. Сегодня работаю лучше, чем вчера.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'predlozi',
    titleRu: 'Предлоги',
    topics: [
      {
        id: 'predlozi',
        titleRu: 'Предлоги с управлением',
        blocks: [
          { type: 'p', text: 'Генитив: bez, od, iz, do, kod, nakon, pre, posle, zbog, između, ispred, iza, pored, blizu, daleko od, umesto.' },
          {
            type: 'examples',
            items: [
              { sr: 'bez tvog prijatelja, od mog oca, iz malog grada, do velikog mosta', ru: 'без твоего друга, от моего отца, из маленького города, до большого моста' },
              { sr: 'kod starog lekara, nakon dugog posla, pre nedelje, posle dobrog ručka', ru: 'у старого врача, после долгой работы, до недели, после хорошего обеда' },
              { sr: 'zbog teškog ispita, između dve visoke zgrade, ispred nove kuće, pored starog parka', ru: 'из-за трудного экзамена, между двумя высокими зданиями, перед новым домом, возле старого парка' },
            ],
          },
          { type: 'p', text: 'Датив: prema, ka, zahvaljujući, uprkos, nasuprot.' },
          {
            type: 'examples',
            items: [
              { sr: 'prema novoj zgradi, ka starom mostu', ru: 'к новому зданию, к старому мосту' },
              { sr: 'zahvaljujući dobrom prijatelju, uprkos lošem vremenu', ru: 'благодаря хорошему другу, несмотря на плохую погоду' },
            ],
          },
          { type: 'p', text: 'Аккузатив (движение/направление): u, na, kroz, za, pred, pod, nad.' },
          {
            type: 'examples',
            items: [
              { sr: 'u veliki grad, na lepu plažu, kroz mračni park', ru: 'в большой город, на красивый пляж, через тёмный парк' },
              { sr: 'za mog brata, pred novu kuću, pod staro drvo', ru: 'для моего брата, перед новым домом, под старое дерево' },
            ],
          },
          { type: 'p', text: 'Инструментал: s(a), pred, nad, pod, za, među.' },
          {
            type: 'examples',
            items: [
              { sr: 's dobrim prijateljem, pred novom kućom, nad velikim stolom', ru: 'с хорошим другом, перед новым домом, над большим столом' },
              { sr: 'pod starim drvetom, za velikim stolom, među dobrim ljudima', ru: 'под старым деревом, за большим столом, среди хороших людей' },
            ],
          },
          { type: 'p', text: 'Локатив: u, na, o, po.' },
          {
            type: 'examples',
            items: [
              { sr: 'u malom selu, na drvenom stolu, o novom filmu, po lepom parku', ru: 'в маленькой деревне, на деревянном столе, о новом фильме, по красивому парку' },
            ],
          },
          { type: 'note', text: 'Сводные примеры: Idem u veliki grad. Živim u velikom gradu. Dolazim iz velikog grada. Idem na lepu plažu. Ležim na lepoj plaži. Vraćam se s lepe plaže.' },
        ],
      },
    ],
  },
  {
    id: 'veznici',
    titleRu: 'Союзы, частицы, междометия',
    topics: [
      {
        id: 'veznici-recce-uzvici',
        titleRu: 'Союзы, частицы, междометия',
        blocks: [
          { type: 'p', text: 'Сочинительные союзы: i, a, ali, ili, ni, niti, pa, te, no. Подчинительные: da, jer, ako, kada, dok, pošto, zato što, mada, iako, čim, pre nego što, posle, kako, koji.' },
          {
            type: 'examples',
            items: [
              { sr: 'Ja čitam knjigu, a ti gledaš film.', ru: 'Я читаю книгу, а ты смотришь фильм.' },
              { sr: 'Ne idem, jer nemam vremena.', ru: 'Не иду, потому что нет времени.' },
              { sr: 'Mada je kiša padala, izašli smo.', ru: 'Хотя шёл дождь, мы вышли.' },
            ],
          },
          { type: 'p', text: 'Частицы (rečce):' },
          {
            type: 'table',
            header: ['Частица', 'Функция', 'Пример'],
            rows: [
              ['li', 'вопрос', 'Da li si student? Možeš li mi pomoći?'],
              ['ne', 'отрицание', 'Ne idem. Ne znam.'],
              ['da', 'утверждение/согласие', 'Da, to je tačno.'],
              ['ni', 'усиление отрицания', 'Ni ne znam. Ni jedan.'],
              ['baš', 'именно', 'Baš tako. Baš lepo.'],
              ['čak', 'даже', 'Čak i on je došao.'],
              ['samo', 'только', 'Samo ti. Samo malo.'],
              ['zar', 'разве', 'Zar ne znaš?'],
            ],
          },
          { type: 'p', text: 'Междометия (uzvici): Ah! Oh! Oj! Hej! Uf! Jao! Bravo! Hvala! Molim!' },
          {
            type: 'examples',
            items: [
              { sr: 'Ah, kako je lepo! Jao, boli me! Bravo, odlično si uradio!', ru: 'Ах, как красиво! Ой, болит! Браво, отлично сделал!' },
              { sr: 'Hej, čekaj! Oj, ti!', ru: 'Эй, подожди! Ой, ты!' },
            ],
          },
          { type: 'p', text: 'Слова-паразиты (poštapalice): znaš, ono, pa, ovaj, kao, dakle, u stvari, zapravo, jednostavno.' },
          {
            type: 'examples',
            items: [
              { sr: 'Pa, znaš, ono, nije baš tako.', ru: 'Ну, знаешь, это, не совсем так.' },
              { sr: 'Dakle, u stvari, zapravo, to nije tačno.', ru: 'Итак, собственно, на самом деле это неправда.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'tvorba',
    titleRu: 'Словообразование',
    topics: [
      {
        id: 'tvorba-reci',
        titleRu: 'Префиксация, суффиксация, словосложение',
        blocks: [
          { type: 'p', text: 'Префиксы:' },
          {
            type: 'table',
            header: ['Приставка', 'Значение', 'Примеры'],
            rows: [
              ['do-', 'до', 'doći, doneti, dovesti, dopisati'],
              ['na-', 'на', 'napisati, naći, naviknuti se'],
              ['pro-', 'про', 'pročitati, proći, progovoriti'],
              ['pre-', 'пере', 'preći, prepisati, prevesti'],
              ['od-', 'от', 'odići, odnesti, odvesti'],
              ['u-', 'в', 'ući, uneti, uvesti'],
              ['iz-', 'из', 'izaći, izneti, izvesti'],
              ['po-', 'по', 'poći, poneti, povest'],
            ],
          },
          { type: 'p', text: 'Суффиксы существительных: -nik (radnik, učenik), -ica (učiteljica, radnica), -ost (radost, lepota), -stvo (prijateljstvo, društvo), -telj (učitelj, prijatelj), -ač (čitalac, gledalac).' },
          { type: 'p', text: 'Суффиксы прилагательных: -ski (srpski, gradski), -an (dobar, star), -iv (lep, živ), -ljiv (pažljiv, ljubazan).' },
          { type: 'p', text: 'Суффиксы глаголов: -ovati (radovati se, putovati), -iti (raditi, učiti), -ati (čitati, gledati).' },
          { type: 'p', text: 'Словосложение: Beograd (beo + grad), Novi Sad, Jadransko more; poluvreme, polufinale, samoposluga, samousluga.' },
          {
            type: 'examples',
            items: [
              { sr: 'On je dobar radnik. Ona je učiteljica.', ru: 'Он хороший рабочий. Она учительница.' },
              { sr: 'Putujem u Beograd. Radujem se putovanju.', ru: 'Еду в Белград. Радуюсь поездке.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'poryadok-slov',
    titleRu: 'Порядок слов и энклитики',
    topics: [
      {
        id: 'red-reci',
        titleRu: 'Порядок слов в предложении',
        blocks: [
          { type: 'p', text: 'Сербский — язык со свободным порядком слов, но свобода не абсолютная. Нейтральная модель: подлежащее — сказуемое — дополнение.' },
          {
            type: 'table',
            header: ['Пример', 'Перевод'],
            rows: [
              ['Marko čita knjigu.', 'Марко читает книгу.'],
              ['Ona piše pismo.', 'Она пишет письмо.'],
              ['Mi gledamo film.', 'Мы смотрим фильм.'],
            ],
          },
          { type: 'p', text: 'Инверсия для эмфазы: выделяемое слово ставится в начало или в конец.' },
          {
            type: 'table',
            header: ['Нейтрально', 'Эмфатически'],
            rows: [
              ['Marko čita knjigu.', 'Knjigu čita Marko. (именно книгу)'],
              ['Ona piše pismo.', 'Pismo piše ona. (именно она)'],
              ['Mi gledamo film.', 'Film gledamo mi. (именно мы)'],
              ['Deca se igraju u parku.', 'U parku se igraju deca. (именно в парке)'],
              ['Ja ću sutra doći.', 'Sutra ću ja doći. (именно завтра)'],
            ],
          },
          { type: 'p', text: 'Общий вопрос: Da li Marko čita knjigu? (нейтрально); Marko čita knjigu? (разговорно, только интонация); Čita li Marko knjigu? (с энклитикой li на втором месте).' },
          { type: 'p', text: 'Специальный вопрос — вопросительное слово в начале: Šta čita Marko? Ko piše pismo? Gde živiš ti? Kada dolaziš kući?' },
          { type: 'p', text: 'Отрицание ne / nije / nema — перед глаголом: Marko ne čita knjigu. Ona nije došla. Nemam vremena. При эмфазе отрицание выносится в начало: Ne čita Marko knjigu, nego gleda film.' },
          { type: 'note', text: 'Прилагательное стоит перед существительным (novi grad, lepa žena, malo selo); наречие — обычно перед глаголом или в начале предложения (On brzo trči / Brzo on trči). Фиксированы: энклитики — строго на втором месте, предлоги — перед существительным, союзы — в начале придаточного, частица li — на втором месте.' },
        ],
      },
      {
        id: 'enklitike',
        titleRu: 'Энклитики: je, se, mi и система кратких форм',
        blocks: [
          { type: 'p', text: 'Энклитика — безударное слово, которое примыкает к предыдущему ударному слову. Энклитики обязаны стоять на втором месте в предложении (после первого ударного слова или группы).' },
          { type: 'p', text: 'Полный список энклитик:' },
          {
            type: 'table',
            header: ['Разряд', 'Энклитики'],
            rows: [
              ['biti (наст.)', 'sam, si, je, smo, ste, su'],
              ['hteti (футур)', 'ću, ćeš, će, ćemo, ćete, će'],
              ['biti (кондиционал)', 'bih, bi, bi, bismo, biste, bi'],
              ['Датив личных местоимений', 'mi, ti, mu, joj, nam, vam, im'],
              ['Аккузатив личных местоимений', 'me, te, ga, je, nas, vas, ih'],
              ['Возвратная частица', 'se'],
              ['Возвратное sebi (дат.)', 'si'],
              ['3 л. ед.ч. ж.р. аккузатив', 'je (совпадает с je от biti)'],
            ],
          },
          { type: 'note', text: 'Строгий порядок энклитик: 1) глагольная (sam, si, je, ću, bih…), 2) датив (mi, ti, mu…), 3) аккузатив (me, te, ga, je…), 4) se, 5) je (3 л. ед.ч. ж.р. акк.). Формула: глагол → кому → что → себя → её.' },
          { type: 'p', text: 'Два je в одном предложении невозможны: второе je вытесняется. Говорят Ona ju je videla или Ona je vidi. В вопросах: Da li si mi ga dao? В отрицаниях отрицательные формы nisam, nisi, nije — глагольные энклитики и стоят первыми: Nije mi ga dao. Nisam ti ga dao. Neću ti ga dati.' },
          { type: 'p', text: 'Полные цепочки энклитик:' },
          {
            type: 'table',
            header: ['Предложение', 'Цепочка', 'Перевод'],
            rows: [
              ['Ja sam mu ga dao.', 'sam + mu + ga', 'Я ему его дал.'],
              ['Ti si mi ga poslao.', 'si + mi + ga', 'Ты мне его послал.'],
              ['Ona mi se javila.', 'mi + se', 'Она мне позвонила.'],
              ['Oni su nam se predstavili.', 'su + nam + se', 'Они нам представились.'],
              ['Dao sam ti je.', 'sam + ti + je', 'Я тебе её дал.'],
              ['On mi ga je dao.', 'mi + ga + je', 'Он мне его дал.'],
              ['Ona mi ih je poslala.', 'mi + ih + je', 'Она мне их послала.'],
              ['Nisam ti ga dao.', 'nisam + ti + ga', 'Я тебе его не дал.'],
              ['Neću ti ga dati.', 'neću + ti + ga', 'Я тебе его не дам.'],
              ['Kada si mi ga poslao?', 'si + mi + ga', 'Когда ты мне его послал?'],
            ],
          },
          { type: 'note', text: 'Нельзя ставить цепочку в начало предложения (❌ Sam mu ga dao ja → ✅ Ja sam mu ga dao) и нельзя её разрывать (❌ Sam mu dao ga je → ✅ On mi ga je dao).' },
        ],
      },
    ],
  },
  {
    id: 'pasiv',
    titleRu: 'Пассив и безличные предложения',
    topics: [
      {
        id: 'pasiv-bezlicne',
        titleRu: 'Страдательный залог и безличные предложения',
        blocks: [
          { type: 'p', text: 'Пассив образуется двумя способами: biti + страдательное причастие (Pismo je napisano. Vrata su otvorena.) и se + глагол (Knjiga se čita. Kuća se gradi. Posao se završava).' },
          {
            type: 'examples',
            items: [
              { sr: 'Ova kuća je sagrađena 1990. godine.', ru: 'Этот дом построен в 1990 году.' },
              { sr: 'Ovde se govori srpski. Kako se to kaže na srpskom?', ru: 'Здесь говорят по-сербски. Как это сказать по-сербски?' },
              { sr: 'Posao se završava sutra. Kuća se gradi već godinu dana.', ru: 'Работа заканчивается завтра. Дом строится уже год.' },
            ],
          },
          { type: 'p', text: 'Агент выражается творительным с od strane: Pismo je napisano od strane mog prijatelja. Kuća je sagrađena od strane poznatog arhitekte.' },
          { type: 'p', text: 'Безличные предложения — без подлежащего:' },
          {
            type: 'examples',
            items: [
              { sr: 'Treba mi tvoja pomoć. Treba da učim.', ru: 'Мне нужна твоя помощь. Нужно учиться.' },
              { sr: 'Govori se da će sutra padati kiša.', ru: 'Говорят, что завтра будет дождь.' },
              { sr: 'Nema vremena. Nema novca. Nema problema.', ru: 'Нет времени. Нет денег. Нет проблемы.' },
              { sr: 'Hladno mi je. Žao mi je. Drago mi je.', ru: 'Мне холодно. Мне жаль. Мне радостно.' },
              { sr: 'Ovde se ne puši. Kako se ide do stanice?', ru: 'Здесь не курят. Как пройти до станции?' },
              { sr: 'Zna se da je to teško.', ru: 'Известно, что это трудно.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'slozene-recenice',
    titleRu: 'Сложное предложение',
    topics: [
      {
        id: 'slozene-recenice',
        titleRu: 'Типы придаточных',
        blocks: [
          { type: 'p', text: 'Изъяснительные (с da):' },
          {
            type: 'examples',
            items: [
              { sr: 'Rekao mi je da će doći sutra.', ru: 'Он сказал мне, что придёт завтра.' },
              { sr: 'Nadam se da ćeš doći. Verujem da ćeš uspeti.', ru: 'Надеюсь, что ты придёшь. Верю, что ты справишься.' },
            ],
          },
          { type: 'p', text: 'Условные (с ako, da):' },
          {
            type: 'examples',
            items: [
              { sr: 'Ako budeš učio, položićeš ispit.', ru: 'Если будешь учиться, сдашь экзамен.' },
              { sr: 'Da imam vremena, čitao bih knjigu.', ru: 'Если бы у меня было время, я бы читал книгу.' },
            ],
          },
          { type: 'p', text: 'Причинные (с jer, zato što, pošto):' },
          {
            type: 'examples',
            items: [
              { sr: 'Zato što je kiša padala, ostali smo kod kuće.', ru: 'Потому что шёл дождь, мы остались дома.' },
              { sr: 'Pošto je bio umoran, rano je zaspao.', ru: 'Так как он был уставшим, рано заснул.' },
            ],
          },
          { type: 'p', text: 'Временные (с kada, dok, čim, pre nego što, posle):' },
          {
            type: 'examples',
            items: [
              { sr: 'Kada dođeš kući, pozovi me.', ru: 'Когда придёшь домой, позвони мне.' },
              { sr: 'Čim stignem, javiću ti se.', ru: 'Как только приеду, свяжусь с тобой.' },
              { sr: 'Pre nego što odeš, pozdravi se.', ru: 'Прежде чем уйдёшь, попрощайся.' },
            ],
          },
          { type: 'p', text: 'Относительные (с koji, ko, šta, čiji) и уступительные (с mada, iako, premda):' },
          {
            type: 'examples',
            items: [
              { sr: 'Čovek s kojim radim je dobar.', ru: 'Человек, с которым я работаю, хороший.' },
              { sr: 'Iako je bio umoran, nastavio je da radi.', ru: 'Хотя он был уставшим, продолжал работать.' },
            ],
          },
          { type: 'p', text: 'Целевые (с da bi) и следственные (с pa, te, tako da):' },
          {
            type: 'examples',
            items: [
              { sr: 'Učim da bih položio ispit.', ru: 'Учусь, чтобы сдать экзамен.' },
              { sr: 'Bilo je hladno, pa smo ostali kod kuće.', ru: 'Было холодно, поэтому мы остались дома.' },
              { sr: 'Toliko je bio umoran da je odmah zaspao.', ru: 'Он был так уставшим, что сразу заснул.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'pravopis',
    titleRu: 'Правописание и пунктуация',
    topics: [
      {
        id: 'pravopis-interpunkcija',
        titleRu: 'Правописание и пунктуация',
        blocks: [
          { type: 'p', text: 'Запятая в сложном предложении: Ja čitam knjigu, a ti gledaš film. Ne idem, jer nemam vremena. Ako budeš učio, položićeš ispit.' },
          { type: 'p', text: 'Запятая при обращении: Marijo, dođi ovamo! Dragi prijatelju, kako si? При перечислении: Kupio sam hleb, mleko, jaja i sir. При приложении: Beograd, glavni grad Srbije, je veoma lep.' },
          { type: 'p', text: 'Правописание по фонетическому принципу: muž — muški; sveska — svezaka; metak — meci. Приставки: predsednik, potpredsednik, potčiniti, otcepiti. Упрощение: Rus + ski = ruski; od + deliti = odeliti. Иностранные слова: postdiplomski, plebs, gangster, Vašington.' },
          { type: 'p', text: 'Заглавные буквы: Srbija, Srbin, srpski jezik; Beograd, Novi Sad; Dunav, Sava. Личные местоимения ja, ti, on — с маленькой буквы (кроме начала предложения).' },
          { type: 'p', text: 'Написание ne:' },
          {
            type: 'table',
            header: ['Сочетание', 'Правило', 'Пример'],
            rows: [
              ['ne + глагол', 'раздельно', 'ne idem, ne znam, ne mogu'],
              ['ne + прилагательное/наречие', 'раздельно', 'ne dobar, ne lepo'],
              ['ne + существительное', 'обычно раздельно', 'ne prijatelj, ne student'],
              ['нико, ништа, нигде, никада', 'слитно', 'niko, ništa, nigde, nikada'],
            ],
          },
        ],
      },
    ],
  },
];
