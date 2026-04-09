// client/src/pages/Dashboard/CandidateDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { referralAPI } from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import ScoreCard from '../../components/dashboard/ScoreCard';
import Badge from '../../components/common/Badge';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const { on, off } = useSocket();
  const { addNotification } = useContext(NotificationContext);
  const userId = user?.id || user?._id;
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReferrals();
  }, [filter]);

  useEffect(() => {
    const handleStatusChanged = (payload) => {
      fetchReferrals();
      if (payload?.status) {
        addNotification(`Referral updated: ${payload.status}`, 'info', 3000);
      }
    };

    on('referral_status_changed', handleStatusChanged);
    return () => off('referral_status_changed', handleStatusChanged);
  }, [on, off, filter]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await referralAPI.getSentReferrals(params);
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
        <h1 className="text-3xl font-bold mb-2">My Referral Activity</h1>
        <p className="text-gray-600">Track your referral requests and progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Total Referrals Sent</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Accepted</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.accepted}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Hired 🎉</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.hired}</p>
        </div>
      </div>

      {/* Score Card */}
      <ScoreCard userId={userId} />

      {/* Referrals List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Referrals</h2>
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
            No referrals found. <Link to="/discover/referrers" className="text-blue-600 hover:underline">Start discovering referrers</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Job Title</th>
                  <th className="px-4 py-3 text-left">Company</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Sent</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{referral.jobTitle}</td>
                    <td className="px-4 py-3">{referral.company}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusColors[referral.status]}>
                        {referral.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/referral/status/${referral._id}`} className="text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
