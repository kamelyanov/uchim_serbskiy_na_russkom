import type { BlankExercise, Script } from '../../types';
import { sr } from '../../lib/transliterate';
import { cn } from '@/lib/utils';

interface Props {
  exercise: BlankExercise;
  script: Script;
  selected: string | null;
  onChange: (value: string | null) => void;
  checked: 'correct' | 'wrong' | null;
}

export function BlankExerciseView({ exercise, script, selected, onChange, checked }: Props) {
  return (
    <div className="w-full">
      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
        Вставьте пропущенное слово
      </p>
      <p className="mb-4 text-muted-foreground font-semibold">{exercise.ru}</p>

      <div className="mb-8 rounded-2xl border-2 border-border bg-card px-4 py-5">
        <p className="font-serifbian text-2xl leading-relaxed">
          {sr(exercise.before, script)}
          <span
            className={cn(
              'mx-1 inline-block min-w-[72px] rounded-lg border-b-4 px-2 text-center align-baseline',
              selected
                ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                : 'border-border text-transparent',
              checked === 'correct' && 'border-[hsl(var(--success))] text-[hsl(var(--success))]',
              checked === 'wrong' && 'border-[hsl(var(--error))] text-[hsl(var(--error))]'
            )}
          >
            {selected ? sr(selected, script) : 'blank'}
          </span>
          {sr(exercise.after, script)}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pop-in-stagger">
        {exercise.options.map((opt) => {
          const isSelected = selected === opt;
          const isAnswer = opt === exercise.answer;
          return (
            <button
              key={opt}
              type="button"
              disabled={checked !== null}
              onClick={() => onChange(opt)}
              className={cn(
                'tile px-5 py-3 text-lg',
                checked === null && isSelected &&
                  'border-[hsl(var(--primary))] bg-[hsl(142_55%_92%)] text-[hsl(var(--primary))]',
                checked === 'correct' && isAnswer &&
                  'border-[hsl(var(--success))] bg-[hsl(var(--success-bg))] text-[hsl(var(--success))]',
                checked === 'correct' && !isAnswer && 'opacity-60',
                checked === 'wrong' && isAnswer &&
                  'border-[hsl(var(--success))] bg-[hsl(var(--success-bg))] text-[hsl(var(--success))]',
                checked === 'wrong' && isSelected && !isAnswer &&
                  'border-[hsl(var(--error))] bg-[hsl(var(--error-bg))] text-[hsl(var(--error))] wiggle',
                checked === 'wrong' && !isSelected && !isAnswer && 'opacity-60'
              )}
            >
              {sr(opt, script)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
