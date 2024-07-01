import React from "react";

function ConfirmModal({ show, onClose, onConfirm, message, confirmText }) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-lg font-semibold">Confirm Action</h2>
        <p className="mt-4">{message}</p>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-4"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
