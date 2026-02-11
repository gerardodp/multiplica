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
}

function generateQuestion(tables: number[]): { a: number; b: number } {
  const a = tables[Math.floor(Math.random() * tables.length)];
  const b = Math.floor(Math.random() * 12) + 1;
  return { a, b };
}

export default function PantallaDeJuego({
  playerName,
  selectedTables,
  totalTime,
  onGameEnd,
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
      <div className="flex flex-col items-center justify-center gap-4 min-h-[400px]">
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
    <div className="animate-fade-in-up flex flex-col items-center gap-4 w-full max-w-lg mx-auto px-4">
      {/* Header con nombre y score */}
      <div className="flex justify-between items-center w-full">
        <p className="text-sm font-semibold text-purple-500">
          Vamos, {playerName}!
        </p>
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
      <p className="text-sm text-slate-400 -mt-2">{timeLeft}s</p>

      {/* Pregunta */}
      <div
        className={`w-full p-6 rounded-3xl text-center transition-all duration-300 ${
          feedback === "correct"
            ? "bg-green-50 animate-pulse-green"
            : feedback === "incorrect"
              ? "bg-red-50 animate-shake"
              : "bg-white shadow-xl"
        }`}
      >
        <div className="text-5xl sm:text-6xl font-extrabold text-slate-700">
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
