import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Script } from './types';
import { findLesson, findNextLessonId } from './data';
import { grammarTopicForLesson } from './data/grammar-map';
import { useProgress } from './hooks/useProgress';
import { buildMarathon, type MarathonPlan } from './lib/marathon';
import { Home } from './sections/Home';
import { LessonRunner } from './sections/LessonRunner';
import { MarathonRunner } from './sections/MarathonRunner';
import { SummaryScreen } from './sections/SummaryScreen';
import { GrammarScreen } from './sections/GrammarScreen';
import { VocabScreen } from './sections/VocabScreen';

import { PALETTES, nextPalette, type Palette } from './lib/palettes';

type View = 'home' | 'lesson' | 'marathon' | 'summary' | 'grammar' | 'vocab';

const SCRIPT_KEY = 'ucimo-srpski-script';
const PALETTE_KEY = 'ucimo-srpski-palette';

interface Summary {
  xp: number;
  total: number;
  mistakes: number;
  nextLessonId: string | null;
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [marathon, setMarathon] = useState<MarathonPlan | null>(null);
  const [grammarCtx, setGrammarCtx] = useState<{ topicId?: string } | null>(null);
  const [script, setScript] = useState<Script>(() => {
    const saved = localStorage.getItem(SCRIPT_KEY);
    return saved === 'cyrillic' ? 'cyrillic' : 'latin';
  });
  const { progress, completeLesson, unlockSection, markWordLearned, resetProgress } = useProgress();
  const [palette, setPalette] = useState<Palette>(() => {
    const saved = localStorage.getItem(PALETTE_KEY);
    return PALETTES.includes(saved as Palette) ? (saved as Palette) : 'blue';
  });
  useEffect(() => {
    if (palette === 'blue') document.documentElement.removeAttribute('data-palette');
    else document.documentElement.dataset.palette = palette;
    localStorage.setItem(PALETTE_KEY, palette);
  }, [palette]);
  const togglePalette = useCallback(() => {
    setPalette((p) => nextPalette(p));
  }, []);

  // Позиция скролла на главной: сохраняем при уходе в урок/марафон
  // и восстанавливаем при возврате, чтобы не «прыгать» в самый верх
  const homeScrollY = useRef(0);
  useLayoutEffect(() => {
    if (view === 'home') {
      window.scrollTo(0, homeScrollY.current);
    }
  }, [view]);
  const rememberHomeScroll = useCallback(() => {
    homeScrollY.current = window.scrollY;
  }, []);

  useEffect(() => {
    localStorage.setItem(SCRIPT_KEY, script);
  }, [script]);

  const startLesson = useCallback((lessonId: string) => {
    rememberHomeScroll();
    setActiveLessonId(lessonId);
    setView('lesson');
  }, [rememberHomeScroll]);

  const finishLesson = useCallback(
    (lessonId: string, xp: number, mistakes: number) => {
      completeLesson(lessonId, xp);
      const loc = findLesson(lessonId);
      setSummary({
        xp,
        total: loc ? loc.theme.lessons[loc.lessonIndex].exercises.length : 0,
        mistakes,
        nextLessonId: findNextLessonId([...progress.completedLessons, lessonId]),
      });
      setView('summary');
    },
    [completeLesson, progress.completedLessons]
  );

  const startMarathon = useCallback(
    (sectionIndex: number) => {
      const plan = buildMarathon(sectionIndex, progress.completedLessons);
      if (!plan || plan.exercises.length === 0) return;
      rememberHomeScroll();
      setMarathon(plan);
      setView('marathon');
    },
    [progress.completedLessons, rememberHomeScroll]
  );

  const finishMarathon = useCallback(
    (xp: number, _correct: number, mistakes: number) => {
      if (marathon) {
        const nextLesson = marathon.lessonsToComplete[0];
        if (nextLesson) completeLesson(nextLesson, xp);
        unlockSection(marathon.sectionIndex);
        setSummary({
          xp,
          total: marathon.exercises.length,
          mistakes,
          nextLessonId: findNextLessonId(
            nextLesson ? [...progress.completedLessons, nextLesson] : progress.completedLessons
          ),
        });
      }
      setMarathon(null);
      setView('summary');
    },
    [marathon, completeLesson, unlockSection, progress.completedLessons]
  );

  const openGrammarFromLesson = useCallback(() => {
    const topicId = activeLessonId ? grammarTopicForLesson(activeLessonId) : undefined;
    setGrammarCtx({ topicId });
  }, [activeLessonId]);

  const location = activeLessonId ? findLesson(activeLessonId) : null;
  const summaryNextLoc = summary?.nextLessonId ? findLesson(summary.nextLessonId) : null;

  let content: React.ReactNode;

  if (view === 'marathon' && marathon) {
    content = (
      <MarathonRunner
        key={`${marathon.sectionTitle}-${marathon.exercises.length}`}
        exercises={marathon.exercises}
        sectionTitle={marathon.sectionTitle}
        color={marathon.color}
        colorDeep={marathon.colorDeep}
        script={script}
        onExit={() => {
          setMarathon(null);
          setView('home');
        }}
        onComplete={finishMarathon}
        onOpenGrammar={() => setGrammarCtx({})}
      />
    );
  } else if (view === 'lesson' && location) {
    content = (
      <LessonRunner
        key={activeLessonId}
        location={location}
        script={script}
        onExit={() => setView('home')}
        onComplete={finishLesson}
        onOpenGrammar={openGrammarFromLesson}
      />
    );
  } else if (view === 'summary' && summary) {
    content = (
      <SummaryScreen
        xp={summary.xp}
        total={summary.total}
        mistakes={summary.mistakes}
        streak={progress.streak}
        nextLessonTitle={summaryNextLoc ? summaryNextLoc.theme.lessons[summaryNextLoc.lessonIndex].titleRu : null}
        onContinue={() => {
          setActiveLessonId(null);
          setSummary(null);
          setView('home');
        }}
        onNextLesson={
          summary.nextLessonId
            ? () => {
                setSummary(null);
                startLesson(summary.nextLessonId!);
              }
            : undefined
        }
      />
    );
  } else if (view === 'grammar') {
    content = <GrammarScreen script={script} onBack={() => setView('home')} />;
  } else if (view === 'vocab') {
    content = (
      <VocabScreen
        script={script}
        learnedWords={progress.learnedWords}
        onMarkLearned={markWordLearned}
        onBack={() => setView('home')}
      />
    );
  } else {
    content = (
      <Home
        script={script}
        onToggleScript={() => setScript((s) => (s === 'latin' ? 'cyrillic' : 'latin'))}
        palette={palette}
        onTogglePalette={togglePalette}
        onSelectPalette={setPalette}
        progress={progress}
        onStartLesson={startLesson}
        onStartSection={startMarathon}
        onResetProgress={resetProgress}
        onOpenGrammar={() => setView('grammar')}
        onOpenVocab={() => setView('vocab')}
      />
    );
  }

  return (
    <>
      {content}
      {grammarCtx && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
          <GrammarScreen
            script={script}
            onBack={() => setGrammarCtx(null)}
            initialTopicId={grammarCtx.topicId}
          />
        </div>
      )}
    </>
  );
}
