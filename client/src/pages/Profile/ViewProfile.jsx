// client/src/pages/Profile/ViewProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { profileAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const ViewProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

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
  const displayName = isOwnProfile
    ? (profile.fullName?.trim() || profile.alias || 'My Profile')
    : (profile.alias || profile.fullName?.trim() || 'Anonymous');

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
