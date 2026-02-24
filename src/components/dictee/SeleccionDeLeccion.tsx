"use client";

import type { DicteeLesson } from "@/lib/dictee/types";
import type { LessonScore } from "@/hooks/useDicteeSettings";

interface Props {
  lessons: DicteeLesson[];
  lessonScores: Record<string, LessonScore>;
  onSelectLesson: (lesson: DicteeLesson) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
}

export default function SeleccionDeLeccion({ lessons, lessonScores, onSelectLesson, soundEnabled, onToggleSound, onOpenSettings }: Props) {
  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4">
      {/* Top bar buttons — same pattern as PantallaDeInicio */}
      <div className="absolute top-6 right-6 flex gap-2">
        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className={`p-3 rounded-xl bg-white/80 shadow-md transition-all cursor-pointer ${
            soundEnabled
              ? "text-purple-500 hover:bg-white"
              : "text-slate-300 hover:bg-white hover:text-slate-400"
          }`}
          aria-label={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
        >
          {soundEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-3 rounded-xl bg-white/80 text-slate-400 hover:text-purple-500 hover:bg-white shadow-md transition-all cursor-pointer"
          aria-label="Configuracion"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.431.992a7.723 7.723 0 010 .255c-.007.38.138.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="text-center pt-8">
        <h2 className="text-3xl font-extrabold text-slate-700">Dictée</h2>
        <p className="mt-2 text-sm text-slate-400">Elige una lección para practicar</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        {lessons.map((lesson) => {
          const score = lessonScores[lesson.id];
          const totalWords = lesson.groups.reduce((sum, g) => sum + g.words.length, 0);

          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              className="w-full text-left p-4 rounded-2xl bg-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border-2 border-transparent hover:border-blue-200"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{lesson.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-slate-700 text-lg">{lesson.title}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{lesson.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-300">{totalWords} palabras</span>
                    {score && (
                      <>
                        <span className={`text-xs font-bold ${
                          score.correct === score.total ? "text-green-500" : "text-blue-500"
                        }`}>
                          {score.correct}/{score.total} correctas
                        </span>
                        {score.bestPoints > 0 && (
                          <span className="text-xs font-bold text-amber-500">
                            ⭐ {score.bestPoints} pts
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-slate-300 mt-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
