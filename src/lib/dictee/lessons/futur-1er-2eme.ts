import type { DicteeLesson } from "../types";

export const futur1er2eme: DicteeLesson = {
  id: "futur-1er-2eme",
  title: "Futur 1er et 2ème groupe",
  description: "Practica el futuro de los verbos del primer y segundo grupo en francés",
  emoji: "🔮",
  groups: [
    {
      label: "Futur – 1er groupe",
      words: [
        { word: "brillera", article: "il", translation: "brillará", altTranslations: ["brilla", "brillaba", "brilló"] },
        { word: "marcherons", article: "nous", translation: "caminaremos", altTranslations: ["caminamos", "caminábamos", "caminaron"] },
        { word: "remplira", article: "elle", translation: "llenará", altTranslations: ["llena", "llenaba", "llenó"] },
        { word: "jouerons", article: "nous", translation: "jugaremos", altTranslations: ["jugamos", "jugábamos", "jugaron"] },
        { word: "rentrerons", article: "nous", translation: "volveremos", altTranslations: ["volvemos", "volvíamos", "volvieron"] },
      ],
    },
    {
      label: "Futur – 2ème groupe",
      words: [
        { word: "choisiront", article: "ils", translation: "elegirán", altTranslations: ["eligen", "elegían", "eligieron"] },
        { word: "finirez", article: "vous", translation: "terminaréis", altTranslations: ["termináis", "terminabais", "terminasteis"] },
        { word: "réussirai", article: "je", translation: "lograré", altTranslations: ["logro", "lograba", "logré"] },
      ],
    },
    {
      label: "Vocabulaire de la plage",
      words: [
        { word: "le soleil", translation: "el sol", altTranslations: ["la luna", "la estrella", "la nube"] },
        { word: "la mer", translation: "el mar", altTranslations: ["el río", "el lago", "la piscina"] },
        { word: "le sable", translation: "la arena", altTranslations: ["la tierra", "la piedra", "el barro"] },
        { word: "les vagues", translation: "las olas", altTranslations: ["las nubes", "las rocas", "las algas"] },
        { word: "le parasol", translation: "la sombrilla", altTranslations: ["la toalla", "la silla", "la mesa"] },
        { word: "la marée haute", translation: "la marea alta", altTranslations: ["la marea baja", "la corriente", "la tormenta"] },
        { word: "la bouée", translation: "la boya", altTranslations: ["la balsa", "el barco", "la tabla"] },
        { word: "le château de sable", translation: "el castillo de arena", altTranslations: ["la torre de arena", "el hoyo de arena", "el muro de arena"] },
      ],
    },
    {
      label: "Autres mots du texte",
      words: [
        { word: "demain", translation: "mañana", altTranslations: ["hoy", "ayer", "anoche"] },
        { word: "longtemps", translation: "mucho tiempo", altTranslations: ["poco tiempo", "a veces", "nunca"] },
        { word: "ensuite", translation: "después", altTranslations: ["antes", "ahora", "siempre"] },
        { word: "heureux", translation: "feliz / felices", altTranslations: ["triste", "cansado", "enfadado"] },
        { word: "protéger", translation: "proteger", altTranslations: ["atacar", "romper", "perder"] },
      ],
    },
  ],
};
