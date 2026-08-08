import React from 'react';
import AppLayout from '../../layouts/AppLayout';

export default function ActivityPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-white">Activity</h1>
        <p className="text-xs text-slate-400">View recent activity across your repositories.</p>
      </div>
    </AppLayout>
  );
}