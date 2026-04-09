// client/src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const candidateLinks = [
    { path: '/discover/referrers', label: 'Discover Referrers', icon: '🔍' },
    { path: '/dashboard/candidate', label: 'My Referrals', icon: '📋' },
    { path: '/profile/view/' + (user?.id || user?._id), label: 'My Profile', icon: '👤' },
  ];

  const referrerLinks = [
    { path: '/discover/candidates', label: 'Discover Candidates', icon: '🔍' },
    { path: '/dashboard/referrer', label: 'Referrals Sent', icon: '📤' },
    { path: '/profile/view/' + (user?.id || user?._id), label: 'My Profile', icon: '👤' },
  ];

  const links = user?.role === 'candidate' ? candidateLinks : referrerLinks;

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 min-h-screen flex flex-col relative">
      <div className="mb-8">
        <h2 className="text-xl font-bold">RefLink</h2>
        <p className="text-xs text-gray-400 mt-1">Get referred. Get hired.</p>
      </div>

      <nav className="space-y-2 flex-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-2 rounded-lg transition ${
              isActive(link.path)
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="mr-2">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className="bg-gray-800 p-4 rounded-lg mt-6">
        <p className="text-xs text-gray-400">Logged in as</p>
        <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
        <p className="text-xs text-purple-400 capitalize mt-1">{user?.role}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
