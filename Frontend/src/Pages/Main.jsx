import React, { useState } from 'react';
import { 
  FileText, Users, Plus, Search, Settings, GitBranch, Clock, Lock, Edit3, Eye, 
  Trash2, UserPlus, X 
} from 'lucide-react';

// ===================== MAIN APP COMPONENT ===================== //
const ResearchCollabApp = () => {

  // ---------- State Management ---------- //
  const [activeTab, setActiveTab] = useState('papers'); // Tracks whether user is on 'My Papers' or 'Shared With Me'
  const [selectedPaper, setSelectedPaper] = useState(null); // Stores the paper currently opened in detail view
  const [showNewPaperModal, setShowNewPaperModal] = useState(false); // Toggles the "Create New Paper" modal
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false); // Toggles the "Collaborator Management" modal
  const [searchQuery, setSearchQuery] = useState(''); // For handling the paper search input

  // ---------- Dummy Data (Papers, Collaborators, Activity) ---------- //
  const papers = [
    {
      id: 1,
      title: 'Machine Learning Approaches in Climate Prediction',
      description: 'A comprehensive study on ML models for climate forecasting',
      author: 'Dr. Sarah Johnson',
      collaborators: 5,
      lastUpdated: '2 hours ago',
      status: 'In Progress',
      access: 'owner'
    },
    {
      id: 2,
      title: 'Quantum Computing Applications in Cryptography',
      description: 'Exploring post-quantum cryptographic algorithms',
      author: 'Prof. Michael Chen',
      collaborators: 3,
      lastUpdated: '1 day ago',
      status: 'Review',
      access: 'read-write'
    },
    {
      id: 3,
      title: 'Neural Networks for Medical Diagnosis',
      description: 'Deep learning models for early disease detection',
      author: 'Dr. Emily Rodriguez',
      collaborators: 7,
      lastUpdated: '3 days ago',
      status: 'Published',
      access: 'read-only'
    }
  ];

  const collaborators = [
    { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah.j@university.edu', role: 'Owner', access: 'Admin' },
    { id: 2, name: 'Alex Martinez', email: 'alex.m@university.edu', role: 'Collaborator', access: 'Read & Write' },
    { id: 3, name: 'Dr. James Wilson', email: 'james.w@university.edu', role: 'Collaborator', access: 'Read & Write' },
    { id: 4, name: 'Lisa Chen', email: 'lisa.c@university.edu', role: 'Reviewer', access: 'Read Only' },
    { id: 5, name: 'Prof. Robert Brown', email: 'robert.b@university.edu', role: 'Advisor', access: 'Read Only' }
  ];

  const recentActivity = [
    { user: 'Alex Martinez', action: 'edited', section: 'Introduction', time: '2 hours ago' },
    { user: 'Dr. James Wilson', action: 'commented on', section: 'Methodology', time: '5 hours ago' },
    { user: 'Lisa Chen', action: 'reviewed', section: 'Results', time: '1 day ago' },
    { user: 'You', action: 'updated', section: 'Abstract', time: '2 days ago' }
  ];

  // ===================== COMPONENTS ===================== //

  // ---------- 1. Individual Paper Card ---------- //
  const PaperCard = ({ paper }) => (
    <div 
      className="bg-white border border-gray-200 rounded-3xl p-5  cursor-pointer"
      onClick={() => setSelectedPaper(paper)} // Opens detailed view on click
    >
      {/* Paper Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <FileText className="w-5 h-5 text-blue-600 mt-1" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xl text-gray-900 mb-1 truncate">{paper.title}</h3>
            <p className="text-base text-gray-600 line-clamp-2">{paper.description}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
          paper.status === 'Published' ? 'bg-green-100 text-green-700' :
          paper.status === 'Review' ? 'bg-yellow-100 text-yellow-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {paper.status}
        </span>
      </div>

      {/* Collaborators and Last Updated */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" /> {paper.collaborators} collaborators
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> {paper.lastUpdated}
        </span>
      </div>

      {/* Author & Access Type */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-sm text-gray-600">by {paper.author}</span>
        <div className="flex items-center gap-1">
          {paper.access === 'owner' && <Lock className="w-4 h-4 text-gray-400" />}
          {paper.access === 'read-write' && <Edit3 className="w-4 h-4 text-green-500" />}
          {paper.access === 'read-only' && <Eye className="w-4 h-4 text-blue-500" />}
          <span className="text-xs text-gray-500 capitalize">{paper.access.replace('-', ' ')}</span>
        </div>
      </div>
    </div>
  );

  // ---------- 2. New Paper Modal ---------- //
  const NewPaperModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-900">Create New Research Paper</h2>
          <button onClick={() => setShowNewPaperModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paper Title</label>
            <input type="text" placeholder="Enter research paper title" className="w-full px-3 py-2 border border-black rounded-3xl focus:ring-2 focus:ring-black" />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows="3" placeholder="Brief description of your research" className="w-full px-3 py-2 border border-black rounded-3xl focus:ring-2 focus:ring-black resize-none" />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Research Category</label>
            <select className="w-full px-3 py-2 border border-black rounded-3xl focus:ring-2 focus:ring-black">
              <option>Computer Science</option>
              <option>Physics</option>
              <option>Biology</option>
              <option>Mathematics</option>
              <option>Chemistry</option>
            </select>
          </div>

          {/* Visibility Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="visibility" defaultChecked className="w-4 h-4 text-black" />
                <span>Private - Only invited collaborators</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="visibility" className="w-4 h-4 text-black" />
                <span>Public - Anyone can view</span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowNewPaperModal(false)} className="flex-1 border border-gray-300 text-gray-700 rounded-3xl hover:bg-gray-50 py-2">Cancel</button>
          <button className="flex-1 bg-black text-white rounded-3xl hover:bg-blue-700 py-2">Create Paper</button>
        </div>
      </div>
    </div>
  );

  // ---------- 3. Collaborator Management Modal ---------- //
  const CollaboratorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-900">Manage Collaborators</h2>
          <button onClick={() => setShowCollaboratorModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        {/* Add Collaborator Section */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Add Collaborator</label>
          <div className="flex gap-2">
            <input type="email" placeholder="Enter email address" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Read & Write</option>
              <option>Read Only</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Invite</button>
          </div>
        </div>

        {/* Existing Collaborators List */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Current Collaborators ({collaborators.length})</h3>
          <div className="space-y-2">
            {collaborators.map(collab => (
              <div key={collab.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {/* Avatar Circle */}
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {collab.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{collab.name}</div>
                    <div className="text-sm text-gray-500">{collab.email}</div>
                  </div>
                </div>

                {/* Role & Access Control */}
                <div className="flex items-center gap-3">
                  {collab.role !== 'Owner' ? (
                    <>
                      <select defaultValue={collab.access} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg">
                        <option>Read & Write</option>
                        <option>Read Only</option>
                      </select>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg font-medium">Owner</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Done Button */}
        <div className="flex justify-end mt-6">
          <button onClick={() => setShowCollaboratorModal(false)} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Done</button>
        </div>
      </div>
    </div>
  );

  // ---------- 4. Detailed Paper View ---------- //
  const PaperDetailView = () => (
    <div className="space-y-6">
      {/* Back Button */}
      <button onClick={() => setSelectedPaper(null)} className="text-black  font-medium mb-4">
        ← Back to Papers
      </button>

      {/* Paper Header Info */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedPaper.title}</h1>
            <p className="text-gray-600 mb-4">{selectedPaper.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Created by {selectedPaper.author}</span>
              <span>•</span>
              <span>Last updated {selectedPaper.lastUpdated}</span>
            </div>
          </div>

          {/* Collaborator & Edit Buttons */}
          <div className="flex gap-2">
            <button onClick={() => setShowCollaboratorModal(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50">
              <UserPlus className="w-4 h-4" /> Collaborators
            </button>
            {selectedPaper.access !== 'read-only' && (
              <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full ">
                <Edit3 className="w-4 h-4" /> Edit Paper
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid: Sections + Sidebar */}
      <div className="grid grid-cols-3 gap-6">
        {/* Paper Sections */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Paper Sections</h2>
            <div className="space-y-3">
              {['Abstract', 'Introduction', 'Methodology', 'Results', 'Conclusion'].map((section, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-3xl hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{section}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Last edited 2h ago</span>
                    {selectedPaper.access !== 'read-only' && <Edit3 className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Activity + Collaborators */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="text-sm flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.section}</span>
                    </p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ===================== RENDER ===================== //
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------- Header ---------- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 rounded-b-[50px] shadow-3xl">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Navigation Tabs */}
            <nav className="flex gap-6">
              <button 
                onClick={() => { setActiveTab('papers'); setSelectedPaper(null); }}
                className={`text-xl font-medium pb-1 border-b-2 ${
                  activeTab === 'papers' ? 'text-gray-900 border-black' : 'text-gray-500 border-transparent hover:text-gray-900'
                }`}
              >
                Global
              </button>
              <button 
                onClick={() => { setActiveTab('shared'); setSelectedPaper(null); }}
                className={`text-xl font-medium pb-1 border-b-2 ${
                  activeTab === 'shared' ? 'text-gray-900 border-black' : 'text-gray-500 border-transparent hover:text-gray-900'
                }`}
              >
               My Research Papers
              </button>
            </nav>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" placeholder="Search papers..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 w-72 border border-gray-300 rounded-3xl focus:ring-2 text-base"
              />
            </div>
            <button onClick={() => setShowNewPaperModal(true)} className="flex items-center gap-2 px-4 py-3 bg-black text-white rounded-3xl text-base">
              <Plus className="w-4 h-4" /> New Paper
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Main Content ---------- */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {selectedPaper ? (
          <PaperDetailView />
        ) : (
          <>
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900">
                {activeTab === 'papers' ? 'Global' : 'My Research Papers'}
              </h1>
              <p className="text-gray-600">
                {activeTab === 'papers'
                  ? 'Manage and collaborate on your research projects'
                  : 'Papers where you have been added as a collaborator'}
              </p>
            </div>

            {/* Paper Grid */}
            <div className="grid grid-cols-1 gap-4">
              {papers.map(paper => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* ---------- Modals ---------- */}
      {showNewPaperModal && <NewPaperModal />}
      {showCollaboratorModal && <CollaboratorModal />}
    </div>
  );
};

export default ResearchCollabApp;
