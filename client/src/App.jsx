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

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
};

const RootApp = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <NotificationContainer />
      <Routes>
        {/* Public Routes */}
        {!isAuthenticated && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}

        {/* Protected Routes */}
        {isAuthenticated && (
          <>
            <Route
              path="/onboarding/candidate"
              element={
                <ProtectedRoute>
                  <CandidateOnboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/referrer"
              element={
                <ProtectedRoute>
                  <ReferrerOnboarding />
                </ProtectedRoute>
              }
            />

            <Route
              path="/discover/referrers"
              element={
                <ProtectedRoute>
                  <DiscoverReferrers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discover/candidates"
              element={
                <ProtectedRoute>
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
                <ProtectedRoute>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/referrer"
              element={
                <ProtectedRoute>
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
                <ProtectedRoute>
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard/candidate" replace />} />
            <Route path="*" element={<Navigate to="/dashboard/candidate" replace />} />
          </>
        )}

        {/* Redirect unauthenticated users */}
        {!isAuthenticated && <Route path="*" element={<Navigate to="/login" replace />} />}
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
