// client/src/utils/scoreUtils.js
export const getTierColor = (tier) => {
  const colors = {
    platinum: '#9333ea',
    gold: '#eab308',
    silver: '#d1d5db',
    bronze: '#ea580c',
  };
  return colors[tier] || '#6b7280';
};

export const getTierDisplayName = (tier) => {
  return tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'Bronze';
};

export const getScoreBadge = (score) => {
  if (score >= 600) return 'Platinum ✨';
  if (score >= 300) return 'Gold ⭐';
  if (score >= 100) return 'Silver';
  return 'Bronze';
};

export const getQualityBadge = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Low';
};
