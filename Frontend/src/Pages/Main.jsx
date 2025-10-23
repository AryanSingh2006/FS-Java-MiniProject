import React, { useState, useEffect } from 'react';
import { Search, FolderPlus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PaperCard from '../Components/PaperCard';
import RepoCard from "../Components/RepoCard";
import RecentActivity from '../Components/RecentActivity';
import UploadPaperButton from '../Components/UploadPaperButton';
import CreateRepoModal from '../Components/CreateRepoModal';
import DeleteRepoModal from '../Components/DeleteRepoModal';
import LogoutConfirmModal from '../Components/LogoutConfirmModal';

// ===================== MAIN APP COMPONENT ===================== //
const ResearchCollabApp = () => {
  const navigate = useNavigate();
  const { repoId } = useParams();

  // ===================== STATE ===================== //
  const [activeTab, setActiveTab] = useState('global'); // 'global' or 'my'
  const [searchQuery, setSearchQuery] = useState(''); // Search input for repos
  const [repos, setRepos] = useState([]); // List of repositories
  const [loading, setLoading] = useState(false); // Loading state for repos
  const [error, setError] = useState(''); // Error state for repos
  const [selectedRepo, setSelectedRepo] = useState(null); // Currently selected repo (for detail view)
  const [papers, setPapers] = useState([]); // Papers for selected repo
  const [papersLoading, setPapersLoading] = useState(false); // Loading state for papers
  const [papersError, setPapersError] = useState(''); // Error state for papers
  const [currentUser, setCurrentUser] = useState(null); // Current logged-in user
  const [showCreateRepoModal, setShowCreateRepoModal] = useState(false); // Show create repo modal
  const [showDeleteRepoModal, setShowDeleteRepoModal] = useState(false); // Show delete repo modal
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Show logout confirmation modal

  // ===================== LOGOUT HANDLER ===================== //
  // Shows the logout confirmation modal
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // ===================== LOGOUT CONFIRM ===================== //
  // Logs out the user and redirects to home
  const handleLogoutConfirm = () => {
    fetch('http://localhost:8080/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .finally(() => {
        navigate('/');
      });
  };

  // ===================== FETCH CURRENT USER ===================== //
  // Fetches the current user info on component mount
  useEffect(() => {
    fetch('http://localhost:8080/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(setCurrentUser)
      .catch((err) => {
        console.error('Failed to fetch current user:', err);
        // If not authenticated, redirect to login
        navigate('/');
      });
  }, [navigate]);

  // ===================== FETCH REPOS ===================== //
  // Fetches repos when the active tab changes
  useEffect(() => {
    setSelectedRepo(null); // Reset selected repo when switching tabs
    setLoading(true);
    setError('');
    const url = activeTab === 'global'
      ? 'http://localhost:8080/repos/global'
      : 'http://localhost:8080/repos/my';
    fetch(url, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text() || 'Failed to fetch');
        return res.json();
      })
      .then(setRepos)
      .catch((err) => setError(err.message || 'Error'))
      .finally(() => setLoading(false));
  }, [activeTab]);

  // ===================== FETCH PAPERS FOR SELECTED REPO ===================== //
  // If repoId is present in URL, fetch that repo and its papers
  useEffect(() => {
    if (!repoId || repos.length === 0) {
      setSelectedRepo(null);
      return;
    }
    // Find the repo in the loaded list
    const repo = repos.find(r => (r.id || r._id) === repoId);
    if (!repo) {
      setSelectedRepo(null);
      return;
    }
    setSelectedRepo(repo);
    setPapers([]);
    setPapersLoading(true);
    setPapersError('');
    fetch(`http://localhost:8080/papers/by-repo/${repoId}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text() || 'Failed to fetch papers');
        return res.json();
      })
      .then(setPapers)
      .catch((err) => setPapersError(err.message || 'Error'))
      .finally(() => setPapersLoading(false));
  }, [repoId, repos]);

  // ===================== REPO CLICK HANDLER ===================== //
  // Navigates to the detail view for the selected repo
  const handleRepoClick = (repo) => {
    navigate(`/main/repos/${repo.id || repo._id}`);
  };

  // ===================== REFRESH PAPERS AFTER UPLOAD ===================== //
  // Re-fetches papers for the current repo after a successful upload
  const handleUploadSuccess = () => {
    if (!repoId) return;
    setPapersLoading(true);
    setPapersError('');
    fetch(`http://localhost:8080/papers/by-repo/${repoId}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text() || 'Failed to fetch papers');
        return res.json();
      })
      .then(setPapers)
      .catch((err) => setPapersError(err.message || 'Error'))
      .finally(() => setPapersLoading(false));
  };

  // ===================== HANDLE REPO CREATED ===================== //
  // Callback after successful repo creation
  const handleRepoCreated = (newRepo) => {
    // Switch to "My" tab and refresh repos
    setActiveTab('my');
    navigate('/main/my');

    // Refresh the repos list
    setLoading(true);
    fetch('http://localhost:8080/repos/my', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text() || 'Failed to fetch');
        return res.json();
      })
      .then(setRepos)
      .catch((err) => setError(err.message || 'Error'))
      .finally(() => setLoading(false));
  };

  // ===================== HANDLE REPO DELETE CONFIRM ===================== //
  // Deletes the currently selected repo
  const handleRepoDeleteConfirm = async () => {
    if (!selectedRepo) return;

    const response = await fetch(`http://localhost:8080/repos/${selectedRepo.id || selectedRepo._id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to delete repository');
    }

    // Navigate back to My repos tab
    navigate('/main/my');

    // Refresh the repos list
    setLoading(true);
    fetch('http://localhost:8080/repos/my', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text() || 'Failed to fetch');
        return res.json();
      })
      .then(setRepos)
      .catch((err) => setError(err.message || 'Error'))
      .finally(() => setLoading(false));
  };
  // ===================== RENDER ===================== //
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===================== HEADER ===================== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 rounded-b-[50px] shadow-3xl">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-8">
            <nav className="flex gap-6">
              <button
                onClick={() => {
                  setActiveTab('global');
                  navigate('/main');
                }}
                className={`text-xl font-medium pb-1 border-b-2 ${activeTab === 'global' ? 'text-gray-900 border-black' : 'text-gray-500 border-transparent hover:text-gray-900'}`}
              >
                Global
              </button>
              <button
                onClick={() => {
                  setActiveTab('my');
                  navigate('/main/my');
                }}
                className={`text-xl font-medium pb-1 border-b-2 ${activeTab === 'my' ? 'text-gray-900 border-black' : 'text-gray-500 border-transparent hover:text-gray-900'}`}
              >
                My Research Papers
              </button>
            </nav>
          </div>
          {/* Search and Logout */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search repos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 w-72 border border-gray-300 rounded-3xl focus:ring-2 text-base"
              />
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title and Description - only show if not in detail view */}
        {!repoId && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {activeTab === 'global' ? 'Global' : 'My Research Papers'}
              </h1>
              <p className="text-gray-600">
                {activeTab === 'global'
                  ? 'Browse all public research repositories.'
                  : 'These are your own research repositories.'}
              </p>
            </div>
            {/* Create New Repo Button - only show in "My" tab */}
            {activeTab === 'my' && (
              <button
                onClick={() => setShowCreateRepoModal(true)}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors flex items-center gap-2 shadow-lg"
              >
                <FolderPlus className="w-5 h-5" />
                New
              </button>
            )}
          </div>
        )}

        {/* Repo Detail View */}
        {repoId && selectedRepo ? (
          <div>
            <button
              onClick={() => navigate('/main')}
              className="mb-4 px-4 py-2 bg-gray-200 rounded-full text-sm"
            >
              ← Back to Repos
            </button>
            {/* Repo Info - full width */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition mb-8 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 w-full break-words">{selectedRepo.name}</h2>
                <p className="text-gray-600 mt-1 w-full break-words">{selectedRepo.description}</p>
              </div>
              {/* Only show action buttons if user is the owner */}
              {currentUser && selectedRepo && currentUser.email === selectedRepo.ownerEmail && (
                <div className="ml-4 flex items-center gap-2">
                  <UploadPaperButton repoId={repoId} onUploadSuccess={handleUploadSuccess} />
                  <button
                    onClick={() => setShowDeleteRepoModal(true)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                    title="Delete repository"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
            {/* Papers and Recent Activity side by side */}
            <div className="grid grid-cols-10 gap-8">
              {/* Papers (70%) */}
              <div className="col-span-7">
                {papersLoading ? (
                  <div className="text-gray-500">Loading papers...</div>
                ) : papersError ? (
                  <div className="text-red-500">{papersError}</div>
                ) : papers.length === 0 ? (
                  <div className="text-gray-500">No papers found for this repo.</div>
                ) : (
                  <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <h3 className="text-base font-semibold mb-3">Paper Sections</h3>
                    <div className="space-y-2">
                      {papers.map(paper => (
                        <PaperCard
                          key={paper.paperId}
                          paper={paper}
                          isOwner={currentUser && selectedRepo && currentUser.email === selectedRepo.ownerEmail}
                          onPaperUpdate={handleUploadSuccess}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Recent Activity (30%) */}
              <div className="col-span-3">
                <RecentActivity repoId={repoId} currentUserEmail={currentUser?.email} />
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          // Repo List View
          <div className="grid grid-cols-1 gap-4">
            {repos.length === 0 ? (
              <div className="text-gray-500">No repositories found.</div>
            ) : (
              repos
                .filter(repo =>
                  repo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(repo => (
                  <RepoCard
                    key={repo.id || repo._id}
                    repo={repo}
                    onClick={handleRepoClick}
                  />
                ))
            )}
          </div>
        )}
      </main>

      {/* Create Repo Modal */}
      {showCreateRepoModal && (
        <CreateRepoModal
          onClose={() => setShowCreateRepoModal(false)}
          onRepoCreated={handleRepoCreated}
        />
      )}

      {/* Delete Repo Modal */}
      {showDeleteRepoModal && selectedRepo && (
        <DeleteRepoModal
          repo={selectedRepo}
          onClose={() => setShowDeleteRepoModal(false)}
          onConfirm={handleRepoDeleteConfirm}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <LogoutConfirmModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}
    </div>
  );
};
export default ResearchCollabApp;
