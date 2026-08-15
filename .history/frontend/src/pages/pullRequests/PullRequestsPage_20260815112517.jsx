import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitPullRequest,
  GitMerge,
  GitBranch,
  Search,
  MessageSquare,
  Clock,
  User,
  GitFork,
  X,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  FileCode2,
  ArrowRight
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import { apiRequest, githubService } from '../../services/api';

export default function PullRequestsPage() {
  const [pullRequests, setPullRequests] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('open'); // 'open' | 'merged' | 'closed' | 'all'
  const [selectedRepo, setSelectedRepo] = useState('all');
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'created'

  // Modal State
  const [selectedPR, setSelectedPR] = useState(null);

const fetchPRData = async () => {
  setLoading(true);
  setError(null);
  try {
    // 1. Fetch repositories and backend PRs simultaneously
    const [prsData, reposData] = await Promise.all([
      apiRequest('/pull-requests').catch(() => []),
      githubService.getRepositories().catch(() => []),
    ]);

    const rawRepos = Array.isArray(reposData) ? reposData : reposData?.data || [];
    let rawPRs = Array.isArray(prsData) ? prsData : prsData?.data || [];

    // 2. FALLBACK: If backend /pull-requests returns [], fetch live PRs directly for each repo
    if (rawPRs.length === 0 && rawRepos.length > 0) {
      const livePRPromises = rawRepos.map(async (repo) => {
        try {
          const owner = repo.owner?.login || repo.full_name?.split('/')[0];
          const repoName = repo.name;
          if (!owner || !repoName) return [];

          // Use your exported githubService helper!
          const livePrs = await githubService.getRepositoryPullRequests(owner, repoName).catch(() => []);
          const list = Array.isArray(livePrs) ? livePrs : livePrs?.data || [];

          return list.map((pr) => ({
            id: String(pr.id),
            number: pr.number,
            title: pr.title,
            body: pr.body || '',
            state: pr.state,
            merged: Boolean(pr.merged_at),
            author: pr.user?.login || 'Contributor',
            headBranch: pr.head?.ref || 'feature',
            baseBranch: pr.base?.ref || 'main',
            commentsCount: pr.comments || 0,
            createdAt: pr.created_at,
            updatedAt: pr.updated_at,
            repoName: repoName,
          }));
        } catch {
          return [];
        }
      });

      const nestedResults = await Promise.all(livePRPromises);
      rawPRs = nestedResults.flat();
    }

    setPullRequests(rawPRs);
    setRepos(rawRepos);
  } catch (err) {
    setError(err.message || 'Unable to load pull requests.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPRData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await apiRequest('/github/repos', { method: 'GET' }).catch(() => {});
      await fetchPRData();
    } catch {
      // Sync error handled quietly
    } finally {
      setSyncing(false);
    }
  };

  // Filter & Search Logic
  const filteredPRs = useMemo(() => {
    return pullRequests
      .filter((pr) => {
        // Search query filter
        const titleMatch = pr.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const numberMatch = pr.number?.toString().includes(searchQuery);
        const repoMatch = (pr.repoName || pr.repository?.name || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        if (searchQuery && !titleMatch && !numberMatch && !repoMatch) return false;

        // Status Filter
        const state = (pr.state || 'open').toLowerCase();
        const isMerged = pr.merged || state === 'merged';

        if (statusFilter === 'open' && (state !== 'open' || isMerged)) return false;
        if (statusFilter === 'merged' && !isMerged) return false;
        if (statusFilter === 'closed' && (state !== 'closed' || isMerged)) return false;

        // Repository Filter
        if (selectedRepo !== 'all') {
          const currentRepo = pr.repoName || pr.repository?.name;
          if (currentRepo !== selectedRepo) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'created') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
      });
  }, [pullRequests, searchQuery, statusFilter, selectedRepo, sortBy]);

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

  const getStatusBadge = (pr) => {
    const isMerged = pr.merged || pr.state === 'merged';
    const isOpen = pr.state === 'open' && !isMerged;

    if (isMerged) {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
          <GitMerge className="w-3 h-3 text-purple-400" /> Merged
        </span>
      );
    }

    if (isOpen) {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <GitPullRequest className="w-3 h-3 text-emerald-400" /> Open
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400">
        <X className="w-3 h-3 text-slate-400" /> Closed
      </span>
    );
  };

  return (
    <AppLayout onSync={handleSync} isSyncing={syncing}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <GitPullRequest className="w-6 h-6 text-purple-400" /> Pull Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review and track changes across your connected repositories.
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

        {/* Toolbar & Filter Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pull requests..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Pills */}
            <div className="flex items-center p-1 bg-slate-950/60 border border-white/10 rounded-xl">
              {[
                { id: 'open', label: 'Open' },
                { id: 'merged', label: 'Merged' },
                { id: 'closed', label: 'Closed' },
                { id: 'all', label: 'All' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    statusFilter === st.id
                      ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Repository Filter */}
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500/50"
            >
              <option value="all">All Repositories</option>
              {repos.map((r) => (
                <option key={r.id || r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500/50 ml-auto"
            >
              <option value="updated">Recently Updated</option>
              <option value="created">Recently Created</option>
            </select>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={fetchPRData} className="underline hover:text-red-300 font-medium">
              Retry
            </button>
          </div>
        )}

        {/* PR List View */}
        {loading ? (
          /* Skeleton Loading State */
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 animate-pulse space-y-2">
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-slate-800/60 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredPRs.length === 0 ? (
          /* Empty State */
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-slate-900/30 border border-white/5 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <GitPullRequest className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No pull requests found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              There are no pull requests matching your current filters.
            </p>
          </div>
        ) : (
          /* Pull Request Item Cards */
          <div className="space-y-3">
            {filteredPRs.map((pr) => {
              const repoName = pr.repoName || pr.repository?.name || 'repoLens';
              const authorName = pr.author?.login || pr.user?.login || pr.author || 'Contributor';
              const headBranch = pr.headBranch || pr.head?.ref || 'feature';
              const baseBranch = pr.baseBranch || pr.base?.ref || 'main';

              return (
                <motion.div
                  key={pr.id || pr.number}
                  whileHover={{ x: 2 }}
                  onClick={() => setSelectedPR(pr)}
                  className="p-4 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer flex items-start justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <GitPullRequest className="w-4 h-4 text-purple-400 shrink-0 mt-1" />

                    <div className="space-y-1.5 min-w-0">
                      {/* PR Title & Number */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors">
                          #{pr.number} {pr.title}
                        </span>
                      </div>

                      {/* Repository & Branches */}
                      <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                        <span className="text-slate-400 flex items-center gap-1">
                          <GitFork className="w-3 h-3 text-slate-500" /> {repoName}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1">
                          <GitBranch className="w-3 h-3 text-purple-400" /> {headBranch} <ArrowRight className="w-2.5 h-2.5 text-slate-500" /> {baseBranch}
                        </span>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                        <span>Opened by {authorName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatTimeAgo(pr.updatedAt || pr.createdAt)}
                        </span>
                        {(pr.commentsCount > 0 || pr.comments > 0) && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MessageSquare className="w-3 h-3" /> {pr.commentsCount || pr.comments} comments
                          </span>
                        )}
                        {pr.changedFiles && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <FileCode2 className="w-3 h-3" /> {pr.changedFiles} files
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">{getStatusBadge(pr)}</div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* PR Details Modal */}
      <AnimatePresence>
        {selectedPR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPR(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedPR(null)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <GitFork className="w-3.5 h-3.5 text-purple-400" />
                <span>{selectedPR.repoName || selectedPR.repository?.name || 'repoLens'}</span>
                <span>•</span>
                <span>#{selectedPR.number}</span>
              </div>

              <h2 className="text-lg font-bold text-white leading-snug">{selectedPR.title}</h2>

              <div className="flex items-center justify-between gap-3 text-xs border-y border-white/10 py-3">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedPR)}
                  <span className="text-slate-400">
                    by <strong className="text-slate-200">{selectedPR.author?.login || selectedPR.author || 'Developer'}</strong>
                  </span>
                </div>

                <div className="text-slate-500 font-mono text-[11px]">
                  {formatTimeAgo(selectedPR.createdAt)}
                </div>
              </div>

              {/* Branch Source/Target Info */}
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-between text-xs font-mono text-purple-300">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <span>{selectedPR.headBranch || selectedPR.head?.ref || 'feature-branch'}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400" />
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <span>{selectedPR.baseBranch || selectedPR.base?.ref || 'main'}</span>
                </div>
              </div>

              {/* Description Body */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Description</div>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {selectedPR.body || selectedPR.description || 'No description provided for this pull request.'}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}