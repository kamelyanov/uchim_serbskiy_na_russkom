import type { ChoiceExercise, Script } from '../../types';
import { sr } from '../../lib/transliterate';
import { cn } from '@/lib/utils';

interface Props {
  exercise: ChoiceExercise;
  script: Script;
  selected: number | null;
  onChange: (index: number | null) => void;
  /** After checking: index of correct answer; wrong selection gets error style. */
  checked: 'correct' | 'wrong' | null;
  /** Ключи неверно выбранных вариантов — после «Повторить» подсвечены красным. */
  wrongMarks?: string[];
}

export function ChoiceExerciseView({ exercise, script, selected, onChange, checked, wrongMarks }: Props) {
  const display = (text: string, lang: 'ru' | 'sr') =>
    lang === 'sr' ? sr(text, script) : text;

  const prompt = display(exercise.prompt, exercise.promptLang);
  const optionLang = exercise.promptLang === 'sr' ? 'ru' : 'sr';

  return (
    <div className="w-full">
      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
        {exercise.promptLang === 'ru' ? 'Переведите на сербский' : 'Переведите на русский'}
      </p>
      <div className="mb-6 rounded-2xl border-2 border-border bg-card px-4 py-3">
        <p className="font-serifbian text-xl">{prompt}</p>
      </div>
      <div className="grid gap-3 pop-in-stagger">
        {exercise.options.map((opt, i) => {
          const isSelected = selected === i;
          const isAnswer = i === exercise.answer;
          return (
            <button
              key={i}
              type="button"
              disabled={checked !== null}
              onClick={() => onChange(i)}
              className={cn(
                'w-full rounded-2xl border-2 border-b-4 px-4 py-3 text-left font-bold text-lg transition-all duration-150 cursor-pointer focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))]',
                checked === null &&
                  (isSelected
                    ? 'border-[hsl(var(--primary))] bg-[hsl(142_55%_92%)] text-[hsl(var(--primary))]'
                    : 'border-border bg-card hover:bg-secondary active:scale-[0.98]'),
                checked === 'correct' && isAnswer &&
                  'border-[hsl(var(--success))] bg-[hsl(var(--success-bg))] text-[hsl(var(--success))]',
                checked === 'correct' && !isAnswer && 'border-border bg-card opacity-60',
                // правильный ответ при ошибке НЕ подсвечиваем — иначе повторение бессмысленно
                checked === 'wrong' && isSelected && !isAnswer &&
                  'border-[hsl(var(--error))] bg-[hsl(var(--error-bg))] text-[hsl(var(--error))] wiggle',
                wrongMarks?.includes(String(i)) &&
                  'border-[hsl(var(--error))] bg-[hsl(var(--error-bg))] text-[hsl(var(--error))]'
              )}
            >
              {display(opt, optionLang)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
