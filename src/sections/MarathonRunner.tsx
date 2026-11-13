import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, Heart, X, Zap } from 'lucide-react';
import type { Script } from '../types';
import type { Exercise } from '../types';
import { ChoiceExerciseView } from '../components/exercises/ChoiceExercise';
import { BuildExerciseView } from '../components/exercises/BuildExercise';
import { BlankExerciseView } from '../components/exercises/BlankExercise';
import { MatchExerciseView } from '../components/exercises/MatchExercise';
import { Owl } from '../components/Owl';
import { cn } from '@/lib/utils';

const MAX_HEARTS = 5;

interface Props {
  exercises: Exercise[];
  sectionTitle: string;
  color: string;
  colorDeep: string;
  script: Script;
  onExit: () => void;
  onComplete: (xp: number, correct: number, mistakes: number) => void;
  onOpenGrammar: () => void;
}

export function MarathonRunner({
  exercises,
  sectionTitle,
  color,
  colorDeep,
  script,
  onExit,
  onComplete,
  onOpenGrammar,
}: Props) {
  const [index, setIndex] = useState(0);
  const [choiceSel, setChoiceSel] = useState<number | null>(null);
  const [buildSel, setBuildSel] = useState<string[]>([]);
  const [blankSel, setBlankSel] = useState<string | null>(null);
  const [checked, setChecked] = useState<'correct' | 'wrong' | null>(null);
  const [wrongMarks, setWrongMarks] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [failed, setFailed] = useState(false);
  const exerciseRef = useRef<HTMLDivElement>(null);
  const isFirstExercise = useRef(true);
  const nextTimer = useRef<number | null>(null);

  // При выходе из марафона гасим таймер автоперехода, чтобы не вызвать
  // переход/завершение уже на другом экране
  useEffect(
    () => () => {
      if (nextTimer.current !== null) window.clearTimeout(nextTimer.current);
    },
    []
  );

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
      setWrongMarks([]);
      setXp((x) => x + 10);
      setCorrectCount((c) => c + 1);
      // Автопереход: «Проверить» + «Продолжить» в один клик
      nextTimer.current = window.setTimeout(next, 500);
    } else {
      setChecked('wrong');
      setWrongMarks((m) => [
        ...m,
        exercise.type === 'choice' ? String(choiceSel) : exercise.type === 'blank' ? blankSel! : buildSel.join(' '),
      ]);
      setMistakes((m) => m + 1);
      const h = hearts - 1;
      setHearts(h);
      if (h <= 0) setFailed(true);
    }
  };

  // «Повторить»: то же задание сначала, неверный выбор остаётся подсвечен красным
  const retry = () => {
    setChoiceSel(null);
    setBuildSel([]);
    setBlankSel(null);
    setChecked(null);
  };

  const next = () => {
    if (index + 1 >= exercises.length) {
      onComplete(xp + 10, correctCount, mistakes); // +10 completion bonus
      return;
    }
    setIndex((i) => i + 1);
    setChoiceSel(null);
    setBuildSel([]);
    setBlankSel(null);
    setChecked(null);
    setWrongMarks([]);
  };

  const onMatchComplete = (matchMistakes: number) => {
    if (matchMistakes === 0) {
      setChecked('correct');
      setXp((x) => x + 10);
      setCorrectCount((c) => c + 1);
      // Автопереход, как после «Проверить» с верным ответом
      nextTimer.current = window.setTimeout(next, 500);
    } else {
      setChecked('wrong');
      setMistakes((m) => m + matchMistakes);
      const h = Math.max(0, hearts - matchMistakes);
      setHearts(h);
      if (h <= 0) setFailed(true);
      // Пары уже соединены — повторить нельзя, переходим дальше сами
      nextTimer.current = window.setTimeout(next, 1500);
    }
  };

  if (failed) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
        <Owl size={130} mood="sad" />
        <h2 className="font-display text-2xl">Кажется, вам нужно повторить материал</h2>
        <p className="max-w-sm font-semibold text-muted-foreground">
          Жизни закончились. Повторите материал справочника и попробуйте пройти марафон ещё раз.
        </p>
        <button
          type="button"
          className="btn-push w-full max-w-xs bg-[hsl(var(--primary))] px-6 py-3 text-[hsl(var(--primary-foreground))]"
          onClick={onExit}
        >
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl lg:max-w-none lg:w-[900px] flex-col px-4">
      {/* Top bar */}
      <div className="flex items-center gap-3 pt-4 pb-2">
        <button
          type="button"
          onClick={onExit}
          aria-label="Выйти из марафона"
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
            style={{ width: `${progress * 100}%`, backgroundColor: `hsl(${color})` }}
          />
        </div>
        <div className="flex items-center gap-1 font-extrabold" style={{ color: `hsl(${colorDeep})` }}>
          <Zap className="h-5 w-5 fill-current" aria-hidden="true" />
          {xp}
        </div>
        <div className="flex items-center gap-1 font-extrabold text-[hsl(var(--error))]">
          <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
          <span aria-label={`Осталось жизней: ${hearts}`}>{hearts}</span>
        </div>
      </div>

      {/* Exercise body */}
      <div className="mx-auto w-full lg:w-[600px]">
        <div ref={exerciseRef} className="flex scroll-mt-16 flex-col items-start py-6" key={`marathon-${index}`}>
        <p
          className="mb-1 text-xs font-extrabold uppercase tracking-widest"
          style={{ color: `hsl(${color})` }}
        >
          Marathon · {sectionTitle} · {index + 1}/{exercises.length}
        </p>
        {exercise.type === 'choice' && (
          <ChoiceExerciseView
            exercise={exercise}
            script={script}
            selected={choiceSel}
            onChange={setChoiceSel}
            checked={checked}
            wrongMarks={wrongMarks}
          />
        )}
        {exercise.type === 'build' && (
          <BuildExerciseView
            exercise={exercise}
            script={script}
            selected={buildSel}
            onChange={setBuildSel}
            checked={checked}
            wrongMarks={wrongMarks}
          />
        )}
        {exercise.type === 'blank' && (
          <BlankExerciseView
            exercise={exercise}
            script={script}
            selected={blankSel}
            onChange={setBlankSel}
            checked={checked}
            wrongMarks={wrongMarks}
          />
        )}
        {exercise.type === 'match' && (
          <MatchExerciseView exercise={exercise} script={script} onComplete={onMatchComplete} />
        )}
        </div>
      </div>

      {/* Spacer: прижимает нижний блок к низу даже на коротких заданиях */}
      <div className="flex-1" />

      {/* Bottom: проверка/фидбек + грамматика, приколочены к низу экрана */}
      <div className="sticky bottom-0 -mx-4 border-t-2 border-border bg-background px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full lg:w-[600px]">
          {/* Фидбек занимает место всегда — кнопка не прыгает при появлении */}
          <div className="mb-3 flex min-h-[32px] items-center">
            {checked !== null && (
              <div className="slide-up flex items-center gap-2">
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
            )}
          </div>
          {checked === null ? (
            exercise.type === 'match' ? (
              <p className="flex min-h-[52px] items-center justify-center text-center font-bold text-muted-foreground">
                Соедините все пары, чтобы продолжить
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
            <button
              type="button"
              className={cn(
                'btn-push w-full px-6 py-3.5 text-white',
                checked === 'correct' ? 'bg-[hsl(var(--success))]' : 'bg-[hsl(var(--error))]'
              )}
              onClick={checked === 'wrong' && exercise.type !== 'match' ? retry : next}
              disabled={checked === 'correct'}
            >
              {checked === 'correct'
                ? 'Отлично!'
                : checked === 'wrong' && exercise.type !== 'match'
                  ? 'Повторить'
                  : 'Продолжить'}
            </button>
          )}
          <button
            type="button"
            onClick={onOpenGrammar}
            className="mx-auto mt-3 flex items-center gap-1.5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Грамматика
          </button>
        </div>
      </div>
    </div>
  );
}
