export interface DicteeWord {
  word: string;       // Palabra a deletrear: "cactus", "ramasser", "lançons"
  article?: string;   // Pista mostrada: "le", "la", "l'", "nous", ""
  translation: string;        // Traducción correcta en español: "el cactus"
  altTranslations: string[];  // 3 alternativas incorrectas: ["la rosa", "el pino", "la hoja"]
}

export interface DicteeGroup {
  label: string;       // Flexible: "s", "ss (entre 2 voyelles)", "Terrestres", "1er grupo -er"
  words: DicteeWord[];
}

export interface DicteeLesson {
  id: string;          // "le-son-s", "les-transports", "verbes-1er-groupe"
  title: string;       // Título libre
  description: string; // Descripción corta en español
  emoji: string;
  groups: DicteeGroup[];
}

export interface WrongGuess {
  letter: string;
  half: boolean; // true = near-miss (right base letter, wrong accent) → costs 0.5 life
}

export type DicteeLevel = 1 | 2 | 3;

export const LEVEL_CONFIGS: Record<DicteeLevel, { label: string; timePerWord: number; timePerQuiz: number }> = {
  1: { label: "Débutant", timePerWord: 40, timePerQuiz: 15 },
  2: { label: "Intermédiaire", timePerWord: 24, timePerQuiz: 10 },
  3: { label: "Expert", timePerWord: 16, timePerQuiz: 7 },
};

export interface DicteeWordResult {
  word: DicteeWord;
  rule: string;             // label del grupo
  wrongGuesses: WrongGuess[];
  completed: boolean;       // true si completó antes de perder vidas
  meaningCorrect: boolean | null; // null si no se mostró quiz
  usedFlash: boolean;             // true si usó flash en esta palabra
  timeUsed: number;               // segundos que tardó
  points: number;                 // puntos obtenidos en esta palabra
}
