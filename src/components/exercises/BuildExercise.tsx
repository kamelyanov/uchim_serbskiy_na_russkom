import { useEffect, useMemo, useState } from 'react';
import type { BuildExercise, Script } from '../../types';
import { sr } from '../../lib/transliterate';
import { cn } from '@/lib/utils';

interface Props {
  exercise: BuildExercise;
  script: Script;
  selected: string[];
  onChange: (words: string[]) => void;
  checked: 'correct' | 'wrong' | null;
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function BuildExerciseView({ exercise, script, selected, onChange, checked }: Props) {
  const solutionWords = useMemo(() => exercise.sr.split(' '), [exercise.sr]);
  // Bank tiles: solution words + distractors, shuffled once per exercise.
  const bank = useMemo(
    () => shuffled([...solutionWords, ...exercise.extra]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercise]
  );

  // Track which bank indexes are used, so duplicate words work.
  const [usedIdx, setUsedIdx] = useState<number[]>([]);

  useEffect(() => {
    setUsedIdx([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise]);

  const pick = (bankIndex: number) => {
    if (checked !== null) return;
    const word = bank[bankIndex];
    const nextUsed = [...usedIdx, bankIndex];
    setUsedIdx(nextUsed);
    onChange([...selected, word]);
  };

  const unpick = (selIndex: number) => {
    if (checked !== null) return;
    const nextSel = selected.filter((_, i) => i !== selIndex);
    // remove the usedIdx entry that corresponds to this selected index
    const nextUsed = usedIdx.filter((_, i) => i !== selIndex);
    setUsedIdx(nextUsed);
    onChange(nextSel);
  };

  return (
    <div className="w-full">
      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
        Соберите сербское предложение
      </p>
      <div className="mb-6 rounded-2xl border-2 border-border bg-card px-4 py-3">
        <p className="font-serifbian text-xl">{exercise.ru}</p>
      </div>

      {/* Answer area */}
      <div
        className={cn(
          'mb-6 flex min-h-[64px] flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed px-3 py-3 transition-colors',
          checked === null && 'border-border bg-secondary/40',
          checked === 'correct' && 'border-[hsl(var(--success))] bg-[hsl(var(--success-bg))]',
          checked === 'wrong' && 'border-[hsl(var(--error))] bg-[hsl(var(--error-bg))]'
        )}
        aria-label="Your answer"
      >
        {selected.length === 0 && (
          <span className="text-muted-foreground font-semibold px-1">
            Нажимайте на слова ниже…
          </span>
        )}
        {selected.map((w, i) => (
          <button
            key={`${w}-${i}`}
            type="button"
            onClick={() => unpick(i)}
            disabled={checked !== null}
            className="tile pop-in border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
          >
            {sr(w, script)}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2">
        {bank.map((w, i) => {
          const usedCount = usedIdx.filter((u) => u === i).length;
          const used = usedCount > 0;
          return (
            <button
              key={`${w}-${i}`}
              type="button"
              className="tile pop-in"
              style={{ animationDelay: `${i * 0.04}s` }}
              disabled={used || checked !== null}
              onClick={() => pick(i)}
            >
              {sr(w, script)}
            </button>
          );
        })}
      </div>

      {checked === 'wrong' && (
        <p className="mt-4 font-bold text-[hsl(var(--error))]">
          Правильный ответ: <span className="font-serifbian">{sr(exercise.sr, script)}</span>
        </p>
      )}
    </div>
  );
}
