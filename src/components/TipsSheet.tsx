import { X } from 'lucide-react';
import type { Script, Theme } from '../types';
import { sr } from '../lib/transliterate';
import { Owl } from './Owl';

interface Props {
  theme: Theme;
  script: Script;
  onClose: () => void;
}

export function TipsSheet({ theme, script, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Справочник: ${theme.titleRu}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="slide-up flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-background sm:rounded-3xl">
        <div
          className="flex items-center justify-between gap-3 px-5 py-4"
          style={{ backgroundColor: `hsl(${theme.color})` }}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/25 p-1.5">
              <Owl size={36} />
            </div>
            <div>
              <p className="font-display text-white text-lg leading-tight">{theme.titleRu}</p>
              <p className="text-white/85 text-sm font-bold">{sr(theme.titleSr, script)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/35 cursor-pointer focus-visible:outline-3 focus-visible:outline-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
            Справочник по грамматике
          </p>
          {theme.tips.map((tip, i) => (
            <section key={i} className={i > 0 ? 'mt-7' : ''}>
              <h3 className="font-display text-lg mb-2 text-[hsl(var(--foreground))]">
                {tip.heading}
              </h3>
              {tip.paragraphs.map((p, j) => (
                <p key={j} className="mb-2 text-[15px] leading-relaxed text-[hsl(var(--foreground))]/90">
                  {p}
                </p>
              ))}
              {tip.examples.length > 0 && (
                <div className="mt-3 overflow-hidden rounded-xl border-2 border-border">
                  {tip.examples.map((ex, j) => (
                    <div
                      key={j}
                      className={`grid grid-cols-1 gap-0.5 px-4 py-2.5 sm:grid-cols-2 sm:gap-3 ${
                        j % 2 === 0 ? 'bg-card' : 'bg-secondary/50'
                      }`}
                    >
                      <span className="font-serifbian">{sr(ex.sr, script)}</span>
                      <span className="text-muted-foreground">{ex.ru}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
