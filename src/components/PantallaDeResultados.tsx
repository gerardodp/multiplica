"use client";

import { useEffect, useRef } from "react";
import { playRecord } from "@/lib/sounds";
import type { QuestionRecord } from "@/lib/types";

interface Props {
  playerName: string;
  score: number;
  totalAnswered: number;
  highScore: number;
  isNewRecord: boolean;
  cancelled: boolean;
  history: QuestionRecord[];
  onPlayAgain: () => void;
}

export default function PantallaDeResultados({
  playerName,
  score,
  totalAnswered,
  highScore,
  isNewRecord,
  cancelled,
  history,
  onPlayAgain,
}: Props) {
  const soundPlayed = useRef(false);

  useEffect(() => {
    if (isNewRecord && !soundPlayed.current) {
      soundPlayed.current = true;
      playRecord();
    }
  }, [isNewRecord]);

  const accuracy =
    totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

  const mistakes = history.filter((q) => !q.isCorrect);

  const getMessage = () => {
    if (accuracy === 100) return "Perfecto!";
    if (accuracy >= 80) return "Excelente!";
    if (accuracy >= 60) return "Muy bien!";
    if (accuracy >= 40) return "Buen trabajo!";
    return "Sigue practicando!";
  };

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-5 w-full max-w-lg mx-auto px-4 pb-8">
      {/* Confetti effect for new records */}
      {isNewRecord && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="animate-confetti absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${60 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random() * 1}s`,
              }}
            >
              {["*", "+", "x", "="][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      {/* Cancelled badge */}
      {cancelled && (
        <div className="w-full rounded-2xl bg-orange-50 border-2 border-orange-200 p-3 text-center">
          <p className="text-sm font-bold text-orange-500">
            Partida cancelada - no cuenta para record
          </p>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-700">
          {cancelled ? "Partida parcial" : getMessage()}
        </h2>
        <p className="mt-1 text-lg text-slate-400">
          {cancelled ? `Animo, ${playerName}!` : `Buen trabajo, ${playerName}!`}
        </p>
      </div>

      {/* Score card */}
      <div className="w-full bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-3">
        <div className="text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          {score}
        </div>
        <p className="text-slate-400 text-lg">
          {score} de {totalAnswered} correctas
        </p>

        {/* Accuracy bar */}
        <div className="w-full">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>Precision</span>
            <span>{accuracy}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-1000"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>
      </div>

      {/* High score (hidden on cancelled) */}
      {!cancelled && (
        <div
          className={`w-full rounded-2xl p-4 text-center ${
            isNewRecord
              ? "bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-amber-300"
              : "bg-white border-2 border-slate-100"
          }`}
        >
          {isNewRecord ? (
            <p className="text-lg font-bold text-amber-600">
              Nuevo record! {highScore} puntos
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              Tu record:{" "}
              <span className="font-bold text-slate-600">{highScore}</span>{" "}
              puntos
            </p>
          )}
        </div>
      )}

      {/* Mistake review */}
      {mistakes.length > 0 && (
        <div className="w-full bg-white rounded-2xl shadow-lg p-5">
          <h3 className="text-sm font-semibold text-slate-500 mb-3">
            Repasa tus fallos ({mistakes.length})
          </h3>
          <div className="flex flex-col gap-2">
            {mistakes.map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-700">
                    {q.a} x {q.b}
                  </span>
                  <span className="text-sm text-slate-400">=</span>
                  <span className="text-lg font-extrabold text-green-600">
                    {q.correctAnswer}
                  </span>
                </div>
                <span className="text-sm font-semibold text-red-400 line-through">
                  {q.userAnswer}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All correct message */}
      {mistakes.length === 0 && totalAnswered > 0 && (
        <div className="w-full rounded-2xl bg-green-50 border-2 border-green-200 p-4 text-center">
          <p className="text-lg font-bold text-green-600">
            Sin fallos, todas correctas!
          </p>
        </div>
      )}

      {/* Boton jugar de nuevo */}
      <button
        onClick={onPlayAgain}
        className="w-full py-4 rounded-2xl text-xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl shadow-purple-200 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
      >
        Jugar de Nuevo
      </button>
    </div>
  );
}
