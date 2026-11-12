import { useMemo, useState } from 'react';
import {
  MessageCircle, MapPin, UserRound, Users, Building2, HeartHandshake,
  Gamepad2, UtensilsCrossed, PawPrint, Apple, Heart, LifeBuoy, Sparkles,
  Shirt, CalendarDays, Plane, BedDouble, Building, GraduationCap, Coffee,
  MessagesSquare, ShoppingCart, Cake, Truck, Stethoscope, TreePine, Landmark,
  Palmtree, ShoppingBag, Trophy, Briefcase, Bird, Music, CloudSun, Map,
  Star, Lock, Check, Flame, Zap, BookOpen, House, Languages, FileText,
  PartyPopper, Clapperboard, CalendarClock, ChefHat, Baby, ClipboardList,
  Newspaper, Drama, History, Award, ThumbsUp, Wand2, SprayCan, Tent,
  Wallet, ScrollText, Recycle, Luggage, Phone, Repeat, Medal, Wrench,
  Compass, Mic, HeartPulse, Share2, Clock, Camera, Navigation,
  Palette as PaletteIcon,
  Handshake, Smile, Laugh, Mountain, Tv, CalendarCheck, Megaphone, Quote,
  Lightbulb, HeartCrack, Target, KeyRound, Thermometer, Boxes, Scale,
  ClipboardCheck, Sprout, Route, Gavel, CloudRain, Flag, Shield, Radio,
  ThumbsDown, Swords, CloudLightning, Brain, HelpCircle, BadgeCheck, Ban,
  Feather, Percent, Globe, Home as HomeIcon, Play, RotateCcw,
  BookMarked, Library,
  type LucideIcon,
} from 'lucide-react';
import type { Progress, Script, Theme } from '../types';
import { sections, findLesson, findNextLessonId, firstIncompleteInSection } from '../data';
import { sr } from '../lib/transliterate';
import { TipsSheet } from '../components/TipsSheet';
import { Owl } from '../components/Owl';
import { useIsMobile } from '../hooks/use-mobile';
import { PALETTE_NAMES, PALETTE_SWATCH, PALETTES, nextPalette, type Palette } from '../lib/palettes';
import { cn } from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = {
  MessageCircle, MapPin, UserRound, Users, Building2, HeartHandshake,
  Gamepad2, UtensilsCrossed, PawPrint, Apple, Heart, LifeBuoy, Sparkles,
  Shirt, CalendarDays, Plane, BedDouble, Building, GraduationCap, Coffee,
  MessagesSquare, ShoppingCart, Cake, Truck, Stethoscope, TreePine, Landmark,
  Palmtree, ShoppingBag, Trophy, Briefcase, Bird, Music, CloudSun, Map,
  House, Languages, FileText, PartyPopper, Clapperboard, CalendarClock,
  ChefHat, Baby, ClipboardList, Newspaper, Drama, History, Award, ThumbsUp,
  Wand2, SprayCan, Tent,
  Wallet, ScrollText, Recycle, Luggage, Phone, Repeat, Medal, Wrench,
  Compass, Mic, HeartPulse, Share2, Clock, Camera, Navigation,
  Palette: PaletteIcon,
  Handshake, Smile, Laugh, Mountain, Tv, CalendarCheck, Megaphone, Quote,
  Lightbulb, HeartCrack, Target, KeyRound, Thermometer, Boxes, Scale,
  ClipboardCheck, Sprout, Route, Gavel, CloudRain, Flag, Shield, Radio,
  ThumbsDown, Swords, CloudLightning, Brain, HelpCircle, BadgeCheck, Ban,
  Feather, Percent, Globe, HomeIcon, Play,
};

// Zigzag offsets for the lesson nodes (Duolingo-style winding path).
const OFFSETS = [0, 44];

interface Props {
  script: Script;
  onToggleScript: () => void;
  palette: Palette;
  onTogglePalette: () => void;
  onSelectPalette: (palette: Palette) => void;
  progress: Progress;
  onStartLesson: (lessonId: string) => void;
  onStartSection: (sectionIndex: number) => void;
  onResetProgress: () => void;
  onOpenGrammar: () => void;
  onOpenVocab: () => void;
  onOpenReading: () => void;
}

