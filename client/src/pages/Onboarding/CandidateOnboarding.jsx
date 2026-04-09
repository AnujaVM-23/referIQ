// client/src/pages/Onboarding/CandidateOnboarding.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { profileAPI } from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const CandidateOnboarding = () => {
  const navigate = useNavigate();
  const { user, setProfile } = useAuth();
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
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const profileData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        targetRoles: formData.targetRoles.split(',').map(r => r.trim()),
        targetCompanies: formData.targetCompanies.split(',').map(c => c.trim()),
      };

      const response = await profileAPI.updateProfile(user.id, profileData);
      setProfile(response.data.profile);
      addNotification('Profile updated successfully!', 'success');
      navigate('/discover/referrers');
    } catch (error) {
      addNotification(error.response?.data?.error || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-gray-600 mb-8">Let's set up your candidate profile to find the right referrals</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />

          <Input
            label="Headline"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            placeholder="e.g., Senior Software Engineer with 5 years experience"
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
            placeholder="React, Node.js, MongoDB, etc."
          />

          <Input
            label="Target Roles (comma-separated)"
            name="targetRoles"
            value={formData.targetRoles}
            onChange={handleChange}
            placeholder="Software Engineer, Product Manager, etc."
            required
          />

          <Input
            label="Target Companies (comma-separated)"
            name="targetCompanies"
            value={formData.targetCompanies}
            onChange={handleChange}
            placeholder="Google, Amazon, Microsoft, etc."
            required
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="San Francisco, CA"
          />

          <Input
            label="LinkedIn URL"
            name="linkedinUrl"
            type="url"
            value={formData.linkedinUrl}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
          />

          <div className="flex gap-4 mt-8">
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Continue to Discover'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateOnboarding;
