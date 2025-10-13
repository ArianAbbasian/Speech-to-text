// src/components/DataManager/DataManager.jsx
import React, { useState } from "react";
import { useText } from "../../contexts/TextContext";
import { useLanguage } from "../../contexts/LanguageContext";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

const DataManager = () => {
  const { texts, setTexts, clearAllTexts, tags, setTags } = useText();
  const { t } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);
  const [importError, setImportError] = useState("");

  const exportData = () => {
    const data = {
      texts: texts,
      tags: tags,
      exportDate: new Date().toISOString(),
      version: "1.0",
      app: "SpeechToText",
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `speech-texts-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    event.target.value = "";

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        setImportError("");

        if (!importedData.texts || !Array.isArray(importedData.texts)) {
          throw new Error(t("dataManager.formatError"));
        }

        const validTexts = importedData.texts.filter(
          (text) =>
            text &&
            typeof text.content === "string" &&
            text.content.trim() !== "" &&
            text.id
        );

        if (validTexts.length === 0) {
          throw new Error(t("dataManager.noValidData"));
        }

        if (
          window.confirm(
            t("dataManager.importConfirm", { count: validTexts.length })
          )
        ) {
          setTexts(validTexts);

          if (importedData.tags && Array.isArray(importedData.tags)) {
            setTags(importedData.tags);
          }

          alert(t("dataManager.importSuccess", { count: validTexts.length }));
        }
      } catch (error) {
        console.error("Import error:", error);
        setImportError(error.message || t("dataManager.importError"));
        alert(error.message || t("dataManager.importError"));
      }
    };

    reader.onerror = () => {
      setImportError(t("dataManager.readError"));
      alert(t("dataManager.readError"));
    };

    reader.readAsText(file);
  };

  const backupToLocal = () => {
    try {
      const backupData = {
        texts: texts,
        tags: tags,
        backupDate: new Date().toISOString(),
        version: "1.0",
      };

      localStorage.setItem("speechTexts_backup", JSON.stringify(backupData));
      alert(t("dataManager.backupSuccess", { count: texts.length }));
    } catch (error) {
      console.error("Backup error:", error);
      alert(t("dataManager.backupError"));
    }
  };

  const restoreFromBackup = () => {
    try {
      const backup = localStorage.getItem("speechTexts_backup");
      if (!backup) {
        alert(t("dataManager.noBackupFound"));
        return;
      }

      const backupData = JSON.parse(backup);

      if (!backupData.texts || !Array.isArray(backupData.texts)) {
        throw new Error(t("dataManager.invalidBackup"));
      }

      const validTexts = backupData.texts.filter(
        (text) =>
          text && typeof text.content === "string" && text.content.trim() !== ""
      );

      if (validTexts.length === 0) {
        alert(t("dataManager.noValidBackup"));
        return;
      }

      if (
        window.confirm(
          t("dataManager.restoreConfirm", { count: validTexts.length })
        )
      ) {
        setTexts(validTexts);

        if (backupData.tags && Array.isArray(backupData.tags)) {
          setTags(backupData.tags);
        }

        alert(t("dataManager.restoreSuccess", { count: validTexts.length }));
      }
    } catch (error) {
      console.error("Restore error:", error);
      alert(t("dataManager.restoreError"));
    }
  };

  const handleClearAll = () => {
    if (texts.length === 0) {
      alert(t("dataManager.noDataToClear"));
      return;
    }
    setShowConfirm(true);
  };

  const confirmClearAll = () => {
    clearAllTexts();
    setShowConfirm(false);
    alert(t("dataManager.clearSuccess"));
  };

  const cancelClearAll = () => {
    setShowConfirm(false);
  };

  const getStatsInfo = () => {
    return {
      totalTexts: texts.length,
      totalWords: texts.reduce((sum, text) => sum + (text.wordCount || 0), 0),
      backupExists: !!localStorage.getItem("speechTexts_backup"),
    };
  };

  const stats = getStatsInfo();

  return (
    <div className="modern-card animate-fadeIn">
      <div className="text-center mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-1">
          {t("dataManager.title")}
        </h1>
        <p className="text-gray-600 text-lg">{t("dataManager.subtitle")}</p>
      </div>

      {/* اطلاعات وضعیت */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.totalTexts}</div>
          <div className="text-blue-100 font-medium">
            {t("dataManager.totalTexts")}
          </div>
          <div className="text-4xl mt-3">📄</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.totalWords}</div>
          <div className="text-green-100 font-medium">
            {t("dataManager.totalWords")}
          </div>
          <div className="text-4xl mt-3">📝</div>
        </div>

        <div
          className={`rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg ${
            stats.backupExists
              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
              : "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
          }`}
        >
          <div className="text-3xl font-bold mb-2">
            {stats.backupExists ? "✅" : "❌"}
          </div>
          <div
            className={
              stats.backupExists ? "text-emerald-100" : "text-gray-100"
            }
          >
            {t("dataManager.backupStatus")}
          </div>
          <div className="text-4xl mt-3">💾</div>
        </div>
      </div>

      {/* نمایش خطای ایمپورت */}
      {importError && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-xl">❌</span>
            <div>
              <div className="font-semibold">
                {t("dataManager.importErrorTitle")}
              </div>
              <div>{importError}</div>
            </div>
          </div>
        </div>
      )}

      {/* دکمه‌های اصلی */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Export */}
        <button
          onClick={exportData}
          disabled={texts.length === 0}
          className={`modern-card p-6 text-center transition-all duration-300 group ${
            texts.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-105 hover:shadow-xl cursor-pointer"
          }`}
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            📤
          </div>
          <div className="text-lg font-semibold text-gray-800 mb-2">
            {t("dataManager.exportJSON")}
          </div>
          <div className="text-sm text-gray-600">
            {texts.length === 0
              ? t("dataManager.noDataToExport")
              : t("dataManager.exportDesc", { count: texts.length })}
          </div>
          {texts.length > 0 && (
            <div className="mt-3 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full inline-block">
              {texts.length} {t("dataManager.items")}
            </div>
          )}
        </button>

        {/* Import */}
        <label
          className={`modern-card p-6 text-center transition-all duration-300 group cursor-pointer ${
            texts.length > 0 ? "hover:scale-105 hover:shadow-xl" : ""
          }`}
        >
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            📥
          </div>
          <div className="text-lg font-semibold text-gray-800 mb-2">
            {t("dataManager.importJSON")}
          </div>
          <div className="text-sm text-gray-600">
            {t("dataManager.importDesc")}
          </div>
          <div className="mt-3 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full inline-block">
            JSON
          </div>
        </label>

        {/* Backup */}
        <button
          onClick={backupToLocal}
          disabled={texts.length === 0}
          className={`modern-card p-6 text-center transition-all duration-300 group ${
            texts.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-105 hover:shadow-xl cursor-pointer"
          }`}
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            💾
          </div>
          <div className="text-lg font-semibold text-gray-800 mb-2">
            {t("dataManager.backup")}
          </div>
          <div className="text-sm text-gray-600">
            {texts.length === 0
              ? t("dataManager.noDataToBackup")
              : t("dataManager.backupDesc")}
          </div>
          {texts.length > 0 && (
            <div className="mt-3 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full inline-block">
              {t("dataManager.localStorage")}
            </div>
          )}
        </button>

        {/* Restore */}
        <button
          onClick={restoreFromBackup}
          disabled={!stats.backupExists}
          className={`modern-card p-6 text-center transition-all duration-300 group ${
            !stats.backupExists
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-105 hover:shadow-xl cursor-pointer"
          }`}
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            🔄
          </div>
          <div className="text-lg font-semibold text-gray-800 mb-2">
            {t("dataManager.restore")}
          </div>
          <div className="text-sm text-gray-600">
            {!stats.backupExists
              ? t("dataManager.noBackupAvailable")
              : t("dataManager.restoreDesc")}
          </div>
          {stats.backupExists && (
            <div className="mt-3 text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full inline-block">
              {t("dataManager.fromBackup")}
            </div>
          )}
        </button>
      </div>

      {/* Clear All Data */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-dashed border-red-200">
        <div className="text-center mb-4">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            {t("dataManager.dangerZone")}
          </h3>
          <p className="text-red-600 text-sm">
            {t("dataManager.dangerZoneDesc")}
          </p>
        </div>

        <button
          onClick={handleClearAll}
          disabled={texts.length === 0}
          className={`w-full py-4 rounded-xl transition-all font-semibold text-lg ${
            texts.length === 0
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
          }`}
        >
          🗑️ {t("dataManager.clearAll")}
          {texts.length > 0 && (
            <span className="ml-2 bg-red-800 text-red-100 px-3 py-1 rounded-full text-sm">
              {texts.length} {t("dataManager.items")}
            </span>
          )}
        </button>
      </div>

      {/* راهنمای مدیریت داده */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2 text-lg">
          💡 {t("dataManager.tipsTitle")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>{t("dataManager.tip1")}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>{t("dataManager.tip2")}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>{t("dataManager.tip3")}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>{t("dataManager.tip4")}</span>
          </div>
        </div>
      </div>

      {/* استفاده از ConfirmModal */}
      <ConfirmModal
        isOpen={showConfirm}
        onConfirm={confirmClearAll}
        onCancel={cancelClearAll}
        title={t("dataManager.confirmTitle")}
        message={t("dataManager.confirmMessage", { count: texts.length })}
        confirmText={t("dataManager.confirm")}
        cancelText={t("dataManager.cancel")}
        confirmColor="red"
      />
    </div>
  );
};

export default DataManager;
