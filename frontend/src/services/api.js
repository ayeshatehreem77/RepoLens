// Dynamic Base URL: reads VITE_API_URL from .env or defaults to relative '/api'
const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

/**
 * Core API Request Wrapper
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('repolens_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let response;

  try {
    response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
      ...options,
      headers,
    });
  } catch (netErr) {
    throw new Error('Network error: Unable to connect to the RepoLens server.');
  }

  // Handle 401 Unauthorized specifically for expired JWT tokens
  if (response.status === 401) {
    localStorage.removeItem('repolens_token');
    localStorage.removeItem('repolens_user');
    
    // Only redirect if not already on login or register
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      window.location.href = '/login?expired=true';
    }
    throw new Error('Session expired. Please log in again.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    const err = new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
    err.status = response.status;
    throw err;
  }

  return data;
}

/**
 * Centralized GitHub Service
 */
export const githubService = {
  // Connected GitHub User Profile
  getGithubUser: () => apiRequest('/github/user'),

  // Repositories
  getRepositories: () => apiRequest('/projects'),
  syncGithub: () => apiRequest('/projects/sync', { method: 'POST' }),
  getRepositoryDetails: (owner, repo) => apiRequest(`/projects/${owner}/${repo}`),
  getReadme: (owner, repo) => apiRequest(`/projects/${owner}/${repo}/readme`),
  getBranches: (owner, repo) => apiRequest(`/projects/${owner}/${repo}/branches`),
  getCommits: (owner, repo) => apiRequest(`/projects/${owner}/${repo}/commits`),

  // Issues & Pull Requests
  getIssues: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/issues${query ? `?${query}` : ''}`);
  },
  getPullRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/pull-requests${query ? `?${query}` : ''}`);
  },

  // Activity Feed
  getActivity: () => apiRequest('/activity'),
};