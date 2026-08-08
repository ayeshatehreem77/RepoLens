import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // 1. DO NOT redirect while verifying token
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-3" />
        <span className="text-xs text-slate-400 font-mono">Verifying authentication...</span>
      </div>
    );
  }

  // 2. Only redirect once loading is finished and user is unauthenticated
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}