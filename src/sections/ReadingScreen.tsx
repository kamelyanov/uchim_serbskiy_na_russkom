import { useState } from 'react';
import { ArrowLeft, BookOpen, X } from 'lucide-react';
import type { Script } from '../types';
import { readingTexts, lookupWord, type ReadingText } from '../data/reading';
import { sr as srTrans } from '../lib/transliterate';

interface Props {
  script: Script;
  onBack: () => void;
}

interface Banner {
  word: string;
  dict: string | null;
  paragraphRu: string;
}

/** Абзац: подзаголовки — строки без знака препинания; слова кликабельны. */
function Paragraph({
  lines,
  script,
  onWord,
}: {
  lines: { sr: string; ru: string; heading: boolean }[];
  script: Script;
  onWord: (word: string, sentenceRu: string) => void;
}) {
  const renderWords = (text: string, sentenceRu: string) =>
    text.split(/(\s+)/).map((part, i) =>
      /^\s+$/.test(part) ? (
        <span key={i}>{' '}</span>
      ) : (
        <button
          key={i}
          type="button"
          onClick={() => onWord(part, sentenceRu)}
          className="inline cursor-pointer rounded px-0.5 text-left transition-colors hover:bg-[hsl(var(--secondary))] focus-visible:outline-2 focus-visible:outline-[hsl(var(--ring))]"
        >
          {srTrans(part, script)}
        </button>
      )
    );

  return (
    <div className="mb-4">
      {lines.map((line, i) =>
        line.heading ? (
          <h2
            key={i}
            className="mt-6 mb-3 font-display text-xl text-[hsl(var(--primary))] first:mt-0"
          >
            {renderWords(line.sr, line.ru)}
          </h2>
        ) : (
          <p key={i} className="inline text-lg leading-relaxed font-semibold">
            {renderWords(line.sr, line.ru)}{' '}
          </p>
        )
      )}
    </div>
  );
}

function TextView({
  text,
  script,
  onBack,
}: {
  text: ReadingText;
  script: Script;
  onBack: () => void;
}) {
  const [banner, setBanner] = useState<Banner | null>(null);

  const onWord = (word: string, paragraphRu: string) => {
    setBanner({ word, dict: lookupWord(text.dict, word), paragraphRu });
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-xl lg:max-w-none lg:w-1/2 px-4 pb-16">
      <header className="sticky top-0 z-40 -mx-4 mb-4 border-b-2 border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="К списку текстов"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary cursor-pointer focus-visible:outline-3 focus-visible:outline-[hsl(var(--ring))]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="min-w-0 truncate font-display text-lg text-[hsl(var(--primary))]">
            {text.titleRu}
          </h1>
        </div>
      </header>

      <div className="pb-24">
        {text.paragraphs.map((p, pi) => (
          <Paragraph key={pi} lines={p.lines} script={script} onWord={onWord} />
        ))}
      </div>

      {banner && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-label={`Перевод: ${banner.word}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setBanner(null);
          }}
        >
          <div className="slide-up w-full max-w-lg rounded-t-3xl border-t-2 border-border bg-background px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-xl text-[hsl(var(--primary))]">
                  {srTrans(banner.word, script)}
                </p>
                {banner.dict ? (
                  <p className="mt-1 text-base font-bold">{banner.dict}</p>
                ) : (
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">
                    В словаре не найдено — посмотри перевод абзаца ниже
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setBanner(null)}
                aria-label="Закрыть"
                className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {banner.paragraphRu && (
              <div className="rounded-xl bg-secondary px-4 py-3">
                <p className="text-sm leading-snug font-semibold text-secondary-foreground">
                  {banner.paragraphRu}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ReadingScreen({ script, onBack }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = readingTexts.find((t) => t.id === activeId) ?? null;

  if (active) {
    return <TextView text={active} script={script} onBack={() => setActiveId(null)} />;
  }

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
          <h1 className="font-display text-lg text-[hsl(var(--primary))]">Чтение</h1>
        </div>
      </header>

      {readingTexts.length === 0 ? (
        <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-5 text-center">
          <BookOpen className="h-16 w-16 text-[hsl(var(--primary))]" aria-hidden="true" />
          <h2 className="font-display text-2xl">Здесь будут тексты для чтения</h2>
          <p className="max-w-sm font-semibold text-muted-foreground">
            Короткие сербские тексты с переводом по предложениям — скоро.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {readingTexts.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 border-b-4 border-border bg-card px-4 py-3 text-left transition-colors hover:bg-secondary"
            >
              <BookOpen className="h-5 w-5 shrink-0 text-[hsl(var(--primary))]" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block truncate font-bold">{t.titleRu}</span>
                <span className="block text-xs font-semibold text-muted-foreground">
                  {t.paragraphs.length} абз.
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
