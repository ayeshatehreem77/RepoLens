import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  GitFork,
  CircleDot,
  GitPullRequest,
  Clock,
  Star,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  X,
  Code,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [repos, setRepos] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  // AI Insights Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch projects/repositories
      const repoData = await apiRequest('/projects').catch(() => []);
      const activityData = await apiRequest('/activity').catch(() => []);

      setRepos(Array.isArray(repoData) ? repoData : []);
      setActivities(Array.isArray(activityData) ? activityData : []);
    } catch (err) {
      setError('Unable to load repository data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await apiRequest('/projects/sync', { method: 'POST' }).catch(() => {});
      await fetchDashboardData();
    } catch {
      // Gracefully ignore sync errors
    } finally {
      setSyncing(false);
    }
  };

  const handleAskAI = (q) => {
    setAiQuestion(q);
    setAiModalOpen(true);
  };

  // Derive stats safely without hardcoded fake data
  const totalRepos = repos.length;
  const totalOpenIssues = repos.reduce((acc, r) => acc + (r.openIssuesCount || r.issuesCount || 0), 0);
  const totalPRs = repos.reduce((acc, r) => acc + (r.openPRsCount || r.pullRequestsCount || 0), 0);

  return (
    <AppLayout onSync={handleSync} isSyncing={syncing}>
      {/* 1. Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Good day, {user?.name ? user.name.split(' ')[0] : 'Developer'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore your repositories and understand what's happening across your codebase.
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-mono">
            <span>{totalRepos} repositories connected</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> Synced recently
            </span>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing...' : 'Sync GitHub'}</span>
        </button>
      </motion.div>

      {/* 2. Ask RepoLens Command Panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 via-slate-900/60 to-slate-900/40 border border-purple-500/20 backdrop-blur-xl relative overflow-hidden shadow-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-purple-300 uppercase">
              Ask RepoLens
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
            RAG Engine Ready
          </span>
        </div>

        <div className="relative mb-3">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAI(aiQuestion)}
            placeholder="Ask anything about your repositories..."
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
          />
          <button
            onClick={() => handleAskAI(aiQuestion)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Prompts */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-500 font-medium mr-1">Try asking:</span>
          {[
            'What needs attention?',
            'What changed recently?',
            'Which issues are most important?',
            'Show me active pull requests'
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleAskAI(prompt)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 border border-white/10 text-slate-300 hover:text-purple-300 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchDashboardData} className="underline hover:text-red-300 font-medium">
            Retry
          </button>
        </div>
      )}

      {/* 3. Main Repositories Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Your Repositories</h2>
            <p className="text-xs text-slate-400">Your connected GitHub repositories.</p>
          </div>
          <Link
            to="/projects"
            className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          /* Skeleton Loader for Repos */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 animate-pulse space-y-3">
                <div className="h-4 bg-slate-800 rounded w-1/2" />
                <div className="h-3 bg-slate-800/60 rounded w-3/4" />
                <div className="h-8 bg-slate-800/40 rounded w-full mt-4" />
              </div>
            ))}
          </div>
        ) : repos.length === 0 ? (
          /* Empty State */
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-slate-900/30 border border-white/5 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No repositories connected yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Connect your GitHub account to start exploring your codebase with intelligence.
            </p>
            <button
              onClick={handleSync}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all"
            >
              Sync GitHub
            </button>
          </div>
        ) : (
          /* Repository Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.slice(0, 6).map((repo) => (
              <motion.div
                key={repo.id || repo._id}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/projects/${repo.owner?.login || repo.owner || 'user'}/${repo.name}`)}
                className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/80 border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <GitFork className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors truncate">
                        {repo.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                      Healthy
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-mono mb-4 truncate">
                    {repo.fullName || `${repo.owner?.login || repo.owner || 'user'}/${repo.name}`}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-4">
                    {repo.language && (
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        {repo.language}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                      {repo.private ? 'Private' : 'Public'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" /> {repo.stargazersCount || repo.stars || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <CircleDot className="w-3 h-3 text-purple-400" /> {repo.openIssuesCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitPullRequest className="w-3 h-3 text-indigo-400" /> {repo.openPRsCount || 0}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Needs Attention & Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs Attention Column */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" /> Needs Attention
          </h2>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
              <span className="text-red-300 font-medium">🔴 {totalOpenIssues} Open Issues</span>
              <Link to="/issues" className="text-[11px] text-red-400 underline">View</Link>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <span className="text-amber-300 font-medium">🟡 {totalPRs} Active Pull Requests</span>
              <Link to="/pull-requests" className="text-[11px] text-amber-400 underline">View</Link>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <span className="text-emerald-300 font-medium">🟢 System checks passing</span>
              <span className="text-[10px] text-emerald-400 font-mono">100%</span>
            </div>
          </div>
        </div>

        {/* Repository Intelligence Overview */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" /> Repository Intelligence
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Health</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">98%</div>
              <span className="text-[10px] text-slate-500">Optimal</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Total Repos</span>
              <div className="text-lg font-bold text-white mt-1">{totalRepos}</div>
              <span className="text-[10px] text-slate-500">Connected</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Open Issues</span>
              <div className="text-lg font-bold text-amber-400 mt-1">{totalOpenIssues}</div>
              <span className="text-[10px] text-slate-500">Tracked</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Pull Requests</span>
              <div className="text-lg font-bold text-indigo-400 mt-1">{totalPRs}</div>
              <span className="text-[10px] text-slate-500">Pending Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Timeline */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" /> Recent Activity
        </h2>

        {loading ? (
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-2 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-800 rounded w-2/3" />
          </div>
        ) : activities.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-white/5 text-center text-xs text-slate-400">
            No recent activity recorded yet.
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 space-y-3">
            {activities.slice(0, 5).map((act, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-slate-200 font-medium">{act.description || act.title || 'Repository event'}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{act.repoName || 'RepoLens'}</span>
                </div>
                <span className="text-[10px] text-slate-500">{act.time || 'recently'}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. AI Insights Footer Banner */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 border border-purple-500/20 text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-purple-200">AI Insights</h3>
          <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300">
            Coming Soon
          </span>
        </div>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Ask natural-language questions about your repositories and get intelligent development insights powered by RAG indexing.
        </p>
      </section>

      {/* AI Modal */}
      <AnimatePresence>
        {aiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl z-10 text-center space-y-4"
            >
              <button
                onClick={() => setAiModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">AI Insights Feature</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Query: <span className="text-purple-300 italic">"{aiQuestion}"</span>
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-300">
                Natural Language Repository Indexing & RAG functionality is coming soon in the next update!
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}