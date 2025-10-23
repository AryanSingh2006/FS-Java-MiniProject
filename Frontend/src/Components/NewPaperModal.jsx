import React from 'react';
import { X } from 'lucide-react';

const NewPaperModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-6 w-full max-w-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-900">Create New Research Paper</h2>
        <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paper Title</label>
          <input type="text" placeholder="Enter research paper title" className="w-full px-3 py-2 border border-black rounded-3xl focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows="3" placeholder="Brief description of your research" className="w-full px-3 py-2 border border-black rounded-3xl focus:ring-2 focus:ring-black resize-none" />
        </div>
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
      <div className="flex gap-3 mt-6">
        <button onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 rounded-3xl hover:bg-gray-50 py-2">Cancel</button>
        <button className="flex-1 bg-black text-white rounded-3xl hover:bg-blue-700 py-2">Create Paper</button>
      </div>
    </div>
  </div>
);

export default NewPaperModal;
