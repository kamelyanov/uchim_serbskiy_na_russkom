import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, BookOpenCheck, Check, Layers, RotateCcw, X } from 'lucide-react';
import type { Script } from '../types';
import {
  allVocabWords,
  coreVocabThemes,
  coreVocabWords,
  extraVocabThemes,
  extraVocabWords,
  type VocabTheme,
  type VocabWord,
} from '../data/vocab';
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

interface ThemeListProps {
  themes: VocabTheme[];
  learnedWords: string[];
  openThemeId: string | null;
  onToggle: (id: string) => void;
  onStart: (words: VocabWord[]) => void;
  onReview: (words: VocabWord[]) => void;
}

function ThemeList({
  themes,
  learnedWords,
  openThemeId,
  onToggle,
  onStart,
  onReview,
}: ThemeListProps) {
  return (
    <div className="space-y-2">
      {themes.map((theme) => {
        const learned = theme.words.filter((w) => learnedWords.includes(w.id)).length;
        const open = openThemeId === theme.id;
        return (
          <div
            key={theme.id}
            className={cn(
              'overflow-hidden rounded-xl border-2 border-b-4 border-border bg-card transition-colors',
              open && 'border-[hsl(var(--primary))]'
            )}
          >
            <button
              type="button"
              onClick={() => onToggle(theme.id)}
              className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left hover:bg-secondary"
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
            {open && (
              <div className="flex flex-col gap-2 border-t-2 border-border px-4 py-3">
                <button
                  type="button"
                  onClick={() => onStart(theme.words)}
                  className="btn-push bg-[hsl(var(--primary))] px-4 py-2.5 font-extrabold text-[hsl(var(--primary-foreground))]"
                >
                  Начать изучение темы
                </button>
                <button
                  type="button"
                  disabled={learned === 0}
                  onClick={() => onReview(theme.words)}
                  className="btn-push flex items-center justify-center gap-2 border-2 border-[hsl(var(--gold-deep))] bg-[hsl(var(--gold))] px-4 py-2 font-extrabold text-[hsl(var(--ink))] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Повторить выученные слова этой темы ({learned})
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function VocabScreen({ script, learnedWords, onMarkLearned, onBack }: Props) {
  const [mode, setMode] = useState<'themes' | 'session'>('themes');
  const [openThemeId, setOpenThemeId] = useState<string | null>(null);
  const [pool, setPool] = useState<VocabWord[]>([]);
  const [queue, setQueue] = useState<VocabWord[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [dir, setDir] = useState<'sr2ru' | 'ru2sr'>('sr2ru');
  const [sessionLearned, setSessionLearned] = useState(0);
  const [reviewIds, setReviewIds] = useState<Set<string>>(new Set());
  // свайп карточки: вправо — «знаю», влево — «не знаю»
  const [dragX, setDragX] = useState(0);
  const [hintSwipe, setHintSwipe] = useState(false);
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null);
  const dragRef = useRef<{ startX: number; dx: number; moved: boolean } | null>(null);

  const total = pool.length;
  const done = mode === 'session' && queue.length === 0;
  const current = queue[0];

  const startSession = (words: VocabWord[]) => {
    if (!words.length) return;
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
    setDragX(0);
    setHintSwipe(true);
    setMode('session');
  };

  // повторение: в урок попадают только уже выученные слова
  const startReview = (words: VocabWord[]) => {
    const learned = words.filter((w) => learnedWords.includes(w.id));
    if (!learned.length) return;
    startSession(learned);
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
    setDragX(0);
    setExitDir(null);
    setDir(Math.random() < 0.5 ? 'sr2ru' : 'ru2sr');
  };

  const SWIPE_THRESHOLD = 100;
  const TINT_THRESHOLD = 28; // цвет стороны появляется почти сразу при свайпе

  // за порогом карточка начинает растворяться — видно, что можно отпускать
  const tintSide = dragX >= TINT_THRESHOLD ? 'right' : dragX <= -TINT_THRESHOLD ? 'left' : null;
  const swipeSide = dragX >= SWIPE_THRESHOLD ? 'right' : dragX <= -SWIPE_THRESHOLD ? 'left' : null;
  const overshoot = Math.max(0, Math.abs(dragX) - SWIPE_THRESHOLD);
  const flyOpacity = swipeSide ? Math.max(0, 1 - overshoot / (SWIPE_THRESHOLD * 0.5)) : 1;

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, dx: 0, moved: false };
    setHintSwipe(false);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    d.dx = e.clientX - d.startX;
    if (Math.abs(d.dx) > 8) d.moved = true;
    setDragX(d.dx);
  };
  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    if (Math.abs(d.dx) >= SWIPE_THRESHOLD) {
      // карточка «прошла точку переключения»: улетает в сторону свайпа
      const dir = d.dx > 0 ? 'right' : 'left';
      setDragX(d.dx);
      setExitDir(dir);
      window.setTimeout(() => answer(dir === 'right'), 180);
    } else {
      setDragX(0);
    }
  };
  const onCardClick = () => {
    if (dragRef.current?.moved) return;
    setHintSwipe(false);
    setRevealed(true);
  };

  const exitSession = () => {
    setMode('themes');
    setQueue([]);
  };

  const learnedCount = useMemo(() => learnedWords.length, [learnedWords]);

  // ---------------------------------------------------------------- session

  if (mode === 'session' && !done) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-xl lg:max-w-none lg:w-1/2 flex-col px-4">
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
            key={current?.id}
            type="button"
            onClick={onCardClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              dragRef.current = null;
              setDragX(0);
            }}
            className={cn(
              'flex min-h-[268px] w-full cursor-pointer touch-pan-y flex-col items-center justify-center gap-3 rounded-2xl border-2 border-b-4 border-border bg-card px-6 py-10 text-center select-none',
              revealed && 'cursor-default',
              hintSwipe && !revealed && !dragX && 'hint-swipe',
              !exitDir && 'card-enter',
              exitDir ? 'transition-all duration-200 ease-out' : !dragX && 'transition-transform duration-200 ease-out'
            )}
            style={
              exitDir
                ? {
                    transform: `translateX(${exitDir === 'right' ? '130%' : '-130%'}) rotate(${exitDir === 'right' ? 18 : -18}deg)`,
                    opacity: 0,
                  }
                : dragX
                  ? (() => {
                      const side = tintSide;
                      const colorVar = side === 'right' ? 'success' : side === 'left' ? 'error' : null;
                      // 0 → только начало свайпа, 1 → у порога перелёта:
                      // кольцо толще и непрозрачнее, заливка плотнеет
                      const t = Math.min(1, Math.max(0, (Math.abs(dragX) - TINT_THRESHOLD) / (SWIPE_THRESHOLD - TINT_THRESHOLD)));
                      const ringW = 2 + Math.round(t * 3); // 2 → 5px
                      const ringA = 0.35 + t * 0.35;
                      const fillA = t * 0.16;
                      return {
                        transform: `translateX(${dragX}px) rotate(${dragX / 18}deg) scale(${swipeSide ? 0.96 : 1})`,
                        opacity: flyOpacity,
                        boxShadow: colorVar
                          ? [
                              `0 0 0 ${ringW}px hsl(var(--${colorVar}) / ${ringA})`,
                              `inset 0 0 0 9999px hsl(var(--${colorVar}) / ${fillA})`,
                              swipeSide ? `0 6px 16px hsl(var(--${colorVar}) / 0.25)` : '',
                            ]
                              .filter(Boolean)
                              .join(', ')
                          : undefined,
                      };
                    })()
                  : undefined
            }
          >
            <span className="flex flex-1 items-center justify-center overflow-hidden font-display text-3xl leading-snug">
              {current && sr(dir === 'sr2ru' ? current.sr : current.ru, script)}
            </span>
            <span className="flex h-24 w-full flex-col items-center justify-center gap-1 overflow-hidden">
              {revealed && current ? (
                <>
                  <span className="block font-display text-2xl leading-snug text-[hsl(var(--primary))]">
                    {sr(dir === 'sr2ru' ? current.ru : current.sr, script)}
                  </span>
                  {current.example && (
                    <span className="block text-xs font-semibold leading-snug text-muted-foreground">
                      {sr(current.example, script)}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs font-semibold text-muted-foreground/70">
                  Нажми, чтобы увидеть перевод · свайп вправо — знаю, влево — нет
                </span>
              )}
            </span>
          </button>
        </div>

        <div className="sticky bottom-0 -mx-4 bg-background px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
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
            <p className="flex h-[52px] items-center justify-center text-center font-bold text-muted-foreground">
              Вспомни перевод и нажми на карточку
            </p>
          )}
          <div className="mt-4 border-t-2 border-border" aria-hidden="true" />
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------ session end

  if (mode === 'session' && done) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-xl lg:max-w-none lg:w-1/2 flex-col items-center justify-center gap-5 px-6 text-center">
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
    <div className="mx-auto min-h-dvh w-full max-w-xl lg:max-w-none lg:w-1/2 px-4 pb-16">
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
        onClick={() => startSession(coreVocabWords)}
        className="btn-push mb-3 w-full bg-[hsl(var(--primary))] px-6 py-4 text-lg font-extrabold text-[hsl(var(--primary-foreground))]"
      >
        Начать изучение слов
      </button>

      {openThemeId === null && learnedCount > 0 && (
        <button
          type="button"
          onClick={() => startReview(allVocabWords)}
          className="btn-push mb-6 flex w-full items-center justify-center gap-2 border-2 border-[hsl(var(--gold-deep))] bg-[hsl(var(--gold))] px-6 py-2.5 font-extrabold text-[hsl(var(--ink))]"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Повторить выученные слова из разных тем
        </button>
      )}
      {openThemeId !== null && <div className="mb-3" />}

      <ThemeList
        themes={coreVocabThemes}
        learnedWords={learnedWords}
        openThemeId={openThemeId}
        onToggle={(id) => setOpenThemeId(openThemeId === id ? null : id)}
        onStart={startSession}
        onReview={startReview}
      />

      {extraVocabThemes.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 rounded-xl border-2 border-b-4 border-border bg-card px-4 py-4">
            <h2 className="flex items-center gap-2 font-display text-lg text-[hsl(var(--primary))]">
              <Layers className="h-5 w-5" aria-hidden="true" />
              Ещё больше слов
            </h2>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              Дополнительные {extraVocabWords.length.toLocaleString('ru-RU')} слов сверх ядра —
              по тем же темам. Здесь редкие и узкие слова, к ним стоит переходить, когда
              освоены основные.
            </p>
            <button
              type="button"
              onClick={() => startSession(extraVocabWords)}
              className="btn-push mt-3 w-full bg-secondary px-4 py-2.5 font-extrabold text-secondary-foreground"
            >
              Учить слова из «Ещё больше слов»
            </button>
          </div>
          <ThemeList
            themes={extraVocabThemes}
            learnedWords={learnedWords}
            openThemeId={openThemeId}
            onToggle={(id) => setOpenThemeId(openThemeId === id ? null : id)}
            onStart={startSession}
            onReview={startReview}
          />
        </section>
      )}
    </div>
  );
}
