"use client";

import { useState, useCallback } from "react";
import { useGameSettings } from "@/hooks/useGameSettings";
import { useConjugaisonSettings } from "@/hooks/useConjugaisonSettings";
import { getVerbsByGroups } from "@/lib/conjugaison/verbs";
import { generateQuestions } from "@/lib/conjugaison/questions";
import { calculateTotalPoints } from "@/lib/conjugaison/scoring";
import type { ConjugaisonQuestion, ConjugaisonQuestionResult, ConjugaisonDifficulty, RoundSize, VerbGroup } from "@/lib/conjugaison/types";
import ConfiguracionConjugaison from "@/components/conjugaison/ConfiguracionConjugaison";
import JuegoConjugaison from "@/components/conjugaison/JuegoConjugaison";
import ResultadosConjugaison from "@/components/conjugaison/ResultadosConjugaison";
import Link from "next/link";

type Screen = "configuracion" | "playing" | "results";

export default function ConjugaisonPage() {
  const { settings: platform, loaded: platformLoaded } = useGameSettings();
  const {
    settings: conjSettings,
    loaded: conjLoaded,
    updateSettings: updateConj,
    saveGameScore,
  } = useConjugaisonSettings();

  const [screen, setScreen] = useState<Screen>("configuracion");
  const [questions, setQuestions] = useState<ConjugaisonQuestion[]>([]);
  const [gameResults, setGameResults] = useState<ConjugaisonQuestionResult[]>([]);
  const [gameBestStreak, setGameBestStreak] = useState(0);
  const [gameTotalPoints, setGameTotalPoints] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  const bothLoaded = platformLoaded && conjLoaded;

  const handleChangeGroups = useCallback(
    (groups: VerbGroup[]) => {
      updateConj({ selectedGroups: groups });
    },
    [updateConj]
  );

  const handleChangeDifficulty = useCallback(
    (difficulty: ConjugaisonDifficulty) => {
      updateConj({ difficulty });
    },
    [updateConj]
  );

  const handleChangeRoundSize = useCallback(
    (roundSize: RoundSize) => {
      updateConj({ roundSize });
    },
    [updateConj]
  );

  const handleStart = useCallback(() => {
    const verbs = getVerbsByGroups(conjSettings.selectedGroups);
    if (verbs.length === 0) return;
    const generated = generateQuestions(verbs, conjSettings.roundSize);
    setQuestions(generated);
    setGameKey((k) => k + 1);
    setScreen("playing");
  }, [conjSettings.selectedGroups, conjSettings.roundSize]);

  const handleFinish = useCallback(
    (results: ConjugaisonQuestionResult[], bestStreak: number) => {
      const total = calculateTotalPoints(results);
      setGameResults(results);
      setGameBestStreak(bestStreak);
      setGameTotalPoints(total);
      saveGameScore(total);
      setScreen("results");
    },
    [saveGameScore]
  );

  const handleCancel = useCallback(() => {
    setScreen("configuracion");
  }, []);

  const handlePlayAgain = useCallback(() => {
    const verbs = getVerbsByGroups(conjSettings.selectedGroups);
    const generated = generateQuestions(verbs, conjSettings.roundSize);
    setQuestions(generated);
    setGameKey((k) => k + 1);
    setScreen("playing");
  }, [conjSettings.selectedGroups, conjSettings.roundSize]);

  const handleChangeSettings = useCallback(() => {
    setScreen("configuracion");
  }, []);

  if (!bothLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-emerald-400 animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper relative min-h-screen flex items-center justify-center py-8">
      {/* Back to menu button */}
      {screen === "configuracion" && (
        <Link
          href="/"
          className="absolute top-6 left-6 p-3 rounded-xl bg-white/80 text-slate-400 hover:text-emerald-500 hover:bg-white shadow-md transition-all"
          aria-label="Volver al menú"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
      )}

      {screen === "configuracion" && (
        <ConfiguracionConjugaison
          selectedGroups={conjSettings.selectedGroups}
          difficulty={conjSettings.difficulty}
          roundSize={conjSettings.roundSize}
          onChangeGroups={handleChangeGroups}
          onChangeDifficulty={handleChangeDifficulty}
          onChangeRoundSize={handleChangeRoundSize}
          onStart={handleStart}
        />
      )}

      {screen === "playing" && (
        <JuegoConjugaison
          key={gameKey}
          questions={questions}
          difficulty={conjSettings.difficulty}
          soundEnabled={platform.soundEnabled}
          onFinish={handleFinish}
          onCancel={handleCancel}
        />
      )}

      {screen === "results" && (
        <ResultadosConjugaison
          results={gameResults}
          bestStreak={gameBestStreak}
          bestScore={conjSettings.bestScore}
          totalPoints={gameTotalPoints}
          onPlayAgain={handlePlayAgain}
          onChangeSettings={handleChangeSettings}
        />
      )}
    </div>
  );
}
