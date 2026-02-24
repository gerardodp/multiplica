"use client";

import { useState, useEffect, useCallback } from "react";

export interface MultiplicaSettings {
  selectedTables: number[];
  selectedTime: number;
  highScore: number;
}

const STORAGE_KEY = "multiplica-rapido-settings";

const defaultMultiplicaSettings: MultiplicaSettings = {
  selectedTables: [2, 3, 4, 5],
  selectedTime: 60,
  highScore: 0,
};

function loadMultiplicaSettings(): MultiplicaSettings {
  if (typeof window === "undefined") return defaultMultiplicaSettings;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        selectedTables: parsed.selectedTables ?? defaultMultiplicaSettings.selectedTables,
        selectedTime: parsed.selectedTime ?? defaultMultiplicaSettings.selectedTime,
        highScore: parsed.highScore ?? defaultMultiplicaSettings.highScore,
      };
    }
  } catch {
    // ignore parse errors
  }
  return defaultMultiplicaSettings;
}

function saveMultiplicaSettings(settings: MultiplicaSettings) {
  if (typeof window === "undefined") return;
  try {
    // Merge into existing key to preserve backward compatibility
    const stored = localStorage.getItem(STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : {};
    const merged = { ...existing, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore storage errors
  }
}

export function useMultiplicaSettings() {
  const [settings, setSettings] = useState<MultiplicaSettings>(defaultMultiplicaSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load from localStorage on mount
    setSettings(loadMultiplicaSettings());
    setLoaded(true);
  }, []);

  const updateSettings = useCallback(
    (updates: Partial<MultiplicaSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...updates };
        saveMultiplicaSettings(next);
        return next;
      });
    },
    []
  );

  const updateHighScore = useCallback(
    (score: number) => {
      setSettings((prev) => {
        if (score > prev.highScore) {
          const next = { ...prev, highScore: score };
          saveMultiplicaSettings(next);
          return next;
        }
        return prev;
      });
    },
    []
  );

  const resetSettings = useCallback(() => {
    // Only reset multiplica-specific fields, preserve playerName etc.
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const existing = stored ? JSON.parse(stored) : {};
        const merged = { ...existing, ...defaultMultiplicaSettings };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // ignore
      }
    }
    setSettings(defaultMultiplicaSettings);
  }, []);

  return { settings, loaded, updateSettings, updateHighScore, resetSettings };
}
