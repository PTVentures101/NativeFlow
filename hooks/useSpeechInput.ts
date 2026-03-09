"use client";

import { useState, useRef, useCallback } from "react";

interface UseSpeechInputOptions {
  onResult: (transcript: string) => void;
}

export function useSpeechInput({ onResult }: UseSpeechInputOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const recognitionRef = useRef<unknown>(null);

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SpeechRecognition() as any;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    // Don't lock to English — user describes queries in English but phrases can be anything
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [onResult]);

  const stopListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (recognitionRef.current as any)?.stop();
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return { isListening, toggle };
}
