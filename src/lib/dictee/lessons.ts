import type { DicteeLesson } from "./types";
import { leSonS } from "./lessons/le-son-s";
import { futur1er2eme } from "./lessons/futur-1er-2eme";

export const allLessons: DicteeLesson[] = [
  leSonS,
  futur1er2eme,
];

export function getLessonById(id: string): DicteeLesson | undefined {
  return allLessons.find((lesson) => lesson.id === id);
}
