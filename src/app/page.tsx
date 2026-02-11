"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useGameSettings } from "@/hooks/useGameSettings";
import PantallaDeInicio from "@/components/PantallaDeInicio";
import PantallaDeConfiguracion from "@/components/PantallaDeConfiguracion";
import PantallaDeJuego from "@/components/PantallaDeJuego";
import PantallaDeResultados from "@/components/PantallaDeResultados";
import type { QuestionRecord } from "@/lib/types";

type Screen = "home" | "config" | "playing" | "results";

interface GameResult {
  score: number;
  total: number;
  isNewRecord: boolean;
  cancelled: boolean;
  history: QuestionRecord[];
}

export default function Home() {
  const { settings, loaded, isConfigured, updateSettings, updateHighScore, resetSettings } =
    useGameSettings();
  const [screen, setScreen] = useState<Screen | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const initialScreenSet = useRef(false);

  // Set initial screen exactly once when settings finish loading
  useEffect(() => {
    if (loaded && !initialScreenSet.current) {
      initialScreenSet.current = true;
      setScreen(isConfigured ? "home" : "config");
    }
  }, [loaded, isConfigured]);

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
    updateSettings({ soundEnabled: !settings.soundEnabled });
  }, [settings.soundEnabled, updateSettings]);

  const handleReset = useCallback(() => {
    resetSettings();
    setScreen("config");
  }, [resetSettings]);

  if (!loaded || !screen) {
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
      {screen === "home" && (
        <PantallaDeInicio
          playerName={settings.playerName}
          selectedTables={settings.selectedTables}
          selectedTime={settings.selectedTime}
          highScore={settings.highScore}
          soundEnabled={settings.soundEnabled}
          onStartGame={handleStartGame}
          onOpenSettings={() => setScreen("config")}
          onToggleSound={handleToggleSound}
        />
      )}

      {screen === "config" && (
        <PantallaDeConfiguracion
          playerName={settings.playerName}
          selectedTables={settings.selectedTables}
          selectedTime={settings.selectedTime}
          soundEnabled={settings.soundEnabled}
          onUpdateName={(name) => updateSettings({ playerName: name })}
          onToggleTable={handleToggleTable}
          onSelectTime={(time) => updateSettings({ selectedTime: time })}
          onToggleSound={handleToggleSound}
          onReset={handleReset}
          onStartGame={handleConfigDone}
        />
      )}

      {screen === "playing" && (
        <PantallaDeJuego
          playerName={settings.playerName}
          selectedTables={settings.selectedTables}
          totalTime={settings.selectedTime}
          onGameEnd={handleGameEnd}
          onCancel={handleCancel}
        />
      )}

      {screen === "results" && gameResult && (
        <PantallaDeResultados
          playerName={settings.playerName}
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
