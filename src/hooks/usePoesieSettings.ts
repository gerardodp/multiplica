"use client";

import { useState, useEffect, useCallback } from "react";
import type { PoesieSettings, PoemProgress } from "@/lib/poesie/types";

const STORAGE_KEY = "poesie-settings";

const defaultSettings: PoesieSettings = {
  poemProgress: {},
};

function loadSettings(): PoesieSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return defaultSettings;
}

function saveSettings(settings: PoesieSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function usePoesieSettings() {
  const [settings, setSettings] = useState<PoesieSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load from localStorage on mount
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  const updateSettings = useCallback(
    (updates: Partial<PoesieSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...updates };
        saveSettings(next);
        return next;
      });
    },
    []
  );

  const savePoemProgress = useCallback(
    (poemId: string, progress: PoemProgress) => {
      setSettings((prev) => {
        const next = {
          ...prev,
          poemProgress: {
            ...prev.poemProgress,
            [poemId]: progress,
          },
        };
        saveSettings(next);
        return next;
      });
    },
    []
  );

  return { settings, loaded, updateSettings, savePoemProgress };
}
