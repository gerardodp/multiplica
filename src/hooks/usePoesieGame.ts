"use client";

import { useState, useCallback, useMemo } from "react";
import type { Poem, Verse, PoemProgress } from "@/lib/poesie/types";
import { shuffleWithGuarantee } from "@/lib/poesie/shuffle";

export type StanzaStatus = "pending" | "current" | "completed";

export interface VerseWithFeedback extends Verse {
  isCorrect?: boolean;
}

export function usePoesieGame(poem: Poem) {
  const [currentStanzaIndex, setCurrentStanzaIndex] = useState(0);
  const [shuffledVerses, setShuffledVerses] = useState<Verse[]>(() =>
    shuffleWithGuarantee([...poem.stanzas[0].verses])
  );
  const [attempts, setAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [stanzaComplete, setStanzaComplete] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [feedback, setFeedback] = useState<boolean[] | null>(null);
  const [completedStanzas, setCompletedStanzas] = useState<number[]>([]);

  const currentStanza = poem.stanzas[currentStanzaIndex];

  const stanzaStatuses: StanzaStatus[] = useMemo(() => {
    return poem.stanzas.map((_, i) => {
      if (completedStanzas.includes(i)) return "completed";
      if (i === currentStanzaIndex) return "current";
      return "pending";
    });
  }, [poem.stanzas, completedStanzas, currentStanzaIndex]);

  const reorderVerses = useCallback((newOrder: Verse[]) => {
    setShuffledVerses(newOrder);
    setFeedback(null);
  }, []);

  const checkOrder = useCallback((): boolean => {
    const correct = currentStanza.verses;
    const isCorrect = shuffledVerses.map(
      (v, i) => v.id === correct[i].id
    );
    setFeedback(isCorrect);
    setAttempts((a) => a + 1);
    setTotalAttempts((a) => a + 1);

    if (isCorrect.every(Boolean)) {
      setStanzaComplete(true);
      setCompletedStanzas((prev) => [...prev, currentStanzaIndex]);
      return true;
    }
    return false;
  }, [currentStanza, shuffledVerses, currentStanzaIndex]);

  const advanceToNextStanza = useCallback(() => {
    const nextIndex = currentStanzaIndex + 1;
    if (nextIndex >= poem.stanzas.length) {
      setAllComplete(true);
      return;
    }
    setCurrentStanzaIndex(nextIndex);
    setShuffledVerses(
      shuffleWithGuarantee([...poem.stanzas[nextIndex].verses])
    );
    setAttempts(0);
    setStanzaComplete(false);
    setFeedback(null);
  }, [currentStanzaIndex, poem.stanzas]);

  const resetGame = useCallback(() => {
    setCurrentStanzaIndex(0);
    setShuffledVerses(shuffleWithGuarantee([...poem.stanzas[0].verses]));
    setAttempts(0);
    setTotalAttempts(0);
    setStanzaComplete(false);
    setAllComplete(false);
    setFeedback(null);
    setCompletedStanzas([]);
  }, [poem.stanzas]);

  const getProgress = useCallback((): PoemProgress => {
    return {
      completedStanzas,
      totalAttempts,
      completed: allComplete,
    };
  }, [completedStanzas, totalAttempts, allComplete]);

  return {
    currentStanzaIndex,
    currentStanza,
    shuffledVerses,
    attempts,
    totalAttempts,
    stanzaComplete,
    allComplete,
    feedback,
    stanzaStatuses,
    reorderVerses,
    checkOrder,
    advanceToNextStanza,
    resetGame,
    getProgress,
  };
}
