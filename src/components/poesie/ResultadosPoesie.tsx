"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { Poem, PoemProgress } from "@/lib/poesie/types";

const CONFETTI_COLORS = ["#f43f5e", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7"];

interface Props {
  poem: Poem;
  progress: PoemProgress;
  onPlayAgain: () => void;
  onBack: () => void;
}

export default function ResultadosPoesie({
  poem,
  progress,
  onPlayAgain,
  onBack,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pre-compute random confetti values to avoid Math.random() during render
  const confettiItems = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        left: `${(((i * 7 + 13) * 37) % 100)}%`,
        delay: `${((i * 3 + 5) % 20) / 10}s`,
        duration: `${2 + ((i * 7 + 3) % 20) / 10}s`,
        color: CONFETTI_COLORS[i % 6],
      })),
    []
  );

  const handlePlayAudio = useCallback(() => {
    if (!poem.audioFile) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    const audio = new Audio(poem.audioFile);
    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });
  }, [poem.audioFile, isPlaying]);

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4">
      {/* Confetti */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50">
        {confettiItems.map((item, i) => (
          <div
            key={i}
            className="animate-confetti absolute w-2.5 h-2.5 rounded-sm opacity-90"
            style={{
              left: item.left,
              animationDelay: item.delay,
              animationDuration: item.duration,
              backgroundColor: item.color,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="text-center">
        <div className="text-5xl mb-3">🏆</div>
        <h2 className="text-2xl font-extrabold text-slate-700">
          Poema completado!
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Has aprendido todo el poema en{" "}
          {progress.totalAttempts}{" "}
          {progress.totalAttempts === 1 ? "intento" : "intentos"}
        </p>
      </div>

      {/* Full poem */}
      <div className="w-full bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl p-5 border border-rose-200 shadow-lg">
        <h3 className="text-center text-lg font-extrabold text-rose-600 mb-4">
          {poem.title}
        </h3>
        {poem.stanzas.map((stanza, si) => (
          <div key={si} className={si > 0 ? "mt-4" : ""}>
            {stanza.verses.map((verse) => (
              <div
                key={verse.id}
                className="flex items-center gap-2 py-0.5"
              >
                <span className="text-base">{verse.emoji}</span>
                <span className="text-sm font-medium text-slate-700 italic">
                  {verse.text}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Play audio button */}
      {poem.audioFile && (
        <button
          onClick={handlePlayAudio}
          className={`w-full py-4 rounded-xl text-lg font-extrabold transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-3 ${
            isPlaying
              ? "bg-rose-100 text-rose-600 border-2 border-rose-300"
              : "bg-white border-2 border-rose-300 text-rose-600 hover:bg-rose-50 shadow-md"
          }`}
        >
          {isPlaying ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
              </svg>
              Pausar audio
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
              Escuchar el poema completo
            </>
          )}
        </button>
      )}

      {/* Action buttons */}
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={onPlayAgain}
          className="w-full py-4 rounded-xl text-lg font-extrabold bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
        >
          Volver a practicar
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl text-base font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer active:scale-95"
        >
          Volver al menu
        </button>
      </div>
    </div>
  );
}
