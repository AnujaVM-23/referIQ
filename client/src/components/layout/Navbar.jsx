// client/src/components/layout/Navbar.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NotificationContext } from '../../context/NotificationContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications } = useContext(NotificationContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          RefLink
        </Link>

        <div className="flex items-center gap-6">
          {/* Notifications Bell */}
          <div className="relative">
            <button className="relative p-2 text-gray-600 hover:text-blue-600">
              🔔
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
            >
              <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.email?.[0].toUpperCase() || 'U'}
              </span>
              <span className="text-sm font-medium">{user?.email?.split('@')[0]}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <Link
                  to="/profile/edit"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Edit Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
