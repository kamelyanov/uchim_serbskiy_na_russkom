import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, Heart, X } from 'lucide-react';
import type { Script } from '../types';
import type { LessonLocation } from '../data';
import type { Exercise } from '../types';
import { ChoiceExerciseView } from '../components/exercises/ChoiceExercise';
import { BuildExerciseView } from '../components/exercises/BuildExercise';
import { BlankExerciseView } from '../components/exercises/BlankExercise';
import { MatchExerciseView } from '../components/exercises/MatchExercise';
import { Owl } from '../components/Owl';
import { cn } from '@/lib/utils';

interface Props {
  location: LessonLocation;
  script: Script;
  onExit: () => void;
  onComplete: (lessonId: string, xp: number, mistakes: number) => void;
  onOpenGrammar: () => void;
}

const MAX_HEARTS = 5;

export function LessonRunner({ location, script, onExit, onComplete, onOpenGrammar }: Props) {
  const { theme, lessonIndex } = location;
  const lesson = theme.lessons[lessonIndex];
  const exercises: Exercise[] = lesson.exercises;

  const [index, setIndex] = useState(0);
  const [choiceSel, setChoiceSel] = useState<number | null>(null);
  const [buildSel, setBuildSel] = useState<string[]>([]);
  const [blankSel, setBlankSel] = useState<string | null>(null);
  const [checked, setChecked] = useState<'correct' | 'wrong' | null>(null);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [xp, setXp] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [failed, setFailed] = useState(false);
  const exerciseRef = useRef<HTMLDivElement>(null);
  const isFirstExercise = useRef(true);

  // При переходе к следующему упражнению мягко скроллим к его началу,
  // чтобы страница не «прыгала» в самый верх
  useLayoutEffect(() => {
    if (isFirstExercise.current) {
      isFirstExercise.current = false;
      return;
    }
    (document.activeElement as HTMLElement | null)?.blur();
    exerciseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [index]);

  const exercise = exercises[index];
  const progress = (index + (checked ? 1 : 0)) / exercises.length;

  const canCheck = useMemo(() => {
    if (checked !== null) return false;
    if (exercise.type === 'choice') return choiceSel !== null;
    if (exercise.type === 'build') return buildSel.length > 0;
    if (exercise.type === 'blank') return blankSel !== null;
    return false; // match completes automatically
  }, [checked, exercise, choiceSel, buildSel, blankSel]);

  const check = () => {
    let correct = false;
    if (exercise.type === 'choice') correct = choiceSel === exercise.answer;
    if (exercise.type === 'build') correct = buildSel.join(' ') === exercise.sr;
    if (exercise.type === 'blank') correct = blankSel === exercise.answer;
    if (correct) {
      setChecked('correct');
      setXp((x) => x + 10);
    } else {
      setChecked('wrong');
      setMistakes((m) => m + 1);
      const h = hearts - 1;
      setHearts(h);
      if (h <= 0) setFailed(true);
    }
  };

  const next = () => {
    if (index + 1 >= exercises.length) {
      onComplete(lesson.id, xp + 10, mistakes); // +10 completion bonus
      return;
    }
    setIndex((i) => i + 1);
    setChoiceSel(null);
    setBuildSel([]);
    setBlankSel(null);
    setChecked(null);
  };

  const onMatchComplete = (matchMistakes: number) => {
    setChecked('correct');
    setXp((x) => x + (matchMistakes === 0 ? 10 : 5));
  };

  if (failed) {
    return (
      <div className="flex min-h-100dvh flex-col items-center justify-center gap-5 px-6 text-center">
        <Owl size={130} mood="sad" />
        <h2 className="font-display text-2xl">Out of hearts!</h2>
        <p className="text-muted-foreground font-semibold max-w-sm">
          No worries — every mistake is a step forward. Take a breath and try the
          lesson again.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            type="button"
            className="btn-push bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-3"
            onClick={() => {
              setIndex(0);
              setChoiceSel(null);
              setBuildSel([]);
              setBlankSel(null);
              setChecked(null);
              setHearts(MAX_HEARTS);
              setXp(0);
              setMistakes(0);
              setFailed(false);
            }}
          >
            Try again
          </button>
          <button
            type="button"
            className="btn-push bg-secondary text-secondary-foreground px-6 py-3"
            onClick={onExit}
          >
            Back to path
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-100dvh w-full max-w-xl flex-col px-4">
      {/* Top bar */}
      <div className="flex items-center gap-3 pt-4 pb-2">
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit lesson"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary cursor-pointer focus-visible:outline-3 focus-visible:outline-[hsl(var(--ring))]"
        >
          <X className="h-6 w-6" />
        </button>
        <div
          className="h-4 flex-1 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: `hsl(${theme.color})`,
            }}
          />
        </div>
        <div className="flex items-center gap-1 font-extrabold text-[hsl(var(--error))]">
          <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
          <span aria-label={`${hearts} hearts left`}>{hearts}</span>
        </div>
      </div>

      {/* Exercise body */}
      <div ref={exerciseRef} className="flex flex-1 scroll-mt-16 flex-col items-start py-6" key={`${lesson.id}-${index}`}>
        <p className="mb-1 text-xs font-extrabold uppercase tracking-widest" style={{ color: `hsl(${theme.color})` }}>
          {theme.titleRu} · {index + 1}/{exercises.length}
        </p>
        {exercise.type === 'choice' && (
          <ChoiceExerciseView
            exercise={exercise}
            script={script}
            selected={choiceSel}
            onChange={setChoiceSel}
            checked={checked}
          />
        )}
        {exercise.type === 'build' && (
          <BuildExerciseView
            exercise={exercise}
            script={script}
            selected={buildSel}
            onChange={setBuildSel}
            checked={checked}
          />
        )}
        {exercise.type === 'blank' && (
          <BlankExerciseView
            exercise={exercise}
            script={script}
            selected={blankSel}
            onChange={setBlankSel}
            checked={checked}
          />
        )}
        {exercise.type === 'match' && (
          <MatchExerciseView exercise={exercise} script={script} onComplete={onMatchComplete} />
        )}
      </div>

      {/* Bottom action bar */}
      <div
        className={cn(
          'sticky bottom-0 -mx-4 border-t-2 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-colors',
          checked === null && 'border-border bg-background',
          checked === 'correct' && 'border-[hsl(var(--success))] bg-[hsl(var(--success-bg))]',
          checked === 'wrong' && 'border-[hsl(var(--error))] bg-[hsl(var(--error-bg))]'
        )}
      >
        {checked === null ? (
          exercise.type === 'match' ? (
            <p className="text-center font-bold text-muted-foreground">
              Match all the pairs to continue
            </p>
          ) : (
            <button
              type="button"
              className="btn-push w-full bg-[hsl(var(--primary))] px-6 py-3.5 text-[hsl(var(--primary-foreground))]"
              disabled={!canCheck}
              onClick={check}
            >
              Проверить
            </button>
          )
        ) : (
          <div className="slide-up">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  checked === 'correct'
                    ? 'bg-[hsl(var(--success))] text-white'
                    : 'bg-[hsl(var(--error))] text-white'
                )}
              >
                {checked === 'correct' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </span>
              <p
                className={cn(
                  'font-display text-lg',
                  checked === 'correct' ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--error))]'
                )}
              >
                {checked === 'correct' ? 'Отлично!' : 'Не совсем…'}
              </p>
            </div>
            <button
              type="button"
              className={cn(
                'btn-push w-full px-6 py-3.5 text-white',
                checked === 'correct' ? 'bg-[hsl(var(--success))]' : 'bg-[hsl(var(--error))]'
              )}
              onClick={next}
            >
              Продолжить
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={onOpenGrammar}
          className="mx-auto mt-2 flex items-center gap-1.5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Грамматика по теме урока
        </button>
      </div>
    </div>
  );
}
