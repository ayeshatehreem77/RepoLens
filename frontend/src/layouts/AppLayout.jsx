import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  GitFork,
  CircleDot,
  GitPullRequest,
  Activity,
  Bell,
  Sparkles,
  Settings,
  LogOut,
  Search,
  RefreshCw,
  Menu,
  X,
  ChevronRight,
  Code2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AppLayout({ children, onSync, isSyncing }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Repositories', path: '/projects', icon: GitFork },
    { name: 'Issues', path: '/issues', icon: CircleDot },
    { name: 'Pull Requests', path: '/pull-requests', icon: GitPullRequest },
    { name: 'Activity', path: '/activity', icon: Activity },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[128px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[128px] pointer-events-none z-0" />

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 border-r border-white/10 bg-slate-900/40 backdrop-blur-xl flex-col fixed inset-y-0 left-0 z-30">
        {/* Brand Logo */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20 text-sm">
            RL
          </div>
          <Link to="/dashboard" className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
            RepoLens
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase px-3 mb-2">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'text-white bg-white/10 border border-white/10 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <div className="pt-4 pb-2">
            <div className="h-[1px] bg-white/5 mx-3 mb-4" />
            <div className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase px-3 mb-2">
              Intelligence
            </div>
            
            <div className="px-3 py-2.5 rounded-xl border border-purple-500/20 bg-purple-950/20 text-xs text-purple-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span className="font-medium">AI Insights</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300">
                Soon
              </span>
            </div>
          </div>
        </div>

        {/* Bottom User Area */}
        <div className="p-3 border-t border-white/5 bg-slate-950/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center font-medium text-xs text-purple-300 shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-medium text-white truncate">{user?.name || 'Developer'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email || ''}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-white/10 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      RL
                    </div>
                    <span className="font-semibold text-white">RepoLens</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
                          location.pathname === item.path
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 z-10">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/10 bg-slate-900/30 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-white/5 border border-white/10"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-white hidden sm:inline-block">Dashboard</span>
          </div>

          {/* Search and Action Tools */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repositories, issues..."
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </form>

            <button
              onClick={onSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-all active:scale-95 disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync GitHub</span>
            </button>

            <Link
              to="/notifications"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all shrink-0 relative"
            >
              <Bell className="w-4 h-4" />
            </Link>

            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-semibold text-purple-300 shrink-0">
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}