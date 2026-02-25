"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useDicteeGame } from "@/hooks/useDicteeGame";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useDicteeTimer } from "@/hooks/useDicteeTimer";
import type { DicteeLesson, DicteeWordResult, DicteeLevel } from "@/lib/dictee/types";
import { LEVEL_CONFIGS } from "@/lib/dictee/types";
import { calculateWordPoints } from "@/lib/dictee/scoring";
import PalabraEnProgreso from "./PalabraEnProgreso";
import TecladoFrances from "./TecladoFrances";
import VidasCorazones from "./VidasCorazones";
import BotonEscuchar from "./BotonEscuchar";
import BarraTimer from "./BarraTimer";
import QuizDeSignificado from "./QuizDeSignificado";

interface Props {
  lesson: DicteeLesson;
  soundEnabled: boolean;
  level: DicteeLevel;
  proMode: boolean;
  onFinish: (results: DicteeWordResult[]) => void;
  onCancel: () => void;
}

export default function JuegoDeAhorcado({ lesson, soundEnabled, level, proMode, onFinish, onCancel }: Props) {
  const {
    currentWord,
    currentRule,
    currentIndex,
    totalWords,
    filledLetters,
    cursorCharIndex,
    wrongGuesses,
    lives,
    maxLives,
    wordComplete,
    finished,
    results,
    lastWrongLetter,
    lastGuessType,
    usedFlash,
    guessLetter,
    advanceToNext,
    forceFailWord,
    activateFlash,
    updateLastResult,
  } = useDicteeGame(lesson);

  const { speak, speaking, supported } = useSpeechSynthesis();

  const [flashActive, setFlashActive] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const wordStartTimeRef = useRef(0);

  const levelConfig = LEVEL_CONFIGS[level];

  // Timer
  const handleTimeUp = useCallback(() => {
    forceFailWord();
  }, [forceFailWord]);

  const { timeLeft, resetTimer } = useDicteeTimer(
    levelConfig.timePerWord,
    !wordComplete && !flashActive,
    handleTimeUp
  );

  // Speak word when it changes
  useEffect(() => {
    if (currentWord && soundEnabled && supported) {
      const timer = setTimeout(() => {
        speak(currentWord.article ? `${currentWord.article} ${currentWord.word}` : currentWord.word);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentWord, currentIndex, soundEnabled, supported, speak]);

  // Reset timer and start time when word changes
  useEffect(() => {
    resetTimer();
    wordStartTimeRef.current = Date.now();
  }, [currentIndex, resetTimer]);

  // When game finishes, report results
  useEffect(() => {
    if (finished) {
      onFinish(results);
    }
  }, [finished, results, onFinish]);

  const handleFlash = useCallback(() => {
    const success = activateFlash();
    if (success) {
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 4000);
    }
  }, [activateFlash]);

  const handleNextOrQuiz = useCallback(() => {
    // After word feedback, show quiz
    setShowQuiz(true);
  }, []);

  const handleQuizAnswer = useCallback(
    (correct: boolean) => {
      const timeUsed = Math.round((Date.now() - wordStartTimeRef.current) / 1000);
      const lastResult = results[results.length - 1];
      if (!lastResult) return;

      const wrongCount = lastResult.wrongGuesses.filter((g) => !g.half).length;
      const halfCount = lastResult.wrongGuesses.filter((g) => g.half).length;

      const points = calculateWordPoints({
        completed: lastResult.completed,
        wrongCount,
        halfCount,
        usedFlash: lastResult.usedFlash,
        meaningCorrect: correct,
        timeUsed,
        timePerWord: levelConfig.timePerWord,
        level,
      });

      updateLastResult({ meaningCorrect: correct, timeUsed, points });
      setTotalPoints((prev) => prev + points);
      setShowQuiz(false);
      advanceToNext();
    },
    [results, updateLastResult, advanceToNext, levelConfig.timePerWord, level]
  );

  if (!currentWord) {
    return null;
  }

  const wasCompleted = wordComplete && results[results.length - 1]?.completed;

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-5 md:gap-9 w-full max-w-md mx-auto px-4">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onCancel}
          className="p-2 rounded-xl bg-white/80 text-slate-400 hover:text-red-500 shadow-md transition-all cursor-pointer"
          aria-label="Cancelar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-400">
            {currentIndex + 1} / {totalWords}
          </span>
          <span className="text-sm font-extrabold text-amber-500">
            {totalPoints} pts
          </span>
        </div>

        <VidasCorazones lives={lives} maxLives={maxLives} />
      </div>

      {/* Timer bar */}
      {!wordComplete && !showQuiz && (
        <BarraTimer timeLeft={timeLeft} maxTime={levelConfig.timePerWord} />
      )}

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300"
          style={{ width: `${((currentIndex) / totalWords) * 100}%` }}
        />
      </div>

      {/* Quiz screen */}
      {showQuiz && currentWord && (
        <QuizDeSignificado
          word={currentWord}
          timePerQuiz={levelConfig.timePerQuiz}
          onAnswer={handleQuizAnswer}
        />
      )}

      {/* Normal game flow (hidden during quiz) */}
      {!showQuiz && (
        <>
          {/* Rule hint */}
          <div className="px-4 py-2 bg-blue-50 rounded-xl">
            <span className="text-sm font-semibold text-blue-500">{currentRule}</span>
          </div>

          {/* Listen + Flash buttons */}
          <div className="flex items-center gap-3">
            <BotonEscuchar
              onClick={() => speak(currentWord.article ? `${currentWord.article} ${currentWord.word}` : currentWord.word)}
              speaking={speaking}
              supported={supported && soundEnabled}
            />
            {!wordComplete && !usedFlash && lives > 2 && (
              <button
                onClick={handleFlash}
                className="p-4 rounded-full shadow-lg transition-all cursor-pointer bg-white text-amber-500 hover:bg-amber-50 hover:shadow-xl active:scale-95"
                aria-label="Flash: ver palabra 2 segundos (-2 vidas)"
                title="Ver palabra 2s (-2 vidas)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          {/* Word progress / Flash display / Completed word */}
          {flashActive ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-wide">
                {currentWord.article ? `${currentWord.article} ` : ""}{currentWord.word}
              </div>
              <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-200 animate-pulse">
                <span className="text-base font-bold text-amber-600">Flash! Memoriza la palabra...</span>
              </div>
            </div>
          ) : wordComplete ? (
            <div className={`text-center p-5 rounded-2xl w-full ${
              wasCompleted
                ? "bg-green-50 border-2 border-green-200"
                : "bg-red-50 border-2 border-red-200"
            }`}>
              <p className={`text-sm font-bold mb-2 ${
                wasCompleted ? "text-green-500" : "text-red-400"
              }`}>
                {wasCompleted ? "Correcto!" : "La respuesta era:"}
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-700">
                {currentWord.article ? `${currentWord.article} ` : ""}{currentWord.word}
              </p>
              <button
                onClick={handleNextOrQuiz}
                className="mt-4 px-8 py-3 rounded-xl text-base font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                {currentIndex + 1 < totalWords ? "Siguiente" : "Ver resultados"}
              </button>
            </div>
          ) : (
            <PalabraEnProgreso
              word={currentWord}
              filledLetters={filledLetters}
              cursorCharIndex={cursorCharIndex}
              revealed={false}
              lastGuessType={lastGuessType}
              proMode={proMode}
            />
          )}

          {/* Keyboard */}
          {!wordComplete && !flashActive && (
            <TecladoFrances
              onGuess={guessLetter}
              disabled={wordComplete || flashActive}
              lastWrong={lastWrongLetter}
              lastGuessType={lastGuessType}
            />
          )}

          {/* Wrong guesses */}
          {wrongGuesses.length > 0 && !wordComplete && (
            <div className="flex gap-2 flex-wrap justify-center">
              {wrongGuesses.map((guess, i) => (
                <span
                  key={`${guess.letter}-${i}`}
                  className={`px-2 py-1 rounded-md text-sm font-bold ${
                    guess.half
                      ? "bg-amber-100 text-amber-500"
                      : "bg-red-100 text-red-400 line-through"
                  }`}
                >
                  {guess.letter}
                  {guess.half && <span className="text-xs ml-0.5">~</span>}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
