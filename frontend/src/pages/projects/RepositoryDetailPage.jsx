import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  GitFork,
  Star,
  CircleDot,
  GitPullRequest,
  GitBranch,
  FileText,
  Clock,
  ArrowLeft,
  AlertCircle,
  Lock,
  Globe
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import { apiRequest } from '../../services/api';

export default function RepositoryDetailPage() {
  const { owner, repo } = useParams();

  const [repoDetails, setRepoDetails] = useState(null);
  const [readme, setReadme] = useState('');
  const [branches, setBranches] = useState([]);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [details, readmeData, branchList, commitList] = await Promise.all([
          githubService.getRepositoryDetails(owner, repo).catch(() => null),
          githubService.getReadme(owner, repo).catch(() => ''),
          githubService.getBranches(owner, repo).catch(() => []),
          githubService.getCommits(owner, repo).catch(() => []),
        ]);

        if (!details) {
          throw new Error('Repository details could not be retrieved.');
        }

        setRepoDetails(details);
        setReadme(typeof readmeData === 'string' ? readmeData : readmeData?.content || '');
        setBranches(Array.isArray(branchList) ? branchList : []);
        setCommits(Array.isArray(commitList) ? commitList : []);
      } catch (err) {
        setError(err.message || 'Error loading repository overview.');
      } finally {
        setLoading(false);
      }
    };

    if (owner && repo) {
      loadData();
    }
  }, [owner, repo]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Repositories
        </Link>

        {loading ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 animate-pulse space-y-4">
            <div className="h-6 bg-slate-800 rounded w-1/3" />
            <div className="h-4 bg-slate-800/60 rounded w-1/2" />
            <div className="h-32 bg-slate-800/30 rounded w-full mt-6" />
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Link to="/projects" className="underline font-medium">
              Return to list
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header info */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <GitFork className="w-6 h-6 text-purple-400" />
                    <span>{owner}</span> / <span className="text-purple-300">{repo}</span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    {repoDetails?.description || 'No description available for this repository.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-1">
                    {repoDetails?.private ? <Lock className="w-3 h-3 text-amber-400" /> : <Globe className="w-3 h-3 text-slate-400" />}
                    {repoDetails?.private ? 'Private' : 'Public'}
                  </span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" /> {repoDetails?.stargazersCount || 0} stars
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5 text-indigo-400" /> {repoDetails?.forksCount || 0} forks
                </span>
                <span className="flex items-center gap-1">
                  <CircleDot className="w-3.5 h-3.5 text-purple-400" /> {repoDetails?.openIssuesCount || 0} open issues
                </span>
              </div>
            </div>

            {/* Commits & Readme Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* README */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 border-b border-white/5 pb-3">
                    <FileText className="w-4 h-4 text-purple-400" /> README.md
                  </div>
                  <div className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
                    {readme || 'No README file found.'}
                  </div>
                </div>
              </div>

              {/* Branches & Commits */}
              <div className="space-y-6">
                {/* Branches */}
                {branches.length > 0 && (
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 space-y-3">
                    <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-purple-400" /> Branches ({branches.length})
                    </h3>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs font-mono">
                      {branches.map((b) => (
                        <div key={b.name} className="px-2.5 py-1.5 rounded-lg bg-slate-950/50 border border-white/5 text-slate-300">
                          {b.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commits */}
                {commits.length > 0 && (
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 space-y-3">
                    <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" /> Recent Commits
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                      {commits.map((c, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-950/50 border border-white/5 space-y-1">
                          <p className="text-white truncate font-medium">{c.commit?.message || c.message}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {c.commit?.author?.name || c.author}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}