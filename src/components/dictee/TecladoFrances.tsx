"use client";

import { useState, useEffect, useCallback } from "react";
import type { GuessResult } from "@/hooks/useDicteeGame";

interface Props {
  onGuess: (letter: string) => void;
  disabled: boolean;
  lastWrong: string | null;
  lastGuessType: GuessResult;
}

const ROWS = [
  ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m"],
  ["w", "x", "c", "v", "b", "n"],
];

const ACCENT_MAP: Record<string, string[]> = {
  e: ["é", "è", "ê", "ë"],
  a: ["à", "â"],
  u: ["ù", "û"],
  i: ["î", "ï"],
  o: ["ô"],
  c: ["ç"],
};

export default function TecladoFrances({ onGuess, disabled, lastWrong, lastGuessType }: Props) {
  const [accentPopup, setAccentPopup] = useState<{ letter: string; rect: DOMRect } | null>(null);

  // Close popup on outside click
  useEffect(() => {
    if (!accentPopup) return;
    const close = () => setAccentPopup(null);
    const timer = setTimeout(() => window.addEventListener("pointerdown", close), 10);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", close);
    };
  }, [accentPopup]);

  // Physical keyboard support (base letters only; accents via popup)
  useEffect(() => {
    if (disabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key)) {
        e.preventDefault();
        handleKeyPress(key, null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  const handleKeyPress = useCallback(
    (letter: string, e: React.PointerEvent | null) => {
      if (disabled) return;

      const variants = ACCENT_MAP[letter];
      if (variants && e) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setAccentPopup({ letter, rect });
        return;
      }

      onGuess(letter);
      setAccentPopup(null);
    },
    [disabled, onGuess]
  );

  const handleAccentSelect = useCallback(
    (letter: string) => {
      onGuess(letter);
      setAccentPopup(null);
    },
    [onGuess]
  );

  const keyClass = (letter: string) => {
    const base =
      "min-w-[2rem] sm:min-w-[2.4rem] md:min-w-[3.2rem] h-11 sm:h-12 md:h-14 rounded-lg font-bold text-sm sm:text-base md:text-lg transition-all select-none touch-manipulation";
    if (lastWrong === letter) {
      if (lastGuessType === "near-miss") {
        return `${base} bg-amber-100 text-amber-600 border-2 border-amber-300 animate-shake`;
      }
      return `${base} bg-red-100 text-red-500 border-2 border-red-300 animate-shake`;
    }
    return `${base} bg-white text-slate-700 border-2 border-slate-200 shadow-sm active:scale-90 cursor-pointer hover:border-blue-300`;
  };

  return (
    <div className="relative flex flex-col items-center gap-1.5 md:gap-2.5">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1 sm:gap-1.5 md:gap-2 justify-center">
          {row.map((letter) => (
            <button
              key={letter}
              type="button"
              disabled={disabled}
              onPointerDown={(e) => {
                e.preventDefault();
                handleKeyPress(letter, e);
              }}
              className={keyClass(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}

      {/* Accent popup */}
      {accentPopup && (
        <div
          className="fixed z-50 flex gap-1 p-2 bg-white rounded-xl shadow-2xl border border-slate-200"
          style={{
            left: Math.max(8, accentPopup.rect.left - 20),
            top: accentPopup.rect.top - 56,
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAccentSelect(accentPopup.letter);
            }}
            className="w-10 h-10 rounded-lg font-bold text-base bg-blue-50 text-blue-700 border-2 border-blue-300 active:scale-90 cursor-pointer transition-all"
          >
            {accentPopup.letter}
          </button>
          {ACCENT_MAP[accentPopup.letter]?.map((variant) => (
            <button
              key={variant}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAccentSelect(variant);
              }}
              className="w-10 h-10 rounded-lg font-bold text-base bg-blue-50 text-blue-700 border-2 border-blue-300 active:scale-90 cursor-pointer transition-all"
            >
              {variant}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
