// client/src/pages/Profile/EditProfile.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { profileAPI } from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setProfile, profile } = useAuth();
  const { addNotification } = useContext(NotificationContext);
  const [formData, setFormData] = useState({
    fullName: '',
    headline: '',
    bio: '',
    skills: '',
    targetRoles: '',
    targetCompanies: '',
    location: '',
    linkedinUrl: '',
    company: '',
    maskedCompany: '',
    role: '',
    department: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (profile) {
          setFormData({
            fullName: profile.fullName || '',
            headline: profile.headline || '',
            bio: profile.bio || '',
            skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
            targetRoles: Array.isArray(profile.targetRoles) ? profile.targetRoles.join(', ') : '',
            targetCompanies: Array.isArray(profile.targetCompanies) ? profile.targetCompanies.join(', ') : '',
            location: profile.location || '',
            linkedinUrl: profile.linkedinUrl || '',
            company: profile.company || '',
            maskedCompany: profile.maskedCompany || '',
            role: profile.role || '',
            department: profile.department || '',
          });
          setLoading(false);
        } else if (user?.id) {
          // Fetch profile if not in context
          const response = await profileAPI.getProfile(user.id);
          if (response.data?.profile) {
            const prof = response.data.profile;
            setFormData({
              fullName: prof.fullName || '',
              headline: prof.headline || '',
              bio: prof.bio || '',
              skills: Array.isArray(prof.skills) ? prof.skills.join(', ') : '',
              targetRoles: Array.isArray(prof.targetRoles) ? prof.targetRoles.join(', ') : '',
              targetCompanies: Array.isArray(prof.targetCompanies) ? prof.targetCompanies.join(', ') : '',
              location: prof.location || '',
              linkedinUrl: prof.linkedinUrl || '',
              company: prof.company || '',
              maskedCompany: prof.maskedCompany || '',
              role: prof.role || '',
              department: prof.department || '',
            });
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        addNotification('Failed to load profile', 'error');
        setLoading(false);
      }
    };

    loadProfile();
  }, [profile, user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const profileData = {
        ...formData,
        skills: user.role === 'candidate' ? formData.skills.split(',').map(s => s.trim()) : undefined,
        targetRoles: user.role === 'candidate' ? formData.targetRoles.split(',').map(r => r.trim()) : undefined,
        targetCompanies: user.role === 'candidate' ? formData.targetCompanies.split(',').map(c => c.trim()) : undefined,
      };

      // Remove undefined keys
      Object.keys(profileData).forEach(key => profileData[key] === undefined && delete profileData[key]);

      const response = await profileAPI.updateProfile(user.id, profileData);
      setProfile(response.data.profile);
      addNotification('Profile updated successfully!', 'success');
      navigate('/profile/view/' + user.id);
    } catch (error) {
      addNotification(error.response?.data?.error || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading profile...</div>;

  const isCandidate = user?.role === 'candidate';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />

          {isCandidate ? (
            <>
              <Input
                label="Headline"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                />
              </div>

              <Input
                label="Skills (comma-separated)"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />

              <Input
                label="Target Roles (comma-separated)"
                name="targetRoles"
                value={formData.targetRoles}
                onChange={handleChange}
                placeholder="Software Engineer, Product Manager"
              />

              <Input
                label="Target Companies (comma-separated)"
                name="targetCompanies"
                value={formData.targetCompanies}
                onChange={handleChange}
                placeholder="Google, Amazon, Microsoft"
              />

              <Input
                label="LinkedIn URL"
                name="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </>
          ) : (
            <>
              <Input
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Google"
              />

              <Input
                label="Masked Company"
                name="maskedCompany"
                value={formData.maskedCompany}
                onChange={handleChange}
                placeholder="Tech Company A"
              />

              <Input
                label="Job Title"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Senior Engineer"
              />

              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Engineering"
              />
            </>
          )}

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="San Francisco, CA"
          />

          <div className="flex gap-4 mt-8">
            <Button
              type="submit"
              disabled={saving}
              variant="primary"
              className="flex-1"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
