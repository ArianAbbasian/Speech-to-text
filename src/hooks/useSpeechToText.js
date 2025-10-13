// src/hooks/useSpeechToText.js
import { useState, useRef, useCallback, useEffect } from 'react';

export const useSpeechToText = (options = {}) => {
  const {
    language: defaultLanguage = 'fa-IR',
    continuous = true,
    interimResults = true
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(defaultLanguage);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  // لیست زبان‌های پشتیبانی شده
  const supportedLanguages = [
    { code: 'fa-IR', name: 'فارسی', flag: '🇮🇷' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
    { code: 'tr-TR', name: 'Türkçe', flag: '🇹🇷' }
  ];

  const resetTranscript = useCallback(() => {
    setTranscript('');
    finalTranscriptRef.current = '';
    setError(null);
  }, []);

  const startListening = useCallback((lang = language) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند. از Chrome یا Edge استفاده کنید.');
      return;
    }

    resetTranscript();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    let final = '';
    let interim = '';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      console.log(`Speech recognition started in ${lang}`);
    };

    recognition.onresult = (event) => {
      interim = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript.trim();
        
        if (result.isFinal) {
          final += text + ' ';
          interim = '';
        } else {
          interim = text;
        }
      }

      if (final) {
        finalTranscriptRef.current += final;
        setTranscript(finalTranscriptRef.current + interim);
        final = '';
      } else if (interim) {
        setTranscript(finalTranscriptRef.current + interim);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      switch (event.error) {
        case 'not-allowed':
          if (event.message.includes('HTTP')) {
            setError('برای استفاده از تشخیص گفتار، از HTTPS یا localhost استفاده کنید');
          } else {
            setError('دسترسی به میکروفون مجاز نیست. لطفا مجوز را بررسی کنید.');
          }
          break;
        case 'network':
          setError('خطای شبکه در تشخیص گفتار');
          break;
        case 'language-not-supported':
          setError('زبان انتخابی پشتیبانی نمی‌شود');
          break;
        case 'audio-capture':
          setError('میکروفون یافت نشد یا در دسترس نیست');
          break;
        default:
          setError(`خطا در تشخیص گفتار: ${event.error}`);
      }
      
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (interim) {
        finalTranscriptRef.current += interim + ' ';
        setTranscript(finalTranscriptRef.current);
      }
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (error) {
      setError('خطا در شروع تشخیص گفتار');
      console.error('Recognition start error:', error);
    }
  }, [continuous, interimResults, language, resetTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      setIsListening(false);
    }
  }, []);

  const changeLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    if (isListening) {
      stopListening();
      setTimeout(() => startListening(newLanguage), 100);
    }
  }, [isListening, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    language,
    supportedLanguages,
    startListening,
    stopListening,
    resetTranscript,
    changeLanguage
  };
};