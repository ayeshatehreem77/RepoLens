const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

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
  } catch (err) {
    throw new Error('Network error: Unable to reach RepoLens API.');
  }

  if (response.status === 401) {
    localStorage.removeItem('repolens_token');
    localStorage.removeItem('repolens_user');
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login?expired=true';
    }
    throw new Error('Session expired. Please log in again.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const err = new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
    err.status = response.status;
    throw err;
  }

  return data;
}

export const githubService = {
  // GET /github/me
  getAuthenticatedUser: () => apiRequest('/github/me'),

  // GET /github/repos
  getRepositories: () => apiRequest('/github/repos'),

  // GET /github/repos/:owner/:repo
  getRepository: (owner, repo) => apiRequest(`/github/repos/${owner}/${repo}`),

  // GET /github/repos/:owner/:repo/issues
  getRepositoryIssues: (owner, repo) => apiRequest(`/github/repos/${owner}/${repo}/issues`),

  // GET /github/repos/:owner/:repo/pulls
  getRepositoryPullRequests: (owner, repo) => apiRequest(`/github/repos/${owner}/${repo}/pulls`),

  // GET /github/repos/:owner/:repo/commits
  getRepositoryCommits: (owner, repo) => apiRequest(`/github/repos/${owner}/${repo}/commits`),
};

export const activityService = {
  // GET /activity?page=1&limit=20
  getUserActivities: (page = 1, limit = 20) =>
    apiRequest(`/activity?page=${page}&limit=${limit}`),

  // GET /activity/project/:projectId
  getProjectActivities: (projectId) =>
    apiRequest(`/activity/project/${projectId}`),

  // POST /activity
  createActivity: (activityData) =>
    apiRequest('/activity', {
      method: 'POST',
      body: JSON.stringify(activityData),
    }),

  // DELETE /activity/:id
  deleteActivity: (id) =>
    apiRequest(`/activity/${id}`, {
      method: 'DELETE',
    }),
};