import { useEffect, useMemo, useState } from 'react';
import type { MatchExercise, Script } from '../../types';
import { sr } from '../../lib/transliterate';
import { cn } from '@/lib/utils';

interface Props {
  exercise: MatchExercise;
  script: Script;
  /** Fires once when all pairs are matched. mistakes = number of wrong taps. */
  onComplete: (mistakes: number) => void;
  /** Parent listens for mismatch count changes (for XP calc). */
  onMistakes?: (mistakes: number) => void;
}

interface Card {
  id: string;
  pairIndex: number;
  side: 'sr' | 'ru';
  text: string;
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MatchExerciseView({ exercise, script, onComplete, onMistakes }: Props) {
  const cards = useMemo<Card[]>(() => {
    const all: Card[] = [];
    exercise.pairs.forEach((p, i) => {
      all.push({ id: `sr-${i}`, pairIndex: i, side: 'sr', text: p.sr });
      all.push({ id: `ru-${i}`, pairIndex: i, side: 'ru', text: p.ru });
    });
    // shuffle each side separately so the grid has a Serbian and a Russian column
    const srs = shuffled(all.filter((c) => c.side === 'sr'));
    const rus = shuffled(all.filter((c) => c.side === 'ru'));
    const out: Card[] = [];
    for (let i = 0; i < srs.length; i++) {
      out.push(srs[i], rus[i]);
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setSelectedId(null);
    setMatched(new Set());
    setWrongIds(new Set());
    setMistakes(0);
    setDone(false);
  }, [exercise]);

  const tap = (card: Card) => {
    if (done || matched.has(card.pairIndex) || wrongIds.has(card.id)) return;
    if (selectedId === null) {
      setSelectedId(card.id);
      return;
    }
    if (selectedId === card.id) {
      setSelectedId(null);
      return;
    }
    const first = cards.find((c) => c.id === selectedId);
    if (!first) {
      setSelectedId(card.id);
      return;
    }
    if (first.side === card.side) {
      // switch selection within same column
      setSelectedId(card.id);
      return;
    }
    if (first.pairIndex === card.pairIndex) {
      const next = new Set(matched);
      next.add(card.pairIndex);
      setMatched(next);
      setSelectedId(null);
      if (next.size === exercise.pairs.length) {
        setDone(true);
        setTimeout(() => onComplete(mistakes), 450);
      }
    } else {
      const m = mistakes + 1;
      setMistakes(m);
      onMistakes?.(m);
      setWrongIds(new Set([first.id, card.id]));
      setSelectedId(null);
      setTimeout(() => setWrongIds(new Set()), 450);
    }
  };

  return (
    <div className="w-full">
      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
        Соедините пары
      </p>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, i) => {
          const isMatched = matched.has(card.pairIndex);
          const isSelected = selectedId === card.id;
          const isWrong = wrongIds.has(card.id);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => tap(card)}
              className={cn(
                'tile w-full pop-in text-base px-2 py-3',
                isSelected &&
                  'border-[hsl(var(--primary))] bg-[hsl(142_55%_92%)] text-[hsl(var(--primary))]',
                isWrong &&
                  'border-[hsl(var(--error))] bg-[hsl(var(--error-bg))] text-[hsl(var(--error))] wiggle',
                isMatched &&
                  'border-[hsl(var(--success))] bg-[hsl(var(--success-bg))] text-[hsl(var(--success))] opacity-0 pointer-events-none transition-opacity duration-300'
              )}
              style={{ animationDelay: `${i * 0.05}s` }}
              aria-pressed={isSelected}
            >
              {card.side === 'sr' ? sr(card.text, script) : card.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
