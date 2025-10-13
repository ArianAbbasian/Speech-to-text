// src/components/ConfirmModal/ConfirmModal.jsx
import React from 'react';

const ConfirmModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = "تایید عمل", 
  message = "آیا از انجام این عمل مطمئن هستید؟",
  confirmText = "تایید",
  cancelText = "انصراف",
  confirmColor = "red"
}) => {
  if (!isOpen) return null;

  const confirmButtonClass = {
    red: "bg-red-500 hover:bg-red-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600"
  }[confirmColor] || "bg-red-500 hover:bg-red-600";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {title}
        </h3>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-all ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;