"use client";

import { useState, useEffect, useMemo } from "react";
import type { ConjugaisonQuestion, ConjugaisonQuestionResult, ConjugaisonDifficulty } from "@/lib/conjugaison/types";
import { DIFFICULTY_CONFIGS } from "@/lib/conjugaison/types";
import { getStreakMultiplier } from "@/lib/conjugaison/scoring";
import { formatPronounVerb, FUTURE_ENDINGS, generateTranslationOptions } from "@/lib/conjugaison/questions";
import { ALL_VERBS } from "@/lib/conjugaison/verbs";
import { useConjugaisonGame } from "@/hooks/useConjugaisonGame";
import { useDicteeTimer } from "@/hooks/useDicteeTimer";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { playCorrect, playIncorrect } from "@/lib/sounds";
import BarraTimer from "@/components/dictee/BarraTimer";

interface Props {
  questions: ConjugaisonQuestion[];
  difficulty: ConjugaisonDifficulty;
  soundEnabled: boolean;
  onFinish: (results: ConjugaisonQuestionResult[], bestStreak: number) => void;
  onCancel: () => void;
}

export default function JuegoConjugaison({
  questions,
  difficulty,
  soundEnabled,
  onFinish,
  onCancel,
}: Props) {
  const timePerQuestion = DIFFICULTY_CONFIGS[difficulty].timePerQuestion;

  const game = useConjugaisonGame(questions, difficulty, timePerQuestion);
  const { speak } = useSpeechSynthesis();

  const { timeLeft, resetTimer } = useDicteeTimer(
    timePerQuestion,
    !game.answered && game.phase === "conjugation",
    game.handleTimeUp
  );

  // When conjugation answered, pronounce the correct form and play sound
  useEffect(() => {
    if (!game.answered || !game.currentQuestion || game.phase !== "conjugation") return;

    if (soundEnabled) {
      if (game.selectedAnswer === game.currentQuestion.correctAnswer) {
        playCorrect();
      } else {
        playIncorrect();
      }
    }

    const text = formatPronounVerb(
      game.currentQuestion.pronoun,
      game.currentQuestion.correctAnswer
    );
    speak(text);
  }, [game.answered, game.phase]);  // eslint-disable-line react-hooks/exhaustive-deps

  // When finished, notify parent
  useEffect(() => {
    if (game.finished) {
      onFinish(game.results, game.bestStreak);
    }
  }, [game.finished]);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleGoToTranslation = () => {
    game.goToTranslation();
  };

  const handleNext = () => {
    game.advanceToNext();
    resetTimer();
  };

  if (!game.currentQuestion) return null;

  const { currentQuestion, currentIndex, totalQuestions, answered, selectedAnswer, phase, streak, totalPoints, lastPoints } = game;
  const streakMult = getStreakMultiplier(streak);

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-4 w-full max-w-lg mx-auto px-4">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onCancel}
          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          aria-label="Cancelar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3 text-sm font-bold">
          {streak >= 2 && (
            <span className="text-orange-500 animate-bounce-in">
              🔥 {streak}
              {streakMult > 1 && (
                <span className="text-xs ml-0.5">x{streakMult}</span>
              )}
            </span>
          )}
          <span className="text-slate-400">
            {currentIndex + 1}/{totalQuestions}
          </span>
          <span className="text-amber-500">{totalPoints} pts</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* === PHASE 1: CONJUGATION === */}
      {phase === "conjugation" && (
        <>
          {/* Timer */}
          {!answered && (
            <div className="w-full">
              <BarraTimer timeLeft={timeLeft} maxTime={timePerQuestion} />
            </div>
          )}

          {/* Question prompt */}
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-xs font-semibold text-slate-400 mb-3">
              Conjugue au futur simple:
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-lg">
                {currentQuestion.pronoun}
              </span>
              <span className="text-2xl text-slate-300 font-light">+</span>
              <span className="text-2xl font-extrabold text-slate-700">
                {currentQuestion.verb.infinitive}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              ({currentQuestion.verb.translation})
            </p>
          </div>

          {/* Options */}
          <div className="w-full flex flex-col gap-2">
            {currentQuestion.options.map((option) => {
              let btnClass =
                "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";

              if (!answered) {
                btnClass +=
                  "border-slate-200 bg-white hover:border-emerald-300 text-slate-700 cursor-pointer";
              } else if (option === currentQuestion.correctAnswer) {
                btnClass += "border-green-400 bg-green-50 text-green-700";
              } else if (option === selectedAnswer) {
                btnClass += "border-red-400 bg-red-50 text-red-500";
              } else {
                btnClass += "border-slate-100 bg-slate-50 text-slate-300";
              }

              const displayText = answered && option === currentQuestion.correctAnswer
                ? formatPronounVerb(currentQuestion.pronoun, option)
                : option;

              return (
                <button
                  key={option}
                  onClick={() => game.selectAnswer(option)}
                  disabled={answered}
                  className={btnClass}
                >
                  {displayText}
                </button>
              );
            })}
          </div>

          {/* Root + ending breakdown */}
          {answered && (
            <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <p className="text-xs font-semibold text-emerald-600 mb-1">
                {currentQuestion.verb.group === "irregulier"
                  ? "Raíz irregular:"
                  : "Raíz = infinitivo:"}
              </p>
              <p className="text-lg font-extrabold text-slate-700">
                <span className={currentQuestion.verb.group === "irregulier" ? "text-amber-600" : "text-emerald-600"}>
                  {currentQuestion.verb.futureRoot}
                </span>
                <span className="text-slate-300 mx-0.5">+</span>
                <span className="text-blue-500">
                  {FUTURE_ENDINGS[currentQuestion.pronoun]}
                </span>
                <span className="text-slate-300 mx-1">=</span>
                <span className="text-slate-700">
                  {currentQuestion.correctAnswer}
                </span>
              </p>
              {currentQuestion.verb.group === "irregulier" && (
                <p className="text-xs text-amber-600 mt-1">
                  {currentQuestion.verb.infinitive} → raíz: <strong>{currentQuestion.verb.futureRoot}</strong>
                </p>
              )}
            </div>
          )}

          {/* Feedback after conjugation answer */}
          {answered && (
            <div className="flex flex-col items-center gap-2">
              {lastPoints > 0 && (
                <p className="text-lg font-extrabold text-amber-500 animate-bounce-in">
                  +{lastPoints} pts
                </p>
              )}
              {selectedAnswer === null && (
                <p className="text-sm font-bold text-red-500">
                  Se acabó el tiempo!
                </p>
              )}
              <button
                onClick={handleGoToTranslation}
                className="mt-1 px-8 py-3 rounded-xl text-base font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* === PHASE 2: TRANSLATION QUIZ === */}
      {phase === "translation" && (
        <TranslationQuiz
          question={currentQuestion}
          allVerbs={ALL_VERBS}
          soundEnabled={soundEnabled}
          onAnswer={game.answerTranslation}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

// --- Translation Quiz sub-component ---

function TranslationQuiz({
  question,
  allVerbs,
  soundEnabled,
  onAnswer,
  onNext,
}: {
  question: ConjugaisonQuestion;
  allVerbs: typeof ALL_VERBS;
  soundEnabled: boolean;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const { correct: correctTranslation, options } = useMemo(
    () => generateTranslationOptions(question.verb, question.pronoun, allVerbs),
    [question, allVerbs]
  );

  const handleSelect = (option: string) => {
    if (answered) return;
    const isCorrect = option === correctTranslation;
    setSelected(option);
    setAnswered(true);
    onAnswer(isCorrect);
    if (soundEnabled) {
      if (isCorrect) playCorrect();
      else playIncorrect();
    }
  };

  const conjugated = formatPronounVerb(question.pronoun, question.correctAnswer);

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-4 w-full">
      <p className="text-sm font-semibold text-slate-400">¿Qué significa...?</p>
      <p className="text-2xl font-extrabold text-slate-700">{conjugated}</p>

      <div className="w-full flex flex-col gap-2">
        {options.map((option) => {
          let btnClass =
            "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";

          if (!answered) {
            btnClass +=
              "border-slate-200 bg-white hover:border-blue-300 text-slate-700 cursor-pointer";
          } else if (option === correctTranslation) {
            btnClass += "border-green-400 bg-green-50 text-green-700";
          } else if (option === selected) {
            btnClass += "border-red-400 bg-red-50 text-red-500";
          } else {
            btnClass += "border-slate-100 bg-slate-50 text-slate-300";
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={btnClass}
            >
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <button
          onClick={onNext}
          className="mt-1 px-8 py-3 rounded-xl text-base font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          Siguiente
        </button>
      )}
    </div>
  );
}
