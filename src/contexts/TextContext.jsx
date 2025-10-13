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

  useEffect(() => {
    const loadInitialData = () => {
      try {
        const savedTexts = localStorage.getItem('speechTexts');
        if (savedTexts) {
          const parsedTexts = JSON.parse(savedTexts);
          if (Array.isArray(parsedTexts) && parsedTexts.length > 0) {
            setTexts(parsedTexts);
          }
        }

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

  useEffect(() => {
    try {
      if (texts.length > 0) {
        localStorage.setItem('speechTexts', JSON.stringify(texts));
      }
    } catch (error) {
      console.error('Error saving texts to localStorage:', error);
    }
  }, [texts]);

  useEffect(() => {
    try {
      localStorage.setItem('speechTags', JSON.stringify(tags));
    } catch (error) {
      console.error('Error saving tags to localStorage:', error);
    }
  }, [tags]);

  const addText = (content, category = 'یادداشت', textTags = [], language = 'fa-IR') => {
    if (content && content.trim()) {
      const newText = {
        id: Date.now() + Math.random(),
        content: content.trim(),
        category: category || 'یادداشت',
        tags: Array.isArray(textTags) ? textTags : [],
        language: language,
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

  const deleteText = (id) => {
    setTexts(prev => prev.filter(text => text.id !== id));
  };

  const updateCategory = (id, category) => {
    setTexts(prev => prev.map(text =>
      text.id === id ? { 
        ...text, 
        category,
        updatedAt: new Date().toLocaleString('fa-IR')
      } : text
    ));
  };

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

  const addTag = (tag) => {
    if (tag && tag.trim() && !tags.includes(tag.trim())) {
      setTags(prev => [...prev, tag.trim()]);
    }
  };

  const removeTag = (tag) => {
    setTags(prev => prev.filter(t => t !== tag));
    
    setTexts(prev => prev.map(text => ({
      ...text,
      tags: text.tags.filter(t => t !== tag)
    })));
  };

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

  const clearAllTexts = () => {
    setTexts([]);
    localStorage.removeItem('speechTexts');
  };

  const searchTexts = (filters = {}) => {
    setSearchFilters(filters);
  };

  const getFilteredTexts = () => {
    let filtered = [...texts];

    if (searchFilters.searchTerm && searchFilters.searchTerm.trim()) {
      const term = searchFilters.searchTerm.trim();
      filtered = filtered.filter(text =>
        text.content.includes(term)
      );
    }

    if (searchFilters.category && searchFilters.category !== 'all') {
      filtered = filtered.filter(text =>
        text.category === searchFilters.category
      );
    }

    if (searchFilters.tags && searchFilters.tags.length > 0) {
      filtered = filtered.filter(text =>
        searchFilters.tags.some(tag => text.tags.includes(tag))
      );
    }

    if (searchFilters.language && searchFilters.language !== 'all') {
      filtered = filtered.filter(text =>
        text.language === searchFilters.language
      );
    }

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

    return filtered;
  };

  const getStatistics = () => {
    const totalTexts = texts.length;
    const totalWords = texts.reduce((sum, text) => sum + text.wordCount, 0);
    const totalCharacters = texts.reduce((sum, text) => sum + text.characterCount, 0);
    
    const categoryStats = texts.reduce((stats, text) => {
      stats[text.category] = (stats[text.category] || 0) + 1;
      return stats;
    }, {});

    const languageStats = texts.reduce((stats, text) => {
      stats[text.language] = (stats[text.language] || 0) + 1;
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
      languageStats,
      todayTexts: todayTexts.length
    };
  };

  const exportData = () => {
    const data = {
      texts,
      tags,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  };

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
    texts,
    tags,
    searchFilters,
    addText,
    deleteText,
    updateCategory,
    editText,
    clearAllTexts,
    addTag,
    removeTag,
    toggleTextTag,
    searchTexts,
    getFilteredTexts,
    getStatistics,
    exportData,
    importData,
  };

  return (
    <TextContext.Provider value={value}>
      {children}
    </TextContext.Provider>
  );
};