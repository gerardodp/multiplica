"use client";

import { useState, useCallback, useMemo } from "react";
import type { DicteeLesson, DicteeWord, DicteeWordResult, WrongGuess } from "@/lib/dictee/types";

const MAX_LIVES = 6;

interface FlatWord {
  word: DicteeWord;
  rule: string;
}

/** Map accented chars to their base letter */
const ACCENT_TO_BASE: Record<string, string> = {
  "é": "e", "è": "e", "ê": "e", "ë": "e",
  "à": "a", "â": "a",
  "ù": "u", "û": "u",
  "î": "i", "ï": "i",
  "ô": "o",
  "ç": "c",
};

function getBaseChar(ch: string): string {
  return ACCENT_TO_BASE[ch] ?? ch;
}

/** Check if two chars share the same base letter but differ in accent */
function isNearMiss(guessed: string, expected: string): boolean {
  if (guessed === expected) return false;
  return getBaseChar(guessed) === getBaseChar(expected);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function flattenAndShuffle(lesson: DicteeLesson): FlatWord[] {
  const flat: FlatWord[] = [];
  for (const group of lesson.groups) {
    for (const word of group.words) {
      flat.push({ word, rule: group.label });
    }
  }
  return shuffleArray(flat);
}

/** Returns indices of letter positions (skipping non-letter chars like hyphens, apostrophes) */
function getLetterIndices(word: string): number[] {
  const indices: number[] = [];
  for (let i = 0; i < word.length; i++) {
    if (/[a-zA-ZÀ-ÿ]/.test(word[i])) {
      indices.push(i);
    }
  }
  return indices;
}

function computeLives(wrongGuesses: WrongGuess[], flashPenalty: number): number {
  let penalty = flashPenalty;
  for (const g of wrongGuesses) {
    penalty += g.half ? 0.5 : 1;
  }
  return MAX_LIVES - penalty;
}

export type GuessResult = "correct" | "near-miss" | "wrong" | null;

export function useDicteeGame(lesson: DicteeLesson) {
  const allWords = useMemo(() => flattenAndShuffle(lesson), [lesson]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [filledLetters, setFilledLetters] = useState<Record<number, string>>({});
  const [wrongGuesses, setWrongGuesses] = useState<WrongGuess[]>([]);
  const [cursorPos, setCursorPos] = useState(0);
  const [results, setResults] = useState<DicteeWordResult[]>([]);
  const [wordComplete, setWordComplete] = useState(false);
  const [finished, setFinished] = useState(false);
  const [lastWrongLetter, setLastWrongLetter] = useState<string | null>(null);
  const [lastGuessType, setLastGuessType] = useState<GuessResult>(null);
  const [usedFlash, setUsedFlash] = useState(false);
  const [flashPenalty, setFlashPenalty] = useState(0);

  const currentFlatWord = allWords[currentIndex] as FlatWord | undefined;
  const currentWord = currentFlatWord?.word;
  const currentRule = currentFlatWord?.rule ?? "";
  const lives = computeLives(wrongGuesses, flashPenalty);
  const totalWords = allWords.length;

  const letterIndices = useMemo(
    () => (currentWord ? getLetterIndices(currentWord.word) : []),
    [currentWord]
  );

  const cursorCharIndex = letterIndices[cursorPos] ?? -1;

  const guessLetter = useCallback(
    (letter: string) => {
      if (wordComplete || finished || !currentWord) return;

      const lowerLetter = letter.toLowerCase();
      const expectedChar = currentWord.word[cursorCharIndex]?.toLowerCase();

      if (!expectedChar) return;

      if (lowerLetter === expectedChar) {
        // Exact match — fill position and advance
        const newFilled = { ...filledLetters, [cursorCharIndex]: currentWord.word[cursorCharIndex] };
        setFilledLetters(newFilled);
        setLastGuessType("correct");
        setLastWrongLetter(null);

        const nextPos = cursorPos + 1;
        if (nextPos >= letterIndices.length) {
          setWordComplete(true);
          setResults((prev) => [
            ...prev,
            {
              word: currentWord,
              rule: currentRule,
              wrongGuesses,
              completed: true,
              meaningCorrect: null,
              usedFlash,
              timeUsed: 0,
              points: 0,
            },
          ]);
        } else {
          setCursorPos(nextPos);
        }
      } else {
        // Check near-miss (same base letter, wrong accent)
        const half = isNearMiss(lowerLetter, expectedChar);
        const newWrong: WrongGuess = { letter: lowerLetter, half };
        const newWrongList = [...wrongGuesses, newWrong];
        setWrongGuesses(newWrongList);
        setLastWrongLetter(lowerLetter);
        setLastGuessType(half ? "near-miss" : "wrong");
        setTimeout(() => {
          setLastWrongLetter(null);
          setLastGuessType(null);
        }, 800);

        const newLives = computeLives(newWrongList, flashPenalty);
        if (newLives <= 0) {
          setWordComplete(true);
          setResults((prev) => [
            ...prev,
            {
              word: currentWord,
              rule: currentRule,
              wrongGuesses: newWrongList,
              completed: false,
              meaningCorrect: null,
              usedFlash,
              timeUsed: 0,
              points: 0,
            },
          ]);
        }
      }
    },
    [wordComplete, finished, currentWord, currentRule, cursorCharIndex, cursorPos, letterIndices.length, filledLetters, wrongGuesses, flashPenalty, usedFlash]
  );

  const forceFailWord = useCallback(() => {
    if (wordComplete || finished || !currentWord) return;
    setWordComplete(true);
    setResults((prev) => [
      ...prev,
      {
        word: currentWord,
        rule: currentRule,
        wrongGuesses,
        completed: false,
        meaningCorrect: null,
        usedFlash,
        timeUsed: 0,
        points: 0,
      },
    ]);
  }, [wordComplete, finished, currentWord, currentRule, wrongGuesses, usedFlash]);

  const activateFlash = useCallback((): boolean => {
    if (usedFlash || wordComplete || finished) return false;
    const newPenalty = flashPenalty + 2;
    setFlashPenalty(newPenalty);
    setUsedFlash(true);

    // Check if lives gone after flash
    const newLives = computeLives(wrongGuesses, newPenalty);
    if (newLives <= 0 && currentWord) {
      setWordComplete(true);
      setResults((prev) => [
        ...prev,
        {
          word: currentWord,
          rule: currentRule,
          wrongGuesses,
          completed: false,
          meaningCorrect: null,
          usedFlash: true,
          timeUsed: 0,
          points: 0,
        },
      ]);
      return false; // died from flash
    }
    return true; // flash activated successfully
  }, [usedFlash, wordComplete, finished, flashPenalty, wrongGuesses, currentWord, currentRule]);

  const updateLastResult = useCallback((patch: Partial<DicteeWordResult>) => {
    setResults((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[updated.length - 1] = { ...updated[updated.length - 1], ...patch };
      return updated;
    });
  }, []);

  const advanceToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= allWords.length) {
      setFinished(true);
    } else {
      setCurrentIndex(nextIndex);
      setFilledLetters({});
      setWrongGuesses([]);
      setCursorPos(0);
      setWordComplete(false);
      setLastWrongLetter(null);
      setLastGuessType(null);
      setUsedFlash(false);
      setFlashPenalty(0);
    }
  }, [currentIndex, allWords.length]);

  return {
    currentWord,
    currentRule,
    currentIndex,
    totalWords,
    filledLetters,
    cursorCharIndex,
    wrongGuesses,
    lives,
    maxLives: MAX_LIVES,
    wordComplete,
    finished,
    results,
    lastWrongLetter,
    lastGuessType,
    usedFlash,
    guessLetter,
    advanceToNext,
    forceFailWord,
    activateFlash,
    updateLastResult,
  };
}
