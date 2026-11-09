# Učimo Srpski — Learn Serbian

**Live:** https://kamelyanov.github.io/ucimo_srpski/

A Duolingo-style web app for learning Serbian with text-only exercises, organized
theme by theme following the Duolingo course section plan (English↔Russian plan,
adapted to Serbian).

## What is inside

- **Sections 1–2 fully playable** (CEFR Intro + A1): 35 units, 70 lessons,
  ~420 exercises. Sections 3–8 follow the Duolingo plan as coming-soon units.
- **4 exercise types** (no voice/sound): multiple-choice translation (both
  directions), word-bank sentence building, fill-in-the-blank, matching pairs.
- **Grammar tips per unit** (guidebook style): Serbian rules explained in
  English with example tables — open via the "Tips" button on each unit.
- **Latinica / Ćirilica toggle**: all Serbian content converts between scripts
  (deterministic transliteration).
- **Gamification**: XP, streak, hearts (5 per lesson), completion summary with
  confetti. Progress is saved in the browser's localStorage (this browser only —
  clearing browser data resets it).
- **PWA**: installable, offline-capable static assets, custom owl icon.

## Tech

React + TypeScript + Vite + Tailwind CSS. Fonts: Dela Gothic One (display),
Manrope (body, full Latin Extended + Cyrillic coverage).

## Run

```bash
npm install
npm run dev    # development
npm run build  # production build to dist/
```

## Deploy

Every push to `main` is built and published to GitHub Pages automatically via
`.github/workflows/deploy.yml` (Pages source must be set to "GitHub Actions" in
repo settings).
