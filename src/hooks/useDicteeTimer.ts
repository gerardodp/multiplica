"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useDicteeTimer(
  timePerWord: number,
  active: boolean,
  onTimeUp: () => void
) {
  const [timeLeft, setTimeLeft] = useState(timePerWord);
  const onTimeUpRef = useRef(onTimeUp);
  const firedRef = useRef(false);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0 && !firedRef.current) {
          firedRef.current = true;
          setTimeout(() => onTimeUpRef.current(), 0);
          return 0;
        }
        return Math.max(0, next);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  const resetTimer = useCallback(() => {
    setTimeLeft(timePerWord);
    firedRef.current = false;
  }, [timePerWord]);

  return { timeLeft, resetTimer };
}
