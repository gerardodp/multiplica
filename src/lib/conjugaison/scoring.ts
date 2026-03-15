import type { ConjugaisonDifficulty, ConjugaisonQuestionResult } from "./types";
import { DIFFICULTY_CONFIGS } from "./types";

export function getStreakMultiplier(streak: number): number {
  if (streak >= 10) return 3.0;
  if (streak >= 5) return 2.0;
  if (streak >= 3) return 1.5;
  return 1.0;
}

export function calculateQuestionPoints(params: {
  correct: boolean;
  timeUsed: number;
  timePerQuestion: number;
  difficulty: ConjugaisonDifficulty;
  streak: number;
}): number {
  if (!params.correct) return 0;

  const { timeUsed, timePerQuestion, difficulty, streak } = params;

  let points = 100;

  // Speed bonus: answered in less than 30% of available time
  if (timeUsed < timePerQuestion * 0.3) {
    points += 50;
  }

  // Streak multiplier
  points = Math.round(points * getStreakMultiplier(streak));

  // Difficulty multiplier
  points = Math.round(points * DIFFICULTY_CONFIGS[difficulty].multiplier);

  return points;
}

export function calculateTotalPoints(
  results: ConjugaisonQuestionResult[]
): number {
  return results.reduce((sum, r) => sum + r.points, 0);
}
