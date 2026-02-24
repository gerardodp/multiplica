"use client";

interface Props {
  timeLeft: number;
  maxTime: number;
}

export default function BarraTimer({ timeLeft, maxTime }: Props) {
  const pct = maxTime > 0 ? (timeLeft / maxTime) * 100 : 0;

  const colorClass =
    pct > 50
      ? "from-green-400 to-emerald-400"
      : pct > 25
      ? "from-yellow-400 to-amber-400"
      : "from-red-400 to-rose-500";

  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-1000 ease-linear`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
