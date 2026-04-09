// client/src/pages/Auth/Register.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NotificationContext } from '../../context/NotificationContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addNotification } = useContext(NotificationContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'candidate',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password || !formData.role) {
      addNotification('Please fill in all fields', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      addNotification('Please enter a valid email address', 'error');
      return;
    }

    if (formData.password.length < 6) {
      addNotification('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await register(formData.email, formData.password, formData.role);
      addNotification('✅ Registration successful! Setting up your profile...', 'success');
      setTimeout(() => {
        navigate(`/onboarding/${formData.role}`);
      }, 500);
    } catch (error) {
      console.error('Register error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Registration failed. Please try again.';
      addNotification(`❌ ${errorMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom right, rgb(37, 99, 235), rgb(30, 58, 138))'
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">RefLink</h1>
        <p className="text-gray-600 text-center mb-8">Join the trusted referral platform</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I am a <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="candidate">Job Seeker (Candidate)</option>
              <option value="referrer">Employee (Referrer)</option>
              <option value="company">Company / Recruiter</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full"
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
