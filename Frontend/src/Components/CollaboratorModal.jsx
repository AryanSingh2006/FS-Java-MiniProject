import React from 'react';
import { X, Trash2 } from 'lucide-react';

const CollaboratorModal = ({ onClose, collaborators = [] }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-900">Manage Collaborators</h2>
        <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
      </div>
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
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Current Collaborators ({collaborators.length})</h3>
        <div className="space-y-2">
          {collaborators.map(collab => (
            <div key={collab.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {collab.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{collab.name}</div>
                  <div className="text-sm text-gray-500">{collab.email}</div>
                </div>
              </div>
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
      <div className="flex justify-end mt-6">
        <button onClick={onClose} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Done</button>
      </div>
    </div>
  </div>
);

export default CollaboratorModal;
