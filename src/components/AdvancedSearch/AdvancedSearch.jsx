// src/components/AdvancedSearch/AdvancedSearch.jsx
import React, { useState } from "react";
import { useText } from "../../contexts/TextContext";
import { useLanguage } from "../../contexts/LanguageContext";

const AdvancedSearch = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const { tags, searchTexts, getFilteredTexts } = useText();
  const { t } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const categories = [
    "all",
    t('textItem.category.work'),
    t('textItem.category.personal'),
    t('textItem.category.note'),
    t('textItem.category.idea')
  ];

  const handleSearch = () => {
    const filters = {};

    if (selectedLanguage && selectedLanguage !== "all") {
      filters.language = selectedLanguage;
    }

    if (searchTerm.trim()) {
      filters.searchTerm = searchTerm;
    }

    if (selectedCategory !== "all") {
      filters.category = selectedCategory;
    }

    if (selectedTags.length > 0) {
      filters.tags = selectedTags;
    }

    if (dateRange.start || dateRange.end) {
      filters.dateRange = { ...dateRange };
    }

    searchTexts(filters);

    const results = getFilteredTexts();

    if (results.length === 0) {
      alert(t("search.noResults"));
    } else {
      alert(t("search.resultsFound", { count: results.length }));
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLanguage("all");
    setSelectedTags([]);
    setDateRange({ start: "", end: "" });
    searchTexts({});
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="modern-card animate-fadeIn">
      <div className="text-center mb-8">
        <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-1">
          {t("search.title")}
        </h3>
        <p className="text-gray-600 text-lg">
          {t("search.subtitle")}
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border-2 border-dashed border-blue-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* جستجوی متنی */}
          <div className="lg:col-span-2 xl:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🔍 {t("search.textSearch")}
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("search.searchPlaceholder")}
              className="modern-input text-lg"
            />
          </div>

          {/* دسته‌بندی */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📁 {t("search.category")}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="modern-select"
            >
              <option value="all">{t("search.allCategories")}</option>
              {categories
                .filter((cat) => cat !== "all")
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          {/* زبان */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🌐 {t("search.language")}
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="modern-select"
            >
              <option value="all">{t("search.allLanguages")}</option>
              <option value="fa-IR">🇮🇷 فارسی</option>
              <option value="en-US">🇺🇸 English</option>
              <option value="en-GB">🇬🇧 English (UK)</option>
              <option value="ar-SA">🇸🇦 العربية</option>
              <option value="tr-TR">🇹🇷 Türkçe</option>
            </select>
          </div>

          {/* بازه تاریخ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📅 {t("search.dateFrom")}
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="modern-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📅 {t("search.dateTo")}
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="modern-input"
            />
          </div>
        </div>

        {/* تگ‌ها */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            🏷️ {t("search.tags")}
          </label>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                  selectedTags.includes(tag)
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* دکمه‌های action */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSearch}
            className="btn-primary flex-1 flex items-center justify-center gap-3 text-lg"
          >
            <span>🔍</span>
            {t("search.applyFilters")}
          </button>
          <button
            onClick={handleReset}
            className="btn-secondary flex items-center justify-center gap-3 text-lg px-8"
          >
            <span>♻️</span>
            {t("search.reset")}
          </button>
        </div>
      </div>

      {/* راهنمای جستجو */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
          💡 {t("search.tipsTitle")}
        </h4>
        <ul className="text-green-700 space-y-2 text-sm">
          <li>• {t("search.tip1")}</li>
          <li>• {t("search.tip2")}</li>
          <li>• {t("search.tip3")}</li>
        </ul>
      </div>
    </div>
  );
};

export default AdvancedSearch;