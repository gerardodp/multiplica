"use client";

import type { VerbGroup, ConjugaisonDifficulty, RoundSize } from "@/lib/conjugaison/types";
import { DIFFICULTY_CONFIGS } from "@/lib/conjugaison/types";
import { VERBS_BY_GROUP } from "@/lib/conjugaison/verbs";

interface Props {
  selectedGroups: VerbGroup[];
  difficulty: ConjugaisonDifficulty;
  roundSize: RoundSize;
  onChangeGroups: (groups: VerbGroup[]) => void;
  onChangeDifficulty: (d: ConjugaisonDifficulty) => void;
  onChangeRoundSize: (s: RoundSize) => void;
  onStart: () => void;
}

const GROUP_LABELS: Record<VerbGroup, { label: string; example: string }> = {
  "1er": { label: "1er grupo (-er)", example: "chanter, jouer..." },
  "2eme": { label: "2ème grupo (-ir)", example: "finir, choisir..." },
  "3eme": { label: "3ème grupo", example: "partir" },
  irregulier: { label: "Irregulares", example: "aller, faire, être..." },
};

const DIFFICULTIES: ConjugaisonDifficulty[] = [1, 2, 3];
const ROUND_SIZES: RoundSize[] = [10, 20, 30];

export default function ConfiguracionConjugaison({
  selectedGroups,
  difficulty,
  roundSize,
  onChangeGroups,
  onChangeDifficulty,
  onChangeRoundSize,
  onStart,
}: Props) {
  const toggleGroup = (group: VerbGroup) => {
    if (selectedGroups.includes(group)) {
      // Don't allow deselecting the last one
      if (selectedGroups.length <= 1) return;
      onChangeGroups(selectedGroups.filter((g) => g !== group));
    } else {
      onChangeGroups([...selectedGroups, group]);
    }
  };

  // Count total available questions
  const totalVerbs = selectedGroups.reduce(
    (sum, g) => sum + VERBS_BY_GROUP[g].length,
    0
  );

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-7 w-full max-w-lg mx-auto px-4">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">📝</div>
        <h2 className="text-3xl font-extrabold text-slate-700">Conjugaison</h2>
        <p className="mt-2 text-sm text-slate-400">
          Practica el futuro simple en francés
        </p>
      </div>

      {/* Verb group selector */}
      <div className="w-full">
        <label className="block text-sm font-semibold text-slate-600 mb-3">
          Verbos a practicar
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(GROUP_LABELS) as VerbGroup[]).map((group) => {
            const selected = selectedGroups.includes(group);
            const info = GROUP_LABELS[group];
            const count = VERBS_BY_GROUP[group].length;
            return (
              <button
                key={group}
                onClick={() => toggleGroup(group)}
                className={`p-3 rounded-xl text-left font-bold transition-all duration-200 cursor-pointer ${
                  selected
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-[1.02]"
                    : "bg-white text-slate-400 border-2 border-slate-200 hover:border-emerald-300 hover:text-emerald-500"
                }`}
              >
                <div className="text-sm">{info.label}</div>
                <div className="text-xs mt-0.5 opacity-75">
                  {info.example} ({count})
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          {totalVerbs} verbos seleccionados ({totalVerbs * 6} combinaciones)
        </p>
      </div>

      {/* Round size selector */}
      <div className="w-full">
        <label className="block text-sm font-semibold text-slate-600 mb-3">
          Preguntas por ronda
        </label>
        <div className="flex gap-3">
          {ROUND_SIZES.map((size) => {
            const selected = size === roundSize;
            return (
              <button
                key={size}
                onClick={() => onChangeRoundSize(size)}
                className={`flex-1 py-3 rounded-xl text-center font-bold transition-all duration-200 cursor-pointer ${
                  selected
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-105"
                    : "bg-white text-slate-400 border-2 border-slate-200 hover:border-emerald-300 hover:text-emerald-400"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="w-full">
        <label className="block text-sm font-semibold text-slate-600 mb-3">
          Dificultad
        </label>
        <div className="flex gap-3">
          {DIFFICULTIES.map((d) => {
            const config = DIFFICULTY_CONFIGS[d];
            const selected = d === difficulty;
            return (
              <button
                key={d}
                onClick={() => onChangeDifficulty(d)}
                className={`flex-1 py-3 rounded-xl text-center font-bold transition-all duration-200 cursor-pointer ${
                  selected
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-105"
                    : "bg-white text-slate-400 border-2 border-slate-200 hover:border-emerald-300 hover:text-emerald-400"
                }`}
              >
                <div className="text-sm">{config.label}</div>
                <div className="text-xs mt-0.5 opacity-75">
                  {config.timePerQuestion}s
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        disabled={totalVerbs === 0}
        className={`w-full py-4 rounded-2xl text-xl font-extrabold transition-all cursor-pointer ${
          totalVerbs > 0
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-200 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            : "bg-slate-100 text-slate-300 cursor-not-allowed"
        }`}
      >
        Empezar!
      </button>
    </div>
  );
}
