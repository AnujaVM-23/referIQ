// client/src/pages/Referral/ReferralStatus.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { referralAPI } from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import StatusTracker from '../../components/dashboard/StatusTracker';
import Button from '../../components/common/Button';

const ReferralStatus = () => {
  const { referralId } = useParams();
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    fetchReferral();
  }, [referralId]);

  const fetchReferral = async () => {
    try {
      setLoading(true);
      const response = await referralAPI.getReferral(referralId);
      setReferral(response.data);
    } catch (error) {
      addNotification('Failed to load referral', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await referralAPI.updateStatus(referralId, newStatus, '');
      addNotification('Status updated successfully', 'success');
      fetchReferral();
    } catch (error) {
      addNotification(error.response?.data?.error || 'Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading referral details...</div>;
  if (!referral) return <div className="text-center py-8">Referral not found</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <StatusTracker referralId={referralId} />

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-xl font-bold mb-4">Referral Details</h3>

          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Job Title</p>
              <p className="font-semibold">{referral.jobTitle}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Company</p>
              <p className="font-semibold">{referral.company}</p>
            </div>

            {referral.jobUrl && (
              <div>
                <p className="text-gray-600 text-sm">Job URL</p>
                <a href={referral.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Open Job Posting
                </a>
              </div>
            )}

            <div>
              <p className="text-gray-600 text-sm">Intro Message</p>
              <p className="text-sm mt-2 p-3 bg-gray-50 rounded">{referral.introMessage}</p>
            </div>

            {referral.revealConsent?.revealedAt && (
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-green-800">✓ Profiles revealed on {new Date(referral.revealConsent.revealedAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Actions</h3>

          <div className="space-y-2">
            {referral.status === 'pending' && (
              <>
                <Button
                  variant="success"
                  onClick={() => handleStatusUpdate('accepted')}
                  disabled={updating}
                  className="w-full"
                >
                  Accept
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleStatusUpdate('declined')}
                  disabled={updating}
                  className="w-full"
                >
                  Decline
                </Button>
              </>
            )}

            {referral.status === 'accepted' && (
              <>
                <Button
                  variant="primary"
                  onClick={() => handleStatusUpdate('referred')}
                  disabled={updating}
                  className="w-full"
                >
                  Mark as Referred
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleStatusUpdate('hired')}
                  disabled={updating}
                  className="w-full"
                >
                  Mark as Hired 🎉
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleStatusUpdate('closed')}
                  disabled={updating}
                  className="w-full"
                >
                  Close
                </Button>
              </>
            )}

            {referral.status === 'referred' && (
              <>
                <Button
                  variant="primary"
                  onClick={() => handleStatusUpdate('interviewing')}
                  disabled={updating}
                  className="w-full"
                >
                  In Interviewing
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleStatusUpdate('closed')}
                  disabled={updating}
                  className="w-full"
                >
                  Close
                </Button>
              </>
            )}

            {referral.status === 'interviewing' && (
              <>
                <Button
                  variant="success"
                  onClick={() => handleStatusUpdate('hired')}
                  disabled={updating}
                  className="w-full"
                >
                  Mark as Hired 🎉
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleStatusUpdate('closed')}
                  disabled={updating}
                  className="w-full"
                >
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralStatus;
