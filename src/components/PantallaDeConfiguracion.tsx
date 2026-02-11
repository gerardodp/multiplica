"use client";

import { useState } from "react";

interface Props {
  playerName: string;
  selectedTables: number[];
  selectedTime: number;
  soundEnabled: boolean;
  onUpdateName: (name: string) => void;
  onToggleTable: (table: number) => void;
  onSelectTime: (time: number) => void;
  onToggleSound: () => void;
  onReset: () => void;
  onStartGame: () => void;
}

const ALL_TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const TIME_OPTIONS = [30, 60, 90];

export default function PantallaDeConfiguracion({
  playerName,
  selectedTables,
  selectedTime,
  soundEnabled,
  onUpdateName,
  onToggleTable,
  onSelectTime,
  onToggleSound,
  onReset,
  onStartGame,
}: Props) {
  const [confirmReset, setConfirmReset] = useState(false);
  const canStart = playerName.trim().length > 0 && selectedTables.length > 0;

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-8 w-full max-w-lg mx-auto px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Multiplica Rápido
        </h1>
        <p className="mt-2 text-lg text-slate-500">
          Practica las tablas de multiplicar
        </p>
      </div>

      {/* Nombre */}
      <div className="w-full">
        <label
          htmlFor="player-name"
          className="block text-sm font-semibold text-slate-600 mb-2"
        >
          Tu nombre
        </label>
        <input
          id="player-name"
          type="text"
          value={playerName}
          onChange={(e) => onUpdateName(e.target.value)}
          placeholder="Escribe tu nombre..."
          maxLength={20}
          className="w-full px-4 py-3 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors bg-white text-slate-700 placeholder:text-slate-300"
        />
      </div>

      {/* Tablas */}
      <div className="w-full">
        <label className="block text-sm font-semibold text-slate-600 mb-3">
          Tablas a practicar
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {ALL_TABLES.map((table) => {
            const isSelected = selectedTables.includes(table);
            return (
              <button
                key={table}
                onClick={() => onToggleTable(table)}
                className={`py-3 rounded-xl text-lg font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-200 scale-105"
                    : "bg-white text-slate-400 border-2 border-slate-200 hover:border-purple-300 hover:text-purple-400"
                }`}
              >
                {table}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tiempo */}
      <div className="w-full">
        <label className="block text-sm font-semibold text-slate-600 mb-3">
          Tiempo de juego
        </label>
        <div className="flex gap-3">
          {TIME_OPTIONS.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                onClick={() => onSelectTime(time)}
                className={`flex-1 py-3 rounded-xl text-lg font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-orange-400 text-white shadow-lg shadow-orange-200 scale-105"
                    : "bg-white text-slate-400 border-2 border-slate-200 hover:border-orange-300 hover:text-orange-400"
                }`}
              >
                {time}s
              </button>
            );
          })}
        </div>
      </div>

      {/* Sonido */}
      <div className="w-full flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-600">
          Sonido
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={soundEnabled}
          onClick={onToggleSound}
          className={`relative w-14 h-8 rounded-full transition-colors duration-200 cursor-pointer ${
            soundEnabled ? "bg-purple-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
              soundEnabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Resetear */}
      <div className="w-full">
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="w-full py-3 rounded-xl text-sm font-semibold text-red-400 border-2 border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Resetear todo
          </button>
        ) : (
          <div className="flex gap-2 animate-fade-in-up">
            <button
              type="button"
              onClick={() => {
                onReset();
                setConfirmReset(false);
              }}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
            >
              Si, borrar todo
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-500 border-2 border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Boton guardar */}
      <button
        onClick={onStartGame}
        disabled={!canStart}
        className={`w-full py-4 rounded-2xl text-xl font-extrabold transition-all duration-300 cursor-pointer ${
          canStart
            ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-xl shadow-green-200 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        Guardar
      </button>
    </div>
  );
}
