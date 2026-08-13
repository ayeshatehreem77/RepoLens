import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  RefreshCw, 
  Star, 
  GitFork, 
  CircleDot, 
  Lock, 
  Globe, 
  AlertCircle, 
  FolderGit2 
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import { githubService } from '../../services/api';

export default function ProjectsPage() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('ALL');

  // Fix: Sync button calls GET /github/repos directly
  const fetchRepositories = async (isSync = false) => {
    if (isSync) setSyncing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await githubService.getRepositories();
      setRepositories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch repositories.');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const languages = ['ALL', ...new Set(repositories.map((r) => r.language).filter(Boolean))];

  const filteredRepositories = repositories.filter((repo) => {
    const matchesSearch =
      repo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = languageFilter === 'ALL' || repo.language === languageFilter;
    return matchesSearch && matchesLang;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-6 h-6 text-purple-400" />
              Repositories
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live GitHub repository data from endpoint GET /github/repos
            </p>
          </div>

          <button
            onClick={() => fetchRepositories(true)}
            disabled={loading || syncing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl transition-all shadow-lg shadow-purple-950/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Refreshing...' : 'Sync GitHub'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 transition-colors"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang} className="bg-slate-900 text-white">
                {lang === 'ALL' ? 'All Languages' : lang}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 animate-pulse space-y-3">
                <div className="h-4 bg-slate-800 rounded w-1/2" />
                <div className="h-3 bg-slate-800/60 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchRepositories()}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredRepositories.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-white/5 space-y-2">
            <p className="text-sm text-slate-300 font-medium">No repositories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRepositories.map((repo) => (
              <Link
                key={repo.id}
                to={`/repositories/${repo.owner?.login || repo.owner}/${repo.name}`}
                className="p-5 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-purple-500/40 hover:bg-slate-900/80 transition-all group space-y-3 block"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors truncate">
                    {repo.name}
                  </h3>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-400 flex items-center gap-1">
                    {repo.private ? <Lock className="w-2.5 h-2.5 text-amber-400" /> : <Globe className="w-2.5 h-2.5 text-slate-400" />}
                    {repo.private ? 'Private' : 'Public'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 h-8">
                  {repo.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <span className="flex items-center gap-1 text-slate-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-400" /> {repo.stargazers_count ?? 0}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <GitFork className="w-3 h-3 text-indigo-400" /> {repo.forks_count ?? 0}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <CircleDot className="w-3 h-3 text-purple-400" /> {repo.open_issues_count ?? 0}
                    </span>
                  </div>

                  {repo.updated_at && (
                    <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}