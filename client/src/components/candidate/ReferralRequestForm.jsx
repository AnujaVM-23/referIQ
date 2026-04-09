// client/src/components/candidate/ReferralRequestForm.jsx
import React, { useState, useContext } from 'react';
import { referralAPI } from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import Button from '../common/Button';
import Input from '../common/Input';

const ReferralRequestForm = ({ referrerId, onSuccess }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobUrl: '',
    introMessage: '',
    resumeUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const { addNotification } = useContext(NotificationContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.introMessage.length < 50) {
      addNotification('Intro message must be at least 50 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      await referralAPI.createReferral({
        ...formData,
        referrerId,
      });
      addNotification('Referral request sent successfully!', 'success');
      onSuccess();
    } catch (error) {
      addNotification(error.response?.data?.error || 'Failed to send referral', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Send Referral Request</h2>

      <Input
        label="Job Title"
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleChange}
        placeholder="e.g., Software Engineer"
        required
      />

      <Input
        label="Company"
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="e.g., Google"
        required
      />

      <Input
        label="Job URL"
        name="jobUrl"
        type="url"
        value={formData.jobUrl}
        onChange={handleChange}
        placeholder="https://careers.google.com/..."
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Intro Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="introMessage"
          value={formData.introMessage}
          onChange={handleChange}
          placeholder="Tell the referrer about yourself and why you're interested in this role (min 50 characters)"
          required
          minLength={50}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.introMessage.length} / 50 characters minimum
        </p>
      </div>

      <Input
        label="Resume URL"
        name="resumeUrl"
        type="url"
        value={formData.resumeUrl}
        onChange={handleChange}
        placeholder="Link to your resume"
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Sending...' : 'Send Referral Request'}
      </Button>
    </form>
  );
};

export default ReferralRequestForm;
