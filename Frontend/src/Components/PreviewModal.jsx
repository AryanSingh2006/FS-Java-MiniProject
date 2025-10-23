import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

// ===================== PREVIEW MODAL COMPONENT ===================== //
const PreviewModal = ({ paper, onClose, versionNumber = null }) => {
  const fileName = paper.fileName || paper.title;
  const fileType = paper.fileType || '';

  // Determine if file is PDF
  const isPDF = fileType.toLowerCase().includes('pdf') || fileName.toLowerCase().endsWith('.pdf');

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Helper function to convert Cloudinary URL to inline mode
  const getInlineCloudinaryUrl = (url) => {
    if (!url) return null;

    // Check if it's a Cloudinary URL
    if (!url.includes('cloudinary.com')) return url;

    // Add fl_attachment:false flag for inline display
    // Pattern: https://res.cloudinary.com/{cloud}/raw/upload/v{version}/{path}
    // Result: https://res.cloudinary.com/{cloud}/raw/upload/fl_attachment:false/v{version}/{path}

    if (url.includes('/upload/')) {
      // Insert fl_attachment:false after /upload/
      return url.replace('/upload/', '/upload/fl_attachment:false/');
    }

    return url;
  };

  // Get preview URL - use backend endpoint for PDFs, Cloudinary with inline flag for DOC/DOCX
  const getPreviewUrl = () => {
    if (isPDF) {
      // For PDFs, use backend endpoint directly (browsers can render PDFs natively)
      const backendUrl = versionNumber
        ? `http://localhost:8080/papers/${paper.paperId}/download/${versionNumber}?inline=true`
        : `http://localhost:8080/papers/${paper.paperId}/download?inline=true`;
      return backendUrl;
    } else {
      // For DOC/DOCX, use Cloudinary URL with inline flag
      if (paper.url) {
        const inlineUrl = getInlineCloudinaryUrl(paper.url);
        if (inlineUrl) {
          return `https://docs.google.com/viewer?url=${encodeURIComponent(inlineUrl)}&embedded=true`;
        }
      }
      return null;
    }
  };

  // Handle download
  const handleDownload = () => {
    // If versionNumber is provided (from version history), download that specific version
    // Otherwise download the current version
    const downloadUrl = versionNumber
      ? `http://localhost:8080/papers/${paper.paperId}/download/${versionNumber}`
      : `http://localhost:8080/papers/${paper.paperId}/download`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open in new tab
  const handleOpenInNewTab = () => {
    if (isPDF) {
      // For PDFs, use backend endpoint with inline mode
      const backendUrl = versionNumber
        ? `http://localhost:8080/papers/${paper.paperId}/download/${versionNumber}?inline=true`
        : `http://localhost:8080/papers/${paper.paperId}/download?inline=true`;
      window.open(backendUrl, '_blank');
    } else {
      // For DOC/DOCX, use Google Docs Viewer (same as preview)
      if (paper.url) {
        const inlineUrl = getInlineCloudinaryUrl(paper.url);
        if (inlineUrl) {
          const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(inlineUrl)}`;
          window.open(viewerUrl, '_blank');
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-[90vw] h-[90vh] max-w-6xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">{fileName}</h2>
            <p className="text-xs text-gray-500">Preview Mode</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleDownload}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              title="Download file"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleOpenInNewTab}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              Open
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Close preview"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          {getPreviewUrl() ? (
            // Can preview - show iframe
            <iframe
              src={getPreviewUrl()}
              className="w-full h-full border-0"
              title={isPDF ? "PDF Preview" : "Document Preview"}
            />
          ) : (
            // Cannot preview (DOC/DOCX old version)
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <ExternalLink className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Preview Not Available</h3>
              <p className="text-gray-600 text-center max-w-md">
                Preview is only available for PDF files and current version of documents.
                Please download this version to view it.
              </p>
              <button
                onClick={handleDownload}
                className="mt-4 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download to View
              </button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            {getPreviewUrl() && !isPDF && "Powered by Google Docs Viewer • "}
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">ESC</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
