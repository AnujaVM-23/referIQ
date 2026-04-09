// client/src/pages/Discover/DiscoverReferrers.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '../../hooks/useMatch';
import { NotificationContext } from '../../context/NotificationContext';
import ReferrerCard from '../../components/referrer/ReferrerCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const DiscoverReferrers = () => {
  const navigate = useNavigate();
  const { matches, loading, fetchMatches } = useMatch();
  const { addNotification } = useContext(NotificationContext);
  const [filters, setFilters] = useState({ company: '', limit: 12 });

  useEffect(() => {
    fetchMatches('referrers', filters);
  }, [filters.limit]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchMatches('referrers', filters);
  };

  const handleConnect = (referrerId) => {
    navigate(`/referral/request/${referrerId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Discover Referrers</h1>
        <p className="text-gray-600">Find the right referrer at your target company</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company"
            name="company"
            value={filters.company}
            onChange={handleFilterChange}
            placeholder="e.g., Google, Amazon"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Results per page</label>
            <select
              name="limit"
              value={filters.limit}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
            </select>
          </div>
        </div>
        <Button onClick={handleSearch} className="mt-4">
          Search
        </Button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-8">Loading referrers...</div>
      ) : matches.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No referrers found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600">
            Found {matches.length} referrers
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((referrer) => (
              <ReferrerCard
                key={referrer._id}
                referrer={referrer}
                matchScore={referrer.matchScore}
                onConnect={() => handleConnect(referrer.userId)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DiscoverReferrers;
