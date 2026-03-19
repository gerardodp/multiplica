import type { DicteeLesson } from "./types";
import { leSonS } from "./lessons/le-son-s";
import { futur1er2eme } from "./lessons/futur-1er-2eme";
import { themeEau } from "./lessons/theme-eau";

export const allLessons: DicteeLesson[] = [
  leSonS,
  futur1er2eme,
  themeEau,
];

export function getLessonById(id: string): DicteeLesson | undefined {
  return allLessons.find((lesson) => lesson.id === id);
}
