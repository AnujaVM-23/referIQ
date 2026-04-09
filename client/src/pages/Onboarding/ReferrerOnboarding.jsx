// client/src/pages/Onboarding/ReferrerOnboarding.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { profileAPI } from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const ReferrerOnboarding = () => {
  const navigate = useNavigate();
  const { user, setProfile } = useAuth();
  const { addNotification } = useContext(NotificationContext);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    maskedCompany: '',
    role: '',
    department: '',
    location: '',
    referralCapacity: '3',
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
      const userId = user?.id || user?._id;
      if (!userId) {
        addNotification('Session issue detected. Please login again.', 'error');
        setLoading(false);
        return;
      }
      const profileData = {
        ...formData,
        fullName: formData.fullName.trim(),
        company: formData.company.trim(),
        maskedCompany: formData.maskedCompany.trim(),
        role: formData.role.trim(),
        department: formData.department.trim(),
        location: formData.location.trim(),
        referralCapacity: parseInt(formData.referralCapacity),
      };

      const response = await profileAPI.updateProfile(userId, profileData);
      setProfile(response.data.profile);
      addNotification('Profile updated successfully!', 'success');
      navigate('/discover/candidates');
    } catch (error) {
      addNotification(error.response?.data?.error || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-2">Become a Referrer</h1>
        <p className="text-gray-600 mb-8">Set up your profile to refer quality candidates and earn bonuses</p>

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
            label="Current Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Google"
            required
          />

          <Input
            label="Masked Company (shown to candidates)"
            name="maskedCompany"
            value={formData.maskedCompany}
            onChange={handleChange}
            placeholder="Tech Company A"
            required
          />

          <Input
            label="Job Title"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Senior Software Engineer"
            required
          />

          <Input
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Engineering"
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="San Francisco, CA"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referral Capacity per Month
            </label>
            <select
              name="referralCapacity"
              value={formData.referralCapacity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 referral</option>
              <option value="2">2 referrals</option>
              <option value="3">3 referrals</option>
              <option value="5">5 referrals</option>
              <option value="10">10+ referrals</option>
            </select>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              type="submit"
              disabled={loading}
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

export default ReferrerOnboarding;
