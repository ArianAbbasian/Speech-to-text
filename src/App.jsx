// src/App.jsx
import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder/AudioRecorder';
import TextManager from './components/TextManager/TextManager';
import AdvancedSearch from './components/AdvancedSearch/AdvancedSearch';
import Statistics from './components/Statistics/Statistics';
import DataManager from './components/DataManager/DataManager';
import TTSControls from './components/TTSControls/TTSControls';
import LanguageSelector from './components/LanguageSelector/LanguageSelector';
import { TextProvider } from './contexts/TextContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// کامپوننت جداگانه برای محتوای اصلی که از هوک استفاده می‌کنه
function AppContent() {
  const [activeTab, setActiveTab] = useState('recorder');
  const { t, language } = useLanguage(); // اضافه کردن language به dependency

  // وقتی زبان تغییر می‌کنه، تب‌ها دوباره ساخته می‌شن
  const tabs = React.useMemo(() => [
    { id: 'recorder', label: t('tabs.recorder'), component: <AudioRecorder /> },
    { id: 'texts', label: t('tabs.texts'), component: <TextManager /> },
    { id: 'search', label: t('tabs.search'), component: <AdvancedSearch /> },
    { id: 'stats', label: t('tabs.stats'), component: <Statistics /> },
    { id: 'data', label: t('tabs.data'), component: <DataManager /> },
  ], [t, language]); // اضافه کردن language به dependency array

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <LanguageSelector />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t('appName')}
          </h1>
          <p className="text-gray-600">{t('appDescription')}</p>
        </header>

        {/* تب‌ها */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* محتوای تب فعال */}
        <div className="min-h-[500px]">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-600">
          <p>{t('madeWithLove')}</p>
        </footer>
      </div>

      {/* کنترل‌های TTS */}
      <TTSControls />
    </div>
  );
}

// کامپوننت اصلی App
function App() {
  return (
    <LanguageProvider>
      <TextProvider>
        <AppContent />
      </TextProvider>
    </LanguageProvider>
  );
}

export default App;