import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, Heart, X } from 'lucide-react';
import type { Script } from '../types';
import type { LessonLocation } from '../data';
import type { Exercise } from '../types';
import { ChoiceExerciseView } from '../components/exercises/ChoiceExercise';
import { BuildExerciseView } from '../components/exercises/BuildExercise';
import { BlankExerciseView } from '../components/exercises/BlankExercise';
import { MatchExerciseView } from '../components/exercises/MatchExercise';
import { Owl } from '../components/Owl';
import { TipsSheet } from '../components/TipsSheet';
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

  // Очередь упражнений: индексы в порядке прохождения. Упражнение, решённое
  // не с первого раза, возвращается в конец очереди и повторяется, пока не
  // будет решено без ошибок.
  const [plan, setPlan] = useState<number[]>(() => exercises.map((_, i) => i));
  const [completed, setCompleted] = useState(0);
  const [requeued, setRequeued] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [choiceSel, setChoiceSel] = useState<number | null>(null);
  const [buildSel, setBuildSel] = useState<string[]>([]);
  const [blankSel, setBlankSel] = useState<string | null>(null);
  const [checked, setChecked] = useState<'correct' | 'wrong' | null>(null);
  // Ключи неверных ответов текущей попытки — подсвечены красным и копятся,
  // пока упражнение не будет решено верно
  const [wrongMarks, setWrongMarks] = useState<string[]>([]);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [xp, setXp] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [failed, setFailed] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const exerciseRef = useRef<HTMLDivElement>(null);
  const isFirstExercise = useRef(true);
  const nextTimer = useRef<number | null>(null);

  // При выходе из урока гасим таймер автоперехода, чтобы не вызвать
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
  }, [completed, attempt]);

  const exerciseIndex = plan[0];
  const exercise = exercises[exerciseIndex];
  const totalUnits = exercises.length + requeued;
  const progress = (completed + (checked ? 1 : 0)) / totalUnits;

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
      // С первого раза — полный XP, после ошибок — урезанный
      setXp((x) => x + (wrongMarks.length ? 5 : 10));
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

  // «Повторить»: то же задание сначала; неверные ответы остаются подсвечены красным
  const retry = () => {
    setChoiceSel(null);
    setBuildSel([]);
    setBlankSel(null);
    setChecked(null);
    setAttempt((a) => a + 1);
  };

  const next = () => {
    const redo = wrongMarks.length > 0;
    if (plan.length === 1 && !redo) {
      onComplete(lesson.id, xp + 10, mistakes); // +10 completion bonus
      return;
    }
    setCompleted((c) => c + 1);
    if (redo) {
      // ошибся — упражнение уходит в конец урока
      setPlan((p) => [...p.slice(1), p[0]]);
      setRequeued((r) => r + 1);
    } else {
      setPlan((p) => p.slice(1));
    }
    setChoiceSel(null);
    setBuildSel([]);
    setBlankSel(null);
    setChecked(null);
    setWrongMarks([]);
    setAttempt((a) => a + 1);
  };

  const onMatchComplete = (matchMistakes: number) => {
    setChecked('correct');
    setXp((x) => x + (matchMistakes === 0 ? 10 : 5));
    // Ошибки в парах — как неверный ответ: упражнение уйдёт в конец урока
    if (matchMistakes > 0) setWrongMarks(['match']);
    nextTimer.current = window.setTimeout(next, 500);
  };

  if (failed) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
        <Owl size={130} mood="sad" />
        <h2 className="font-display text-2xl">Жизни закончились!</h2>
        <p className="text-muted-foreground font-semibold max-w-sm">
          Не переживай — каждая ошибка приближает к цели. Выдохни и попробуй
          пройти урок ещё раз.
        </p>
        <button
          type="button"
          onClick={() => setTipsOpen(true)}
          className="flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl border-2 border-b-4 px-4 py-3 text-left transition-colors"
          style={{
            borderColor: `hsl(${theme.colorDeep})`,
            backgroundColor: `hsl(${theme.color})`,
          }}
        >
          <BookOpen className="h-5 w-5 shrink-0 text-white" aria-hidden="true" />
          <span className="text-sm leading-tight font-extrabold text-white">
            Кажется, стоит повторить справочник: «{theme.titleRu}»
          </span>
        </button>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            type="button"
            className="btn-push bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-3"
            onClick={() => {
              setPlan(exercises.map((_, i) => i));
              setCompleted(0);
              setRequeued(0);
              setAttempt(0);
              setChoiceSel(null);
              setBuildSel([]);
              setBlankSel(null);
              setChecked(null);
              setWrongMarks([]);
              setHearts(MAX_HEARTS);
              setXp(0);
              setMistakes(0);
              setFailed(false);
            }}
          >
            Попробовать снова
          </button>
          <button
            type="button"
            className="btn-push bg-secondary text-secondary-foreground px-6 py-3"
            onClick={onExit}
          >
            Назад к урокам
          </button>
        </div>
        {tipsOpen && <TipsSheet theme={theme} script={script} onClose={() => setTipsOpen(false)} />}
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
          aria-label="Выйти из урока"
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
          <span aria-label={`Осталось жизней: ${hearts}`}>{hearts}</span>
        </div>
      </div>

      {/* Exercise body */}
      <div className="mx-auto w-full lg:w-[600px]">
        <div ref={exerciseRef} className="flex scroll-mt-16 flex-col items-start py-6" key={`${lesson.id}-${exerciseIndex}-${attempt}`}>
        <p className="mb-1 text-xs font-extrabold uppercase tracking-widest" style={{ color: `hsl(${theme.color})` }}>
          {theme.titleRu} · {completed + 1}/{totalUnits}
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
              onClick={checked === 'wrong' ? retry : next}
              disabled={checked === 'correct'}
            >
              {checked === 'correct' ? 'Отлично!' : checked === 'wrong' ? 'Повторить' : 'Продолжить'}
            </button>
          )}
          <button
            type="button"
            onClick={onOpenGrammar}
            className="mx-auto mt-3 flex items-center gap-1.5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Грамматика по теме урока
          </button>
        </div>
      </div>
    </div>
  );
}
