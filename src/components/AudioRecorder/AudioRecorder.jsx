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
    startListening, 
    stopListening, 
    resetTranscript
  } = useSpeechToText();
  
  const { addText } = useText();
  const { t, speechLanguage } = useLanguage();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    if (transcript) {
      setIsProcessing(true);
      const timer = setTimeout(() => setIsProcessing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [transcript]);

  const handleStartListening = () => {
    startListening(speechLanguage);
  };

  const handleSaveText = () => {
    if (transcript.trim()) {
      const category = t('textItem.category.note');
      addText(transcript, category, [], speechLanguage);
      setShowSaveSuccess(true);
      
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000);
    }
  };

  const handleSaveAndClear = () => {
    if (transcript.trim()) {
      const category = t('textItem.category.note');
      addText(transcript, category, [], speechLanguage);
      setShowSaveSuccess(true);
      resetTranscript();
      
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000);
    }
  };

  const getLanguageName = () => {
    const languageNames = {
      'fa-IR': '🇮🇷 فارسی',
      'en-US': '🇺🇸 English',
      'en-GB': '🇬🇧 English',
      'ar-SA': '🇸🇦 العربية',
      'tr-TR': '🇹🇷 Türkçe'
    };
    return languageNames[speechLanguage] || speechLanguage;
  };

  return (
    <div className="modern-card animate-fadeIn">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-1">
            {t('speechToText.title')}
          </h1>
          <p className="text-gray-600 mt-2">{t('speechToText.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 rounded-2xl border border-blue-100">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            {t('speechToText.currentLanguage')}:
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {getLanguageName()}
          </span>
        </div>
      </div>

      {/* دکمه‌های اصلی */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <button
          onClick={handleStartListening}
          disabled={isListening}
          className={`flex items-center justify-center gap-3 ${
            isListening ? 'btn-secondary' : 'btn-primary'
          }`}
        >
          {isListening ? (
            <>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              {t('speechToText.processing')}
            </>
          ) : (
            <>
              <span className="text-lg">🎤</span>
              {t('speechToText.startSpeaking')}
            </>
          )}
        </button>
        
        <button
          onClick={stopListening}
          disabled={!isListening}
          className="btn-danger"
        >
          <span className="text-lg">⏹️</span>
          {t('speechToText.stop')}
        </button>
      </div>

      {/* وضعیت */}
      <div className="text-center mb-6 space-y-3">
        {isListening && (
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 rounded-2xl border border-red-200 animate-pulse">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-red-700">
              🎤 {t('speechToText.listening')}
            </span>
          </div>
        )}
        
        {isProcessing && transcript && (
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 rounded-2xl border border-blue-200">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-blue-700">
              ⚡ {t('speechToText.processingText')}
            </span>
          </div>
        )}
      </div>

      {/* پیام موفقیت */}
      {showSaveSuccess && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-6 text-center animate-fadeIn">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-semibold">{t('speechToText.success')}</span>
          </div>
        </div>
      )}

      {/* نمایش خطا */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* نمایش متن تبدیل شده */}
      {transcript && (
        <div className="mt-8 animate-slideIn">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {t('speechToText.transcribedText')}
            </h3>
            <div className="badge badge-blue">
              {transcript.split(/\s+/).filter(word => word.length > 0).length} {t('speechToText.words')}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-6 transition-all duration-300 hover:border-blue-300">
            <p 
              className="text-gray-700 leading-8 whitespace-pre-wrap text-lg"
              dir={speechLanguage.startsWith('fa') || speechLanguage.startsWith('ar') ? 'rtl' : 'ltr'}
              style={{ 
                textAlign: speechLanguage.startsWith('fa') || speechLanguage.startsWith('ar') ? 'right' : 'left'
              }}
            >
              {transcript}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleSaveText}
              className="btn-success"
            >
              <span className="text-lg">💾</span>
              {t('speechToText.saveText')}
            </button>
            <button
              onClick={handleSaveAndClear}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              <span className="text-lg">💾</span>
              {t('speechToText.saveAndClear')}
            </button>
            <button
              onClick={resetTranscript}
              className="btn-secondary"
            >
              <span className="text-lg">🔄</span>
              {t('speechToText.clear')}
            </button>
          </div>
        </div>
      )}

      {/* راهنمایی */}
      {!transcript && !isListening && (
        <div className="text-center text-gray-500 mt-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
          <div className="text-6xl mb-4">🎤</div>
          <p className="text-lg font-semibold text-gray-700 mb-2">
            {t('speechToText.placeholder')}
          </p>
          <p className="text-gray-600">{t('speechToText.suggestion')}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;