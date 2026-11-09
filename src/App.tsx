import { useCallback, useEffect, useState } from 'react';
import type { Script } from './types';
import { findLesson } from './data';
import { useProgress } from './hooks/useProgress';
import { buildMarathon, type MarathonPlan } from './lib/marathon';
import { Home } from './sections/Home';
import { LessonRunner } from './sections/LessonRunner';
import { MarathonRunner } from './sections/MarathonRunner';
import { SummaryScreen } from './sections/SummaryScreen';

type View = 'home' | 'lesson' | 'marathon' | 'summary';

const SCRIPT_KEY = 'ucimo-srpski-script';

interface Summary {
  xp: number;
  total: number;
  mistakes: number;
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [marathon, setMarathon] = useState<MarathonPlan | null>(null);
  const [script, setScript] = useState<Script>(() => {
    const saved = localStorage.getItem(SCRIPT_KEY);
    return saved === 'cyrillic' ? 'cyrillic' : 'latin';
  });
  const { progress, completeLesson, resetProgress } = useProgress();

  useEffect(() => {
    localStorage.setItem(SCRIPT_KEY, script);
  }, [script]);

  const startLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
    setView('lesson');
  }, []);

  const finishLesson = useCallback(
    (lessonId: string, xp: number, mistakes: number) => {
      completeLesson(lessonId, xp);
      const loc = findLesson(lessonId);
      setSummary({
        xp,
        total: loc ? loc.theme.lessons[loc.lessonIndex].exercises.length : 0,
        mistakes,
      });
      setView('summary');
    },
    [completeLesson]
  );

  const startMarathon = useCallback(
    (sectionIndex: number) => {
      const plan = buildMarathon(sectionIndex, progress.completedLessons);
      if (!plan || plan.exercises.length === 0) return;
      setMarathon(plan);
      setView('marathon');
    },
    [progress.completedLessons]
  );

  const finishMarathon = useCallback(
    (xp: number, _correct: number, mistakes: number) => {
      if (marathon) {
        const nextLesson = marathon.lessonsToComplete[0];
        if (nextLesson) completeLesson(nextLesson, xp);
        setSummary({ xp, total: marathon.exercises.length, mistakes });
      }
      setMarathon(null);
      setView('summary');
    },
    [marathon, completeLesson]
  );

  const location = activeLessonId ? findLesson(activeLessonId) : null;

  if (view === 'marathon' && marathon) {
    return (
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
      />
    );
  }

  if (view === 'lesson' && location) {
    return (
      <LessonRunner
        key={activeLessonId}
        location={location}
        script={script}
        onExit={() => setView('home')}
        onComplete={finishLesson}
      />
    );
  }

  if (view === 'summary' && summary) {
    return (
      <SummaryScreen
        xp={summary.xp}
        total={summary.total}
        mistakes={summary.mistakes}
        streak={progress.streak}
        onContinue={() => {
          setActiveLessonId(null);
          setSummary(null);
          setView('home');
        }}
      />
    );
  }

  return (
    <Home
      script={script}
      onToggleScript={() => setScript((s) => (s === 'latin' ? 'cyrillic' : 'latin'))}
      progress={progress}
      onStartLesson={startLesson}
      onStartSection={startMarathon}
      onResetProgress={resetProgress}
    />
  );
}