export function Home({ script, onToggleScript, palette, onTogglePalette, onSelectPalette, progress, onStartLesson, onStartSection, onResetProgress, onOpenGrammar, onOpenVocab, onOpenReading }: Props) {
  const [tipsTheme, setTipsTheme] = useState<Theme | null>(null);
  const isMobile = useIsMobile();

  const nextLessonId = useMemo(
    () => findNextLessonId(progress.completedLessons),
    [progress.completedLessons]
  );

  const isUnlocked = (lessonId: string): boolean => {
    // unlocked if it is the next lesson in the global path
    if (lessonId === nextLessonId) return true;
    // or if its section was unlocked via a marathon — but only the first
    // incomplete lesson of that section, not all of them
    const loc = findLesson(lessonId);
    if (loc == null) return false;
    const sectionId = loc.sectionIndex + 1;
    if (!progress.unlockedSections.includes(sectionId)) return false;
    return lessonId === firstIncompleteInSection(sectionId, progress.completedLessons);
  };

  const totalLessons = useMemo(
    () => sections.reduce((n, s) => n + s.units.reduce((m, u) => m + u.lessons.length, 0), 0),
    []
  );

  return (
    <div className="mx-auto min-h-dvh w-full max-w-xl lg:max-w-none lg:w-1/2 px-4 pb-24">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 -mx-4 border-b-2 border-border bg-background/95 px-4 py-2 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Наверх"
              title="Наверх"
              className="flex min-w-0 cursor-pointer items-center gap-2 rounded-full transition-transform hover:scale-105 focus-visible:outline-3 focus-visible:outline-[hsl(var(--ring))]"
            >
              <Owl size={32} />
              <span
                className="truncate font-narrow text-[24px] font-semibold uppercase leading-none tracking-tight text-[hsl(var(--primary))] sm:text-[32px]"
                title="Učimo srpski znajući ruski"
              >
                Učimo srpski znajući ruski
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1 font-extrabold text-[hsl(var(--gold-deep))]" title="Streak">
              <Flame className="h-5 w-5 fill-current" aria-hidden="true" />
              {progress.streak}
            </span>
            <span className="flex items-center gap-1 font-extrabold text-[hsl(var(--primary))]" title="Total XP">
              <Zap className="h-5 w-5 fill-current" aria-hidden="true" />
              {progress.xp}
            </span>
            <button
              type="button"
              onClick={onTogglePalette}
              aria-label={`Цветовая гамма: ${PALETTE_NAMES[palette]}. Нажми, чтобы переключить`}
              title={`Гамма: ${PALETTE_NAMES[palette]} → ${PALETTE_NAMES[nextPalette(palette)]}`}
              className="btn-push bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
            >
              <PaletteIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onToggleScript}
              aria-label="Переключить латиницу / кириллицу"
              className="btn-push bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
              title="Латиница / кириллица"
            >
              <span className="flex items-center gap-1 leading-none">
                <span className={cn(script === 'latin' ? 'text-sm font-extrabold' : 'text-[10px] font-bold text-muted-foreground/60')}>ĆL</span>
                <span className="text-[10px] text-muted-foreground/60" aria-hidden="true">↔</span>
                <span className={cn(script === 'cyrillic' ? 'text-sm font-extrabold' : 'text-[10px] font-bold text-muted-foreground/60')}>ЋЛ</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs: dictionary & grammar (main menu only) */}
      <div className="sticky top-[calc(3rem+2px)] z-30 -mx-4 flex gap-2 border-b-2 border-border bg-background/95 px-4 py-1 backdrop-blur">
        <button
          type="button"
          onClick={onOpenVocab}
          className="group flex flex-1 cursor-pointer items-center justify-center gap-1.5 py-0.5"
        >
          <span className="rounded-lg bg-secondary p-1.5 text-secondary-foreground transition-colors group-hover:bg-muted">
            <BookMarked className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Слова</span>
        </button>
        <button
          type="button"
          onClick={onOpenGrammar}
          className="group flex flex-1 cursor-pointer items-center justify-center gap-1.5 py-0.5"
        >
          <span className="rounded-lg bg-secondary p-1.5 text-secondary-foreground transition-colors group-hover:bg-muted">
            <Library className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Грамматика</span>
        </button>
        <button
          type="button"
          onClick={onOpenReading}
          className="group flex flex-1 cursor-pointer items-center justify-center gap-1.5 py-0.5"
        >
          <span className="rounded-lg bg-secondary p-1.5 text-secondary-foreground transition-colors group-hover:bg-muted">
            <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Чтение</span>
        </button>
      </div>

      {sections.map((section) => (
        <div key={section.id} className="mt-8">
          {/* Section banner */}
          {section.units.length > 0 ? (
            <div className="mb-6 rounded-2xl border-2 border-b-4 px-5 py-4 text-white"
              style={{
                backgroundColor: `hsl(${section.units[0].color})`,
                borderColor: `hsl(${section.units[0].colorDeep})`,
              }}
            >
              <p className="text-xs font-extrabold uppercase tracking-widest text-white/85">
                {section.titleRu} · CEFR {section.cefr}
              </p>
              <p className="font-display text-lg leading-snug">{section.descriptionRu}</p>
              <button
                type="button"
                onClick={() => onStartSection(section.index)}
                className="btn-push mt-3 flex items-center gap-1.5 bg-white px-4 py-2 text-sm font-extrabold uppercase tracking-wide"
                style={{ color: `hsl(${section.units[0].colorDeep})` }}
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                Начать этот модуль
              </button>
            </div>
          ) : (
            <div className="mb-4 rounded-2xl border-2 border-dashed border-border bg-secondary/40 px-5 py-4">
              <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                {section.titleRu} · CEFR {section.cefr} · Скоро
              </p>
              <p className="font-display text-base text-muted-foreground">{section.descriptionRu}</p>
            </div>
          )}

          {/* Units */}
          {section.units.map((unit) => {
            const Icon = ICONS[unit.icon] ?? Star;
            const completedCount = unit.lessons.filter((l) =>
              progress.completedLessons.includes(l.id)
            ).length;
            const unitDone = completedCount === unit.lessons.length;
            return (
              <div key={unit.id} className="mb-10">
                {/* Unit header */}
                <div
                  className="mb-6 flex items-center justify-between gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 text-white"
                  style={{
                    backgroundColor: `hsl(${unit.color})`,
                    borderColor: `hsl(${unit.colorDeep})`,
                  }}
                >
                  <div className="min-w-0">
                    <p className="font-display text-lg leading-tight">{unit.titleRu}</p>
                    <p className="truncate text-sm font-bold text-white/85">
                      {sr(unit.titleSr, script)} · {completedCount}/{unit.lessons.length}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTipsTheme(unit)}
                    className="btn-push flex shrink-0 items-center gap-1.5 bg-white px-3 py-2 text-sm"
                    style={{ color: `hsl(${unit.colorDeep})` }}
                    aria-label={`Справочник: ${unit.titleRu}`}
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    Справочник
                  </button>
                </div>

                {/* Lesson nodes */}
                <div className="flex flex-col items-center gap-8 pt-5">
                  {unit.lessons.map((lesson, li) => {
                    const done = progress.completedLessons.includes(lesson.id);
                    const unlocked = isUnlocked(lesson.id);
                    const clickable = done || unlocked;
                    const isNext = lesson.id === nextLessonId;
                    const offset = (isMobile ? [0, 20] : OFFSETS)[li % OFFSETS.length] * (li % 4 < 2 ? 1 : -1);
                    return (
                      <div
                        key={lesson.id}
                        className={cn('flex items-center gap-3', offset < 0 && 'flex-row-reverse')}
                        style={{ transform: `translateX(${offset}px)` }}
                      >
                        <button
                          type="button"
                          disabled={!clickable}
                          onClick={() => clickable && onStartLesson(lesson.id)}
                          title={done ? 'Пройдено — нажми, чтобы повторить' : undefined}
                          aria-label={`${lesson.titleRu}${done ? ' (пройден, нажми чтобы повторить)' : unlocked ? '' : ' (заблокирован)'}`}
                          className={cn(
                            'group relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-b-6 transition-all duration-150 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[hsl(var(--ring))]',
                            done &&
                              'cursor-pointer border-[hsl(var(--gold-deep))] bg-[hsl(var(--gold))] text-[hsl(var(--ink))] hover:brightness-105 active:translate-y-1 active:border-b-2',
                            !done && unlocked &&
                              'cursor-pointer text-white hover:brightness-105 active:translate-y-1 active:border-b-2',
                            !clickable &&
                              'cursor-not-allowed border-[hsl(110_10%_70%)] bg-[hsl(110_12%_82%)] text-[hsl(110_8%_55%)]',
                            isNext && 'star-pop'
                          )}
                          style={
                            !done && unlocked
                              ? {
                                  backgroundColor: `hsl(${unit.color})`,
                                  borderColor: `hsl(${unit.colorDeep})`,
                                }
                              : undefined
                          }
                        >
                          {done ? (
                            <Check className="h-8 w-8" strokeWidth={3.5} />
                          ) : unlocked ? (
                            <Icon className="h-8 w-8" />
                          ) : (
                            <Lock className="h-7 w-7" />
                          )}
                          {isNext && (
                            <span
                              className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-xl border-2 border-b-4 bg-card px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide whitespace-nowrap"
                              style={{
                                color: `hsl(${unit.colorDeep})`,
                                borderColor: `hsl(${unit.color})`,
                              }}
                            >
                              Старт
                            </span>
                          )}
                        </button>
                        <span
                          className={cn(
                            'max-w-[160px] text-sm font-bold leading-tight sm:max-w-[200px]',
                            done && 'text-muted-foreground',
                            !unlocked && 'text-muted-foreground/60'
                          )}
                        >
                          {lesson.titleRu} / {sr(lesson.titleSr, script)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {unitDone && (
                  <p className="mt-4 text-center text-sm font-extrabold text-[hsl(var(--gold-deep))]">
                    Раздел пройден! ★
                  </p>
                )}
              </div>
            );
          })}

          {/* Planned units for coming-soon sections */}
          {section.units.length === 0 && section.plannedUnits && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {section.plannedUnits.map((u, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-xl border-2 border-dashed border-border px-3.5 py-2.5 text-muted-foreground"
                >
                  <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="text-sm font-bold">{u.titleRu}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Footer stats */}
      <footer className="mt-10 border-t-2 border-border pt-6 text-center">
        <p className="text-sm font-bold text-muted-foreground">
          {progress.completedLessons.length}/{totalLessons} уроков пройдено ·{' '}
          {progress.xp} XP · серия {progress.streak} дн.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Прогресс сохраняется только в этом браузере.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Сбросить весь прогресс? Это удалит уроки, XP и серию, сохранённые в этом браузере.')) {
              onResetProgress();
            }
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-border px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Сбросить прогресс
        </button>

        {/* Palette picker */}
        <div className="mt-6 border-t-2 border-border pt-4">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
            Цветовая гамма
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {PALETTES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onSelectPalette(p)}
                aria-pressed={palette === p}
                aria-label={PALETTE_NAMES[p]}
                title={PALETTE_NAMES[p]}
                className={cn(
                  'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition-all',
                  palette === p
                    ? 'scale-110 border-[hsl(var(--primary))]'
                    : 'border-transparent hover:scale-105'
                )}
              >
                <span
                  className="h-5 w-5 rounded-full border border-black/15"
                  style={{
                    background: `linear-gradient(90deg, ${PALETTE_SWATCH[p][0]} 50%, ${PALETTE_SWATCH[p][1]} 50%)`,
                  }}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>
      </footer>

      {tipsTheme && (
        <TipsSheet theme={tipsTheme} script={script} onClose={() => setTipsTheme(null)} />
      )}
    </div>
  );
}
