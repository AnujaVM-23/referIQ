// client/src/App.jsx - All routes defined
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './hooks/useAuth';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import NotificationContainer from './components/NotificationContainer';

// Pages - Auth
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Pages - Onboarding
import CandidateOnboarding from './pages/Onboarding/CandidateOnboarding';
import ReferrerOnboarding from './pages/Onboarding/ReferrerOnboarding';

// Pages - Discover
import DiscoverReferrers from './pages/Discover/DiscoverReferrers';
import DiscoverCandidates from './pages/Discover/DiscoverCandidates';

// Pages - Referral
import ReferralRequest from './pages/Referral/ReferralRequest';
import ReferralStatus from './pages/Referral/ReferralStatus';

// Pages - Dashboard
import CandidateDashboard from './pages/Dashboard/CandidateDashboard';
import ReferrerDashboard from './pages/Dashboard/ReferrerDashboard';

// Pages - Profile
import ViewProfile from './pages/Profile/ViewProfile';
import EditProfile from './pages/Profile/EditProfile';

// Pages - Company
import CompanyDashboard from './pages/Company/CompanyDashboard';

const isCandidateProfileComplete = (profile) => {
  return Boolean(profile?.fullName?.trim())
    && Array.isArray(profile?.targetRoles)
    && profile.targetRoles.length > 0
    && Array.isArray(profile?.targetCompanies)
    && profile.targetCompanies.length > 0;
};

const isReferrerProfileComplete = (profile) => {
  return Boolean(profile?.fullName?.trim())
    && Boolean(profile?.company?.trim())
    && Boolean(profile?.role?.trim());
};

const getDefaultRoute = (user, profile) => {
  if (!user) return '/login';

  if (user.role === 'candidate') {
    return isCandidateProfileComplete(profile) ? '/dashboard/candidate' : '/onboarding/candidate';
  }

  if (user.role === 'referrer') {
    return isReferrerProfileComplete(profile) ? '/dashboard/referrer' : '/onboarding/referrer';
  }

  return '/company/dashboard';
};

// Protected Route Container
const ProtectedLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user, profile } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRoute(user, profile)} replace />;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
};

const RootApp = () => {
  const { isAuthenticated, loading, user, profile } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const defaultRoute = getDefaultRoute(user, profile);

  return (
    <Router>
      <NotificationContainer />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to={defaultRoute} replace />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to={defaultRoute} replace />}
        />

        {/* Protected Routes */}
            <Route
              path="/onboarding/candidate"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateOnboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/referrer"
              element={
                <ProtectedRoute allowedRoles={['referrer']}>
                  <ReferrerOnboarding />
                </ProtectedRoute>
              }
            />

            <Route
              path="/discover/referrers"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <DiscoverReferrers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discover/candidates"
              element={
                <ProtectedRoute allowedRoles={['referrer']}>
                  <DiscoverCandidates />
                </ProtectedRoute>
              }
            />

            <Route
              path="/referral/request/:referrerId"
              element={
                <ProtectedRoute>
                  <ReferralRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/referral/status/:referralId"
              element={
                <ProtectedRoute>
                  <ReferralStatus />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/candidate"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/referrer"
              element={
                <ProtectedRoute allowedRoles={['referrer']}>
                  <ReferrerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/view/:userId"
              element={
                <ProtectedRoute>
                  <ViewProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/company/dashboard"
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to={isAuthenticated ? defaultRoute : '/login'} replace />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? defaultRoute : '/login'} replace />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RootApp />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
