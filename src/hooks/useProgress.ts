import { useCallback, useEffect, useState } from 'react';
import type { Progress } from '../types';

const KEY = 'ucimo-srpski-progress-v1';

const DEFAULT_PROGRESS: Progress = {
  completedLessons: [],
  xp: 0,
  streak: 0,
  lastPlayed: '',
  unlockedSections: [1],
};

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
      // storage unavailable — progress is session-only
    }
  }, [progress]);

  const completeLesson = useCallback((lessonId: string, xpEarned: number) => {
    setProgress((p) => {
      const already = p.completedLessons.includes(lessonId);
      const today = todayStr();
      let streak = p.streak;
      if (p.lastPlayed !== today) {
        streak = p.lastPlayed === yesterdayStr() ? p.streak + 1 : 1;
      }
      return {
        ...p,
        completedLessons: already
          ? p.completedLessons
          : [...p.completedLessons, lessonId],
        xp: p.xp + xpEarned,
        streak,
        lastPlayed: today,
      };
    });
  }, []);

  const unlockSection = useCallback((sectionIndex: number) => {
    setProgress((p) =>
      p.unlockedSections.includes(sectionIndex)
        ? p
        : { ...p, unlockedSections: [...p.unlockedSections, sectionIndex] }
    );
  }, []);

  const resetProgress = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // storage unavailable — nothing to clear
    }
    setProgress(DEFAULT_PROGRESS);
  }, []);

  const isCompleted = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  return { progress, completeLesson, unlockSection, isCompleted, resetProgress };
}
