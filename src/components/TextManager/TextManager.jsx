// src/components/TextManager/TextManager.jsx
import React, { useState, useEffect } from 'react';
import { useText } from '../../contexts/TextContext';
import { useLanguage } from '../../contexts/LanguageContext';
import TextItem from '../TextItem/TextItem';

const TextManager = () => {
  const { texts, getFilteredTexts, searchTexts, getStatistics } = useText();
  const { t } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTexts, setFilteredTexts] = useState([]);
  
  const categories = ['all', t('textItem.category.work'), t('textItem.category.personal'), t('textItem.category.note'), t('textItem.category.idea')];
  const stats = getStatistics();

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
    <div className="modern-card animate-fadeIn">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent pb-1">
            {t('textManager.title')}
          </h2>
          <p className="text-gray-600 mt-2">{t('textManager.subtitle')}</p>
        </div>
        
        {/* آمار سریع */}
        <div className="flex gap-4 text-sm">
          <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
            <div className="font-bold text-blue-600">{stats.totalTexts}</div>
            <div className="text-blue-500">{t('statistics.totalTexts')}</div>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-200">
            <div className="font-bold text-green-600">{stats.totalWords}</div>
            <div className="text-green-500">{t('statistics.totalWords')}</div>
          </div>
          <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-200">
            <div className="font-bold text-orange-600">{stats.todayTexts}</div>
            <div className="text-orange-500">{t('statistics.today')}</div>
          </div>
        </div>
      </div>
      
      {/* فیلتر و جستجو */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder={t('textManager.searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
              className="modern-input"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="modern-select flex-1"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? t('textManager.allCategories') : category}
                </option>
              ))}
            </select>
            
            <button
              onClick={clearFilters}
              className="btn-secondary whitespace-nowrap"
            >
              {t('textManager.clearFilter')}
            </button>
          </div>
        </div>
      </div>

      {/* لیست متن‌ها */}
      <div className="space-y-4 custom-scrollbar">
        {filteredTexts.map(text => (
          <TextItem key={text.id} text={text} />
        ))}
        
        {filteredTexts.length === 0 && (
          <div className="text-center text-gray-500 py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📝</div>
            {searchTerm || selectedCategory !== 'all' ? (
              <div>
                <p className="text-xl font-semibold text-gray-700 mb-2">
                  {t('textManager.noResults')}
                </p>
                <p className="text-gray-600">{t('textManager.tryDifferentFilters')}</p>
              </div>
            ) : texts.length === 0 ? (
              <div>
                <p className="text-xl font-semibold text-gray-700 mb-2">
                  {t('textManager.noTexts')}
                </p>
                <p className="text-gray-600">{t('textManager.noTextsDesc')}</p>
              </div>
            ) : (
              <p className="text-lg text-gray-600">{t('textManager.startAdding')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextManager;