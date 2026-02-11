"use client";

import { useState, useEffect, useCallback } from "react";
import { setSoundEnabled } from "@/lib/sounds";

interface GameSettings {
  playerName: string;
  selectedTables: number[];
  selectedTime: number;
  highScore: number;
  soundEnabled: boolean;
}

const STORAGE_KEY = "multiplica-rapido-settings";

const defaultSettings: GameSettings = {
  playerName: "",
  selectedTables: [2, 3, 4, 5],
  selectedTime: 60,
  highScore: 0,
  soundEnabled: true,
};

function loadSettings(): GameSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
    }
  } catch {
    // ignore parse errors
  }
  return defaultSettings;
}

function saveSettings(settings: GameSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage errors
  }
}

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s = loadSettings();
    setSoundEnabled(s.soundEnabled);
    setSettings(s);
    setLoaded(true);
  }, []);

  const updateSettings = useCallback(
    (updates: Partial<GameSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...updates };
        if (updates.soundEnabled !== undefined) {
          setSoundEnabled(updates.soundEnabled);
        }
        saveSettings(next);
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
          saveSettings(next);
          return next;
        }
        return prev;
      });
    },
    []
  );

  const resetSettings = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setSoundEnabled(defaultSettings.soundEnabled);
    setSettings(defaultSettings);
  }, []);

  const isConfigured = loaded && settings.playerName.trim().length > 0;

  return { settings, loaded, isConfigured, updateSettings, updateHighScore, resetSettings };
}
