// src/components/TTSControls/TTSControls.jsx
import React from 'react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

const TTSControls = () => {
  const {
    isSpeaking,
    isPaused,
    currentText,
    voices,
    voice,
    rate,
    pitch,
    changeVoice,
    changeRate,
    changePitch,
    pause,
    resume,
    stop
  } = useTextToSpeech();

  if (!isSpeaking && !currentText) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-800">در حال پخش متن</h4>
        <button
          onClick={stop}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          ✕
        </button>
      </div>

      {/* متن در حال پخش */}
      <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-gray-700 max-h-20 overflow-y-auto">
        {currentText}
      </div>

      {/* کنترل‌ها */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={isPaused ? resume : pause}
          className={`px-3 py-1 rounded text-sm ${
            isPaused 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-yellow-500 text-white hover:bg-yellow-600'
          }`}
        >
          {isPaused ? 'ادامه ▶️' : 'توقف ⏸️'}
        </button>

        <button
          onClick={stop}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          توقف ⏹️
        </button>

        <div className="flex-1 text-xs text-gray-500 text-left">
          {isPaused ? 'متوقف شده' : 'در حال پخش...'}
        </div>
      </div>

      {/* تنظیمات پیشرفته */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-gray-600 mb-1">سرعت:</label>
          <select
            value={rate}
            onChange={(e) => changeRate(parseFloat(e.target.value))}
            className="w-full p-1 border border-gray-300 rounded"
          >
            <option value="0.5">0.5x - کند</option>
            <option value="0.8">0.8x - آرام</option>
            <option value="1.0">1.0x - عادی</option>
            <option value="1.2">1.2x - سریع</option>
            <option value="1.5">1.5x - خیلی سریع</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-600 mb-1">زبان:</label>
          <select
            value={voice ? voice.voiceURI : ''}
            onChange={(e) => {
              const selectedVoice = voices.find(v => v.voiceURI === e.target.value);
              if (selectedVoice) changeVoice(selectedVoice);
            }}
            className="w-full p-1 border border-gray-300 rounded"
          >
            {voices.map(voice => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TTSControls;