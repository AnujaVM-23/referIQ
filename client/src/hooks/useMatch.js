// client/src/hooks/useMatch.js
import { useState, useCallback } from 'react';
import { matchAPI } from '../services/api';

export const useMatch = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMatches = useCallback(async (type = 'referrers', params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = type === 'referrers'
        ? await matchAPI.getMatchingReferrers(params)
        : await matchAPI.getMatchingCandidates(params);

      setMatches(response.data.matches);
      return response.data.matches;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch matches');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const scoreMatch = useCallback(async (candidateId, referrerId) => {
    try {
      const response = await matchAPI.scoreMatch(candidateId, referrerId);
      return response.data.score;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to score match');
      throw err;
    }
  }, []);

  return { matches, loading, error, fetchMatches, scoreMatch };
};
