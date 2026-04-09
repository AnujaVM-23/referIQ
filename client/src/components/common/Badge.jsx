// client/src/components/common/Badge.jsx
import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-blue-200 text-blue-800',
    success: 'bg-green-200 text-green-800',
    danger: 'bg-red-200 text-red-800',
    warning: 'bg-yellow-200 text-yellow-800',
    platinum: 'bg-purple-200 text-purple-800',
    gold: 'bg-yellow-200 text-yellow-800',
    silver: 'bg-gray-200 text-gray-800',
    bronze: 'bg-orange-200 text-orange-800',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
