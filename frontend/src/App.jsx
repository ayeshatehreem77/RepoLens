import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProjectedRoute';

// Layout & Landing Page Imports
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/landingpage/LandingPage';

// Authenticated Pages
import DashboardPage from './pages/dashboard/Dashboard';
import ProjectsPage from './pages/projects/ProjectsPage';
import IssuesPage from './pages/issues/IssuesPage';
import ActivityPage from './pages/activity/ActivityPage';
import RepositoryDetailPage from './pages/projects/RepositoryDetailPage';
import NotificationsPage from './pages/notifications/NotificationsPage'
import PullRequestsPage from './pages/pullRequests/PullRequestsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/repositories/:owner/:repo" element={<RepositoryDetailPage />} />
            <Route path="/issues" element={<IssuesPage />} />
            <Route path="/pull-requests" element={<PullRequestsPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<DashboardPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
