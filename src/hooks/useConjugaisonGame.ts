"use client";

import { useState, useCallback, useRef } from "react";
import type {
  ConjugaisonQuestion,
  ConjugaisonQuestionResult,
  ConjugaisonDifficulty,
} from "@/lib/conjugaison/types";
import { calculateQuestionPoints } from "@/lib/conjugaison/scoring";

export function useConjugaisonGame(
  questions: ConjugaisonQuestion[],
  difficulty: ConjugaisonDifficulty,
  timePerQuestion: number
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<ConjugaisonQuestionResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [finished, setFinished] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);

  // eslint-disable-next-line react-hooks/purity -- ref initialized once, not a render concern
  const questionStartTime = useRef(Date.now());

  const currentQuestion =
    currentIndex < questions.length ? questions[currentIndex] : null;

  const selectAnswer = useCallback(
    (answer: string) => {
      if (answered || !currentQuestion) return;

      const timeUsed = (Date.now() - questionStartTime.current) / 1000;
      const correct = answer === currentQuestion.correctAnswer;
      const newStreak = correct ? streak + 1 : 0;

      const points = calculateQuestionPoints({
        correct,
        timeUsed,
        timePerQuestion,
        difficulty,
        streak: correct ? newStreak : 0,
      });

      const result: ConjugaisonQuestionResult = {
        question: currentQuestion,
        selectedAnswer: answer,
        correct,
        timeUsed,
        points,
      };

      setSelectedAnswer(answer);
      setAnswered(true);
      setLastPoints(points);
      setResults((prev) => [...prev, result]);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setTotalPoints((prev) => prev + points);
    },
    [answered, currentQuestion, streak, bestStreak, timePerQuestion, difficulty]
  );

  const handleTimeUp = useCallback(() => {
    if (answered || !currentQuestion) return;

    const timeUsed = timePerQuestion;
    const result: ConjugaisonQuestionResult = {
      question: currentQuestion,
      selectedAnswer: null,
      correct: false,
      timeUsed,
      points: 0,
    };

    setAnswered(true);
    setLastPoints(0);
    setResults((prev) => [...prev, result]);
    setStreak(0);
  }, [answered, currentQuestion, timePerQuestion]);

  const advanceToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex(nextIndex);
    setSelectedAnswer(null);
    setAnswered(false);
    setLastPoints(0);
    questionStartTime.current = Date.now();
  }, [currentIndex, questions.length]);

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    selectedAnswer,
    answered,
    streak,
    bestStreak,
    totalPoints,
    lastPoints,
    finished,
    results,
    selectAnswer,
    handleTimeUp,
    advanceToNext,
  };
}
