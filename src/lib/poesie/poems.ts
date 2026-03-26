import type { Poem } from "./types";

export const leVoyageDuneGoutteDeEau: Poem = {
  id: "le-voyage-dune-goutte-deau",
  title: "Le voyage d'une goutte d'eau",
  emoji: "💧",
  description: "Aprende este poema sobre el viaje de una gota de agua",
  audioFile: "/audio/le-voyage-dune-goutte-deau.mp3",
  stanzas: [
    {
      number: 1,
      verses: [
        { id: "1-1", text: "Descendue d'un glacier,", emoji: "🏔️" },
        { id: "1-2", text: "C'est une goutte d'eau", emoji: "💧" },
        { id: "1-3", text: "Qui ne fait que briller", emoji: "✨" },
        { id: "1-4", text: "Dans le torrent tout là-haut.", emoji: "🌊" },
      ],
    },
    {
      number: 2,
      verses: [
        { id: "2-1", text: "Le courant s'est calmé,", emoji: "🍃" },
        { id: "2-2", text: "Elle traverse les prés,", emoji: "🌿" },
        { id: "2-3", text: "Caressant un poisson,", emoji: "🐟" },
        { id: "2-4", text: "Passant entre les joncs.", emoji: "🌾" },
      ],
    },
    {
      number: 3,
      verses: [
        { id: "3-1", text: "Déjà dans la rivière,", emoji: "🏞️" },
        { id: "3-2", text: "Elle visite un village,", emoji: "🏘️" },
        { id: "3-3", text: "Continue son voyage,", emoji: "🧭" },
        { id: "3-4", text: "Passe par dessus les pierres.", emoji: "🪨" },
      ],
    },
    {
      number: 4,
      verses: [
        { id: "4-1", text: "Dans le fleuve élargi,", emoji: "🛶" },
        { id: "4-2", text: "Elle arrive à la mer,", emoji: "🌊" },
        { id: "4-3", text: "Le soleil l'éblouit", emoji: "☀️" },
        { id: "4-4", text: "Et l'appelle dans les airs.", emoji: "☁️" },
      ],
    },
    {
      number: 5,
      verses: [
        { id: "5-1", text: "Des nuages à la mer,", emoji: "🌧️" },
        { id: "5-2", text: "Neige, glace, gaz, ou eau,", emoji: "❄️" },
        { id: "5-3", text: "Toi qui parcours la Terre,", emoji: "🌍" },
        { id: "5-4", text: "Ton voyage est très beau.", emoji: "🌈" },
      ],
    },
  ],
};

export const allPoems: Poem[] = [leVoyageDuneGoutteDeEau];
