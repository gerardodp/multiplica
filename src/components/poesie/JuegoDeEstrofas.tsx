"use client";

import { useCallback, useEffect } from "react";
import type { Poem, PoemProgress } from "@/lib/poesie/types";
import { usePoesieGame } from "@/hooks/usePoesieGame";
import { useDragReorder } from "@/hooks/useDragReorder";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { playCorrect, playIncorrect } from "@/lib/sounds";
import ProgresoEstrofas from "./ProgresoEstrofas";
import VersoArrastrable from "./VersoArrastrable";
import EstrofaCompletada from "./EstrofaCompletada";

interface Props {
  poem: Poem;
  soundEnabled: boolean;
  onFinish: (progress: PoemProgress) => void;
}

export default function JuegoDeEstrofas({
  poem,
  soundEnabled,
  onFinish,
}: Props) {
  const {
    currentStanzaIndex,
    currentStanza,
    shuffledVerses,
    attempts,
    stanzaComplete,
    allComplete,
    feedback,
    stanzaStatuses,
    reorderVerses,
    checkOrder,
    advanceToNextStanza,
    getProgress,
  } = usePoesieGame(poem);

  const { speak } = useSpeechSynthesis();

  const {
    drag,
    setItemRef,
    handlePointerDown,
    containerProps,
  } = useDragReorder(shuffledVerses, reorderVerses);

  // Speak the stanza when completed
  useEffect(() => {
    if (stanzaComplete && soundEnabled) {
      const text = currentStanza.verses.map((v) => v.text).join(" ");
      speak(text, 0.8);
    }
  }, [stanzaComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVerify = useCallback(() => {
    const correct = checkOrder();
    if (soundEnabled) {
      if (correct) {
        playCorrect();
      } else {
        playIncorrect();
      }
    }
  }, [checkOrder, soundEnabled]);

  const handleNext = useCallback(() => {
    if (allComplete || currentStanzaIndex === poem.stanzas.length - 1) {
      onFinish(getProgress());
    } else {
      advanceToNextStanza();
    }
  }, [allComplete, currentStanzaIndex, poem.stanzas.length, onFinish, getProgress, advanceToNextStanza]);

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-5 w-full max-w-md mx-auto px-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg font-extrabold text-slate-700">
          {poem.emoji} {poem.title}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Ordena los versos de la estrofa {currentStanzaIndex + 1}
        </p>
      </div>

      {/* Progress */}
      <ProgresoEstrofas
        statuses={stanzaStatuses}
        currentIndex={currentStanzaIndex}
      />

      {/* Stanza number badge */}
      <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
        Estrofa {currentStanzaIndex + 1} de {poem.stanzas.length}
        {attempts > 0 && (
          <span className="ml-2 opacity-80">
            · {attempts} {attempts === 1 ? "intento" : "intentos"}
          </span>
        )}
      </div>

      {/* Draggable verses */}
      <div
        className="w-full flex flex-col gap-3"
        {...containerProps}
      >
        {shuffledVerses.map((verse, i) => (
          <VersoArrastrable
            key={verse.id}
            verse={verse}
            index={i}
            isDragging={drag.activeIndex === i}
            dragOffsetY={drag.activeIndex === i ? drag.offsetY : 0}
            feedback={feedback ? feedback[i] : null}
            onPointerDown={handlePointerDown}
            setRef={setItemRef}
          />
        ))}
      </div>

      {/* Verify button */}
      {!stanzaComplete && (
        <button
          onClick={handleVerify}
          className="w-full py-4 rounded-xl text-lg font-extrabold bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
        >
          Verificar orden
        </button>
      )}

      {/* Stanza complete overlay */}
      {stanzaComplete && (
        <EstrofaCompletada
          stanza={currentStanza}
          isLast={currentStanzaIndex === poem.stanzas.length - 1}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
