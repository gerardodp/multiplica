"use client";

import { useState, useCallback } from "react";
import { useGameSettings } from "@/hooks/useGameSettings";
import GameCard from "@/components/GameCard";

export default function Home() {
  const { settings, loaded, isConfigured, updateSettings } = useGameSettings();
  const [nameInput, setNameInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const handleSaveName = useCallback(() => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      updateSettings({ playerName: trimmed });
    }
  }, [nameInput, updateSettings]);

  const handleToggleSound = useCallback(() => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  }, [settings.soundEnabled, updateSettings]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-purple-400 animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  // Name setup screen
  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="animate-fade-in-up flex flex-col items-center gap-8 w-full max-w-md mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Aprendemos!
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Mini-juegos educativos para aprender jugando
            </p>
          </div>

          <div className="w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
            <label className="text-sm font-semibold text-slate-600">
              Como te llamas?
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              placeholder="Tu nombre..."
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-lg font-semibold text-slate-700"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              disabled={!nameInput.trim()}
              className={`w-full py-4 rounded-xl text-lg font-extrabold transition-all ${
                nameInput.trim()
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl cursor-pointer"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              Empezar!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Settings panel
  if (showSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="animate-fade-in-up flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-slate-700">Ajustes</h2>

          <div className="w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-5">
            {/* Player name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-500">Nombre</label>
              <input
                type="text"
                value={settings.playerName}
                onChange={(e) => updateSettings({ playerName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-lg font-semibold text-slate-700"
              />
            </div>

            {/* Sound toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Sonido</span>
              <button
                onClick={handleToggleSound}
                className={`w-14 h-8 rounded-full transition-all cursor-pointer ${
                  settings.soundEnabled ? "bg-purple-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                    settings.soundEnabled ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="w-full py-4 rounded-xl text-lg font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    );
  }

  // Game selector
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="animate-fade-in-up flex flex-col items-center gap-8 w-full max-w-md mx-auto px-4">
        {/* Settings button */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 rounded-xl bg-white/80 text-slate-400 hover:text-purple-500 hover:bg-white shadow-md transition-all cursor-pointer"
            aria-label="Ajustes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.431.992a7.723 7.723 0 010 .255c-.007.38.138.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Aprendemos!
          </h1>
          <p className="mt-3 text-xl text-slate-600 font-semibold">
            Hola, {settings.playerName}!
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Elige un juego para empezar
          </p>
        </div>

        {/* Game cards */}
        <div className="w-full flex flex-col gap-4">
          <GameCard
            href="/multiplica"
            emoji="✖️"
            title="Multiplica Rápido"
            description="Practica las tablas de multiplicar contra el reloj"
            gradient="bg-gradient-to-br from-purple-500 to-pink-500"
          />
          <GameCard
            href="/dictee"
            emoji="🇫🇷"
            title="Dictée"
            description="Practica la ortografía en francés con un ahorcado por audio"
            gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}
