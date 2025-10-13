// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fa, en, ar, tr } from '../locales';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fa-IR');
  const [translations, setTranslations] = useState(fa);

  // نگاشت کد زبان به فایل ترجمه
  const languageMap = {
    'fa-IR': fa,
    'en-US': en,
    'en-GB': en,
    'ar-SA': ar,
    'tr-TR': tr
  };

  // بارگذاری زبان از localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && languageMap[savedLanguage]) {
      setLanguage(savedLanguage);
      setTranslations(languageMap[savedLanguage]);
      // تنظیم direction اولیه
      document.documentElement.dir = 
        savedLanguage.startsWith('fa') || savedLanguage.startsWith('ar') ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    if (languageMap[newLanguage]) {
      setLanguage(newLanguage);
      setTranslations(languageMap[newLanguage]);
      localStorage.setItem('appLanguage', newLanguage);
      
      // تغییر direction صفحه بر اساس زبان
      document.documentElement.dir = 
        newLanguage.startsWith('fa') || newLanguage.startsWith('ar') ? 'rtl' : 'ltr';
      document.documentElement.lang = newLanguage;
      
      console.log('Language changed to:', newLanguage);
    }
  };

  // تابع ترجمه با fallback
  const t = (key) => {
    try {
      const keys = key.split('.');
      let value = translations;
      
      for (const k of keys) {
        value = value[k];
        if (value === undefined) {
          // Fallback به انگلیسی اگر ترجمه پیدا نشد
          let fallbackValue = en;
          for (const k of keys) {
            fallbackValue = fallbackValue[k];
            if (fallbackValue === undefined) {
              console.warn(`Translation key not found: ${key}`);
              return key;
            }
          }
          return fallbackValue;
        }
      }
      
      return value;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  const value = {
    language,
    translations,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};