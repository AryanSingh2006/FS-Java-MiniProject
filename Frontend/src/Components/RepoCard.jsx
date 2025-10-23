import React from "react";

const RepoCard = ({ repo, onClick }) => {

  return (
    <div
      key={repo.id || repo._id}
      className="bg-white border border-gray-200 rounded-3xl p-5 cursor-pointer hover:bg-gray-50 relative"
      onClick={() => onClick(repo)}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-xl text-gray-900 mb-1">{repo.name}</h3>
          <p className="text-base text-gray-600">{repo.description}</p>
        </div>
        <span className="text-xs text-gray-500">
          {repo.ownerEmail || repo.owner || "Unknown Owner"}
        </span>
      </div>
      <div className="text-xs text-gray-400">
        Created:{" "}
        {repo.createdAt
          ? new Date(repo.createdAt).toLocaleString()
          : "N/A"}
      </div>
    </div>
  );
};

export default RepoCard;
