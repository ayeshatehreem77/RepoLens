import React, { useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import { activityService } from '../../services/api';
import { 
  Activity, 
  GitPullRequest, 
  CircleDot, 
  GitCommit, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Search
} from 'lucide-react';

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredActivities(activities);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredActivities(
        activities.filter(
          (act) =>
            act.title?.toLowerCase().includes(term) ||
            act.details?.toLowerCase().includes(term) ||
            act.project?.name?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, activities]);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await activityService.getUserActivities();
      // Supports array directly or pagination object { data: [...] }
      const list = Array.isArray(res) ? res : res?.data || [];
      setActivities(list);
      setFilteredActivities(list);
    } catch (err) {
      setError(err.message || 'Unable to fetch recent workspace activity.');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const lowerType = (type || '').toLowerCase();
    if (lowerType.includes('pr') || lowerType.includes('pull')) {
      return <GitPullRequest className="w-4 h-4 text-purple-400" />;
    }
    if (lowerType.includes('issue')) {
      return <CircleDot className="w-4 h-4 text-emerald-400" />;
    }
    if (lowerType.includes('commit')) {
      return <GitCommit className="w-4 h-4 text-blue-400" />;
    }
    return <Activity className="w-4 h-4 text-slate-400" />;
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-400" />
              Activity Log
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              View and track real-time events across your connected GitHub repositories.
            </p>
          </div>
          <button
            onClick={fetchActivities}
            disabled={loading}
            className="self-start sm:self-auto px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Feed
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activities by keyword or repository..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 transition placeholder:text-slate-500"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-slate-400 text-xs gap-3">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            Fetching activity logs...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredActivities.length === 0 && (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <Activity className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-300 font-medium">No activity records found</p>
            <p className="text-xs text-slate-500 mt-1">
              {searchTerm ? 'Try adjusting your search filter.' : 'Actions like PR merges, issues, and syncs will appear here automatically.'}
            </p>
          </div>
        )}

        {/* Activity Feed List */}
        {!loading && !error && filteredActivities.length > 0 && (
          <div className="space-y-3">
            {filteredActivities.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-start justify-between hover:border-slate-700/80 transition"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/50 mt-0.5 flex-shrink-0">
                    {getActivityIcon(item.type)}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-100">{item.title}</h2>
                    {item.details && (
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.details}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11px] text-slate-500">
                      {item.project && (
                        <span className="px-2 py-0.5 bg-purple-950/60 border border-purple-800/40 text-purple-300 rounded-md font-medium">
                          {item.project.name || item.project.fullName}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}