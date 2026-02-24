import type { DicteeLesson } from "./types";
import { leSonS } from "./lessons/le-son-s";

export const allLessons: DicteeLesson[] = [
  leSonS,
];

export function getLessonById(id: string): DicteeLesson | undefined {
  return allLessons.find((lesson) => lesson.id === id);
}
