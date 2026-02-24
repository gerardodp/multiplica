"use client";

import { useState, useMemo, useCallback } from "react";
import type { DicteeWord } from "@/lib/dictee/types";
import { useDicteeTimer } from "@/hooks/useDicteeTimer";
import BarraTimer from "./BarraTimer";

interface Props {
  word: DicteeWord;
  timePerQuiz: number;
  onAnswer: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizDeSignificado({ word, timePerQuiz, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  const options = useMemo(
    () => shuffle([word.translation, ...word.altTranslations]),
    [word]
  );

  const handleTimeUp = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    setResult(false);
  }, [answered]);

  const { timeLeft } = useDicteeTimer(timePerQuiz, !answered, handleTimeUp);

  const handleSelect = (option: string) => {
    if (answered) return;
    const isCorrect = option === word.translation;
    setSelected(option);
    setAnswered(true);
    setResult(isCorrect);
  };

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-4 w-full">
      <p className="text-sm font-semibold text-slate-400">¿Qué significa...?</p>
      <p className="text-2xl font-extrabold text-slate-700">
        {word.article ? `${word.article} ` : ""}{word.word}
      </p>

      {/* Timer */}
      {!answered && (
        <div className="w-full">
          <BarraTimer timeLeft={timeLeft} maxTime={timePerQuiz} />
        </div>
      )}

      <div className="w-full flex flex-col gap-2">
        {options.map((option) => {
          let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";

          if (!answered) {
            btnClass += "border-slate-200 bg-white hover:border-blue-300 text-slate-700 cursor-pointer";
          } else if (option === word.translation) {
            btnClass += "border-green-400 bg-green-50 text-green-700";
          } else if (option === selected) {
            btnClass += "border-red-400 bg-red-50 text-red-500";
          } else {
            btnClass += "border-slate-100 bg-slate-50 text-slate-300";
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={btnClass}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Timeout message */}
      {answered && selected === null && (
        <p className="text-sm font-bold text-red-500">Se acabó el tiempo!</p>
      )}

      {/* Siguiente button */}
      {answered && (
        <button
          onClick={() => onAnswer(result ?? false)}
          className="mt-1 px-8 py-3 rounded-xl text-base font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          Siguiente
        </button>
      )}
    </div>
  );
}
