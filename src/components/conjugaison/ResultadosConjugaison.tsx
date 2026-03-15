"use client";

import Link from "next/link";
import type { ConjugaisonQuestionResult } from "@/lib/conjugaison/types";
import { formatPronounVerb } from "@/lib/conjugaison/questions";

interface Props {
  results: ConjugaisonQuestionResult[];
  bestStreak: number;
  bestScore: number;
  totalPoints: number;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
}

export default function ResultadosConjugaison({
  results,
  bestStreak,
  bestScore,
  totalPoints,
  onPlayAgain,
  onChangeSettings,
}: Props) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const isNewRecord = totalPoints > 0 && totalPoints >= bestScore;

  const isGreat = percentage >= 80;
  const isOk = percentage >= 50;

  // Group results by verb for breakdown
  const verbBreakdown = new Map<
    string,
    { correct: number; total: number; verb: string }
  >();
  for (const r of results) {
    const key = r.question.verb.infinitive;
    const existing = verbBreakdown.get(key) || {
      correct: 0,
      total: 0,
      verb: key,
    };
    existing.total++;
    if (r.correct) existing.correct++;
    verbBreakdown.set(key, existing);
  }

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4">
      {/* Header */}
      <div className="text-center">
        <div className="text-5xl mb-3">
          {isGreat ? "🎉" : isOk ? "👍" : "💪"}
        </div>
        <h2 className="text-2xl font-extrabold text-slate-700">
          {isGreat ? "Excelente!" : isOk ? "Buen trabajo!" : "Sigue practicando!"}
        </h2>
        <p className="text-sm text-slate-400 mt-1">Conjugaison – Futur simple</p>
      </div>

      {/* Points */}
      <div className="w-full bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="text-4xl font-extrabold text-amber-500">
          {totalPoints} pts
        </div>
        {isNewRecord && (
          <p className="text-sm font-bold text-amber-600 mt-1 animate-bounce-in">
            ⭐ Nuevo récord!
          </p>
        )}
        {!isNewRecord && bestScore > 0 && (
          <p className="text-xs text-slate-400 mt-1">
            Mejor: {bestScore} pts
          </p>
        )}
      </div>

      {/* Score + Streak */}
      <div className="w-full flex gap-3">
        <div
          className={`flex-1 bg-white rounded-2xl shadow-lg p-5 text-center`}
        >
          <div
            className={`text-4xl font-extrabold ${
              isGreat
                ? "text-green-500"
                : isOk
                  ? "text-blue-500"
                  : "text-orange-500"
            }`}
          >
            {correct}/{total}
          </div>
          <p className="text-xs text-slate-400 mt-1">correctas ({percentage}%)</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-5 text-center">
          <div className="text-4xl font-extrabold text-orange-500">
            🔥 {bestStreak}
          </div>
          <p className="text-xs text-slate-400 mt-1">mejor racha</p>
        </div>
      </div>

      {/* Verb breakdown */}
      <div className="w-full bg-white rounded-2xl shadow-lg p-5">
        <h3 className="font-bold text-slate-600 mb-3 text-sm">
          Detalle por verbo:
        </h3>
        <div className="flex flex-col gap-2">
          {[...verbBreakdown.values()].map((item) => {
            const allCorrect = item.correct === item.total;
            const allWrong = item.correct === 0;
            const bgColor = allCorrect
              ? "bg-green-50 border-green-100"
              : allWrong
                ? "bg-red-50 border-red-100"
                : "bg-amber-50 border-amber-100";
            const textColor = allCorrect
              ? "text-green-500"
              : allWrong
                ? "text-red-400"
                : "text-amber-500";

            return (
              <div
                key={item.verb}
                className={`flex items-center justify-between p-3 rounded-xl border ${bgColor}`}
              >
                <span className="font-bold text-slate-700">{item.verb}</span>
                <span className={`text-sm font-extrabold ${textColor}`}>
                  {item.correct}/{item.total}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail per question */}
      <div className="w-full bg-white rounded-2xl shadow-lg p-5">
        <h3 className="font-bold text-slate-600 mb-3 text-sm">
          Todas las preguntas:
        </h3>
        <div className="flex flex-col gap-2">
          {results.map((r, i) => {
            const pointColor =
              r.points >= 100
                ? "text-amber-500"
                : r.points > 0
                  ? "text-green-500"
                  : "text-slate-300";
            const bgColor = r.correct
              ? "bg-green-50 border-green-100"
              : "bg-red-50 border-red-100";

            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border ${bgColor}`}
              >
                <span
                  className={`text-sm ${r.correct ? "text-green-400" : "text-red-300"}`}
                >
                  {r.correct ? "✓" : "✗"}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-700">
                    {formatPronounVerb(
                      r.question.pronoun,
                      r.question.correctAnswer
                    )}
                  </span>
                  {!r.correct && r.selectedAnswer && (
                    <span className="text-xs text-red-400 ml-2">
                      (dijiste: {r.selectedAnswer})
                    </span>
                  )}
                  {!r.correct && !r.selectedAnswer && (
                    <span className="text-xs text-red-400 ml-2">
                      (sin respuesta)
                    </span>
                  )}
                </div>
                <span className={`text-sm font-extrabold ${pointColor}`}>
                  {r.points} pts
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={onPlayAgain}
          className="w-full py-4 rounded-xl text-lg font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          Jugar de nuevo
        </button>
        <button
          onClick={onChangeSettings}
          className="w-full py-3 rounded-xl text-base font-bold text-slate-500 bg-white shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          Cambiar configuración
        </button>
        <Link
          href="/"
          className="w-full py-3 rounded-xl text-base font-bold text-slate-400 hover:text-slate-600 transition-all cursor-pointer text-center block"
        >
          Volver al menú
        </Link>
      </div>
    </div>
  );
}
