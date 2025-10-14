// src/App.jsx
import React, { useState } from "react";
import AudioRecorder from "./components/AudioRecorder/AudioRecorder";
import TextManager from "./components/TextManager/TextManager";
import AdvancedSearch from "./components/AdvancedSearch/AdvancedSearch";
import Statistics from "./components/Statistics/Statistics";
import DataManager from "./components/DataManager/DataManager";
import TTSControls from "./components/TTSControls/TTSControls";
import { TextProvider } from "./contexts/TextContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle flex items-center gap-2"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <>
          <span className="text-lg">🌙</span>
          <span className="text-xs hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <span className="text-lg">☀️</span>
          <span className="text-xs hidden sm:inline">Light</span>
        </>
      )}
    </button>
  );
};

const MobileNavigation = ({ tabs, activeTab, onTabChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="lg:hidden mb-4">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-full modern-card px-4 py-3 flex items-center justify-between text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
      >
        <span className="font-medium text-sm">
          {tabs.find((tab) => tab.id === activeTab)?.label}
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${
            isMenuOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute left-3 right-3 mt-2 modern-card border border-gray-200 dark:border-gray-600 z-50 max-h-80 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                setIsMenuOpen(false);
              }}
              className={`w-full px-4 py-3 text-right border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-all text-sm ${
                activeTab === tab.id
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-medium"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DesktopTabs = ({ tabs, activeTab, onTabChange }) => (
  <div className="hidden lg:block modern-card mb-4 sm:mb-6 p-0 overflow-hidden">
    <div className="flex">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-all rounded-lg ${
            activeTab === tab.id
              ? "bg-blue-500 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

const AppContent = () => {
  const [activeTab, setActiveTab] = useState("recorder");
  const { t, uiLanguage, changeLanguage, languages } = useLanguage();

  const tabs = [
    { id: "recorder", label: t("tabs.recorder"), component: <AudioRecorder /> },
    { id: "texts", label: t("tabs.texts"), component: <TextManager /> },
    { id: "search", label: t("tabs.search"), component: <AdvancedSearch /> },
    { id: "stats", label: t("tabs.stats"), component: <Statistics /> },
    { id: "data", label: t("tabs.data"), component: <DataManager /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4 px-3 sm:py-6 sm:px-4 lg:py-8 lg:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
            <div className="order-2 sm:order-1">
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {t("app.language")}:
              </span>
              <select
                value={uiLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="modern-select text-xs sm:text-sm"
              >
                {Object.entries(languages).map(([code, lang]) => (
                  <option key={code} value={code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {t("app.title")}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("app.description")}
          </p>
        </header>

        {/* نویگیشن */}
        <MobileNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <DesktopTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* محتوای تب فعال */}
        <div className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 sm:mt-12 text-gray-600 dark:text-gray-400 text-sm">
          <p>{t("app.madeWith")}</p>
        </footer>
      </div>

      <TTSControls />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TextProvider>
          <AppContent />
        </TextProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
