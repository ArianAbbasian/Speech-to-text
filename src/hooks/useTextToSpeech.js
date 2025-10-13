// src/hooks/useTextToSpeech.js
import { useState, useCallback, useEffect, useRef } from "react";

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [voice, setVoice] = useState(null);
  const [rate, setRate] = useState(0.8);
  const [pitch, setPitch] = useState(1);
  const utteranceRef = useRef(null);

  // دریافت لیست صداهای موجود
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // پیدا کردن صدای فارسی
      const persianVoice = availableVoices.find(
        (v) =>
          v.lang.includes("fa") ||
          v.name.includes("Persian") ||
          v.name.includes("Farsi")
      );

      if (persianVoice) {
        setVoice(persianVoice);
      } else if (availableVoices.length > 0) {
        setVoice(availableVoices[0]); // اولین صدای موجود
      }
    };

    loadVoices();

    // وقتی صداها لود شدن
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback(
    (text, lang = "fa-IR") => {
      if (!("speechSynthesis" in window)) {
        alert("مرورگر شما از Text-to-Speech پشتیبانی نمی‌کند");
        return;
      }

      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang; // استفاده از زبان متن
      utterance.rate = rate;
      utterance.pitch = pitch;

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setCurrentText(text);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentText("");
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentText("");

        switch (event.error) {
          case "interrupted":
            alert("پخش صدا قطع شد");
            break;
          case "network":
            alert("خطای شبکه در پخش صدا");
            break;
          default:
            alert("خطا در پخش صدا");
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSpeaking, rate, pitch, voice]
  );

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  const resume = useCallback(() => {
    if (window.speechSynthesis.speaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentText("");
  }, []);

  const changeVoice = useCallback((newVoice) => {
    setVoice(newVoice);
  }, []);

  const changeRate = useCallback((newRate) => {
    setRate(newRate);
  }, []);

  const changePitch = useCallback((newPitch) => {
    setPitch(newPitch);
  }, []);

  return {
    isSpeaking,
    isPaused,
    currentText,
    voices,
    voice,
    rate,
    pitch,
    speak,
    pause,
    resume,
    stop,
    changeVoice,
    changeRate,
    changePitch,
  };
};
