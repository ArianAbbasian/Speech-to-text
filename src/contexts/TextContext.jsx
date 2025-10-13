// src/contexts/TextContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const TextContext = createContext();

export const useText = () => {
  const context = useContext(TextContext);
  if (!context) {
    throw new Error('useText must be used within a TextProvider');
  }
  return context;
};

export const TextProvider = ({ children }) => {
  const [texts, setTexts] = useState([]);
  const [tags, setTags] = useState(['مهم', 'فوری', 'پروژه', 'شخصی', 'کار']);
  const [searchFilters, setSearchFilters] = useState({});

  // بارگذاری اولیه از localStorage - نسخه اصلاح شده
  useEffect(() => {
    const loadInitialData = () => {
      try {
        // بارگذاری متن‌ها
        const savedTexts = localStorage.getItem('speechTexts');
        console.log('Loaded from localStorage:', savedTexts);
        
        if (savedTexts) {
          const parsedTexts = JSON.parse(savedTexts);
          if (Array.isArray(parsedTexts) && parsedTexts.length > 0) {
            setTexts(parsedTexts);
          }
        }

        // بارگذاری تگ‌ها
        const savedTags = localStorage.getItem('speechTags');
        if (savedTags) {
          const parsedTags = JSON.parse(savedTags);
          if (Array.isArray(parsedTags)) {
            setTags(parsedTags);
          }
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadInitialData();
  }, []);

  // ذخیره‌سازی در localStorage هنگام تغییر texts - نسخه اصلاح شده
  useEffect(() => {
    try {
      if (texts.length > 0) {
        localStorage.setItem('speechTexts', JSON.stringify(texts));
        console.log('Saved to localStorage:', texts);
      }
    } catch (error) {
      console.error('Error saving texts to localStorage:', error);
    }
  }, [texts]);

  // ذخیره‌سازی در localStorage هنگام تغییر tags
  useEffect(() => {
    try {
      localStorage.setItem('speechTags', JSON.stringify(tags));
    } catch (error) {
      console.error('Error saving tags to localStorage:', error);
    }
  }, [tags]);

  // 🔹 ADD TEXT - اضافه کردن متن جدید
  const addText = (content, category = 'یادداشت', textTags = [], language = 'fa-IR') => {
  if (content && content.trim()) {
    const newText = {
      id: Date.now() + Math.random(),
      content: content.trim(),
      category: category || 'یادداشت',
      tags: Array.isArray(textTags) ? textTags : [],
      language: language, // اضافه کردن فیلد زبان
      createdAt: new Date().toLocaleString('fa-IR'),
      updatedAt: null,
      wordCount: content.trim().split(/\s+/).filter(word => word.length > 0).length,
      characterCount: content.trim().length
    };

    setTexts(prev => {
      const newTexts = [newText, ...prev];
      return newTexts;
    });
    return newText;
  }
};

  // 🔹 DELETE TEXT - حذف متن
  const deleteText = (id) => {
    setTexts(prev => prev.filter(text => text.id !== id));
  };

  // 🔹 UPDATE CATEGORY - به‌روزرسانی دسته‌بندی
  const updateCategory = (id, category) => {
    setTexts(prev => prev.map(text =>
      text.id === id ? { 
        ...text, 
        category,
        updatedAt: new Date().toLocaleString('fa-IR')
      } : text
    ));
  };

  // 🔹 EDIT TEXT - ویرایش محتوای متن
  const editText = (id, newContent) => {
    if (newContent && newContent.trim()) {
      setTexts(prev => prev.map(text =>
        text.id === id ? { 
          ...text, 
          content: newContent.trim(),
          updatedAt: new Date().toLocaleString('fa-IR'),
          wordCount: newContent.trim().split(/\s+/).filter(word => word.length > 0).length,
          characterCount: newContent.trim().length
        } : text
      ));
    }
  };

  // 🔹 ADD TAG - اضافه کردن تگ جدید
  const addTag = (tag) => {
    if (tag && tag.trim() && !tags.includes(tag.trim())) {
      setTags(prev => [...prev, tag.trim()]);
    }
  };

  // 🔹 REMOVE TAG - حذف تگ
  const removeTag = (tag) => {
    setTags(prev => prev.filter(t => t !== tag));
    
    setTexts(prev => prev.map(text => ({
      ...text,
      tags: text.tags.filter(t => t !== tag)
    })));
  };

  // 🔹 TOGGLE TEXT TAG - اضافه/حذف تگ از متن
  const toggleTextTag = (textId, tag) => {
    setTexts(prev => prev.map(text =>
      text.id === textId
        ? {
            ...text,
            tags: text.tags.includes(tag)
              ? text.tags.filter(t => t !== tag)
              : [...text.tags, tag]
          }
        : text
    ));
  };

  // 🔹 CLEAR ALL TEXTS - پاک کردن همه متن‌ها
  const clearAllTexts = () => {
    setTexts([]);
    localStorage.removeItem('speechTexts');
  };

  // 🔹 SEARCH TEXTS - جستجوی متن‌ها - نسخه اصلاح شده
  const searchTexts = (filters = {}) => {
    console.log('Setting search filters:', filters);
    setSearchFilters(filters);
  };

  // 🔹 GET FILTERED TEXTS - دریافت متن‌های فیلتر شده - نسخه اصلاح شده
  const getFilteredTexts = () => {
    console.log('Current texts:', texts);
    console.log('Current filters:', searchFilters);
    
    let filtered = [...texts]; // ایجاد کپی از texts

    // فیلتر بر اساس متن
    if (searchFilters.searchTerm && searchFilters.searchTerm.trim()) {
      const term = searchFilters.searchTerm.trim();
      filtered = filtered.filter(text =>
        text.content.includes(term)
      );
    }

    // فیلتر بر اساس دسته‌بندی
    if (searchFilters.category && searchFilters.category !== 'all') {
      filtered = filtered.filter(text =>
        text.category === searchFilters.category
      );
    }

    // فیلتر بر اساس تگ‌ها
    if (searchFilters.tags && searchFilters.tags.length > 0) {
      filtered = filtered.filter(text =>
        searchFilters.tags.some(tag => text.tags.includes(tag))
      );
    }

    // فیلتر بر اساس بازه تاریخ
    if (searchFilters.dateRange) {
      const { start, end } = searchFilters.dateRange;
      
      if (start) {
        const startDate = new Date(start);
        filtered = filtered.filter(text => {
          try {
            const textDate = new Date(text.createdAt);
            return textDate >= startDate;
          } catch {
            return true;
          }
        });
      }
      
      if (end) {
        const endDate = new Date(end);
        filtered = filtered.filter(text => {
          try {
            const textDate = new Date(text.createdAt);
            return textDate <= endDate;
          } catch {
            return true;
          }
        });
      }
    }

    console.log('Filtered texts:', filtered);
    return filtered;
  };

  // 🔹 GET STATISTICS - دریافت آمار
  const getStatistics = () => {
    const totalTexts = texts.length;
    const totalWords = texts.reduce((sum, text) => sum + text.wordCount, 0);
    const totalCharacters = texts.reduce((sum, text) => sum + text.characterCount, 0);
    
    const categoryStats = texts.reduce((stats, text) => {
      stats[text.category] = (stats[text.category] || 0) + 1;
      return stats;
    }, {});

    const today = new Date().toLocaleDateString('fa-IR');
    const todayTexts = texts.filter(text => 
      text.createdAt.includes(today)
    );

    return {
      totalTexts,
      totalWords,
      totalCharacters,
      categoryStats,
      todayTexts: todayTexts.length
    };
  };

  // 🔹 EXPORT DATA - خروجی داده‌ها
  const exportData = () => {
    const data = {
      texts,
      tags,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  };

  // 🔹 IMPORT DATA - ورودی داده‌ها
  const importData = (importedData) => {
    try {
      const data = JSON.parse(importedData);
      
      if (data.texts && Array.isArray(data.texts)) {
        setTexts(data.texts);
      }
      
      if (data.tags && Array.isArray(data.tags)) {
        setTags(data.tags);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  const value = {
    // داده‌ها
    texts,
    tags,
    searchFilters,
    
    // متدهای مدیریت متن
    addText,
    deleteText,
    updateCategory,
    editText,
    clearAllTexts,
    
    // متدهای مدیریت تگ
    addTag,
    removeTag,
    toggleTextTag,
    
    // متدهای جستجو و فیلتر
    searchTexts,
    getFilteredTexts,
    
    // متدهای آمار و گزارش
    getStatistics,
    
    // متدهای مدیریت داده
    exportData,
    importData,
  };

  return (
    <TextContext.Provider value={value}>
      {children}
    </TextContext.Provider>
  );
};