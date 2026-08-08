import React from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';

export default function NotificationsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" /> Notifications
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Stay updated with activity across your connected repositories.
          </p>
        </div>

        <div className="p-8 text-center rounded-2xl bg-slate-900/30 border border-white/5 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">All caught up!</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            You have no unread notifications right now.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}