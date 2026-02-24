"use client";

import type { DicteeWordResult } from "@/lib/dictee/types";
import { calculateTotalPoints } from "@/lib/dictee/scoring";

interface Props {
  results: DicteeWordResult[];
  lessonTitle: string;
  bestPoints: number;
  onPlayAgain: () => void;
  onBackToLessons: () => void;
}

export default function ResultadosDictee({ results, lessonTitle, bestPoints, onPlayAgain, onBackToLessons }: Props) {
  const correct = results.filter((r) => r.completed).length;
  const total = results.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const totalPoints = calculateTotalPoints(results);
  const isNewRecord = totalPoints > 0 && totalPoints >= bestPoints;

  const isGreat = percentage >= 80;
  const isOk = percentage >= 50;

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4">
      <div className="text-center">
        <div className="text-5xl mb-3">
          {isGreat ? "🎉" : isOk ? "👍" : "💪"}
        </div>
        <h2 className="text-2xl font-extrabold text-slate-700">
          {isGreat ? "Excelente!" : isOk ? "Buen trabajo!" : "Sigue practicando!"}
        </h2>
        <p className="text-sm text-slate-400 mt-1">{lessonTitle}</p>
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
        {!isNewRecord && bestPoints > 0 && (
          <p className="text-xs text-slate-400 mt-1">
            Mejor: {bestPoints} pts
          </p>
        )}
      </div>

      {/* Score */}
      <div className="w-full bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className={`text-5xl font-extrabold ${
          isGreat ? "text-green-500" : isOk ? "text-blue-500" : "text-orange-500"
        }`}>
          {correct}/{total}
        </div>
        <p className="text-sm text-slate-400 mt-2">palabras correctas ({percentage}%)</p>
      </div>

      {/* Word-by-word results */}
      <div className="w-full bg-white rounded-2xl shadow-lg p-5">
        <h3 className="font-bold text-slate-600 mb-3 text-sm">Detalle por palabra:</h3>
        <div className="flex flex-col gap-2">
          {results.map((r, i) => {
            const pointColor =
              r.points >= 100 ? "text-amber-500" :
              r.points > 0 ? "text-green-500" :
              "text-slate-300";
            const bgColor =
              r.points >= 100 ? "bg-amber-50 border-amber-100" :
              r.completed ? "bg-green-50 border-green-100" :
              "bg-red-50 border-red-100";

            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border ${bgColor}`}
              >
                <span className={`text-sm ${r.completed ? "text-green-400" : "text-red-300"}`}>
                  {r.completed ? "✓" : "✗"}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-700">
                    {r.word.article ? `${r.word.article} ` : ""}
                    {r.word.word}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">({r.rule})</span>
                  {r.meaningCorrect === true && (
                    <span className="text-xs text-green-500 ml-1">trad. ✓</span>
                  )}
                  {r.meaningCorrect === false && (
                    <span className="text-xs text-red-400 ml-1">trad. ✗</span>
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
          className="w-full py-4 rounded-xl text-lg font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          Repetir lección
        </button>
        <button
          onClick={onBackToLessons}
          className="w-full py-3 rounded-xl text-base font-bold text-slate-500 bg-white shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          Elegir otra lección
        </button>
      </div>
    </div>
  );
}
