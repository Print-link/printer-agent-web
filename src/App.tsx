import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ToastProvider } from './contexts/ToastContext';
import { useAuthStore } from './stores/authStore';
import { OfflineBanner } from './shared/components/OfflineBanner';
import { ToastContainer } from './components/shared/toast/ToastContainer';
import LoginPage from './pages/auth/LoginPage';
import SetupPasswordPage from './pages/auth/SetupPasswordPage';
import BusinessInfoPage from './pages/auth/BusinessInfoPage';
import SetupLocationPage from './pages/auth/SetupLocationPage';
import ClerkLayout from './layouts/ClerkLayout';

// Lazy load pages
const DashboardPage = lazy(() => import('./pages/clerk/DashboardPage'));
const OrdersPage = lazy(() => import('./pages/clerk/OrdersPage'));
const BranchesPage = lazy(() => import('./pages/clerk/BranchesPage'));
const OverviewPage = lazy(() => import('./pages/clerk/OverviewPage'));
const ProfilePage = lazy(() => import('./pages/clerk/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/clerk/SettingsPage'));
const UserManagementPage = lazy(() => import('./pages/clerk/UserManagementPage'));
const StatusPage = lazy(() => import('./pages/clerk/StatusPage'));
const ServicesPage = lazy(() => import('./pages/clerk/ServicesPage'));
const BranchCreatePage = lazy(() => import('./pages/clerk/branches/BranchCreatePage'));

import { queryClient } from './lib/queryClient';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function SetupPasswordRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!user || user.isTemporaryPassword !== true) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && user.isTemporaryPassword !== true) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function SetupBusinessRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Business info setup is no longer required for users
  // Branches have their own setup flow
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function SetupLocationRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Location setup is no longer required for users
  // Branches have their own location setup
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SettingsProvider>
          <ToastProvider>
            <OfflineBanner />
            <ToastContainer />
            <Router>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/setup-password"
                  element={
                    <SetupPasswordRoute>
                      <SetupPasswordPage />
                    </SetupPasswordRoute>
                  }
                />
                <Route
                  path="/setup-business"
                  element={
                    <SetupBusinessRoute>
                      <BusinessInfoPage />
                    </SetupBusinessRoute>
                  }
                />
                <Route
                  path="/setup-location"
                  element={
                    <SetupLocationRoute>
                      <SetupLocationPage />
                    </SetupLocationRoute>
                  }
                />
                <Route
                  path="/clerk"
                  element={
                    <ProtectedRoute>
                      <ClerkLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="jobs" element={<OrdersPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="overview" element={<OverviewPage />} />
                  <Route path="branches" element={<BranchesPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="branches/create" element={<BranchCreatePage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="user-management" element={<UserManagementPage />} />
                </Route>
                <Route path="/" element={<Navigate to="/clerk/dashboard" replace />} />
              </Routes>
            </Suspense>
          </Router>
          <ReactQueryDevtools initialIsOpen={false} />
          </ToastProvider>
        </SettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
