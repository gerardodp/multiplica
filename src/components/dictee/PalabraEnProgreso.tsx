"use client";

import type { DicteeWord } from "@/lib/dictee/types";
import type { GuessResult } from "@/hooks/useDicteeGame";

interface Props {
  word: DicteeWord;
  filledLetters: Record<number, string>;
  cursorCharIndex: number;
  revealed: boolean;
  lastGuessType: GuessResult;
  proMode?: boolean;
}

export default function PalabraEnProgreso({ word, filledLetters, cursorCharIndex, revealed, lastGuessType, proMode = false }: Props) {
  const letters = word.word.split("");

  // Determine cursor color based on last guess feedback
  const cursorBorderClass =
    lastGuessType === "near-miss"
      ? "border-amber-500 bg-amber-100 ring-2 ring-amber-300"
      : lastGuessType === "wrong"
      ? "border-red-500 bg-red-100 ring-2 ring-red-300"
      : "border-blue-500 bg-blue-100 ring-2 ring-blue-300";

  if (proMode && !revealed) {
    // Pro mode: show only filled letters + blinking cursor, no empty boxes
    const filledChars: string[] = [];
    for (let i = 0; i < letters.length; i++) {
      const isLetter = /[a-zA-ZÀ-ÿ]/.test(letters[i]);
      if (!isLetter) {
        filledChars.push(letters[i]);
      } else if (i in filledLetters) {
        filledChars.push(filledLetters[i]);
      } else {
        break; // Stop at first unfilled letter
      }
    }

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {word.article && (
            <span className="text-2xl font-bold text-blue-400">{word.article}</span>
          )}
          <div className="flex items-baseline">
            <span className="text-3xl font-extrabold text-blue-700 tracking-wider">
              {filledChars.join("")}
            </span>
            <span className="text-3xl font-extrabold text-blue-400 animate-pulse ml-0.5">|</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {word.article && (
          <span className="text-2xl font-bold text-blue-400">{word.article}</span>
        )}
        <div className="flex gap-1.5 flex-wrap justify-center">
          {letters.map((ch, i) => {
            const isLetter = /[a-zA-ZÀ-ÿ]/.test(ch);
            const isFilled = i in filledLetters;
            const isCursor = i === cursorCharIndex && !revealed;
            const isRevealed = !isLetter || revealed || isFilled;

            return (
              <div
                key={i}
                className={`w-9 h-11 sm:w-11 sm:h-13 flex items-center justify-center rounded-lg border-2 text-xl sm:text-2xl font-extrabold transition-all ${
                  !isLetter
                    ? "border-transparent"
                    : isCursor
                    ? `${cursorBorderClass} text-transparent animate-pulse`
                    : isFilled
                    ? "border-blue-300 bg-blue-50 text-blue-700 animate-letter-reveal"
                    : revealed
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-transparent"
                }`}
              >
                {isRevealed ? ch : isCursor ? "_" : "\u00A0"}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
