// src/components/AdvancedSearch/AdvancedSearch.jsx
import React, { useState } from 'react';
import { useText } from '../../contexts/TextContext';
import { useLanguage } from '../../contexts/LanguageContext'; // تغییر به useLanguage

const AdvancedSearch = () => {
  const { tags, searchTexts, getFilteredTexts } = useText();
  const { t } = useLanguage(); // استفاده از useLanguage
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const categories = ['all', 'کار', 'شخصی', 'یادداشت', 'ایده'];

  const handleSearch = () => {
    const filters = {};
    
    if (searchTerm.trim()) {
      filters.searchTerm = searchTerm;
    }
    
    if (selectedCategory !== 'all') {
      filters.category = selectedCategory;
    }
    
    if (selectedTags.length > 0) {
      filters.tags = selectedTags;
    }
    
    if (dateRange.start || dateRange.end) {
      filters.dateRange = { ...dateRange };
    }
    
    console.log('Applying filters:', filters);
    searchTexts(filters);
    
    // نمایش نتایج
    const results = getFilteredTexts();
    console.log('Search results:', results);
    
    if (results.length === 0) {
      alert(t('textManager.noResults'));
    } else {
      alert(`${results.length} ${t('advancedSearch.resultsFound')}`);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setDateRange({ start: '', end: '' });
    searchTexts({});
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {t('advancedSearch.title')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* جستجوی متنی */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('advancedSearch.searchText')}
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('advancedSearch.searchPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* دسته‌بندی */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('advancedSearch.category')}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="all">{t('advancedSearch.allCategories')}</option>
            {categories.filter(cat => cat !== 'all').map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* بازه تاریخ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('advancedSearch.dateFrom')}
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('advancedSearch.dateTo')}
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* تگ‌ها */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('advancedSearch.tags')}
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm border transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* دکمه‌های action */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSearch}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          🔍 {t('advancedSearch.applyFilters')}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
        >
          ♻️ {t('advancedSearch.reset')}
        </button>
      </div>
    </div>
  );
};

export default AdvancedSearch;