"use client";

import type { Verse } from "@/lib/poesie/types";

interface Props {
  verse: Verse;
  index: number;
  isDragging: boolean;
  dragOffsetY: number;
  feedback: boolean | null;
  onPointerDown: (index: number, e: React.PointerEvent) => void;
  setRef: (index: number, el: HTMLElement | null) => void;
}

export default function VersoArrastrable({
  verse,
  index,
  isDragging,
  dragOffsetY,
  feedback,
  onPointerDown,
  setRef,
}: Props) {
  const feedbackClasses =
    feedback === true
      ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-300"
      : feedback === false
      ? "border-red-400 bg-red-50 ring-2 ring-red-300 animate-shake"
      : "border-slate-200 bg-white";

  return (
    <div
      ref={(el) => setRef(index, el)}
      data-drag-item
      onPointerDown={(e) => onPointerDown(index, e)}
      className={`
        flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 shadow-sm
        select-none
        ${isDragging ? "transition-none" : "transition-all duration-200"}
        ${feedbackClasses}
        ${isDragging ? "z-20 shadow-xl scale-[1.03] bg-white/95 relative" : "z-0"}
      `}
      style={{
        touchAction: "none",
        cursor: isDragging ? "grabbing" : "grab",
        transform: isDragging ? `translateY(${dragOffsetY}px)` : undefined,
      }}
    >
      {/* Drag handle */}
      <div className="flex flex-col gap-0.5 text-slate-300 flex-shrink-0">
        <div className="flex gap-0.5">
          <div className="w-1 h-1 rounded-full bg-current" />
          <div className="w-1 h-1 rounded-full bg-current" />
        </div>
        <div className="flex gap-0.5">
          <div className="w-1 h-1 rounded-full bg-current" />
          <div className="w-1 h-1 rounded-full bg-current" />
        </div>
        <div className="flex gap-0.5">
          <div className="w-1 h-1 rounded-full bg-current" />
          <div className="w-1 h-1 rounded-full bg-current" />
        </div>
      </div>

      {/* Emoji */}
      <span className="text-2xl flex-shrink-0">{verse.emoji}</span>

      {/* Verse text */}
      <span className="text-base font-medium text-slate-700 italic leading-snug">
        {verse.text}
      </span>

      {/* Feedback icon */}
      {feedback === true && (
        <span className="ml-auto text-emerald-500 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        </span>
      )}
      {feedback === false && (
        <span className="ml-auto text-red-500 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </span>
      )}
    </div>
  );
}
