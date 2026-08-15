import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CircleDot,
  CheckCircle2,
  Search,
  MessageSquare,
  Clock,
  User,
  GitFork,
  X,
  AlertCircle,
  Tag,
  RefreshCw
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import { apiRequest, githubService } from '../../services/api';

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('open'); // 'open' | 'closed' | 'all'
  const [selectedRepo, setSelectedRepo] = useState('all');
  const [selectedLabel, setSelectedLabel] = useState('all');
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'created' | 'comments'

  // Selected Issue State for Modal View
  const [selectedIssue, setSelectedIssue] = useState(null);

  const fetchIssuesData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch repos and database issues simultaneously
      const [issuesRes, reposRes] = await Promise.all([
        apiRequest('/issues').catch(() => []),
        githubService.getRepositories().catch(() => []),
      ]);

      const rawRepos = Array.isArray(reposRes)
        ? reposRes
        : reposRes?.data || [];

      let rawIssues = Array.isArray(issuesRes)
        ? issuesRes
        : issuesRes?.data || [];

      // 2. FALLBACK: If DB issues are empty, fetch live issues directly using repo details
      if (rawIssues.length === 0 && rawRepos.length > 0) {
        const liveIssuesPromises = rawRepos.map(async (repo) => {
          try {
            // Extracts owner and repo name (e.g. 'ayeshatehreem77' and 'RepoLens')
            const owner = repo.owner?.login || repo.full_name?.split('/')[0];
            const repoName = repo.name;

            if (!owner || !repoName) return [];

            const repoIssues = await apiRequest(
              `/github/repos/${owner}/${repoName}/issues`
            ).catch(() => []);

            const issueList = Array.isArray(repoIssues)
              ? repoIssues
              : repoIssues?.data || [];

            // Map GitHub REST issues into our component format
            return issueList
              .filter((iss) => !iss.pull_request) // Exclude PRs
              .map((iss) => ({
                id: String(iss.id),
                githubId: iss.id,
                number: iss.number,
                title: iss.title,
                body: iss.body || '',
                state: iss.state,
                author: iss.user?.login || 'Contributor',
                labels: iss.labels ? iss.labels.map((l) => (typeof l === 'string' ? l : l.name)) : [],
                commentsCount: iss.comments || 0,
                createdAt: iss.created_at,
                updatedAt: iss.updated_at,
                repoName: repoName,
                repository: {
                  id: repo.id,
                  name: repoName,
                  owner: owner,
                },
              }));
          } catch {
            return [];
          }
        });

        const nestedResults = await Promise.all(liveIssuesPromises);
        rawIssues = nestedResults.flat();
      }

      setIssues(rawIssues);
      setRepos(rawRepos);
    } catch (err) {
      console.error('Failed to load issues data:', err);
      setError(err.message || 'Unable to load issues data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuesData();
  }, []);

  // Extract all unique labels across fetched issues
  const availableLabels = useMemo(() => {
    const labelSet = new Set();
    issues.forEach((issue) => {
      if (Array.isArray(issue.labels)) {
        issue.labels.forEach((l) => {
          const name = typeof l === 'string' ? l : l.name;
          if (name) labelSet.add(name);
        });
      }
    });
    return Array.from(labelSet);
  }, [issues]);

  const filteredIssues = useMemo(() => {
    return issues
      .filter((issue) => {
        // 1. Text Search
        const titleMatch = issue.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const numberMatch = issue.number?.toString().includes(searchQuery);
        if (searchQuery && !titleMatch && !numberMatch) return false;

        // 2. Status Filter
        const isOpen = issue.state === 'open' || issue.isOpen !== false;
        if (statusFilter === 'open' && !isOpen) return false;
        if (statusFilter === 'closed' && isOpen) return false;

        // 3. Repository Filter (Loose Matching)
        if (selectedRepo !== 'all') {
          const issueRepoName = (
            issue.repoName ||
            issue.repository?.name ||
            issue.project?.name ||
            ''
          ).toLowerCase();

          const filterRepoName = selectedRepo.toLowerCase();

          // Check if repo name matches or partially matches
          if (
            issueRepoName &&
            !issueRepoName.includes(filterRepoName) &&
            !filterRepoName.includes(issueRepoName)
          ) {
            return false;
          }
        }

        // 4. Label Filter
        if (selectedLabel !== 'all') {
          const hasLabel = issue.labels?.some(
            (l) => (typeof l === 'string' ? l : l.name) === selectedLabel
          );
          if (!hasLabel) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'created') {
          return new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0);
        }
        return new Date(b.updatedAt || b.updated_at || b.createdAt || 0) - new Date(a.updatedAt || a.updated_at || a.createdAt || 0);
      });
  }, [issues, searchQuery, statusFilter, selectedRepo, selectedLabel, sortBy]);

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
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="pb-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <CircleDot className="w-6 h-6 text-purple-400" /> Issues
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track and understand issues across your connected repositories.
            </p>
          </div>
          <button
            onClick={fetchIssuesData}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issues..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Pills */}
            <div className="flex items-center p-1 bg-slate-950/60 border border-white/10 rounded-xl">
              {[
                { id: 'open', label: 'Open' },
                { id: 'closed', label: 'Closed' },
                { id: 'all', label: 'All' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${statusFilter === st.id
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

            {/* Label Filter */}
            {availableLabels.length > 0 && (
              <select
                value={selectedLabel}
                onChange={(e) => setSelectedLabel(e.target.value)}
                className="bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500/50"
              >
                <option value="all">All Labels</option>
                {availableLabels.map((lbl) => (
                  <option key={lbl} value={lbl}>
                    {lbl}
                  </option>
                ))}
              </select>
            )}

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500/50 sm:ml-auto"
            >
              <option value="updated">Recently Updated</option>
              <option value="created">Recently Created</option>
              <option value="comments">Most Commented</option>
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
            <button onClick={fetchIssuesData} className="underline hover:text-red-300 font-medium">
              Retry
            </button>
          </div>
        )}

        {/* Issue List View */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 animate-pulse space-y-2">
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-slate-800/60 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-slate-900/30 border border-white/5 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <CircleDot className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No issues found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Your repositories don't have any issues matching these filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIssues.map((issue) => {
              const isOpen = issue.state === 'open' || issue.isOpen !== false;
              const repoName = issue.repoName || issue.repository?.name || issue.repo || 'Repository';
              const authorName = issue.author?.login || issue.user?.login || issue.author || 'Contributor';

              return (
                <motion.div
                  key={issue.id || issue.number}
                  whileHover={{ x: 2 }}
                  onClick={() => setSelectedIssue(issue)}
                  className="p-4 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer flex items-start justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {isOpen ? (
                      <CircleDot className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    )}

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors">
                          #{issue.number} {issue.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-[11px]">
                        <span className="font-mono text-slate-400 flex items-center gap-1">
                          <GitFork className="w-3 h-3 text-slate-500" /> {repoName}
                        </span>

                        {Array.isArray(issue.labels) &&
                          issue.labels.map((lbl, idx) => {
                            const name = typeof lbl === 'string' ? lbl : lbl.name;
                            return (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium text-[10px]"
                              >
                                {name}
                              </span>
                            );
                          })}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                        <span>Opened by {authorName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatTimeAgo(issue.createdAt || issue.created_at || issue.updatedAt)}
                        </span>
                        {(issue.commentsCount > 0 || issue.comments > 0) && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MessageSquare className="w-3 h-3" /> {issue.commentsCount || issue.comments} comments
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border shrink-0 ${isOpen
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                      }`}
                  >
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Issue Details Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIssue(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedIssue(null)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <GitFork className="w-3.5 h-3.5 text-purple-400" />
                <span>{selectedIssue.repoName || selectedIssue.repository?.name || selectedIssue.repo || 'Repository'}</span>
                <span>•</span>
                <span>#{selectedIssue.number}</span>
              </div>

              <h2 className="text-lg font-bold text-white leading-snug">{selectedIssue.title}</h2>

              <div className="flex items-center gap-3 text-xs border-y border-white/10 py-3">
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${selectedIssue.state === 'open' || selectedIssue.isOpen !== false
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                    }`}
                >
                  {selectedIssue.state === 'open' || selectedIssue.isOpen !== false ? 'Open' : 'Closed'}
                </span>

                <span className="text-slate-400">
                  Opened by{' '}
                  <strong className="text-slate-200">
                    {selectedIssue.author?.login || selectedIssue.user?.login || selectedIssue.author || 'Developer'}
                  </strong>
                </span>

                <span className="text-slate-500 font-mono text-[11px] ml-auto">
                  {formatTimeAgo(selectedIssue.createdAt || selectedIssue.created_at)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Description</div>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {selectedIssue.body || selectedIssue.description || 'No description provided for this issue.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
                {Array.isArray(selectedIssue.labels) && selectedIssue.labels.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {selectedIssue.labels.map((lbl, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-[10px]"
                        >
                          {typeof lbl === 'string' ? lbl : lbl.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedIssue.assignee && (
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>Assignee: {selectedIssue.assignee.login || selectedIssue.assignee}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}