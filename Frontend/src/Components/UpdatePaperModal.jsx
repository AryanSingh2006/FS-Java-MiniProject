import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

// ===================== UPDATE PAPER MODAL COMPONENT ===================== //
const UpdatePaperModal = ({ paper, onClose, onUpdateSuccess }) => {
  // ===================== STATE ===================== //
  const [file, setFile] = useState(null); // Selected file for update
  const [uploading, setUploading] = useState(false); // Upload loading state
  const [error, setError] = useState(''); // Error message

  // ===================== HANDLE FILE SELECTION ===================== //
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  // ===================== HANDLE FORM SUBMIT ===================== //
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/papers/${paper.paperId}/update`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update paper');
      }

      // Success - reset form and close modal
      setFile(null);
      onClose();

      // Notify parent component to refresh papers list
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      setError(err.message || 'Error updating paper');
    } finally {
      setUploading(false);
    }
  };

  // ===================== HANDLE MODAL CLOSE ===================== //
  const handleClose = () => {
    if (!uploading) {
      onClose();
    }
  };

  // ===================== RENDER ===================== //
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleClose}>
      {/* Modal Content */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Update Paper</h2>
            <p className="text-sm text-gray-600 mt-1">{paper.title || paper.fileName}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* File Input */}
          <div>
            <label htmlFor="update-file" className="block text-sm font-medium text-gray-700 mb-2">
              Select New Version *
            </label>
            <div className="relative">
              <input
                type="file"
                id="update-file"
                onChange={handleFileChange}
                disabled={uploading}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all"
              />
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          {/* Current Version Info */}
          <div className="p-3 bg-gray-50 rounded-2xl">
            <p className="text-xs text-gray-500 mb-1">Current Version</p>
            <p className="text-sm font-medium text-gray-700">{paper.currentVersion || 'v1.0'}</p>
            <p className="text-xs text-gray-500 mt-1">
              Uploaded: {paper.uploadedAt ? new Date(paper.uploadedAt).toLocaleString() : 'N/A'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-4 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Update Paper
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePaperModal;
