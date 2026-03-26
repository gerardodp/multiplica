"use client";

import type { Stanza } from "@/lib/poesie/types";

interface Props {
  stanza: Stanza;
  isLast: boolean;
  onNext: () => void;
}

export default function EstrofaCompletada({ stanza, isLast, onNext }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="animate-bounce-in bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full flex flex-col items-center gap-5">
        {/* Success header */}
        <div className="text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-extrabold text-emerald-600">
            Estrofa {stanza.number} completada!
          </h3>
        </div>

        {/* Stanza text */}
        <div className="w-full bg-gradient-to-br from-rose-50 to-amber-50 rounded-xl p-5 border border-rose-200">
          {stanza.verses.map((verse) => (
            <div
              key={verse.id}
              className="flex items-center gap-2 py-1 animate-fade-in-up"
            >
              <span className="text-lg">{verse.emoji}</span>
              <span className="text-base font-medium text-slate-700 italic">
                {verse.text}
              </span>
            </div>
          ))}
        </div>

        {/* Audio indicator */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.7.48A6.985 6.985 0 002 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h1.535l4.033 3.796A.75.75 0 0010 16.25V3.75zM15.95 5.05a.75.75 0 00-1.06 1.06 5.5 5.5 0 010 7.78.75.75 0 001.06 1.06 7 7 0 000-9.9z" />
          </svg>
          <span>Escuchando la estrofa...</span>
        </div>

        {/* Next button */}
        <button
          onClick={onNext}
          className="w-full py-4 rounded-xl text-lg font-extrabold bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
        >
          {isLast ? "Ver resultados" : "Siguiente estrofa"}
        </button>
      </div>
    </div>
  );
}
