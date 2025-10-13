// src/components/TextManager/TextManager.jsx
import React, { useState, useEffect } from 'react';
import { useText } from '../../contexts/TextContext';
import { useLanguage } from '../../contexts/LanguageContext'; // تغییر به useLanguage
import TextItem from '../TextItem/TextItem';

const TextManager = () => {
  const { texts, getFilteredTexts, searchTexts, getStatistics } = useText();
  const { t } = useLanguage(); // استفاده از useLanguage
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTexts, setFilteredTexts] = useState([]);
  
  const categories = ['all', 'کار', 'شخصی', 'یادداشت', 'ایده'];
  const stats = getStatistics();

  // اعمال فیلترها هنگام تغییر
  useEffect(() => {
    const filters = {};
    
    if (searchTerm.trim()) {
      filters.searchTerm = searchTerm;
    }
    
    if (selectedCategory !== 'all') {
      filters.category = selectedCategory;
    }
    
    searchTexts(filters);
    setFilteredTexts(getFilteredTexts());
  }, [searchTerm, selectedCategory, texts, searchTexts, getFilteredTexts]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    searchTexts({});
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {t('textManager.title')}
        </h2>
        
        {/* آمار سریع */}
        <div className="flex gap-4 text-sm text-gray-600">
          <span>{t('textManager.total')}: {stats.totalTexts}</span>
          <span>{t('statistics.totalWords')}: {stats.totalWords}</span>
          <span>{t('statistics.today')}: {stats.todayTexts}</span>
        </div>
      </div>
      
      {/* فیلتر و جستجو */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder={t('textManager.searchPlaceholder')}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="all">{t('textManager.allCategories')}</option>
          {categories.filter(cat => cat !== 'all').map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
        >
          {t('textManager.clearFilter')}
        </button>
      </div>

      {/* لیست متن‌ها */}
      <div className="space-y-4">
        {filteredTexts.map(text => (
          <TextItem key={text.id} text={text} />
        ))}
        
        {filteredTexts.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            {searchTerm || selectedCategory !== 'all' ? (
              <p>{t('textManager.noResults')}</p>
            ) : texts.length === 0 ? (
              <div>
                <p className="text-lg mb-2">{t('textManager.noTexts')}</p>
                <p className="text-sm">{t('textManager.noTextsDescription')}</p>
              </div>
            ) : (
              <p>متن‌های شما اینجا نمایش داده می‌شوند</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextManager;