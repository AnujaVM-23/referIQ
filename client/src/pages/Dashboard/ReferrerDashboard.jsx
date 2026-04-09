// client/src/pages/Dashboard/ReferrerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { referralAPI } from '../../services/api';
import ScoreCard from '../../components/dashboard/ScoreCard';
import Leaderboard from '../../components/dashboard/Leaderboard';
import Badge from '../../components/common/Badge';

const ReferrerDashboard = () => {
  const { user, profile } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReferrals();
  }, [filter]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await referralAPI.getReceivedReferrals(params);
      setReferrals(response.data.referrals);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'warning',
    accepted: 'primary',
    declined: 'danger',
    referred: 'primary',
    interviewing: 'primary',
    hired: 'success',
    closed: 'secondary',
  };

  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'pending').length,
    accepted: referrals.filter(r => r.status === 'accepted').length,
    hired: referrals.filter(r => r.status === 'hired').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Referrals Dashboard</h1>
        <p className="text-gray-600">Manage referrals you've sent and track your success</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Total Referrals Sent</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Pending Response</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Accepted</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.accepted}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Successfully Hired</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.hired}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Referrals List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Referrals I've Sent</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="referred">Referred</option>
                <option value="interviewing">Interviewing</option>
                <option value="hired">Hired</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading referrals...</div>
            ) : referrals.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No referrals yet. <a href="/discover/candidates" className="text-blue-600 hover:underline">Discover candidates to refer</a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Candidate</th>
                      <th className="px-4 py-3 text-left">Position</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Sent</th>
                      <th className="px-4 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((referral) => (
                      <tr key={referral._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">{referral.candidateId?.alias || 'Anonymous'}</td>
                        <td className="px-4 py-3">{referral.jobTitle}</td>
                        <td className="px-4 py-3">
                          <Badge variant={statusColors[referral.status]}>
                            {referral.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <a href={`/referral/status/${referral._id}`} className="text-blue-600 hover:underline">
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Score Card */}
          <ScoreCard userId={user?.id} />

          {/* Leaderboard */}
          <Leaderboard company={profile?.company} limit={5} />
        </div>
      </div>
    </div>
  );
};

export default ReferrerDashboard;
