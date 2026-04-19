import type { DicteeLesson } from "../types";

export const imparfait: DicteeLesson = {
  id: "imparfait",
  title: "L'imparfait",
  description: "Practica el imperfecto en francés con un texto sobre la infancia",
  emoji: "👵",
  groups: [
    {
      label: "Imparfait – être et avoir",
      words: [
        { word: "étais", article: "j'", translation: "era / estaba", altTranslations: ["soy / estoy", "fui / estuve", "seré / estaré"] },
        { word: "étaient", article: "ils", translation: "eran / estaban", altTranslations: ["son / están", "fueron / estuvieron", "serán / estarán"] },
        { word: "étions", article: "nous", translation: "éramos / estábamos", altTranslations: ["somos / estamos", "fuimos / estuvimos", "seremos / estaremos"] },
      ],
    },
    {
      label: "Imparfait – verbes courants",
      words: [
        { word: "allais", article: "j'", translation: "iba", altTranslations: ["voy", "fui", "iré"] },
        { word: "devions", article: "nous", translation: "debíamos", altTranslations: ["debemos", "debimos", "deberemos"] },
        { word: "faisais", article: "je", translation: "hacía", altTranslations: ["hago", "hice", "haré"] },
        { word: "aidais", article: "j'", translation: "ayudaba", altTranslations: ["ayudo", "ayudé", "ayudaré"] },
        { word: "jouais", article: "je", translation: "jugaba", altTranslations: ["juego", "jugué", "jugaré"] },
      ],
    },
    {
      label: "Vocabulaire de l'enfance",
      words: [
        { word: "l'enfance", translation: "la infancia", altTranslations: ["la juventud", "la vejez", "la adolescencia"] },
        { word: "la grand-mère", translation: "la abuela", altTranslations: ["la madre", "la tía", "la hermana"] },
        { word: "le maître", translation: "el maestro", altTranslations: ["el alumno", "el padre", "el amigo"] },
        { word: "l'école", translation: "la escuela", altTranslations: ["la casa", "el parque", "la calle"] },
        { word: "les devoirs", translation: "los deberes", altTranslations: ["los juegos", "los libros", "las tareas de casa"] },
      ],
    },
    {
      label: "Autres mots du texte",
      words: [
        { word: "toujours", translation: "siempre", altTranslations: ["nunca", "a veces", "a menudo"] },
        { word: "à pied", translation: "a pie", altTranslations: ["en coche", "en bici", "corriendo"] },
        { word: "sévères", translation: "severos / estrictos", altTranslations: ["amables", "divertidos", "tranquilos"] },
        { word: "silencieux", translation: "silenciosos", altTranslations: ["ruidosos", "hablando", "gritando"] },
        { word: "les tâches ménagères", translation: "las tareas del hogar", altTranslations: ["los deberes", "los juegos", "la compra"] },
        { word: "dehors", translation: "fuera", altTranslations: ["dentro", "arriba", "abajo"] },
        { word: "libres", translation: "libres", altTranslations: ["ocupados", "cansados", "tristes"] },
        { word: "le dîner", translation: "la cena", altTranslations: ["el almuerzo", "el desayuno", "la merienda"] },
      ],
    },
  ],
};
