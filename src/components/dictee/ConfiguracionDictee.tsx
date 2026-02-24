"use client";

import type { DicteeLevel } from "@/lib/dictee/types";
import { LEVEL_CONFIGS } from "@/lib/dictee/types";

interface Props {
  level: DicteeLevel;
  proMode: boolean;
  onChangeLevel: (level: DicteeLevel) => void;
  onChangeProMode: (proMode: boolean) => void;
  onBack: () => void;
}

const LEVELS: DicteeLevel[] = [1, 2, 3];

export default function ConfiguracionDictee({ level, proMode, onChangeLevel, onChangeProMode, onBack }: Props) {
  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-8 w-full max-w-lg mx-auto px-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-700">Configuración</h2>
        <p className="mt-2 text-sm text-slate-400">Ajusta la dificultad de Dictée</p>
      </div>

      {/* Level selector */}
      <div className="w-full">
        <label className="block text-sm font-semibold text-slate-600 mb-3">
          Nivel de dificultad
        </label>
        <div className="flex gap-3">
          {LEVELS.map((l) => {
            const config = LEVEL_CONFIGS[l];
            const selected = l === level;
            return (
              <button
                key={l}
                onClick={() => onChangeLevel(l)}
                className={`flex-1 py-3 rounded-xl text-center font-bold transition-all duration-200 cursor-pointer ${
                  selected
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-200 scale-105"
                    : "bg-white text-slate-400 border-2 border-slate-200 hover:border-purple-300 hover:text-purple-400"
                }`}
              >
                <div className="text-sm">{config.label}</div>
                <div className="text-xs mt-0.5 opacity-75">{config.timePerWord}s</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pro mode toggle */}
      <div className="w-full flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-slate-600">
            Modo Pro
          </label>
          <p className="text-xs text-slate-400 mt-0.5">Sin pistas: no verás cuántas letras tiene la palabra</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={proMode}
          onClick={() => onChangeProMode(!proMode)}
          className={`relative w-14 h-8 rounded-full transition-colors duration-200 cursor-pointer ${
            proMode ? "bg-purple-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
              proMode ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Back button — same style as multiplica "Guardar" */}
      <button
        onClick={onBack}
        className="w-full py-4 rounded-2xl text-xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-xl shadow-green-200 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
      >
        Guardar
      </button>
    </div>
  );
}
