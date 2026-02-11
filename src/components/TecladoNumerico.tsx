"use client";

import { useEffect, useCallback } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function TecladoNumerico({
  value,
  onChange,
  onSubmit,
  disabled,
}: Props) {
  const handleDigit = useCallback(
    (digit: number) => {
      if (disabled) return;
      if (value.length >= 3) return;
      onChange(value + digit);
    },
    [disabled, value, onChange]
  );

  const handleDelete = useCallback(() => {
    if (disabled) return;
    onChange(value.slice(0, -1));
  }, [disabled, value, onChange]);

  const handleSubmit = useCallback(() => {
    if (disabled || !value) return;
    onSubmit();
  }, [disabled, value, onSubmit]);

  // Physical keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleDigit(parseInt(e.key));
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleDelete();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDigit, handleDelete, handleSubmit]);

  const digitButton = (digit: number) => (
    <button
      key={digit}
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        handleDigit(digit);
      }}
      className="aspect-square rounded-2xl bg-white text-3xl font-extrabold text-slate-700 shadow-md border-2 border-slate-100 active:scale-90 active:bg-slate-50 transition-all select-none touch-manipulation cursor-pointer"
    >
      {digit}
    </button>
  );

  return (
    <div className="numpad w-full max-w-xs mx-auto">
      {/* Display */}
      <div className="numpad-display mb-3 h-16 flex items-center justify-center rounded-2xl bg-white border-2 border-purple-200 text-4xl font-extrabold text-slate-700">
        {value || <span className="text-slate-300">?</span>}
      </div>

      {/* Numpad grid */}
      <div className="numpad-grid grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => digitButton(d))}

        {/* Delete */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            handleDelete();
          }}
          className="aspect-square rounded-2xl bg-red-50 text-2xl font-bold text-red-400 shadow-md border-2 border-red-100 active:scale-90 active:bg-red-100 transition-all select-none touch-manipulation cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-7 h-7 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33z"
            />
          </svg>
        </button>

        {digitButton(0)}

        {/* OK */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          disabled={!value || disabled}
          className={`aspect-square rounded-2xl text-2xl font-extrabold shadow-md transition-all select-none touch-manipulation cursor-pointer ${
            value && !disabled
              ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white border-2 border-green-300 active:scale-90"
              : "bg-slate-100 text-slate-300 border-2 border-slate-100 cursor-not-allowed"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
}
