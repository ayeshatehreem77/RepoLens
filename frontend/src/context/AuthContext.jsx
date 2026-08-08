import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, githubService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('repolens_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [githubUser, setGithubUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('repolens_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await apiRequest('/auth/me').catch(() => null);
        if (userData) {
          setUser(userData);
          localStorage.setItem('repolens_user', JSON.stringify(userData));
        }

        const ghProfile = await githubService.getGithubUser().catch(() => null);
        if (ghProfile) {
          setGithubUser(ghProfile);
        }
      } catch (err) {
        localStorage.removeItem('repolens_token');
        localStorage.removeItem('repolens_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.accessToken || data.token) {
      const token = data.accessToken || data.token;
      localStorage.setItem('repolens_token', token);
      setUser(data.user);
      localStorage.setItem('repolens_user', JSON.stringify(data.user));

      githubService.getGithubUser().then(setGithubUser).catch(() => {});
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('repolens_token');
    localStorage.removeItem('repolens_user');
    setUser(null);
    setGithubUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, githubUser, loading, login, logout, setGithubUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);