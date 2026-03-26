export interface Verse {
  text: string;
  emoji: string;
  id: string;
}

export interface Stanza {
  number: number;
  verses: Verse[];
}

export interface Poem {
  id: string;
  title: string;
  emoji: string;
  description: string;
  stanzas: Stanza[];
  audioFile?: string;
}

export interface PoemProgress {
  completedStanzas: number[];
  totalAttempts: number;
  completed: boolean;
}

export interface PoesieSettings {
  poemProgress: Record<string, PoemProgress>;
}
