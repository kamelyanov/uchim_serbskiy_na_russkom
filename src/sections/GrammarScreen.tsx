import { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import type { Script } from '../types';
import { grammarSections, type GrammarBlock } from '../data/grammar';
import { sr } from '../lib/transliterate';

interface Props {
  script: Script;
  onBack: () => void;
}

function Block({ block, script }: { block: GrammarBlock; script: Script }) {
  if (block.type === 'p') {
    return <p className="mb-3 leading-relaxed">{sr(block.text, script)}</p>;
  }
  if (block.type === 'note') {
    return (
      <div className="mb-4 rounded-xl border-2 border-[hsl(var(--primary)/0.35)] bg-[hsl(var(--primary)/0.08)] px-4 py-3 leading-relaxed">
        {sr(block.text, script)}
      </div>
    );
  }
  if (block.type === 'table') {
    return (
      <div className="mb-4 overflow-x-auto rounded-xl border-2 border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-secondary">
              {block.header.map((h, i) => (
                <th
                  key={i}
                  className="border-b-2 border-border px-3 py-2 text-left font-extrabold whitespace-nowrap"
                >
                  {sr(h, script)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri} className="odd:bg-secondary/40">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="border-t border-border px-3 py-2 align-top whitespace-nowrap"
                  >
                    {sr(cell, script)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  // examples
  return (
    <ul className="mb-4 space-y-1.5">
      {block.items.map((ex, i) => (
        <li key={i} className="leading-relaxed">
          <span className="font-bold">{sr(ex.sr, script)}</span>
          {ex.ru && <span className="text-muted-foreground"> — {ex.ru}</span>}
        </li>
      ))}
    </ul>
  );
}

export function GrammarScreen({ script, onBack }: Props) {
  const [tocOpen, setTocOpen] = useState(true);

  const scrollToTopic = (topicId: string) => {
    setTocOpen(false);
    // даём React отрисовать список статей перед скроллом
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById(`grammar-topic-${topicId}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  return (
    <div className="mx-auto min-h-100dvh w-full max-w-xl px-4 pb-16">
      {/* Sticky header */}
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
          <h1 className="flex items-center gap-2 font-display text-lg text-[hsl(var(--primary))]">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
            Грамматика
          </h1>
          <button
            type="button"
            onClick={() => setTocOpen((v) => !v)}
            className="btn-push ml-auto bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
          >
            {tocOpen ? 'Скрыть' : 'Оглавление'}
          </button>
        </div>
      </header>

      {/* Оглавление по секциям */}
      {tocOpen && (
        <nav className="mb-8 space-y-4">
          {grammarSections.map((section) => (
            <div key={section.id}>
              <p className="mb-1.5 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                {section.titleRu}
              </p>
              <div className="overflow-hidden rounded-xl border-2 border-border">
                {section.topics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => scrollToTopic(topic.id)}
                    className="flex w-full items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-left text-sm font-bold transition-colors first:border-t-0 hover:bg-secondary cursor-pointer"
                  >
                    {topic.titleRu}
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      )}

      {/* Статьи */}
      {grammarSections.map((section) => (
        <div key={section.id} className="mb-6">
          <h2 className="mb-4 border-b-2 border-border pb-2 font-display text-xl text-[hsl(var(--primary))]">
            {section.titleRu}
          </h2>
          {section.topics.map((topic) => (
            <article
              key={topic.id}
              id={`grammar-topic-${topic.id}`}
              className="mb-8 scroll-mt-20"
            >
              <h3 className="mb-3 font-display text-lg">{topic.titleRu}</h3>
              {topic.blocks.map((block, i) => (
                <Block key={i} block={block} script={script} />
              ))}
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}
