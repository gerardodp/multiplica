let preferredVoice: SpeechSynthesisVoice | null = null;
let voicesReady = false;

/** Promise that resolves when voices are available */
let voicesPromise: Promise<void> | null = null;

function waitForVoices(): Promise<void> {
  if (voicesReady) return Promise.resolve();
  if (voicesPromise) return voicesPromise;

  voicesPromise = new Promise<void>((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Some browsers (Safari) return voices synchronously
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesReady = true;
      preferredVoice = findFrenchVoiceFromList(voices);
      resolve();
      return;
    }

    // Chrome/Firefox load voices asynchronously
    const onVoicesChanged = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      const v = window.speechSynthesis.getVoices();
      voicesReady = true;
      preferredVoice = findFrenchVoiceFromList(v);
      resolve();
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);

    // Safety timeout: don't wait forever
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      voicesReady = true;
      resolve();
    }, 3000);
  });

  return voicesPromise;
}

function findFrenchVoiceFromList(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  // Prefer high-quality French voices
  const preferred = ["Thomas", "Google français", "Amelie", "Audrey"];
  for (const name of preferred) {
    const match = voices.find((v) => v.name.includes(name) && v.lang.startsWith("fr"));
    if (match) return match;
  }

  return voices.find((v) => v.lang === "fr-FR") ??
    voices.find((v) => v.lang.startsWith("fr")) ??
    null;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Warm up the speech engine: triggers voice loading and does a silent utterance
 * so the first real word doesn't sound robotic.
 */
export async function warmUpSpeech(): Promise<void> {
  if (!isSpeechSupported()) return;

  await waitForVoices();

  // Silent utterance to wake up the audio pipeline
  const silent = new SpeechSynthesisUtterance("");
  silent.lang = "fr-FR";
  silent.volume = 0;
  if (preferredVoice) silent.voice = preferredVoice;
  window.speechSynthesis.speak(silent);
}

export async function speakFrench(text: string, rate = 0.85): Promise<void> {
  if (!isSpeechSupported()) return;

  window.speechSynthesis.cancel();

  // Ensure voices are loaded before first real utterance
  await waitForVoices();

  // Re-check in case voiceschanged fired again
  if (!preferredVoice) {
    const voices = window.speechSynthesis.getVoices();
    preferredVoice = findFrenchVoiceFromList(voices);
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = 1;

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
}
