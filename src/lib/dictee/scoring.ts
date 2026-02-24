import type { DicteeLevel, DicteeWordResult } from "./types";

interface ScoreParams {
  completed: boolean;
  wrongCount: number;       // full errors
  halfCount: number;        // near-misses
  usedFlash: boolean;
  meaningCorrect: boolean | null;
  timeUsed: number;
  timePerWord: number;
  level: DicteeLevel;
}

const LEVEL_MULTIPLIER: Record<DicteeLevel, number> = {
  1: 1.0,
  2: 1.5,
  3: 2.0,
};

export function calculateWordPoints(params: ScoreParams): number {
  const { completed, wrongCount, halfCount, usedFlash, meaningCorrect, timeUsed, timePerWord, level } = params;

  let base = 0;

  if (completed) {
    base += 100;
    if (wrongCount === 0 && halfCount === 0) {
      base += 50; // perfect bonus
    }
    base -= wrongCount * 15;
    base -= halfCount * 5;
    if (usedFlash) base -= 30;
    if (timeUsed > 0 && timeUsed < timePerWord * 0.5) {
      base += 20; // speed bonus
    }
  }
  // Quiz points apply regardless of completion
  if (meaningCorrect === true) base += 25;
  if (meaningCorrect === false) base -= 10;

  // Apply level multiplier
  base = Math.round(base * LEVEL_MULTIPLIER[level]);

  // Never negative
  return Math.max(0, base);
}

export function calculateTotalPoints(results: DicteeWordResult[]): number {
  return results.reduce((sum, r) => sum + r.points, 0);
}
