// src/components/Statistics/Statistics.jsx
import React from 'react';
import { useText } from '../../contexts/TextContext';
import { useLanguage } from '../../contexts/LanguageContext'; // تغییر به useLanguage

const Statistics = () => {
  const { texts } = useText();
  const { t } = useLanguage(); // استفاده از useLanguage

  const totalWords = texts.reduce((sum, text) => sum + text.wordCount, 0);
  const totalCharacters = texts.reduce((sum, text) => sum + text.content.length, 0);
  
  const categoryStats = texts.reduce((stats, text) => {
    stats[text.category] = (stats[text.category] || 0) + 1;
    return stats;
  }, {});

  const today = new Date().toLocaleDateString('fa-IR');
  const todayTexts = texts.filter(text => 
    text.createdAt.includes(today.split('/').join('/'))
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {t('statistics.title')}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{texts.length}</div>
          <div className="text-sm text-blue-500">{t('statistics.totalTexts')}</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{totalWords}</div>
          <div className="text-sm text-green-500">{t('statistics.totalWords')}</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{totalCharacters}</div>
          <div className="text-sm text-purple-500">{t('statistics.totalCharacters')}</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">{todayTexts.length}</div>
          <div className="text-sm text-orange-500">{t('statistics.today')}</div>
        </div>
      </div>

      {/* آمار دسته‌بندی‌ها */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">
          {t('statistics.categoryDistribution')}
        </h4>
        <div className="space-y-2">
          {Object.entries(categoryStats).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{category}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(count / texts.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;