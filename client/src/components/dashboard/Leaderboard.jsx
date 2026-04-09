// client/src/components/dashboard/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import { scoreAPI } from '../../services/api';
import Badge from '../common/Badge';

const Leaderboard = ({ company = null, limit = 10 }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [company]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await scoreAPI.getLeaderboard({
        company,
        limit: Math.min(limit, 100),
      });
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">Top Referrers</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Company</th>
              <th className="px-4 py-2 text-right">Score</th>
              <th className="px-4 py-2 text-center">Tier</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((referrer) => (
              <tr key={referrer._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-lg">{referrer.rank}</td>
                <td className="px-4 py-3">{referrer.fullName}</td>
                <td className="px-4 py-3">{referrer.maskedCompany}</td>
                <td className="px-4 py-3 text-right font-bold">{referrer.referralScore}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={referrer.tier || 'bronze'} className="text-xs">
                    {referrer.tier?.toUpperCase() || 'BRONZE'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No referrers in leaderboard yet
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
