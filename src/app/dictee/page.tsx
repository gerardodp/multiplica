"use client";

import { useState, useCallback } from "react";
import { useGameSettings } from "@/hooks/useGameSettings";
import { useDicteeSettings } from "@/hooks/useDicteeSettings";
import { allLessons } from "@/lib/dictee/lessons";
import type { DicteeLesson, DicteeWordResult, DicteeLevel } from "@/lib/dictee/types";
import { calculateTotalPoints } from "@/lib/dictee/scoring";
import SeleccionDeLeccion from "@/components/dictee/SeleccionDeLeccion";
import ConfiguracionDictee from "@/components/dictee/ConfiguracionDictee";
import JuegoDeAhorcado from "@/components/dictee/JuegoDeAhorcado";
import ResultadosDictee from "@/components/dictee/ResultadosDictee";
import Link from "next/link";

type Screen = "lesson-select" | "configuracion" | "playing" | "results";

export default function DicteePage() {
  const { settings: platform, loaded: platformLoaded, updateSettings: updatePlatform } = useGameSettings();
  const { settings: dicteeSettings, loaded: dicteeLoaded, updateSettings: updateDictee, saveLessonScore } = useDicteeSettings();

  const [screen, setScreen] = useState<Screen>("lesson-select");
  const [selectedLesson, setSelectedLesson] = useState<DicteeLesson | null>(null);
  const [gameResults, setGameResults] = useState<DicteeWordResult[]>([]);
  const [gameKey, setGameKey] = useState(0);

  const bothLoaded = platformLoaded && dicteeLoaded;

  const handleSelectLesson = useCallback((lesson: DicteeLesson) => {
    setSelectedLesson(lesson);
    setGameKey((k) => k + 1);
    setScreen("playing");
  }, []);

  const handleFinish = useCallback(
    (results: DicteeWordResult[]) => {
      setGameResults(results);
      if (selectedLesson) {
        const correct = results.filter((r) => r.completed).length;
        const totalPoints = calculateTotalPoints(results);
        saveLessonScore(selectedLesson.id, correct, results.length, totalPoints);
      }
      setScreen("results");
    },
    [selectedLesson, saveLessonScore]
  );

  const handleCancel = useCallback(() => {
    setScreen("lesson-select");
  }, []);

  const handlePlayAgain = useCallback(() => {
    if (selectedLesson) {
      setGameKey((k) => k + 1);
      setScreen("playing");
    }
  }, [selectedLesson]);

  const handleBackToLessons = useCallback(() => {
    setSelectedLesson(null);
    setScreen("lesson-select");
  }, []);

  const handleToggleSound = useCallback(() => {
    updatePlatform({ soundEnabled: !platform.soundEnabled });
  }, [platform.soundEnabled, updatePlatform]);

  const handleOpenSettings = useCallback(() => {
    setScreen("configuracion");
  }, []);

  const handleChangeLevel = useCallback((level: DicteeLevel) => {
    updateDictee({ level });
  }, [updateDictee]);

  const handleChangeProMode = useCallback((proMode: boolean) => {
    updateDictee({ proMode });
  }, [updateDictee]);

  if (!bothLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-blue-400 animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper relative min-h-screen flex items-center justify-center py-8">
      {/* Back to menu button */}
      {(screen === "lesson-select" || screen === "configuracion") && (
        <Link
          href="/"
          className="absolute top-6 left-6 p-3 rounded-xl bg-white/80 text-slate-400 hover:text-blue-500 hover:bg-white shadow-md transition-all"
          aria-label="Volver al menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
      )}

      {screen === "lesson-select" && (
        <SeleccionDeLeccion
          lessons={allLessons}
          lessonScores={dicteeSettings.lessonScores}
          onSelectLesson={handleSelectLesson}
          soundEnabled={platform.soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenSettings={handleOpenSettings}
        />
      )}

      {screen === "configuracion" && (
        <ConfiguracionDictee
          level={dicteeSettings.level}
          proMode={dicteeSettings.proMode}
          onChangeLevel={handleChangeLevel}
          onChangeProMode={handleChangeProMode}
          onBack={() => setScreen("lesson-select")}
        />
      )}

      {screen === "playing" && selectedLesson && (
        <JuegoDeAhorcado
          key={gameKey}
          lesson={selectedLesson}
          soundEnabled={platform.soundEnabled}
          level={dicteeSettings.level}
          proMode={dicteeSettings.proMode}
          onFinish={handleFinish}
          onCancel={handleCancel}
        />
      )}

      {screen === "results" && selectedLesson && (
        <ResultadosDictee
          results={gameResults}
          lessonTitle={selectedLesson.title}
          bestPoints={dicteeSettings.lessonScores[selectedLesson.id]?.bestPoints ?? 0}
          onPlayAgain={handlePlayAgain}
          onBackToLessons={handleBackToLessons}
        />
      )}
    </div>
  );
}
