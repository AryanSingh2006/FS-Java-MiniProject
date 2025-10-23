import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

// ===================== DELETE REPO CONFIRMATION MODAL ===================== //
const DeleteRepoModal = ({ repo, onClose, onConfirm }) => {
  const [repoNameInput, setRepoNameInput] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    // Check if entered name matches
    if (repoNameInput.trim() !== repo.name.trim()) {
      setError('Repository name does not match. Please type the exact name to confirm.');
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete repository');
      setDeleting(false);
    }
  };

  // Handle ESC key to close
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !deleting) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, deleting]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={!deleting ? onClose : undefined}
    >
      {/* Modal Content */}
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Delete Repository</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={deleting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Warning Message */}
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">
              ⚠️ This action cannot be undone!
            </p>
            <p className="text-red-600 text-sm mt-1">
              This will permanently delete the repository and all its papers.
            </p>
          </div>

          {/* Repo Name Display */}
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              Do you want to delete <span className="font-bold text-gray-900">"{repo.name}"</span>?
            </p>
            <p className="text-sm text-gray-600">
              Please type the repository name to confirm:
            </p>
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={repoNameInput}
            onChange={(e) => {
              setRepoNameInput(e.target.value);
              setError('');
            }}
            placeholder={repo.name}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
            disabled={deleting}
            autoFocus
          />

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={deleting || !repoNameInput.trim()}
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                'Delete Repository'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRepoModal;
