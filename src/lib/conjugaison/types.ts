export type Pronoun = "je" | "tu" | "il/elle/on" | "nous" | "vous" | "ils/elles";

export type VerbGroup = "1er" | "2eme" | "3eme" | "irregulier";

export interface ConjugaisonVerb {
  infinitive: string;
  group: VerbGroup;
  futureRoot: string;
  conjugations: Record<Pronoun, string>;
  translation: string;
}

export interface ConjugaisonQuestion {
  verb: ConjugaisonVerb;
  pronoun: Pronoun;
  correctAnswer: string;
  options: string[];
}

export interface ConjugaisonQuestionResult {
  question: ConjugaisonQuestion;
  selectedAnswer: string | null;
  correct: boolean;
  timeUsed: number;
  points: number;
}

export type ConjugaisonDifficulty = 1 | 2 | 3;

export const DIFFICULTY_CONFIGS: Record<
  ConjugaisonDifficulty,
  { label: string; timePerQuestion: number; multiplier: number }
> = {
  1: { label: "Fácil", timePerQuestion: 15, multiplier: 1.0 },
  2: { label: "Normal", timePerQuestion: 10, multiplier: 1.5 },
  3: { label: "Rápido", timePerQuestion: 6, multiplier: 2.0 },
};

export type RoundSize = 10 | 20 | 30;
