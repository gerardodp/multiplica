"use client";

import { useState, useEffect, useCallback } from "react";
import { setSoundEnabled } from "@/lib/sounds";

export interface PlatformSettings {
  playerName: string;
  soundEnabled: boolean;
}

const PLATFORM_KEY = "aprendemos-settings";
const OLD_KEY = "multiplica-rapido-settings";

const defaultSettings: PlatformSettings = {
  playerName: "",
  soundEnabled: true,
};

function migrateFromOldKey(): PlatformSettings | null {
  if (typeof window === "undefined") return null;
  try {
    // Already migrated?
    const existing = localStorage.getItem(PLATFORM_KEY);
    if (existing) return null;

    const old = localStorage.getItem(OLD_KEY);
    if (old) {
      const parsed = JSON.parse(old);
      if (parsed.playerName) {
        const migrated: PlatformSettings = {
          playerName: parsed.playerName ?? "",
          soundEnabled: parsed.soundEnabled ?? true,
        };
        localStorage.setItem(PLATFORM_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function loadSettings(): PlatformSettings {
  if (typeof window === "undefined") return defaultSettings;

  // Try migration first
  const migrated = migrateFromOldKey();
  if (migrated) return migrated;

  try {
    const stored = localStorage.getItem(PLATFORM_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
    }
  } catch {
    // ignore parse errors
  }
  return defaultSettings;
}

function saveSettings(settings: PlatformSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PLATFORM_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage errors
  }
}

export function useGameSettings() {
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s = loadSettings();
    setSoundEnabled(s.soundEnabled);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load from localStorage on mount
    setSettings(s);
    setLoaded(true);
  }, []);

  const updateSettings = useCallback(
    (updates: Partial<PlatformSettings>) => {
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

  const resetSettings = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PLATFORM_KEY);
    }
    setSoundEnabled(defaultSettings.soundEnabled);
    setSettings(defaultSettings);
  }, []);

  const isConfigured = loaded && settings.playerName.trim().length > 0;

  return { settings, loaded, isConfigured, updateSettings, resetSettings };
}
