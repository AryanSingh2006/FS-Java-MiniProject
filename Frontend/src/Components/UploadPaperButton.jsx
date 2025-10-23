import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

// ===================== UPLOAD PAPER BUTTON & MODAL COMPONENT ===================== //
const UploadPaperButton = ({ repoId, onUploadSuccess }) => {
  // ===================== STATE ===================== //
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [title, setTitle] = useState(''); // Paper title input
  const [file, setFile] = useState(null); // Selected file
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
    if (!title.trim()) {
      setError('Please enter a paper title');
      return;
    }
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('repoId', repoId);
    formData.append('title', title.trim());
    formData.append('file', file);

    setUploading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/papers/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload paper');
      }

      // Success - reset form and close modal
      setTitle('');
      setFile(null);
      setShowModal(false);

      // Notify parent component to refresh papers list
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError(err.message || 'Error uploading paper');
    } finally {
      setUploading(false);
    }
  };

  // ===================== HANDLE MODAL CLOSE ===================== //
  const handleClose = () => {
    if (!uploading) {
      setShowModal(false);
      setTitle('');
      setFile(null);
      setError('');
    }
  };

  // ===================== RENDER ===================== //
  return (
    <>
      {/* Upload Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
      >
        <Upload className="w-4 h-4" />
        Upload Paper
      </button>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal Content */}
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Upload New Paper</h2>
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
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Paper Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter paper title"
                  disabled={uploading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
              </div>

              {/* File Input */}
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Select File *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="file"
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
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadPaperButton;
