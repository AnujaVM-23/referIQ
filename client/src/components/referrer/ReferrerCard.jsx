// client/src/components/referrer/ReferrerCard.jsx
import React from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

const ReferrerCard = ({ referrer, matchScore, onConnect }) => {
  const displayName = referrer.fullName || referrer.alias || 'Referrer';
  const displayCompany = referrer.maskedCompany || referrer.company || 'Company not specified';

  const tierColors = {
    platinum: 'bg-purple-100 text-purple-800',
    gold: 'bg-yellow-100 text-yellow-800',
    silver: 'bg-gray-100 text-gray-800',
    bronze: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <Avatar size="lg" alt={displayName} src={referrer.profilePhoto} />
          <div className="flex-1">
            <h3 className="text-lg font-bold">{displayName}</h3>
            <p className="text-gray-600 text-sm">{referrer.role || 'Role not specified'} at {displayCompany}</p>
            <p className="text-gray-500 text-xs mt-1">📍 {referrer.location || 'Location not specified'}</p>
          </div>
        </div>
        <Badge variant={referrer.tier || 'bronze'} className={`text-xs font-bold`}>
          {referrer.tier?.toUpperCase() || 'Bronze'}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm mb-4 border-t pt-4">
        <div>
          <p className="text-gray-600">Tier</p>
          <Badge variant={referrer.tier || 'bronze'} className="text-xs">
            {referrer.tier?.toUpperCase() || 'Bronze'}
          </Badge>
        </div>
        <div>
          <p className="text-gray-600">Score</p>
          <p className="font-bold">{referrer.referralScore}</p>
        </div>
        <div>
          <p className="text-gray-600">Response Rate</p>
          <p className="font-bold">{Math.round(referrer.responseRate)}%</p>
        </div>
      </div>

      {matchScore !== undefined && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">Match Score</p>
          <p className="text-lg font-bold text-blue-600">{matchScore}%</p>
          {Array.isArray(referrer.matchedSkills) && referrer.matchedSkills.length > 0 && (
            <p className="text-xs text-blue-700 mt-1">
              Matched skills: {referrer.matchedSkills.slice(0, 3).join(', ')}
            </p>
          )}
        </div>
      )}

      <button
        onClick={onConnect}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
      >
        Send Referral Request
      </button>
    </div>
  );
};

export default ReferrerCard;
