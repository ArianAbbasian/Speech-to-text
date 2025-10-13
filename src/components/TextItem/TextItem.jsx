// src/components/TextItem/TextItem.jsx
import React, { useState } from "react";
import { useText } from "../../contexts/TextContext";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";
import { useLanguage } from "../../contexts/LanguageContext";

const TextItem = ({ text }) => {
  const { deleteText, updateCategory, editText } = useText();
  const { t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(text.content);
  const [showTTSControls, setShowTTSControls] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState(t("textItem.copy"));

  const {
    isSpeaking,
    isPaused,
    currentText,
    speak,
    pause,
    resume,
    stop,
    rate,
    changeRate,
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
      speak(text.content, text.language || "fa-IR");
    }
  };

  const handleStop = () => {
    stop();
  };

  const handleSpeedChange = (newRate) => {
    changeRate(newRate);
    if (isCurrentText && isSpeaking) {
      stop();
      setTimeout(() => speak(text.content, text.language || "fa-IR"), 100);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text.content);
    setCopyButtonText("✅ Copied!");
    setTimeout(() => {
      setCopyButtonText(t("textItem.copy"));
    }, 2000);
  };

  const getSpeakButtonText = () => {
    if (isCurrentText) {
      if (isPaused) return t("textItem.resume");
      if (isSpeaking) return t("textItem.pause");
    }
    return t("textItem.play");
  };

  const getLanguageName = (langCode) => {
    const languages = {
      "fa-IR": "🇮🇷 فارسی",
      "en-US": "🇺🇸 English",
      "en-GB": "🇬🇧 English",
      "ar-SA": "🇸🇦 عربی",
      "tr-TR": "🇹🇷 ترکی",
    };
    return languages[langCode] || langCode;
  };

  const getPlaybackStatus = () => {
    if (isSpeaking) {
      return isPaused ? t("textItem.paused") : t("textItem.playing");
    }
    return t("textItem.finished");
  };

  const categories = [
    t("textItem.category.work"),
    t("textItem.category.personal"),
    t("textItem.category.note"),
    t("textItem.category.idea"),
  ];

  return (
    <div className="modern-card card-hover group animate-fadeIn">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            📅 {text.createdAt}
          </span>
          {text.language && (
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {getLanguageName(text.language)}
            </span>
          )}
          {text.updatedAt && (
            <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              ✏️ {t("textItem.edited")}: {text.updatedAt}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={text.category}
            onChange={(e) => updateCategory(text.id, e.target.value)}
            className="modern-select text-xs !py-2 !px-3 min-w-[120px]"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div className="flex gap-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all hover:scale-110"
              title={t("textItem.edit")}
            >
              {isEditing ? "❌" : "✏️"}
            </button>

            <button
              onClick={() => deleteText(text.id)}
              className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all hover:scale-110"
              title={t("textItem.delete")}
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* محتوای متن */}
      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="modern-input min-h-[120px] resize-vertical"
            rows="4"
          />
          <div className="flex gap-2 mt-3 justify-end">
            <button
              onClick={handleSaveEdit}
              className="btn-success text-sm !px-4 !py-2"
            >
              💾 {t("textItem.save")}
            </button>
            <button
              onClick={handleCancelEdit}
              className="btn-secondary text-sm !px-4 !py-2"
            >
              ❌ {t("textItem.cancel")}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <p
            className="text-gray-700 leading-8 text-lg bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-all"
            dir={
              text.language?.startsWith("fa") || text.language?.startsWith("ar")
                ? "rtl"
                : "ltr"
            }
            style={{
              textAlign:
                text.language?.startsWith("fa") ||
                text.language?.startsWith("ar")
                  ? "right"
                  : "left",
            }}
          >
            {text.content}
          </p>
        </div>
      )}

      {/* وضعیت پخش */}
      {isCurrentText && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isSpeaking ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              ></div>
              <span className="font-medium text-blue-700">
                {getPlaybackStatus()}
              </span>
            </div>
            <span className="text-sm bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
              {t("textItem.speed")}: {rate}x
            </span>
          </div>
        </div>
      )}

      {/* فوتر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
            📝 {text.wordCount} {t("speechToText.words")}
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
            🔤 {text.characterCount} {t("speechToText.characters")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* کنترل‌های TTS */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-2">
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isCurrentText && isSpeaking
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200"
              }`}
            >
              <span className="text-lg">
                {isCurrentText && isSpeaking ? (isPaused ? "▶️" : "⏸️") : "🔊"}
              </span>
              <span className="text-sm font-medium">
                {getSpeakButtonText()}
              </span>
            </button>

            {isCurrentText && isSpeaking && (
              <button
                onClick={handleStop}
                className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all hover:scale-110"
                title={t("textItem.stop")}
              >
                ⏹️
              </button>
            )}

            <button
              onClick={() => setShowTTSControls(!showTTSControls)}
              className="p-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all hover:scale-110"
              title={t("textItem.settings")}
            >
              ⚙️
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            title={t("textItem.copy")}
          >
            <span>📋</span>
            <span className="text-sm font-medium">{copyButtonText}</span>
          </button>
        </div>
      </div>

      {/* کنترل‌های پیشرفته TTS */}
      {showTTSControls && (
        <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl border border-purple-200 animate-slideIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {t("textItem.speed")}:
            </span>
            <div className="flex flex-wrap gap-2">
              {[0.5, 0.8, 1.0, 1.2, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-4 py-2 rounded-xl transition-all font-medium ${
                    rate === speed
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-purple-50 hover:border-purple-300"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {isCurrentText && (
            <div className="mt-3 text-xs text-purple-600 bg-purple-100 px-3 py-2 rounded-xl">
              {t("textItem.speedChangeNotice")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextItem;
