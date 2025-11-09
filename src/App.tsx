import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { SettingsProfile } from './pages/SettingsProfile';
import { SettingsSecurity } from './pages/SettingsSecurity';
import { WorkspaceProvider } from './features/workspace/WorkspaceContext';
function PrivateRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated
  } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
function PublicRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated
  } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>;
}
function AppRoutes() {
  return <Routes>
      <Route path="/login" element={<PublicRoute>
            <Login />
          </PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute>
            <Dashboard />
          </PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute>
            <Projects />
          </PrivateRoute>} />
      <Route path="/projects/:id" element={<PrivateRoute>
            <ProjectDetail />
          </PrivateRoute>} />
      <Route path="/settings/profile" element={<PrivateRoute>
            <SettingsProfile />
          </PrivateRoute>} />
      <Route path="/settings/security" element={<PrivateRoute>
            <SettingsSecurity />
          </PrivateRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>;
}
export function App() {
  useEffect(() => {
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
  }, []);

  return <BrowserRouter>
      <AuthProvider>
        <WorkspaceProvider>
          <AppRoutes />
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>;
}
