"use client";

import { useState, useCallback } from "react";
import { useGameSettings } from "@/hooks/useGameSettings";
import { useMultiplicaSettings } from "@/hooks/useMultiplicaSettings";
import PantallaDeInicio from "@/components/PantallaDeInicio";
import PantallaDeConfiguracion from "@/components/PantallaDeConfiguracion";
import PantallaDeJuego from "@/components/PantallaDeJuego";
import PantallaDeResultados from "@/components/PantallaDeResultados";
import Link from "next/link";
import type { QuestionRecord } from "@/lib/types";

type Screen = "home" | "config" | "playing" | "results";

interface GameResult {
  score: number;
  total: number;
  isNewRecord: boolean;
  cancelled: boolean;
  history: QuestionRecord[];
}

export default function MultiplicaPage() {
  const { settings: platform, loaded: platformLoaded, updateSettings: updatePlatform } =
    useGameSettings();
  const { settings, loaded, updateSettings, updateHighScore, resetSettings } =
    useMultiplicaSettings();
  const [screen, setScreen] = useState<Screen>("home");
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const bothLoaded = platformLoaded && loaded;

  const handleToggleTable = useCallback(
    (table: number) => {
      const current = settings.selectedTables;
      const updated = current.includes(table)
        ? current.filter((t) => t !== table)
        : [...current, table];
      updateSettings({ selectedTables: updated });
    },
    [settings.selectedTables, updateSettings]
  );

  const handleStartGame = useCallback(() => {
    setScreen("playing");
  }, []);

  const handleGameEnd = useCallback(
    (score: number, total: number, history: QuestionRecord[]) => {
      const isNewRecord = score > settings.highScore;
      updateHighScore(score);
      setGameResult({ score, total, isNewRecord, cancelled: false, history });
      setScreen("results");
    },
    [settings.highScore, updateHighScore]
  );

  const handleCancel = useCallback(
    (score: number, total: number, history: QuestionRecord[]) => {
      setGameResult({ score, total, isNewRecord: false, cancelled: true, history });
      setScreen("results");
    },
    []
  );

  const handlePlayAgain = useCallback(() => {
    setGameResult(null);
    setScreen("home");
  }, []);

  const handleConfigDone = useCallback(() => {
    setScreen("home");
  }, []);

  const handleToggleSound = useCallback(() => {
    updatePlatform({ soundEnabled: !platform.soundEnabled });
  }, [platform.soundEnabled, updatePlatform]);

  const handleReset = useCallback(() => {
    resetSettings();
    setScreen("config");
  }, [resetSettings]);

  if (!bothLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-purple-400 animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper relative min-h-screen flex items-center justify-center py-8">
      {/* Back to menu button */}
      {screen === "home" && (
        <Link
          href="/"
          className="absolute top-6 left-6 p-3 rounded-xl bg-white/80 text-slate-400 hover:text-purple-500 hover:bg-white shadow-md transition-all"
          aria-label="Volver al menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
      )}

      {screen === "home" && (
        <PantallaDeInicio
          playerName={platform.playerName}
          selectedTables={settings.selectedTables}
          selectedTime={settings.selectedTime}
          highScore={settings.highScore}
          soundEnabled={platform.soundEnabled}
          onStartGame={handleStartGame}
          onOpenSettings={() => setScreen("config")}
          onToggleSound={handleToggleSound}
        />
      )}

      {screen === "config" && (
        <PantallaDeConfiguracion
          playerName={platform.playerName}
          selectedTables={settings.selectedTables}
          selectedTime={settings.selectedTime}
          soundEnabled={platform.soundEnabled}
          onUpdateName={(name) => updatePlatform({ playerName: name })}
          onToggleTable={handleToggleTable}
          onSelectTime={(time) => updateSettings({ selectedTime: time })}
          onToggleSound={handleToggleSound}
          onReset={handleReset}
          onStartGame={handleConfigDone}
        />
      )}

      {screen === "playing" && (
        <PantallaDeJuego
          playerName={platform.playerName}
          selectedTables={settings.selectedTables}
          totalTime={settings.selectedTime}
          onGameEnd={handleGameEnd}
          onCancel={handleCancel}
        />
      )}

      {screen === "results" && gameResult && (
        <PantallaDeResultados
          playerName={platform.playerName}
          score={gameResult.score}
          totalAnswered={gameResult.total}
          highScore={Math.max(settings.highScore, gameResult.score)}
          isNewRecord={gameResult.isNewRecord}
          cancelled={gameResult.cancelled}
          history={gameResult.history}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
