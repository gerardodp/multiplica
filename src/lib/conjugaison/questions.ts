import type { ConjugaisonVerb, ConjugaisonQuestion, Pronoun } from "./types";

const PRONOUNS: Pronoun[] = [
  "je",
  "tu",
  "il/elle/on",
  "nous",
  "vous",
  "ils/elles",
];

export const FUTURE_ENDINGS: Record<Pronoun, string> = {
  je: "ai",
  tu: "as",
  "il/elle/on": "a",
  nous: "ons",
  vous: "ez",
  "ils/elles": "ont",
};

// Present tense patterns for generating "wrong tense" distractors
const PRESENT_ENDINGS_ER: Record<Pronoun, string> = {
  je: "e",
  tu: "es",
  "il/elle/on": "e",
  nous: "ons",
  vous: "ez",
  "ils/elles": "ent",
};

const PRESENT_ENDINGS_IR: Record<Pronoun, string> = {
  je: "is",
  tu: "is",
  "il/elle/on": "it",
  nous: "issons",
  vous: "issez",
  "ils/elles": "issent",
};

function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Elision: "je" + vowel -> "j'" */
export function formatPronounVerb(
  pronoun: Pronoun,
  conjugatedForm: string
): string {
  if (pronoun === "je" && /^[aeéèêiîoôuûyhàâ]/i.test(conjugatedForm)) {
    return `j'${conjugatedForm}`;
  }
  return `${pronoun} ${conjugatedForm}`;
}

function getPresentForm(verb: ConjugaisonVerb, pronoun: Pronoun): string | null {
  if (verb.group === "irregulier") return null;

  const inf = verb.infinitive;
  if (verb.group === "1er" && inf.endsWith("er")) {
    const stem = inf.slice(0, -2);
    return stem + PRESENT_ENDINGS_ER[pronoun];
  }
  if ((verb.group === "2eme") && inf.endsWith("ir")) {
    const stem = inf.slice(0, -2);
    return stem + PRESENT_ENDINGS_IR[pronoun];
  }
  if (verb.group === "3eme" && inf.endsWith("ir")) {
    // 3rd group -ir (like partir): present uses stem without last letter
    const stem = inf.slice(0, -2);
    const endings: Record<Pronoun, string> = {
      je: "s",
      tu: "s",
      "il/elle/on": "t",
      nous: "tons",
      vous: "tez",
      "ils/elles": "tent",
    };
    return stem + endings[pronoun];
  }
  return null;
}

function getWrongEndingForm(
  verb: ConjugaisonVerb,
  correctPronoun: Pronoun
): string | null {
  // Pick a different pronoun's ending applied to the same root
  const otherPronouns = PRONOUNS.filter((p) => p !== correctPronoun);
  const randomPronoun =
    otherPronouns[Math.floor(Math.random() * otherPronouns.length)];
  const wrongForm = verb.futureRoot + FUTURE_ENDINGS[randomPronoun];
  // Make sure it's different from the correct answer
  if (wrongForm === verb.conjugations[correctPronoun]) return null;
  return wrongForm;
}

function getWrongRootForm(
  verb: ConjugaisonVerb,
  pronoun: Pronoun
): string | null {
  if (verb.group !== "irregulier") return null;
  // Use infinitive as root instead of irregular root
  const fakeForm = verb.infinitive + FUTURE_ENDINGS[pronoun];
  if (fakeForm === verb.conjugations[pronoun]) return null;
  return fakeForm;
}

