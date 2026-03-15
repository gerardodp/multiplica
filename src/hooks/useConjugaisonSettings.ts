"use client";

import { useState, useEffect, useCallback } from "react";
import type { VerbGroup, ConjugaisonDifficulty, RoundSize } from "@/lib/conjugaison/types";

export interface ConjugaisonSettings {
  selectedGroups: VerbGroup[];
  difficulty: ConjugaisonDifficulty;
  roundSize: RoundSize;
  bestScore: number;
  gamesPlayed: number;
}

const STORAGE_KEY = "conjugaison-settings";

const defaultSettings: ConjugaisonSettings = {
  selectedGroups: ["1er", "2eme"],
  difficulty: 1,
  roundSize: 10,
  bestScore: 0,
  gamesPlayed: 0,
};

function loadSettings(): ConjugaisonSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultSettings };
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings(settings: ConjugaisonSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function useConjugaisonSettings() {
  const [settings, setSettings] = useState<ConjugaisonSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load from localStorage on mount
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  const updateSettings = useCallback(
    (partial: Partial<ConjugaisonSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...partial };
        saveSettings(next);
        return next;
      });
    },
    []
  );

  const saveGameScore = useCallback((totalPoints: number) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        bestScore: Math.max(prev.bestScore, totalPoints),
      };
      saveSettings(next);
      return next;
    });
  }, []);

  return { settings, loaded, updateSettings, saveGameScore };
}
