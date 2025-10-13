// src/components/AudioRecorder/AudioRecorder.jsx
import React, { useState, useEffect } from 'react';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { useText } from '../../contexts/TextContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AudioRecorder = () => {
  const { 
    isListening, 
    transcript, 
    error, 
    language,
    supportedLanguages,
    startListening, 
    stopListening, 
    resetTranscript,
    changeLanguage
  } = useSpeechToText();
  
  const { addText } = useText();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fa-IR');

  useEffect(() => {
    if (transcript) {
      setIsProcessing(true);
      const timer = setTimeout(() => setIsProcessing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [transcript]);

  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  const handleStartListening = () => {
    startListening(selectedLanguage);
  };

  const handleSaveText = () => {
    if (transcript.trim()) {
      const category = selectedLanguage.startsWith('fa') ? 'یادداشت' : 'Note';
      addText(transcript, category);
      setShowSaveSuccess(true);
      
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000);
    }
  };

  const handleSaveAndClear = () => {
    if (transcript.trim()) {
      const category = selectedLanguage.startsWith('fa') ? 'یادداشت' : 'Note';
      addText(transcript, category);
      setShowSaveSuccess(true);
      resetTranscript();
      
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000);
    }
  };

  const getLanguageName = (langCode) => {
    const lang = supportedLanguages.find(l => l.code === langCode);
    return lang ? `${lang.flag} ${lang.name}` : langCode;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {t('speechToText.title')}
        </h1>
        
        {/* انتخاب زبان */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{t('language')}:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={isListening}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
          >
            {supportedLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* دکمه‌های کنترل */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <button
          onClick={handleStartListening}
          disabled={isListening}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${
            isListening 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isListening ? (
            <>⏳ {t('speechToText.processing')}</>
          ) : (
            <>🎤 {t('speechToText.startSpeaking')}</>
          )}
        </button>
        
        <button
          onClick={stopListening}
          disabled={!isListening}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${
            !isListening 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          ⏹ {t('speechToText.stop')}
        </button>

        {transcript && (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSaveText}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              💾 {t('speechToText.saveText')}
            </button>
            <button
              onClick={handleSaveAndClear}
              className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
            >
              💾 {t('speechToText.saveAndClear')}
            </button>
            <button
              onClick={resetTranscript}
              className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all flex items-center justify-center gap-2"
            >
              🔄 {t('speechToText.clear')}
            </button>
          </div>
        )}
      </div>

      {/* وضعیت زبان */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
          🌐 {getLanguageName(selectedLanguage)}
          {isListening && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{t('speechToText.listening')}</span>
            </div>
          )}
        </div>
      </div>

      {/* پیام موفقیت */}
      {showSaveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center animate-fadeIn">
          ✅ {t('speechToText.textSaved')}
        </div>
      )}

      {/* وضعیت */}
      <div className="text-center mb-4 space-y-2">
        {isListening && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full animate-pulse">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            🎤 {t('speechToText.listening')}
          </div>
        )}
        
        {isProcessing && transcript && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
            ⚡ {t('speechToText.processing')}
          </div>
        )}
      </div>

      {/* نمایش خطا */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
          ❌ {error}
        </div>
      )}

      {/* نمایش متن تبدیل شده */}
      {transcript && (
        <div className="mt-6 animate-fadeIn">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            {t('speechToText.transcribedText')}
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[120px] transition-all duration-300">
            <p 
              className="leading-8 whitespace-pre-wrap text-lg"
              dir={selectedLanguage.startsWith('fa') || selectedLanguage.startsWith('ar') ? 'rtl' : 'ltr'}
              style={{ 
                textAlign: selectedLanguage.startsWith('fa') || selectedLanguage.startsWith('ar') ? 'right' : 'left'
              }}
            >
              {transcript}
            </p>
          </div>
          
          <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
            <span>
              {transcript.split(/\s+/).filter(word => word.length > 0).length} 
              {t('speechToText.words')}
            </span>
            <span>{transcript.length} {t('speechToText.characters')}</span>
          </div>
        </div>
      )}

      {/* راهنمایی */}
      {!transcript && !isListening && (
        <div className="text-center text-gray-500 mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="mb-2">💡 {t('speechToText.placeholder')}</p>
          <p className="text-sm">{t('speechToText.suggestion')}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;