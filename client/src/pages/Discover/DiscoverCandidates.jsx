// client/src/pages/Discover/DiscoverCandidates.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '../../hooks/useMatch';
import { NotificationContext } from '../../context/NotificationContext';
import CandidateCard from '../../components/candidate/CandidateCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const DiscoverCandidates = () => {
  const navigate = useNavigate();
  const { matches, loading, fetchMatches } = useMatch();
  const { addNotification } = useContext(NotificationContext);
  const [filters, setFilters] = useState({ skills: '', limit: 12 });

  useEffect(() => {
    fetchMatches('candidates', filters);
  }, [filters.limit]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchMatches('candidates', filters);
  };

  const handleConnect = (candidateId) => {
    if (!candidateId) {
      addNotification('Candidate profile is unavailable', 'error');
      return;
    }

    navigate(`/profile/view/${candidateId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Discover Candidates</h1>
        <p className="text-gray-600">Find quality candidates to refer to your company</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Skills"
            name="skills"
            value={filters.skills}
            onChange={handleFilterChange}
            placeholder="e.g., React, Python (comma-separated)"
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
        <div className="text-center py-8">Loading candidates...</div>
      ) : matches.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No candidates found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600">
            Found {matches.length} candidates
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((candidate) => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                onConnect={() => handleConnect(candidate.userId)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DiscoverCandidates;
