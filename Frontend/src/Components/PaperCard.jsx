import React, { useState, useEffect, useRef } from 'react';
import { FileText, Edit3, MoreVertical, Upload, History, Trash2, Download, Eye } from 'lucide-react';
import UpdatePaperModal from './UpdatePaperModal';
import VersionHistoryModal from './VersionHistoryModal';
import PreviewModal from './PreviewModal';
import DeletePaperModal from './DeletePaperModal';

const PaperCard = ({ paper, onClick, onPaperUpdate, isOwner = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        setIsHovered(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Function to calculate time ago
  const getTimeAgo = (date) => {
    if (!date) return 'N/A';

    const now = new Date();
    const uploadDate = new Date(date);
    const diffInSeconds = Math.floor((now - uploadDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const handleMenuClick = (e, action) => {
    e.stopPropagation();
    setShowMenu(false);
    setIsHovered(false);

    if (action === 'update') {
      setShowUpdateModal(true);
    } else if (action === 'preview') {
      setShowPreviewModal(true);
    } else if (action === 'view-previous') {
      setShowVersionModal(true);
    } else if (action === 'download') {
      handleDownload();
    } else if (action === 'delete') {
      setShowDeleteModal(true);
    }
  };

  const handleDownload = () => {
    // Download current version using the download endpoint
    const downloadUrl = `http://localhost:8080/papers/${paper.paperId}/download`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = paper.fileName || paper.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateSuccess = () => {
    // Notify parent component to refresh papers list
    if (onPaperUpdate) {
      onPaperUpdate();
    }
  };

  const handleDeleteConfirm = async () => {
    const response = await fetch(`http://localhost:8080/papers/${paper.paperId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to delete paper');
    }

    // Notify parent component to refresh papers list
    if (onPaperUpdate) {
      onPaperUpdate();
    }
  };

  const handleThreeDotsClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div
      className="relative flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all group"
      onClick={() => onClick && onClick(paper)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !showMenu && setIsHovered(false)}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="font-medium text-gray-900 truncate">{paper.title || paper.fileName}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 relative">
        <Edit3 className={`w-4 h-4 text-gray-400 transition-opacity ${isHovered || showMenu ? 'opacity-0' : 'opacity-100'}`} />
        <span className={`text-sm text-gray-500 transition-transform ${isHovered || showMenu ? '-translate-x-6' : ''}`}>
          Last edited {getTimeAgo(paper.uploadedAt || paper.updatedAt || paper.createdAt)}
        </span>

        {/* Three dots menu button - only visible on hover */}
        <button
          className={`p-1 hover:bg-gray-200 rounded transition-opacity absolute right-0 ${isHovered || showMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={handleThreeDotsClick}
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-2 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          {/* Show Update and Delete only for owners */}
          {isOwner && (
            <>
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors"
                onClick={(e) => handleMenuClick(e, 'update')}
              >
                <Upload className="w-4 h-4" />
                Update
              </button>
            </>
          )}

          {/* Preview - available to everyone */}
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={(e) => handleMenuClick(e, 'preview')}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          {/* Download Current Version - available to everyone */}
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={(e) => handleMenuClick(e, 'download')}
          >
            <Download className="w-4 h-4" />
            Download
          </button>

          {/* View Previous Files - available to everyone */}
          <button
            className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${!isOwner ? 'rounded-b-lg' : ''}`}
            onClick={(e) => handleMenuClick(e, 'view-previous')}
          >
            <History className="w-4 h-4" />
            View Previous Files
          </button>

          {/* Delete - only for owners */}
          {isOwner && (
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
              onClick={(e) => handleMenuClick(e, 'delete')}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      )}

      {/* Update Paper Modal */}
      {showUpdateModal && (
        <UpdatePaperModal
          paper={paper}
          onClose={() => setShowUpdateModal(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Version History Modal */}
      {showVersionModal && (
        <VersionHistoryModal
          paper={paper}
          onClose={() => setShowVersionModal(false)}
        />
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <PreviewModal
          paper={paper}
          onClose={() => setShowPreviewModal(false)}
        />
      )}

      {/* Delete Paper Modal */}
      {showDeleteModal && (
        <DeletePaperModal
          paper={paper}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default PaperCard;
