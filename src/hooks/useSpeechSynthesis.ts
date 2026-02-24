"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { speakFrench, isSpeechSupported, warmUpSpeech } from "@/lib/dictee/speech";

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const warmedUp = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- check browser API on mount
    setSupported(isSpeechSupported());

    // Warm up: trigger voice loading + silent utterance
    if (isSpeechSupported() && !warmedUp.current) {
      warmedUp.current = true;
      warmUpSpeech();
    }
  }, []);

  const speak = useCallback((text: string, rate?: number) => {
    if (!isSpeechSupported()) return;

    setSpeaking(true);
    speakFrench(text, rate);

    // Listen for end of speech
    const check = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setSpeaking(false);
        clearInterval(check);
      }
    }, 100);

    // Safety timeout
    const timeout = setTimeout(() => {
      setSpeaking(false);
      clearInterval(check);
    }, 10000);

    return () => {
      clearInterval(check);
      clearTimeout(timeout);
    };
  }, []);

  return { speak, speaking, supported };
}
