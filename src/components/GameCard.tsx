"use client";

import Link from "next/link";

interface Props {
  href: string;
  emoji: string;
  title: string;
  description: string;
  gradient: string;
}

export default function GameCard({ href, emoji, title, description, gradient }: Props) {
  return (
    <Link
      href={href}
      className={`block w-full rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all ${gradient}`}
    >
      <div className="text-5xl mb-3">{emoji}</div>
      <h2 className="text-xl font-extrabold text-white">{title}</h2>
      <p className="mt-1 text-sm text-white/80">{description}</p>
    </Link>
  );
}
