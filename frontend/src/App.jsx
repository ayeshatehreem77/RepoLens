import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProjectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/Dashboard';
import ProjectsPage from './pages/projects/ProjectsPage';
import IssuesPage from './pages/issues/IssuesPage';
import PullRequestsPage from './pages/pullRequests/PullRequestsPage';
import LoginPage from './pages/auth/LoginPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/pull-requests" element={<PullRequestsPage />} />
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;