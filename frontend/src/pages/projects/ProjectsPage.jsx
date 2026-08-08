import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GitFork,
  Search,
  RefreshCw,
  Star,
  CircleDot,
  GitPullRequest,
  ArrowRight,
  AlertCircle,
  Clock,
  Filter,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import { apiRequest } from '../../services/api';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter state synced with URL parameter if present
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'public' | 'private' | 'updated'

  const fetchRepositories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/projects');
      setRepos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load repository data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  // Update query state if search param in URL changes
  useEffect(() => {
    const queryFromUrl = searchParams.get('search');
    if (queryFromUrl !== null) {
      setSearchQuery(queryFromUrl);
    }
  }, [searchParams]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await apiRequest('/projects/sync', { method: 'POST' }).catch(() => {});
      await fetchRepositories();
    } catch {
      // Sync errors handled silently or through reload
    } finally {
      setSyncing(false);
    }
  };

  // Filter & Search Logic
  const filteredRepos = useMemo(() => {
    return repos
      .filter((repo) => {
        // Text Search
        const nameMatch = repo.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const ownerMatch = (repo.fullName || repo.owner?.login || repo.owner || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const langMatch = repo.language?.toLowerCase().includes(searchQuery.toLowerCase());

        if (searchQuery && !nameMatch && !ownerMatch && !langMatch) {
          return false;
        }

        // Filter Tabs
        if (activeFilter === 'public') return !repo.private;
        if (activeFilter === 'private') return repo.private;

        return true;
      })
      .sort((a, b) => {
        if (activeFilter === 'updated') {
          return new Date(b.updatedAt || b.pushedAt || 0) - new Date(a.updatedAt || a.pushedAt || 0);
        }
        return 0;
      });
  }, [repos, searchQuery, activeFilter]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AppLayout onSync={handleSync} isSyncing={syncing}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <GitFork className="w-6 h-6 text-purple-400" /> Repositories
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore and manage your connected GitHub repositories.
            </p>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync GitHub'}</span>
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchParams(e.target.value ? { search: e.target.value } : {});
              }}
              placeholder="Search repositories..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 border border-white/10 rounded-xl overflow-x-auto shrink-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'public', label: 'Public' },
              { id: 'private', label: 'Private' },
              { id: 'updated', label: 'Recently Updated' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={fetchRepositories} className="underline hover:text-red-300 font-medium">
              Retry
            </button>
          </div>
        )}

        {/* Repositories Grid / List */}
        {loading ? (
          /* Skeleton Loader Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 animate-pulse space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-slate-800 rounded w-1/2" />
                  <div className="h-4 bg-slate-800/60 rounded w-12" />
                </div>
                <div className="h-3 bg-slate-800/60 rounded w-3/4" />
                <div className="h-8 bg-slate-800/40 rounded w-full mt-4" />
              </div>
            ))}
          </div>
        ) : filteredRepos.length === 0 ? (
          /* Empty State */
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-slate-900/30 border border-white/5 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No repositories found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchQuery
                ? `No repositories match "${searchQuery}". Try clearing your filters or search query.`
                : 'Connect or sync your GitHub repositories to start exploring your codebase.'}
            </p>
            <button
              onClick={handleSync}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all shadow-lg shadow-purple-600/20"
            >
              Sync GitHub
            </button>
          </div>
        ) : (
          /* Repository Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => {
              const ownerName = repo.owner?.login || repo.owner || 'developer';
              const fullRepoPath = `/repositories/${ownerName}/${repo.name}`;

              return (
                <motion.div
                  key={repo.id || repo._id}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  onClick={() => navigate(fullRepoPath)}
                  className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/80 border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer group flex flex-col justify-between shadow-lg relative overflow-hidden"
                >
                  <div>
                    {/* Header line: Title + Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <GitFork className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors truncate">
                          {repo.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Healthy
                      </span>
                    </div>

                    {/* Owner / Name */}
                    <p className="text-xs text-slate-400 font-mono mb-3 truncate">
                      {repo.fullName || `${ownerName}/${repo.name}`}
                    </p>

                    {/* Tags: Language + Public/Private */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-4">
                      {repo.language && (
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                          {repo.language}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1">
                        {repo.private ? <Lock className="w-3 h-3 text-amber-400" /> : <Globe className="w-3 h-3 text-slate-400" />}
                        {repo.private ? 'Private' : 'Public'}
                      </span>
                    </div>
                  </div>

                  {/* Footer metadata */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="flex items-center gap-1" title="Stars">
                        <Star className="w-3 h-3 text-amber-400" /> {repo.stargazersCount || repo.stars || 0}
                      </span>
                      <span className="flex items-center gap-1" title="Forks">
                        <GitFork className="w-3 h-3 text-indigo-400" /> {repo.forksCount || repo.forks || 0}
                      </span>
                      <span className="flex items-center gap-1" title="Open Issues">
                        <CircleDot className="w-3 h-3 text-purple-400" /> {repo.openIssuesCount || 0}
                      </span>
                      <span className="flex items-center gap-1" title="Pull Requests">
                        <GitPullRequest className="w-3 h-3 text-blue-400" /> {repo.openPRsCount || 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(repo.updatedAt || repo.pushedAt)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all ml-1" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}