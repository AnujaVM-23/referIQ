// client/src/components/referrer/CandidateFeed.jsx
import React, { useState, useEffect } from 'react';
import { useMatch } from '../../hooks/useMatch';
import CandidateCard from '../candidate/CandidateCard';

const CandidateFeed = () => {
  const { matches, loading, fetchMatches } = useMatch();

  useEffect(() => {
    fetchMatches('candidates', { limit: 20 });
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading candidates...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Matching Candidates</h2>
      
      {matches.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No matching candidates found at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((candidate) => (
            <CandidateCard
              key={candidate._id}
              candidate={candidate}
              onConnect={() => {
                // Handle connect
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateFeed;
