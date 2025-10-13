// src/components/TextItem/TextItem.jsx
import React, { useState } from 'react';
import { useText } from '../../contexts/TextContext';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { useLanguage } from '../../contexts/LanguageContext'; // اضافه کردن

const TextItem = ({ text }) => {
  const { deleteText, updateCategory, editText } = useText();
  const { t } = useLanguage(); // اضافه کردن
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(text.content);
  const [showTTSControls, setShowTTSControls] = useState(false);
  
  const {
    isSpeaking,
    isPaused,
    currentText,
    speak,
    pause,
    resume,
    stop,
    rate,
    changeRate
  } = useTextToSpeech();

  const isCurrentText = currentText === text.content;

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      editText(text.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(text.content);
    setIsEditing(false);
  };

  const handleSpeak = () => {
    if (isCurrentText && isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      if (isSpeaking) {
        stop();
      }
      speak(text.content);
    }
  };

  const handleStop = () => {
    stop();
  };

  const handleSpeedChange = (newRate) => {
    changeRate(newRate);
    if (isCurrentText && isSpeaking) {
      stop();
      setTimeout(() => speak(text.content), 100);
    }
  };

  const getSpeakButtonText = () => {
    if (isCurrentText) {
      if (isPaused) return `${t('textManager.resume')} 🔊`;
      if (isSpeaking) return `${t('textManager.stop')} ⏸️`;
    }
    return `${t('textManager.play')} 🔊`;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      {/* بقیه کد TextItem بدون تغییر */}
      {/* فقط جای متن‌های سخت‌کد شده از t() استفاده کن */}
    </div>
  );
};

export default TextItem;