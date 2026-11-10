import { useMemo, useState } from 'react';
import { ArrowLeft, BookOpenCheck, Check, RotateCcw, X } from 'lucide-react';
import type { Script } from '../types';
import { vocabThemes, allVocabWords, type VocabWord } from '../data/vocab';
import { sr } from '../lib/transliterate';
import { cn } from '@/lib/utils';

const LESSON_MIN = 25;
const LESSON_MAX = 30;
const REINSERT_MIN = 4;
const REINSERT_MAX = 7;

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Props {
  script: Script;
  learnedWords: string[];
  onMarkLearned: (wordId: string) => void;
  onBack: () => void;
}

export function VocabScreen({ script, learnedWords, onMarkLearned, onBack }: Props) {
  const [mode, setMode] = useState<'themes' | 'session'>('themes');
  const [pool, setPool] = useState<VocabWord[]>([]);
  const [queue, setQueue] = useState<VocabWord[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [dir, setDir] = useState<'sr2ru' | 'ru2sr'>('sr2ru');
  const [sessionLearned, setSessionLearned] = useState(0);
  const [reviewIds, setReviewIds] = useState<Set<string>>(new Set());

  const total = pool.length;
  const done = mode === 'session' && queue.length === 0;
  const current = queue[0];

  const startSession = (words: VocabWord[]) => {
    const count = Math.min(
      LESSON_MIN + Math.floor(Math.random() * (LESSON_MAX - LESSON_MIN + 1)),
      words.length
    );
    // сначала невыученные, выученные — добором
    const fresh = shuffle(words.filter((w) => !learnedWords.includes(w.id)));
    const rest = shuffle(words.filter((w) => learnedWords.includes(w.id)));
    const lesson = [...fresh, ...rest].slice(0, count);
    setPool(lesson);
    setQueue(shuffle(lesson));
    setRevealed(false);
    setDir(Math.random() < 0.5 ? 'sr2ru' : 'ru2sr');
    setSessionLearned(0);
    setReviewIds(new Set());
    setMode('session');
  };

  const answer = (known: boolean) => {
    if (!current) return;
    const rest = queue.slice(1);
    if (known) {
      onMarkLearned(current.id);
      setSessionLearned((n) => n + 1);
      setQueue(rest);
    } else {
      setReviewIds((s) => new Set(s).add(current.id));
      const at = Math.min(
        rest.length,
        REINSERT_MIN + Math.floor(Math.random() * (REINSERT_MAX - REINSERT_MIN + 1))
      );
      rest.splice(at, 0, current);
      setQueue(rest);
    }
    setRevealed(false);
    setDir(Math.random() < 0.5 ? 'sr2ru' : 'ru2sr');
  };

  const exitSession = () => {
    setMode('themes');
    setQueue([]);
  };

  const learnedCount = useMemo(() => learnedWords.length, [learnedWords]);

  // ---------------------------------------------------------------- session

  if (mode === 'session' && !done) {
    return (
      <div className="mx-auto flex min-h-100dvh w-full max-w-xl flex-col px-4">
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button
            type="button"
            onClick={exitSession}
            aria-label="Завершить урок"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary cursor-pointer focus-visible:outline-3 focus-visible:outline-[hsl(var(--ring))]"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="h-4 flex-1 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuenow={total ? Math.round(((total - queue.length) / total) * 100) : 0}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-[hsl(var(--primary))] transition-all duration-300"
              style={{
                width: `${total ? ((total - queue.length) / total) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="text-sm font-extrabold text-muted-foreground">
            {total - queue.length}/{total}
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-6">
          <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
            {dir === 'sr2ru' ? 'сербский → русский' : 'русский → сербский'}
          </p>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className={cn(
              'flex min-h-56 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-b-4 border-border bg-card px-6 py-10 text-center',
              revealed && 'cursor-default'
            )}
          >
            <span className="font-display text-3xl leading-snug">
              {current && sr(dir === 'sr2ru' ? current.sr : current.ru, script)}
            </span>
            {revealed && current && (
              <span className="slide-up">
                <span className="block font-display text-2xl text-[hsl(var(--primary))]">
                  {sr(dir === 'sr2ru' ? current.ru : current.sr, script)}
                </span>
                {current.example && (
                  <span className="mt-2 block text-sm font-semibold text-muted-foreground">
                    {sr(current.example, script)}
                  </span>
                )}
              </span>
            )}
            {!revealed && (
              <span className="text-sm font-bold text-muted-foreground">
                Нажми, чтобы увидеть перевод
              </span>
            )}
          </button>
        </div>

        <div className="sticky bottom-0 -mx-4 border-t-2 border-border bg-background px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {revealed ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => answer(false)}
                className="btn-push flex flex-1 items-center justify-center gap-2 border-2 border-[hsl(var(--error))] bg-[hsl(var(--error-bg))] px-6 py-3.5 font-extrabold text-[hsl(var(--error))]"
              >
                <RotateCcw className="h-5 w-5" aria-hidden="true" />
                Не знаю
              </button>
              <button
                type="button"
                onClick={() => answer(true)}
                className="btn-push flex flex-1 items-center justify-center gap-2 bg-[hsl(var(--success))] px-6 py-3.5 font-extrabold text-white"
              >
                <Check className="h-5 w-5" aria-hidden="true" />
                Знаю
              </button>
            </div>
          ) : (
            <p className="text-center font-bold text-muted-foreground">
              Вспомни перевод и нажми на карточку
            </p>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------ session end

  if (mode === 'session' && done) {
    return (
      <div className="mx-auto flex min-h-100dvh w-full max-w-xl flex-col items-center justify-center gap-5 px-6 text-center">
        <BookOpenCheck className="h-16 w-16 text-[hsl(var(--primary))]" aria-hidden="true" />
        <h2 className="font-display text-2xl">Урок завершён!</h2>
        <p className="font-semibold text-muted-foreground">
          Слов в уроке: {total} · отмечено «знаю»: {sessionLearned} · на изучении:{' '}
          {reviewIds.size}
        </p>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            className="btn-push bg-[hsl(var(--primary))] px-6 py-3 text-[hsl(var(--primary-foreground))]"
            onClick={() => startSession(pool)}
          >
            Повторить ещё раз
          </button>
          <button
            type="button"
            className="btn-push bg-secondary px-6 py-3 text-secondary-foreground"
            onClick={exitSession}
          >
            К темам
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------- themes

  return (
    <div className="mx-auto min-h-100dvh w-full max-w-xl px-4 pb-16">
      <header className="sticky top-0 z-40 -mx-4 mb-4 border-b-2 border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="К урокам"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary cursor-pointer focus-visible:outline-3 focus-visible:outline-[hsl(var(--ring))]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg text-[hsl(var(--primary))]">Слова</h1>
          <span className="ml-auto text-sm font-extrabold text-muted-foreground">
            выучено: {learnedCount}
          </span>
        </div>
      </header>

      <button
        type="button"
        onClick={() => startSession(allVocabWords)}
        className="btn-push mb-6 w-full bg-[hsl(var(--primary))] px-6 py-4 text-lg font-extrabold text-[hsl(var(--primary-foreground))]"
      >
        Начать изучение слов
      </button>

      <div className="space-y-2">
        {vocabThemes.map((theme) => {
          const learned = theme.words.filter((w) => learnedWords.includes(w.id)).length;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => startSession(theme.words)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border-2 border-b-4 border-border bg-card px-4 py-3 text-left transition-colors hover:bg-secondary cursor-pointer"
            >
              <span className="min-w-0">
                <span className="block truncate font-bold">{theme.titleRu}</span>
                {theme.description && (
                  <span className="block truncate text-xs text-muted-foreground">
                    {theme.description}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-sm font-extrabold text-muted-foreground">
                {learned}/{theme.words.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
