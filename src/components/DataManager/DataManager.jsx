// src/components/DataManager/DataManager.jsx
import React, { useState } from 'react';
import { useText } from '../../contexts/TextContext';
import { useLanguage } from '../../contexts/LanguageContext'; // تغییر به useLanguage
import ConfirmModal from '../ConfirmModal/ConfirmModal';

const DataManager = () => {
  const { texts, setTexts, clearAllTexts } = useText();
  const { t } = useLanguage(); // استفاده از useLanguage
  const [showConfirm, setShowConfirm] = useState(false);

  const exportData = () => {
    const dataStr = JSON.stringify(texts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `speech-texts-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTexts = JSON.parse(e.target.result);
          if (Array.isArray(importedTexts)) {
            setTexts(importedTexts);
            alert(t('dataManager.importSuccess'));
          } else {
            alert('فرمت فایل نامعتبر است');
          }
        } catch (error) {
          alert('خطا در خواندن فایل');
        }
      };
      reader.readAsText(file);
    }
  };

  const backupToLocal = () => {
    localStorage.setItem('speechTexts_backup', JSON.stringify(texts));
    alert(t('dataManager.backupSuccess'));
  };

  const restoreFromBackup = () => {
    const backup = localStorage.getItem('speechTexts_backup');
    if (backup) {
      setTexts(JSON.parse(backup));
      alert(t('dataManager.restoreSuccess'));
    } else {
      alert('پشتیبان‌گیری یافت نشد');
    }
  };

  const handleClearAll = () => {
    setShowConfirm(true);
  };

  const confirmClearAll = () => {
    clearAllTexts();
    setShowConfirm(false);
  };

  const cancelClearAll = () => {
    setShowConfirm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {t('dataManager.title')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={exportData}
          className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
        >
          📤 {t('dataManager.exportJSON')}
        </button>
        
        <label className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 cursor-pointer">
          📥 {t('dataManager.importJSON')}
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
        </label>
        
        <button
          onClick={backupToLocal}
          className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
        >
          💾 {t('dataManager.backup')}
        </button>
        
        <button
          onClick={restoreFromBackup}
          className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
        >
          🔄 {t('dataManager.restore')}
        </button>
      </div>

      {/* استفاده از ConfirmModal */}
      <ConfirmModal
        isOpen={showConfirm}
        onConfirm={confirmClearAll}
        onCancel={cancelClearAll}
        title={t('dataManager.confirmTitle')}
        message={t('dataManager.confirmMessage')}
        confirmText={t('dataManager.confirm')}
        cancelText={t('dataManager.cancel')}
        confirmColor="red"
      />

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleClearAll}
          className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
        >
          🗑️ {t('dataManager.clearAll')}
        </button>
      </div>
    </div>
  );
};

export default DataManager;