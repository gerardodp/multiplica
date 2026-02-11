"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import TecladoNumerico from "./TecladoNumerico";
import { playCorrect, playIncorrect, playTick, playGo, playTimeUp } from "@/lib/sounds";
import type { QuestionRecord } from "@/lib/types";

interface Props {
  playerName: string;
  selectedTables: number[];
  totalTime: number;
  onGameEnd: (score: number, total: number, history: QuestionRecord[]) => void;
  onCancel: (score: number, total: number, history: QuestionRecord[]) => void;
}

function generateQuestion(tables: number[]): { a: number; b: number } {
  const table = tables[Math.floor(Math.random() * tables.length)];
  const factor = Math.floor(Math.random() * 10) + 1;
  // Randomize order of factors
  if (Math.random() < 0.5) {
    return { a: table, b: factor };
  }
  return { a: factor, b: table };
}

export default function PantallaDeJuego({
  playerName,
  selectedTables,
  totalTime,
  onGameEnd,
  onCancel,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [question, setQuestion] = useState(() =>
    generateQuestion(selectedTables)
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const historyRef = useRef<QuestionRecord[]>([]);

  // Countdown before game starts
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1) {
          playGo();
        } else {
          playTick();
        }
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!started) {
      setStarted(true);
    }
  }, [countdown, started]);

  // Game timer
  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) {
      playTimeUp();
      onGameEnd(score, totalAnswered, historyRef.current);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, score, totalAnswered, onGameEnd]);

  const handleSubmit = useCallback(() => {
    if (!answer.trim() || !started) return;

    const correctAnswer = question.a * question.b;
    const userAnswer = parseInt(answer);
    const isCorrect = userAnswer === correctAnswer;

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }

    historyRef.current.push({
      a: question.a,
      b: question.b,
      userAnswer,
      correctAnswer,
      isCorrect,
    });

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedback("correct");
      playCorrect();
    } else {
      setFeedback("incorrect");
      playIncorrect();
    }

    setTotalAnswered((prev) => prev + 1);
    setAnswer("");

    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
      setQuestion(generateQuestion(selectedTables));
    }, 600);
  }, [answer, question, selectedTables, started]);

  const progressPercent = (timeLeft / totalTime) * 100;
  const timeBarColor =
    progressPercent > 50
      ? "bg-green-400"
      : progressPercent > 25
        ? "bg-yellow-400"
        : "bg-red-400";

  // Countdown screen
  if (countdown > 0) {
    return (
      <div className="game-countdown flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <p className="text-xl text-slate-500">
          Preparate, {playerName}!
        </p>
        <div className="animate-bounce-in text-8xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          {countdown}
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen animate-fade-in-up flex flex-col items-center gap-4 w-full max-w-lg mx-auto px-4">
      {/* Header con nombre y score */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCancel(score, totalAnswered, historyRef.current)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors cursor-pointer"
            aria-label="Cancelar partida"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </button>
          <p className="text-sm font-semibold text-purple-500">
            {playerName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-emerald-500">
            {score}
          </span>
          <span className="text-sm text-slate-400">puntos</span>
        </div>
      </div>

      {/* Barra de tiempo */}
      <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${timeBarColor} rounded-full transition-all duration-1000 ease-linear`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="game-timer-text text-sm text-slate-400 -mt-2">{timeLeft}s</p>

      {/* Pregunta */}
      <div
        className={`game-question w-full p-6 rounded-3xl text-center transition-all duration-300 ${
          feedback === "correct"
            ? "bg-green-50 animate-pulse-green"
            : feedback === "incorrect"
              ? "bg-red-50 animate-shake"
              : "bg-white shadow-xl"
        }`}
      >
        <div className="game-question-text text-5xl sm:text-6xl font-extrabold text-slate-700">
          {question.a}{" "}
          <span className="text-purple-500">x</span>{" "}
          {question.b}
        </div>

        <p
          className={`mt-2 text-lg font-bold h-7 transition-opacity duration-200 ${
            feedback === "correct"
              ? "text-green-500 opacity-100"
              : feedback === "incorrect"
                ? "text-red-400 opacity-100"
                : "opacity-0"
          }`}
        >
          {feedback === "correct" && "Correcto!"}
          {feedback === "incorrect" && `Era ${question.a * question.b}`}
          {!feedback && "\u00A0"}
        </p>
      </div>

      {/* Teclado numerico */}
      <TecladoNumerico
        value={answer}
        onChange={setAnswer}
        onSubmit={handleSubmit}
        disabled={feedback !== null}
      />
    </div>
  );
}
