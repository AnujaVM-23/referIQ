// client/src/pages/Company/CompanyDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { referralAPI } from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';

const CompanyDashboard = () => {
  const [company, setCompany] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewingId, setReviewingId] = useState('');
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      const response = await referralAPI.getCompanyVerificationRequests({
        status: 'pending_company_review',
        company,
        limit: 50,
      });
      setRequests(response.data.referrals || []);
    } catch (error) {
      addNotification(error.response?.data?.error || 'Failed to fetch company verification requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (referralId, decision) => {
    try {
      setReviewingId(referralId);
      await referralAPI.reviewReferralByCompany(referralId, decision, 'Reviewed by company dashboard');
      addNotification(`Referral ${decision === 'accepted' ? 'approved' : 'rejected'} successfully`, 'success');
      fetchVerificationRequests();
    } catch (error) {
      addNotification(error.response?.data?.error || 'Failed to review referral', 'error');
    } finally {
      setReviewingId('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Company Dashboard</h1>
        <p className="text-gray-600">Verify incoming referral requests and approve or reject them</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Verification Filter</h3>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <Input
            label="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Google, Amazon"
          />
        </div>
        <Button className="mt-4" onClick={fetchVerificationRequests}>Search Requests</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Pending Company Reviews</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{requests.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Requests Needing Action</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{requests.filter((r) => r.status === 'pending_company_review').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Company Decisions Made</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{requests.filter((r) => r.status !== 'pending_company_review').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Referral Verification Queue</h3>
        {loading ? (
          <div className="text-center py-6">Loading verification requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-6 text-gray-600">No pending verification requests.</div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-lg">{request.jobTitle}</p>
                    <p className="text-sm text-gray-600">Company: {request.company}</p>
                    <p className="text-sm text-gray-600">Candidate: {request.candidateId?.alias || request.candidateId?.email || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Referrer: {request.referrerId?.alias || request.referrerId?.email || 'N/A'}</p>
                    <p className="text-xs text-gray-500 mt-1">Created: {new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                  <Badge variant={request.status === 'pending_company_review' ? 'warning' : 'success'}>
                    {request.status.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                </div>

                {request.status === 'pending_company_review' && (
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="success"
                      disabled={reviewingId === request._id}
                      onClick={() => handleReview(request._id, 'accepted')}
                    >
                      {reviewingId === request._id ? 'Processing...' : 'Approve'}
                    </Button>
                    <Button
                      variant="danger"
                      disabled={reviewingId === request._id}
                      onClick={() => handleReview(request._id, 'rejected')}
                    >
                      {reviewingId === request._id ? 'Processing...' : 'Reject'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
