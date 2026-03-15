import type { ConjugaisonVerb, VerbGroup } from "./types";

export const ALL_VERBS: ConjugaisonVerb[] = [
  // --- 1er groupe (-er) ---
  {
    infinitive: "chanter",
    group: "1er",
    futureRoot: "chanter",
    conjugations: {
      je: "chanterai",
      tu: "chanteras",
      "il/elle/on": "chantera",
      nous: "chanterons",
      vous: "chanterez",
      "ils/elles": "chanteront",
    },
    translation: "cantar",
  },
  {
    infinitive: "jouer",
    group: "1er",
    futureRoot: "jouer",
    conjugations: {
      je: "jouerai",
      tu: "joueras",
      "il/elle/on": "jouera",
      nous: "jouerons",
      vous: "jouerez",
      "ils/elles": "joueront",
    },
    translation: "jugar",
  },
  {
    infinitive: "marcher",
    group: "1er",
    futureRoot: "marcher",
    conjugations: {
      je: "marcherai",
      tu: "marcheras",
      "il/elle/on": "marchera",
      nous: "marcherons",
      vous: "marcherez",
      "ils/elles": "marcheront",
    },
    translation: "caminar",
  },
  {
    infinitive: "briller",
    group: "1er",
    futureRoot: "briller",
    conjugations: {
      je: "brillerai",
      tu: "brilleras",
      "il/elle/on": "brillera",
      nous: "brillerons",
      vous: "brillerez",
      "ils/elles": "brilleront",
    },
    translation: "brillar",
  },
  {
    infinitive: "rentrer",
    group: "1er",
    futureRoot: "rentrer",
    conjugations: {
      je: "rentrerai",
      tu: "rentreras",
      "il/elle/on": "rentrera",
      nous: "rentrerons",
      vous: "rentrerez",
      "ils/elles": "rentreront",
    },
    translation: "volver",
  },

  // --- 2ème groupe (-ir, conjugación en -iss-) ---
  {
    infinitive: "finir",
    group: "2eme",
    futureRoot: "finir",
    conjugations: {
      je: "finirai",
      tu: "finiras",
      "il/elle/on": "finira",
      nous: "finirons",
      vous: "finirez",
      "ils/elles": "finiront",
    },
    translation: "terminar",
  },
  {
    infinitive: "choisir",
    group: "2eme",
    futureRoot: "choisir",
    conjugations: {
      je: "choisirai",
      tu: "choisiras",
      "il/elle/on": "choisira",
      nous: "choisirons",
      vous: "choisirez",
      "ils/elles": "choisiront",
    },
    translation: "elegir",
  },
  {
    infinitive: "réussir",
    group: "2eme",
    futureRoot: "réussir",
    conjugations: {
      je: "réussirai",
      tu: "réussiras",
      "il/elle/on": "réussira",
      nous: "réussirons",
      vous: "réussirez",
      "ils/elles": "réussiront",
    },
    translation: "lograr",
  },
  {
    infinitive: "remplir",
    group: "2eme",
    futureRoot: "remplir",
    conjugations: {
      je: "remplirai",
      tu: "rempliras",
      "il/elle/on": "remplira",
      nous: "remplirons",
      vous: "remplirez",
      "ils/elles": "rempliront",
    },
    translation: "llenar",
  },

  // --- 3ème groupe (partir) ---
  {
    infinitive: "partir",
    group: "3eme",
    futureRoot: "partir",
    conjugations: {
      je: "partirai",
      tu: "partiras",
      "il/elle/on": "partira",
      nous: "partirons",
      vous: "partirez",
      "ils/elles": "partiront",
    },
    translation: "salir / irse",
  },

  // --- Irregulares ---
  {
    infinitive: "aller",
    group: "irregulier",
    futureRoot: "ir",
    conjugations: {
      je: "irai",
      tu: "iras",
      "il/elle/on": "ira",
      nous: "irons",
      vous: "irez",
      "ils/elles": "iront",
    },
    translation: "ir",
  },
  {
    infinitive: "faire",
    group: "irregulier",
    futureRoot: "fer",
    conjugations: {
      je: "ferai",
      tu: "feras",
      "il/elle/on": "fera",
      nous: "ferons",
      vous: "ferez",
      "ils/elles": "feront",
    },
    translation: "hacer",
  },
  {
    infinitive: "venir",
    group: "irregulier",
    futureRoot: "viendr",
    conjugations: {
      je: "viendrai",
      tu: "viendras",
      "il/elle/on": "viendra",
      nous: "viendrons",
      vous: "viendrez",
      "ils/elles": "viendront",
    },
    translation: "venir",
  },
  {
    infinitive: "voir",
    group: "irregulier",
    futureRoot: "verr",
    conjugations: {
      je: "verrai",
      tu: "verras",
      "il/elle/on": "verra",
      nous: "verrons",
      vous: "verrez",
      "ils/elles": "verront",
    },
    translation: "ver",
  },
  {
    infinitive: "avoir",
    group: "irregulier",
    futureRoot: "aur",
    conjugations: {
      je: "aurai",
      tu: "auras",
      "il/elle/on": "aura",
      nous: "aurons",
      vous: "aurez",
      "ils/elles": "auront",
    },
    translation: "tener",
  },
  {
    infinitive: "être",
    group: "irregulier",
    futureRoot: "ser",
    conjugations: {
      je: "serai",
      tu: "seras",
      "il/elle/on": "sera",
      nous: "serons",
      vous: "serez",
      "ils/elles": "seront",
    },
    translation: "ser / estar",
  },
];

export const VERBS_BY_GROUP: Record<VerbGroup, ConjugaisonVerb[]> = {
  "1er": ALL_VERBS.filter((v) => v.group === "1er"),
  "2eme": ALL_VERBS.filter((v) => v.group === "2eme"),
  "3eme": ALL_VERBS.filter((v) => v.group === "3eme"),
  irregulier: ALL_VERBS.filter((v) => v.group === "irregulier"),
};

export function getVerbsByGroups(groups: VerbGroup[]): ConjugaisonVerb[] {
  return ALL_VERBS.filter((v) => groups.includes(v.group));
}
