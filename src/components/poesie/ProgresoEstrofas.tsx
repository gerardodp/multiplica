"use client";

import type { StanzaStatus } from "@/hooks/usePoesieGame";

interface Props {
  statuses: StanzaStatus[];
  currentIndex: number;
}

export default function ProgresoEstrofas({ statuses, currentIndex }: Props) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {statuses.map((status, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              status === "completed"
                ? "bg-emerald-500 text-white shadow-md"
                : status === "current"
                ? "bg-rose-500 text-white shadow-lg scale-110 animate-pulse"
                : "bg-white/60 text-slate-400 border-2 border-slate-200"
            }`}
          >
            {status === "completed" ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < statuses.length - 1 && (
            <div
              className={`w-6 h-0.5 transition-all ${
                statuses[i] === "completed"
                  ? "bg-emerald-400"
                  : i === currentIndex
                  ? "bg-rose-300"
                  : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
