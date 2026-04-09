// client/src/pages/Profile/ViewProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { profileAPI, referralAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { NotificationContext } from '../../context/NotificationContext';

const ViewProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();
  const { addNotification } = React.useContext(NotificationContext);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [relatedReferral, setRelatedReferral] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    const fetchRelatedReferral = async () => {
      const actorRole = loggedInUser?.role;
      const viewedRole = user?.role;
      const viewedUserId = user?.id || user?._id;

      if (actorRole !== 'referrer' || viewedRole !== 'candidate' || !viewedUserId) {
        setRelatedReferral(null);
        return;
      }

      try {
        const response = await referralAPI.getReferralForReferrerCandidate(viewedUserId);
        setRelatedReferral(response.data.referral || null);
      } catch (error) {
        setRelatedReferral(null);
      }
    };

    fetchRelatedReferral();
  }, [loggedInUser?.role, user?.role, user?.id, user?._id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getProfile(userId);
      setUser(response.data.user);
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading profile...</div>;
  if (!profile) return <div className="text-center py-8">Profile not found</div>;

  const isCandidate = user?.role === 'candidate';
  const loggedInUserId = loggedInUser?.id || loggedInUser?._id;
  const profileUserId = user?.id || user?._id;
  const isOwnProfile = loggedInUserId && profileUserId && String(loggedInUserId) === String(profileUserId);
  const isReferrerViewingCandidate = loggedInUser?.role === 'referrer' && isCandidate;
  const displayName = isOwnProfile
    ? (profile.fullName?.trim() || profile.alias || 'My Profile')
    : (profile.alias || profile.fullName?.trim() || 'Anonymous');

  const handleReferralDecision = async (decision) => {
    if (!relatedReferral?._id) {
      addNotification('No referral request found for this candidate.', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const newStatus = decision === 'accept' ? 'accepted' : 'declined';
      const response = await referralAPI.updateStatus(
        relatedReferral._id,
        newStatus,
        `Referrer ${decision}ed from candidate profile view`
      );
      setRelatedReferral(response.data.referral);
      addNotification(`Referral ${newStatus} successfully`, 'success');
    } catch (error) {
      addNotification(error.response?.data?.error || 'Failed to update referral status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        {isOwnProfile && (
          <div className="flex justify-end mb-4">
            <Button variant="primary" onClick={() => navigate('/profile/edit')}>
              Edit Profile
            </Button>
          </div>
        )}

        {isReferrerViewingCandidate && (
          <div className="mb-4 border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="font-semibold">Referral Decision</p>
                <p className="text-sm text-gray-600">
                  {relatedReferral
                    ? `Current status: ${relatedReferral.status.replace(/_/g, ' ')}`
                    : 'No referral request yet from this candidate.'}
                </p>
              </div>
              {relatedReferral?.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="success"
                    disabled={actionLoading}
                    onClick={() => handleReferralDecision('accept')}
                  >
                    {actionLoading ? 'Processing...' : 'Accept'}
                  </Button>
                  <Button
                    variant="danger"
                    disabled={actionLoading}
                    onClick={() => handleReferralDecision('reject')}
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          <Avatar size="xl" alt={displayName} src={profile.profilePhoto} />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{displayName}</h1>
            <p className="text-gray-600 mt-2">
              {isCandidate ? profile.headline : `${profile.role} at ${profile.maskedCompany}`}
            </p>
            {profile.location && (
              <p className="text-gray-600 mt-1">📍 {profile.location}</p>
            )}
            {!isCandidate && (
              <div className="mt-3">
                <Badge variant={profile.tier || 'bronze'}>
                  {profile.tier?.toUpperCase() || 'BRONZE'}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 border-t pt-6">
          {isCandidate ? (
            <>
              {profile.bio && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="primary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.targetRoles && profile.targetRoles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Target Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.targetRoles.map((role) => (
                      <Badge key={role} variant="success">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.targetCompanies && profile.targetCompanies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Target Companies</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.targetCompanies.map((company) => (
                      <Badge key={company} variant="warning">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-gray-600 text-sm">Quality Score</p>
                <p className="text-3xl font-bold text-blue-600">{profile.qualityScore}%</p>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Department</p>
                  <p className="font-semibold">{profile.department || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Response Rate</p>
                  <p className="font-semibold">{Math.round(profile.responseRate)}%</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Referral Score</p>
                  <p className="font-semibold">{profile.referralScore}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Total Referrals</p>
                  <p className="text-2xl font-bold">{profile.totalReferrals}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Successful Hires</p>
                  <p className="text-2xl font-bold text-green-600">{profile.successfulHires}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
