// src/components/LanguageSelector/LanguageSelector.jsx
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: 'fa-IR', name: 'فارسی', flag: '🇮🇷' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
    { code: 'tr-TR', name: 'Türkçe', flag: '🇹🇷' }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">🌐</span>
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;