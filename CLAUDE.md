# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start development server (http://localhost:3000)
- `npm run build` — Production build
- `npm run lint` — Run ESLint

No test framework is configured.

## Architecture

**Multiplica Rapido** is a client-side multiplication practice game built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. There is no backend — all state is persisted to localStorage.

### Screen-based navigation

The app uses a single-page architecture with four screens managed by React state in `src/app/page.tsx` (the central orchestrator). Screens are: `inicio` (home), `configuracion` (settings), `jugando` (playing), `resultados` (results). Each screen is a component in `src/components/`.

### Key patterns

- **All components use `"use client"`** — the entire app is client-rendered.
- **`src/hooks/useGameSettings.ts`** — Custom hook that loads/saves `GameSettings` to localStorage under key `"multiplica-rapido-settings"`. This is the single source of truth for player name, selected tables (1-12), time limit (30/60/90s), high score, and sound preference.
- **`src/lib/sounds.ts`** — Sound effects via Web Audio API with lazy `AudioContext` initialization. No audio files are used.
- **`src/lib/types.ts`** — Shared TypeScript interfaces (`QuestionRecord`).
- **Path alias:** `@/*` maps to `./src/*` (configured in tsconfig.json).

### UI conventions

- Spanish language throughout (component names, UI text, variable names in game logic).
- Gradient backgrounds (purple/pink/orange), rounded corners, shadow styling.
- Custom CSS animations defined in `src/app/globals.css` (bounce-in, shake, pulse-green, fade-in-up, confetti).
- Mobile-first responsive design with specific breakpoints at 480px in globals.css.
