import React, { createContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  phone?: string;
  role?: string;
  createdAt?: string;
  creditsBalance?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('auth_token');
    if (stored) {
      setToken(stored);
      fetchCurrentUser(stored);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchCurrentUser(tk: string) {
    try {
      const res = await fetch('/api/v1/profile', {
        headers: { Authorization: `Bearer ${tk}` },
      });
      if (res.ok) {
        const { user } = await res.json();
        setUser(user);
      } else {
        localStorage.removeItem('auth_token');
        setToken(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.message || json.error || 'Login failed');
    }
    const json = await res.json();
    const { accessToken, data } = json;
    localStorage.setItem('auth_token', accessToken);
    setToken(accessToken);
    setUser(data);
  }

  async function register(email: string, password: string, fullName: string) {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.message || json.error || 'Registration failed');
    }
    const json = await res.json();
    // After registration, you may want to auto-login or redirect to login page
    // For now, just show success message
  }

  function logout() {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  }

  async function refreshUser() {
    if (token) {
      await fetchCurrentUser(token);
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
