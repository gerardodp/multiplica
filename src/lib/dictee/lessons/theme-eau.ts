import type { DicteeLesson } from "../types";

export const themeEau: DicteeLesson = {
  id: "theme-eau",
  title: "Thème de l'eau",
  description: "Vocabulario del agua: mares, ríos, lluvia y más",
  emoji: "💧",
  groups: [
    {
      label: "Eau salée / eau douce",
      words: [
        { word: "salée", article: "l'eau", translation: "el agua salada", altTranslations: ["el agua dulce", "el agua fría", "el agua caliente"] },
        { word: "douce", article: "l'eau", translation: "el agua dulce", altTranslations: ["el agua salada", "el agua turbia", "el agua helada"] },
        { word: "mer", article: "la", translation: "el mar", altTranslations: ["el río", "el lago", "el océano"] },
        { word: "océan", article: "l'", translation: "el océano", altTranslations: ["el mar", "el lago", "el río"] },
      ],
    },
    {
      label: "Cours d'eau",
      words: [
        { word: "fleuve", article: "le", translation: "el río (que desemboca en el mar)", altTranslations: ["el lago", "el arroyo", "el torrente"] },
        { word: "rivière", article: "la", translation: "el río (afluente)", altTranslations: ["el lago", "el mar", "el torrente"] },
        { word: "ruisseau", article: "le", translation: "el arroyo", altTranslations: ["el río", "el torrente", "el lago"] },
        { word: "torrent", article: "le", translation: "el torrente", altTranslations: ["el arroyo", "el río", "el lago"] },
      ],
    },
    {
      label: "Étendues d'eau calme",
      words: [
        { word: "lac", article: "le", translation: "el lago", altTranslations: ["el mar", "el río", "el estanque"] },
        { word: "étang", article: "l'", translation: "el estanque", altTranslations: ["el lago", "el río", "la charca"] },
        { word: "mare", article: "la", translation: "la charca", altTranslations: ["el lago", "el estanque", "el río"] },
      ],
    },
    {
      label: "Chutes d'eau",
      words: [
        { word: "cascade", article: "la", translation: "la cascada", altTranslations: ["la catarata", "la fuente", "el torrente"] },
        { word: "chute", article: "la", translation: "la catarata", altTranslations: ["la cascada", "la fuente", "el río"] },
      ],
    },
    {
      label: "Précipitations et météo",
      words: [
        { word: "rosée", article: "la", translation: "el rocío", altTranslations: ["la lluvia", "la nieve", "la niebla"] },
        { word: "nuage", article: "le", translation: "la nube", altTranslations: ["el viento", "la lluvia", "el trueno"] },
        { word: "pluie", article: "la", translation: "la lluvia", altTranslations: ["la nieve", "el granizo", "la nube"] },
        { word: "neige", article: "la", translation: "la nieve", altTranslations: ["la lluvia", "el granizo", "el hielo"] },
        { word: "grêle", article: "la", translation: "el granizo", altTranslations: ["la nieve", "la lluvia", "el hielo"] },
      ],
    },
    {
      label: "États de l'eau",
      words: [
        { word: "liquide", article: "l'eau", translation: "el agua líquida", altTranslations: ["el agua sólida", "el agua gaseosa", "el vapor de agua"] },
        { word: "vapeur", article: "la", translation: "el vapor de agua", altTranslations: ["el agua líquida", "el hielo", "la nieve"] },
        { word: "glace", article: "la", translation: "el hielo", altTranslations: ["la nieve", "el granizo", "el vapor"] },
        { word: "souterraine", article: "l'eau", translation: "el agua subterránea", altTranslations: ["el agua dulce", "el agua salada", "el agua de lluvia"] },
        { word: "nappe", article: "la", translation: "la capa freática", altTranslations: ["el río subterráneo", "el lago subterráneo", "el acuífero"] },
      ],
    },
  ],
};
