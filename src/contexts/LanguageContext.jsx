// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fa } from '../locales/fa';
import { en } from '../locales/en';
import { ar } from '../locales/ar';
import { tr } from '../locales/tr';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // زبان پیش‌فرض انگلیسی
  const [uiLanguage, setUiLanguage] = useState('en');
  const [speechLanguage, setSpeechLanguage] = useState('en-US');
  const [translations, setTranslations] = useState(en);

  const languages = {
    en: { 
      name: 'English', 
      flag: '🇺🇸', 
      translations: en,
      speechCode: 'en-US'
    },
    fa: { 
      name: 'فارسی', 
      flag: '🇮🇷', 
      translations: fa,
      speechCode: 'fa-IR'
    },
    ar: { 
      name: 'العربية', 
      flag: '🇸🇦', 
      translations: ar,
      speechCode: 'ar-SA'
    },
    tr: { 
      name: 'Türkçe', 
      flag: '🇹🇷', 
      translations: tr,
      speechCode: 'tr-TR'
    }
  };

  useEffect(() => {
    const savedUiLanguage = localStorage.getItem('appUiLanguage');
    const savedSpeechLanguage = localStorage.getItem('appSpeechLanguage');
    
    // اگر زبان ذخیره شده وجود دارد از آن استفاده کن، در غیر این صورت از انگلیسی
    if (savedUiLanguage && languages[savedUiLanguage]) {
      setUiLanguage(savedUiLanguage);
      setTranslations(languages[savedUiLanguage].translations);
    } else {
      // زبان پیش‌فرض انگلیسی
      setUiLanguage('en');
      setTranslations(en);
      localStorage.setItem('appUiLanguage', 'en');
    }
    
    if (savedSpeechLanguage) {
      setSpeechLanguage(savedSpeechLanguage);
    } else {
      // زبان گفتار پیش‌فرض انگلیسی
      setSpeechLanguage('en-US');
      localStorage.setItem('appSpeechLanguage', 'en-US');
    }
  }, []);

  const changeLanguage = (lang) => {
    if (languages[lang]) {
      setUiLanguage(lang);
      setSpeechLanguage(languages[lang].speechCode);
      setTranslations(languages[lang].translations);
      
      localStorage.setItem('appUiLanguage', lang);
      localStorage.setItem('appSpeechLanguage', languages[lang].speechCode);
    }
  };

  const changeSpeechLanguage = (speechLang) => {
    setSpeechLanguage(speechLang);
    localStorage.setItem('appSpeechLanguage', speechLang);
    
    const matchingLang = Object.entries(languages).find(([_, langData]) => 
      langData.speechCode === speechLang
    );
    
    if (matchingLang) {
      const [langKey] = matchingLang;
      setUiLanguage(langKey);
      setTranslations(languages[langKey].translations);
      localStorage.setItem('appUiLanguage', langKey);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value;
  };

  const getSpeechLanguages = () => {
    return Object.values(languages).map(lang => ({
      code: lang.speechCode,
      name: lang.name,
      flag: lang.flag
    }));
  };

  const value = {
    uiLanguage,
    speechLanguage,
    translations,
    languages,
    changeLanguage,
    changeSpeechLanguage,
    t,
    getSpeechLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};