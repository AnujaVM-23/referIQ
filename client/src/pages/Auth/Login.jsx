// client/src/pages/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NotificationContext } from '../../context/NotificationContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useContext(NotificationContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      addNotification('Please enter both email and password', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      addNotification('Please enter a valid email address', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await login(formData.email, formData.password);
      addNotification('✅ Login successful! Redirecting...', 'success');
      setTimeout(() => {
        navigate('/dashboard/candidate');
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Login failed. Please try again.';
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
        <p className="text-gray-600 text-center mb-8">Get referred. Get hired.</p>

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

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
