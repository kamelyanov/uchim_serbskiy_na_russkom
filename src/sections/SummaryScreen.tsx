import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Target, Zap } from 'lucide-react';
import { Owl } from '../components/Owl';

interface Props {
  xp: number;
  total: number;
  mistakes: number;
  streak: number;
  /** Название следующего урока, если он есть. */
  nextLessonTitle?: string | null;
  onContinue: () => void;
  /** Переход к следующему уроку без возврата на карту. */
  onNextLesson?: () => void;
}

export function SummaryScreen({ xp, total, mistakes, streak, nextLessonTitle, onContinue, onNextLesson }: Props) {
  const accuracy = Math.max(0, Math.round(((total - mistakes) / total) * 100));
  const perfect = mistakes === 0;

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    confetti({
      particleCount: perfect ? 160 : 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#195736', '#ffbf2e', '#6DBA8D', '#4F86BB', '#EA5150'],
    });
  }, [perfect]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md lg:max-w-none lg:w-1/2 flex-col items-center justify-center gap-6 px-6 text-center">
      <Owl size={140} mood="excited" className="float-slow" />
      <div>
        <h2 className="font-display text-3xl text-[hsl(var(--primary))]">
          {perfect ? 'Идеальный урок!' : 'Урок пройден!'}
        </h2>
        <p className="mt-1 font-bold text-muted-foreground">
          {perfect ? 'Ни одной ошибки. Sjajno!' : 'Так держать — svaka čast!'}
        </p>
      </div>

      <div className="grid w-full grid-cols-3 gap-3 pop-in-stagger">
        <div className="rounded-2xl border-2 border-b-4 border-[hsl(var(--gold-deep))] bg-[hsl(var(--gold))] px-2 py-4">
          <Zap className="mx-auto mb-1 h-6 w-6 fill-[hsl(var(--ink))] text-[hsl(var(--ink))]" />
          <p className="font-display text-xl text-[hsl(var(--ink))]">+{xp}</p>
          <p className="text-xs font-extrabold uppercase tracking-wide text-[hsl(var(--ink))]/75">XP</p>
        </div>
        <div className="rounded-2xl border-2 border-b-4 border-[hsl(210_50%_37%)] bg-[hsl(210_45%_50%)] px-2 py-4 text-white">
          <Target className="mx-auto mb-1 h-6 w-6" />
          <p className="font-display text-xl">{accuracy}%</p>
          <p className="text-xs font-extrabold uppercase tracking-wide text-white/85">Точность</p>
        </div>
        <div className="rounded-2xl border-2 border-b-4 border-[hsl(8_62%_44%)] bg-[hsl(8_68%_58%)] px-2 py-4 text-white">
          <Flame className="mx-auto mb-1 h-6 w-6 fill-current" />
          <p className="font-display text-xl">{streak}</p>
          <p className="text-xs font-extrabold uppercase tracking-wide text-white/85">Серия</p>
        </div>
      </div>

      <button
        type="button"
        className="btn-push w-full bg-[hsl(var(--primary))] px-6 py-4 text-lg text-[hsl(var(--primary-foreground))]"
        onClick={onContinue}
      >
        Продолжить
      </button>

      {onNextLesson && (
        <button
          type="button"
          className="btn-push w-full border-2 border-[hsl(var(--primary))] bg-background px-6 py-3 text-[hsl(var(--primary))]"
          onClick={onNextLesson}
        >
          Следующее задание{nextLessonTitle ? `: ${nextLessonTitle}` : ''} →
        </button>
      )}
    </div>
  );
}
