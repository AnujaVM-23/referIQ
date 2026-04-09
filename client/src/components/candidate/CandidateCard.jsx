// client/src/components/candidate/CandidateCard.jsx
import React from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

const CandidateCard = ({ candidate, onConnect }) => {
  const displayName = candidate.fullName || candidate.alias || 'Candidate';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <Avatar size="lg" alt={displayName} src={candidate.profilePhoto} />
          <div className="flex-1">
            <h3 className="text-lg font-bold">{displayName}</h3>
            <p className="text-gray-600 text-sm">{candidate.headline || 'No headline yet'}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {candidate.skills && candidate.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="primary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
            {Array.isArray(candidate.matchedSkills) && candidate.matchedSkills.length > 0 && (
              <p className="text-xs text-green-700 mt-2">
                Skill match: {candidate.matchedSkills.slice(0, 3).join(', ')}
              </p>
            )}
          </div>
        </div>
        <Badge variant={`${candidate.qualityScore >= 70 ? 'success' : 'warning'}`}>
          {candidate.qualityScore}%
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div>
          <p className="text-gray-600">Target Roles</p>
          <p className="font-semibold">{candidate.targetRoles?.join(', ') || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600">Target Companies</p>
          <p className="font-semibold">{candidate.targetCompanies?.slice(0, 2).join(', ') || 'N/A'}</p>
        </div>
      </div>

      <button
        onClick={onConnect}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
      >
        Send Referral
      </button>
    </div>
  );
};

export default CandidateCard;
