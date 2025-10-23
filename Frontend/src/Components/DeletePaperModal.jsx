import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';

// ===================== DELETE PAPER CONFIRMATION MODAL ===================== //
const DeletePaperModal = ({ paper, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, isDeleting]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete paper');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-500" />
            Delete Paper
          </h2>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Warning Message */}
        <div className="mb-6">
          <p className="text-gray-700 text-lg mb-3">
            Are you sure you want to delete this paper?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
            <p className="text-red-800 font-semibold text-sm">⚠️ This action cannot be undone!</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-gray-800 font-medium text-sm">Paper: {paper.title || paper.fileName}</p>
            <p className="text-gray-600 text-xs mt-1">All versions will be permanently deleted.</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePaperModal;
