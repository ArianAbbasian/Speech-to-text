// src/components/Statistics/Statistics.jsx
import React from 'react';
import { useText } from '../../contexts/TextContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Statistics = () => {
  const { texts } = useText();
  const { t, uiLanguage } = useLanguage();

  const totalWords = texts.reduce((sum, text) => sum + text.wordCount, 0);
  const totalCharacters = texts.reduce((sum, text) => sum + text.content.length, 0);
  
  const categoryStats = texts.reduce((stats, text) => {
    stats[text.category] = (stats[text.category] || 0) + 1;
    return stats;
  }, {});

  // تاریخ امروز بر اساس زبان انتخابی
  const getTodayDate = () => {
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    };
    
    const locales = {
      'fa': 'fa-IR',
      'en': 'en-US', 
      'ar': 'ar-SA',
      'tr': 'tr-TR'
    };
    
    return new Date().toLocaleDateString(locales[uiLanguage] || 'fa-IR', options);
  };

  const today = getTodayDate();
  const todayTexts = texts.filter(text => {
    const textDate = new Date(text.createdAt).toLocaleDateString();
    const todayDate = new Date(today).toLocaleDateString();
    return textDate === todayDate;
  });

  // ترجمه دسته‌بندی‌ها برای نمایش
  const translateCategory = (category) => {
    const categoryTranslations = {
      'کار': t('textItem.category.work'),
      'شخصی': t('textItem.category.personal'),
      'یادداشت': t('textItem.category.note'),
      'ایده': t('textItem.category.idea'),
      'Work': t('textItem.category.work'),
      'Personal': t('textItem.category.personal'),
      'Note': t('textItem.category.note'),
      'Idea': t('textItem.category.idea')
    };
    
    return categoryTranslations[category] || category;
  };

  // آمار زبان‌ها
  const languageStats = texts.reduce((stats, text) => {
    const lang = text.language || 'fa-IR';
    stats[lang] = (stats[lang] || 0) + 1;
    return stats;
  }, {});

  const languageNames = {
    'fa-IR': '🇮🇷 فارسی',
    'en-US': '🇺🇸 English',
    'en-GB': '🇬🇧 English',
    'ar-SA': '🇸🇦 العربية', 
    'tr-TR': '🇹🇷 Türkçe'
  };

  return (
    <div className="modern-card animate-fadeIn statistics-content">
      <div className="text-center mb-8">
        <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-1">
          {t('statistics.title')}
        </h3>
        <p className="text-gray-600 text-lg">
          {t('statistics.subtitle')}
        </p>
      </div>
      
      {/* کارت‌های آمار کلی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg stat-card">
          <div className="text-3xl font-bold mb-2">{texts.length}</div>
          <div className="text-blue-100 font-medium">{t('statistics.totalTexts')}</div>
          <div className="text-4xl mt-3">📄</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
          <div className="text-3xl font-bold mb-2">{totalWords}</div>
          <div className="text-green-100 font-medium">{t('statistics.totalWords')}</div>
          <div className="text-4xl mt-3">📝</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
          <div className="text-3xl font-bold mb-2">{totalCharacters}</div>
          <div className="text-purple-100 font-medium">{t('statistics.totalCharacters')}</div>
          <div className="text-4xl mt-3">🔤</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
          <div className="text-3xl font-bold mb-2">{todayTexts.length}</div>
          <div className="text-orange-100 font-medium">{t('statistics.today')}</div>
          <div className="text-4xl mt-3">🎯</div>
        </div>
      </div>

      {/* آمار زبان‌ها */}
      {texts.length > 0 && Object.keys(languageStats).length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-2xl">🌍</span>
            {t('statistics.languageDistribution')}
          </h4>
          <div className="space-y-4">
            {Object.entries(languageStats).map(([language, count]) => (
              <div key={language} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{languageNames[language] || language}</span>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {count}
                  </span>
                </div>
                <div className="w-32 bg-blue-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${(count / texts.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* آمار دسته‌بندی‌ها */}
      {texts.length > 0 && Object.keys(categoryStats).length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-2xl">📊</span>
            {t('statistics.categoryDistribution')}
          </h4>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700">
                    {translateCategory(category)}
                  </span>
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {count}
                  </span>
                </div>
                <div className="w-32 bg-purple-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${(count / texts.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* پیام زمانی که هیچ متنی وجود ندارد */}
      {texts.length === 0 && (
        <div className="text-center text-gray-500 py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">📈</div>
          <p className="text-xl font-semibold text-gray-700 mb-2">
            {t('statistics.noData')}
          </p>
          <p className="text-gray-600">{t('statistics.noDataDesc')}</p>
        </div>
      )}

      {/* خلاصه آمار */}
      {texts.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mt-8">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            📋 {t('statistics.summary')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-green-700">
            <div>
              <span className="font-medium">{t('statistics.avgWordsPerText')}: </span>
              {(totalWords / texts.length).toFixed(1)}
            </div>
            <div>
              <span className="font-medium">{t('statistics.avgCharsPerText')}: </span>
              {(totalCharacters / texts.length).toFixed(1)}
            </div>
            <div>
              <span className="font-medium">{t('statistics.mostUsedLanguage')}: </span>
              {Object.entries(languageStats).sort((a, b) => b[1] - a[1])[0]?.[0] ? languageNames[Object.entries(languageStats).sort((a, b) => b[1] - a[1])[0][0]] : '-'}
            </div>
            <div>
              <span className="font-medium">{t('statistics.mostUsedCategory')}: </span>
              {Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0]?.[0] ? translateCategory(Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0][0]) : '-'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;