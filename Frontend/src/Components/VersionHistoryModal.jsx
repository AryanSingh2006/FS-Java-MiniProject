import React, { useState, useEffect } from 'react';
import { X, Download, Eye, FileText } from 'lucide-react';
import PreviewModal from './PreviewModal';

// ===================== VERSION HISTORY MODAL COMPONENT ===================== //
const VersionHistoryModal = ({ paper, onClose }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewVersion, setPreviewVersion] = useState(null);

  // Fetch version history
  useEffect(() => {
    if (!paper?.paperId) return;

    setLoading(true);
    setError('');

    fetch(`http://localhost:8080/papers/${paper.paperId}/versions`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch versions');
        return res.json();
      })
      .then((data) => {
        // Sort versions by version number descending (newest first)
        const sortedVersions = [...(data.versions || [])].sort((a, b) => b.versionNumber - a.versionNumber);
        setVersions(sortedVersions);
      })
      .catch((err) => {
        setError(err.message || 'Error loading versions');
      })
      .finally(() => setLoading(false));
  }, [paper?.paperId]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle preview action
  const handlePreview = (version) => {
    // Create a paper-like object for the PreviewModal
    const versionPaper = {
      ...paper,
      paperId: paper.paperId,
      url: version.url,
      fileName: version.fileName,
      fileType: version.fileType || paper.fileType,
      title: `${paper.title} - Version ${version.versionNumber}`,
      versionNumber: version.versionNumber // Pass the version number for proper download
    };
    console.log('Opening preview for version:', version.versionNumber);
    console.log('Version URL:', version.url);
    setPreviewVersion(versionPaper);
  };

  // Handle download action
  const handleDownload = (version) => {
    // Use the proper download endpoint with version number to get file in correct format
    const downloadUrl = `http://localhost:8080/papers/${paper.paperId}/download/${version.versionNumber}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = version.fileName || `${paper.title}_v${version.versionNumber}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      {/* Modal Content */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Version History</h2>
            <p className="text-sm text-gray-600 mt-1">{paper.title || paper.fileName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No versions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version, index) => (
                <div
                  key={version.versionNumber}
                  className={`border rounded-2xl p-4 transition-all ${version.versionNumber === paper.currentVersion
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Version Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            Version {version.versionNumber}
                          </h3>
                          {version.versionNumber === paper.currentVersion && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{version.fileName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded: {formatDate(version.uploadedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handlePreview(version)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors flex items-center gap-1"
                        title="Preview file"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleDownload(version)}
                        className="px-3 py-2 bg-black hover:bg-gray-800 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-1"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Preview Modal for Version */}
      {previewVersion && (
        <PreviewModal
          paper={previewVersion}
          versionNumber={previewVersion.versionNumber}
          onClose={() => setPreviewVersion(null)}
        />
      )}
    </div>
  );
};

export default VersionHistoryModal;
