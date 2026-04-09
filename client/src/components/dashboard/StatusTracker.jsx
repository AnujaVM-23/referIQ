// client/src/components/dashboard/StatusTracker.jsx
import React, { useState, useEffect } from 'react';
import { referralAPI } from '../../services/api';
import Badge from '../common/Badge';

const StatusTracker = ({ referralId }) => {
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferral();
  }, [referralId]);

  const fetchReferral = async () => {
    try {
      setLoading(true);
      const response = await referralAPI.getReferral(referralId);
      setReferral(response.data);
    } catch (error) {
      console.error('Error fetching referral:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!referral) return <div>Referral not found</div>;

  const statusSteps = ['pending', 'accepted', 'referred', 'interviewing', 'hired'];
  const currentIndex = statusSteps.indexOf(referral.status);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">Referral Status</h3>

      <div className="flex items-center justify-between mb-8">
        {statusSteps.map((step, index) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                index <= currentIndex ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              ✓
            </div>
            <p className="text-xs mt-2 capitalize text-center">{step}</p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Status History</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {referral.statusHistory?.map((history, index) => (
            <div key={index} className="text-sm bg-gray-50 p-2 rounded">
              <p className="font-semibold capitalize">
                {history.from} → {history.to}
              </p>
              <p className="text-gray-600 text-xs">{new Date(history.timestamp).toLocaleString()}</p>
              {history.note && <p className="text-gray-700 text-xs mt-1">{history.note}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Badge variant="primary">{referral.status.toUpperCase()}</Badge>
      </div>
    </div>
  );
};

export default StatusTracker;
