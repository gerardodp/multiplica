"use client";

import { useState, useEffect, useCallback } from "react";
import type { DicteeLevel } from "@/lib/dictee/types";

export interface LessonScore {
  correct: number;
  total: number;
  bestPoints: number;
}

export interface DicteeSettings {
  lastLessonId: string;
  lessonScores: Record<string, LessonScore>;
  level: DicteeLevel;
  proMode: boolean;
}

const STORAGE_KEY = "dictee-settings";

const defaultSettings: DicteeSettings = {
  lastLessonId: "",
  lessonScores: {},
  level: 1,
  proMode: false,
};

function loadSettings(): DicteeSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Spread defaults for backwards compat with old data missing new fields
      const settings = { ...defaultSettings, ...parsed };
      // Ensure existing lessonScores get bestPoints default
      for (const key of Object.keys(settings.lessonScores)) {
        settings.lessonScores[key] = {
          bestPoints: 0,
          ...settings.lessonScores[key],
        };
      }
      return settings;
    }
  } catch {
    // ignore
  }
  return defaultSettings;
}

function saveSettings(settings: DicteeSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function useDicteeSettings() {
  const [settings, setSettings] = useState<DicteeSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load from localStorage on mount
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  const updateSettings = useCallback(
    (updates: Partial<DicteeSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...updates };
        saveSettings(next);
        return next;
      });
    },
    []
  );

  const saveLessonScore = useCallback(
    (lessonId: string, correct: number, total: number, totalPoints: number) => {
      setSettings((prev) => {
        const existing = prev.lessonScores[lessonId];
        const bestPoints = Math.max(existing?.bestPoints ?? 0, totalPoints);
        const next = {
          ...prev,
          lastLessonId: lessonId,
          lessonScores: {
            ...prev.lessonScores,
            [lessonId]: { correct, total, bestPoints },
          },
        };
        saveSettings(next);
        return next;
      });
    },
    []
  );

  return { settings, loaded, updateSettings, saveLessonScore };
}
