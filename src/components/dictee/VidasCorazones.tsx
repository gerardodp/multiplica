"use client";

interface Props {
  lives: number;   // can be fractional (e.g. 5.5)
  maxLives: number;
}

export default function VidasCorazones({ lives, maxLives }: Props) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxLives }).map((_, i) => {
        const heartValue = lives - i; // >1 = full, 0-1 = half, <=0 = empty

        if (heartValue >= 1) {
          // Full heart
          return (
            <span key={i} className="text-xl transition-all scale-100">
              ❤️
            </span>
          );
        }

        if (heartValue > 0) {
          // Half heart — show as orange/amber
          return (
            <span key={i} className="text-xl transition-all scale-90 opacity-70">
              🧡
            </span>
          );
        }

        // Empty heart
        return (
          <span key={i} className="text-xl transition-all scale-75 opacity-30 animate-heart-break">
            🖤
          </span>
        );
      })}
    </div>
  );
}
