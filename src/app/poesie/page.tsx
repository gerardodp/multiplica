"use client";

import { useState, useCallback } from "react";
import { useGameSettings } from "@/hooks/useGameSettings";
import { usePoesieSettings } from "@/hooks/usePoesieSettings";
import { allPoems } from "@/lib/poesie/poems";
import type { PoemProgress } from "@/lib/poesie/types";
import JuegoDeEstrofas from "@/components/poesie/JuegoDeEstrofas";
import ResultadosPoesie from "@/components/poesie/ResultadosPoesie";
import Link from "next/link";

type Screen = "playing" | "results";

// With only one poem, go straight to the game
const poem = allPoems[0];

export default function PoesiePage() {
  const { settings: platform, loaded: platformLoaded } = useGameSettings();
  const {
    loaded: poesieLoaded,
    savePoemProgress,
  } = usePoesieSettings();

  const [screen, setScreen] = useState<Screen>("playing");
  const [progress, setProgress] = useState<PoemProgress | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const bothLoaded = platformLoaded && poesieLoaded;

  const handleFinish = useCallback(
    (prog: PoemProgress) => {
      setProgress(prog);
      savePoemProgress(poem.id, prog);
      setScreen("results");
    },
    [savePoemProgress]
  );

  const handlePlayAgain = useCallback(() => {
    setGameKey((k) => k + 1);
    setScreen("playing");
    setProgress(null);
  }, []);

  const handleBack = useCallback(() => {
    window.location.href = "/";
  }, []);

  if (!bothLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-rose-400 animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper relative min-h-screen flex items-center justify-center py-8">
      {screen === "playing" && (
        <>
          <Link
            href="/"
            className="absolute top-6 left-6 p-3 rounded-xl bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white shadow-md transition-all z-10"
            aria-label="Volver al menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <JuegoDeEstrofas
            key={gameKey}
            poem={poem}
            soundEnabled={platform.soundEnabled}
            onFinish={handleFinish}
          />
        </>
      )}

      {screen === "results" && progress && (
        <ResultadosPoesie
          poem={poem}
          progress={progress}
          onPlayAgain={handlePlayAgain}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