export function generateDistractors(
  verb: ConjugaisonVerb,
  pronoun: Pronoun,
  correctAnswer: string
): string[] {
  const candidates = new Set<string>();

  // Strategy 1: Other persons' conjugations of the SAME verb (wrong ending)
  // e.g., for "je + faire" → "feras" (tu), "ferons" (nous), "feront" (ils)
  for (const p of PRONOUNS) {
    if (p === pronoun) continue;
    const form = verb.conjugations[p];
    if (form !== correctAnswer) candidates.add(form);
  }

  // Strategy 2: Wrong root — use infinitive as root (common mistake)
  // e.g., for "je + faire" → "faireai" instead of "ferai"
  // For regulars: swap a different regular root pattern
  if (verb.group === "irregulier") {
    // infinitive + correct ending (e.g., "allerai", "faireai", "voirai")
    const fakeForm = verb.infinitive + FUTURE_ENDINGS[pronoun];
    if (fakeForm !== correctAnswer) candidates.add(fakeForm);
    // infinitive + other endings too
    for (const p of shuffle([...PRONOUNS])) {
      if (p === pronoun) continue;
      const fake = verb.infinitive + FUTURE_ENDINGS[p];
      if (fake !== correctAnswer) candidates.add(fake);
    }
  } else {
    // For regulars: wrong ending applied to root (same as strategy 1 but
    // also try malformed roots — drop/add letters)
    const root = verb.futureRoot;
    // e.g., for "chanter" try "chanteai" (double the e) or truncated root
    if (root.endsWith("er")) {
      const shortRoot = root.slice(0, -1); // "chante" -> "chant"
      const fakeForm = shortRoot + FUTURE_ENDINGS[pronoun];
      if (fakeForm !== correctAnswer) candidates.add(fakeForm);
    }
    if (root.endsWith("ir")) {
      const shortRoot = root.slice(0, -1); // "finir" -> "fini"
      const fakeForm = shortRoot + FUTURE_ENDINGS[pronoun];
      if (fakeForm !== correctAnswer) candidates.add(fakeForm);
    }
  }

  // Strategy 3: Present tense form of the same verb (wrong tense)
  // e.g., for "je + chanter" → "chante" instead of "chanterai"
  const present = getPresentForm(verb, pronoun);
  if (present && present !== correctAnswer) candidates.add(present);

  // Pick 3, prioritizing: shuffle and slice
  return shuffle([...candidates]).slice(0, 3);
}

export function generateQuestions(
  verbs: ConjugaisonVerb[],
  count: number
): ConjugaisonQuestion[] {
  const questions: ConjugaisonQuestion[] = [];

  // Build pool: all verb+pronoun combinations
  const pool: { verb: ConjugaisonVerb; pronoun: Pronoun }[] = [];
  for (const verb of verbs) {
    for (const pronoun of PRONOUNS) {
      pool.push({ verb, pronoun });
    }
  }

  const shuffledPool = shuffle(pool);
  let poolIndex = 0;

  for (let i = 0; i < count; i++) {
    // Cycle through shuffled pool, reshuffle if exhausted
    if (poolIndex >= shuffledPool.length) {
      poolIndex = 0;
      // Re-shuffle for variety
      const reshuffled = shuffle(pool);
      shuffledPool.splice(0, shuffledPool.length, ...reshuffled);
    }

    let { verb, pronoun } = shuffledPool[poolIndex];
    poolIndex++;

    // Avoid more than 2 consecutive same verbs
    if (questions.length >= 2) {
      const last2 = [
        questions[questions.length - 1].verb.infinitive,
        questions[questions.length - 2].verb.infinitive,
      ];
      if (last2[0] === verb.infinitive && last2[1] === verb.infinitive) {
        // Try next in pool
        const swap = shuffledPool[poolIndex % shuffledPool.length];
        if (swap) {
          verb = swap.verb;
          pronoun = swap.pronoun;
          poolIndex++;
        }
      }
    }

    const correctAnswer = verb.conjugations[pronoun];
    const distractors = generateDistractors(verb, pronoun, correctAnswer);
    const options = shuffle([correctAnswer, ...distractors]);

    questions.push({ verb, pronoun, correctAnswer, options });
  }

  return questions;
}

/**
 * Generate 4 translation options for the translation quiz.
 * Correct: the verb's futureTranslation for the given pronoun.
 * Distractors: futureTranslations from OTHER verbs for the SAME pronoun.
 * e.g. for "tu iras" → correct "tú irás", distractors "tú verás", "tú harás", "tú cantarás"
 */
export function generateTranslationOptions(
  verb: ConjugaisonVerb,
  pronoun: Pronoun,
  allVerbs: ConjugaisonVerb[]
): { correct: string; options: string[] } {
  const correct = verb.futureTranslations[pronoun];

  const otherTranslations: string[] = [];
  const others = shuffle(
    allVerbs.filter((v) => v.infinitive !== verb.infinitive)
  );
  for (const other of others) {
    const t = other.futureTranslations[pronoun];
    if (t !== correct && !otherTranslations.includes(t)) {
      otherTranslations.push(t);
    }
    if (otherTranslations.length >= 3) break;
  }

  return {
    correct,
    options: shuffle([correct, ...otherTranslations.slice(0, 3)]),
  };
}
