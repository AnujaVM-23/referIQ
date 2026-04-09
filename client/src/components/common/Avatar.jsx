// client/src/components/common/Avatar.jsx
import React from 'react';

const Avatar = ({ src, alt = 'Avatar', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-gray-300 flex items-center justify-center overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-lg font-bold text-gray-600">{alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

export default Avatar;
