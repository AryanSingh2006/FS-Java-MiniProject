import React, { useState, useEffect } from 'react';

const RecentActivity = ({ repoId, currentUserEmail }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch activity data from the new endpoint
  useEffect(() => {
    if (!repoId) return;

    setLoading(true);
    fetch(`http://localhost:8080/papers/activity/${repoId}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch activity');
        return res.json();
      })
      .then((data) => {
        // Take only the 4 most recent activities
        setActivities(data.slice(0, 4));
      })
      .catch((err) => {
        console.error('Failed to fetch activity:', err);
        setActivities([]);
      })
      .finally(() => setLoading(false));
  }, [repoId]);

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

  // Extract username from email (part before @)
  const getUsernameFromEmail = (email) => {
    if (!email) return 'Unknown';
    return email.split('@')[0];
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
      {loading ? (
        <div className="text-gray-400 text-sm">Loading activity...</div>
      ) : activities.length === 0 ? (
        <div className="text-gray-400 text-sm">No activity yet.</div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, idx) => (
            <div key={idx} className="text-sm">
              <div className="flex items-start gap-2">
                <div className={`w-6 h-6 ${activity.actionType === 'uploaded' ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <div className={`w-2 h-2 ${activity.actionType === 'uploaded' ? 'bg-green-600' : 'bg-blue-600'} rounded-full`}></div>
                </div>
                <div>
                  <p className="text-gray-900">
                    <span className="font-medium">
                      {activity.ownerEmail && activity.ownerEmail === currentUserEmail
                        ? 'You'
                        : activity.ownerEmail
                          ? getUsernameFromEmail(activity.ownerEmail)
                          : 'Unknown'}
                    </span> {activity.actionType} <span className="font-medium">{activity.paperTitle || activity.fileName}</span>
                    {activity.versionNumber > 1 && (
                      <span className="text-gray-500 text-xs ml-1">(v{activity.versionNumber})</span>
                    )}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">{getTimeAgo(activity.uploadedAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
