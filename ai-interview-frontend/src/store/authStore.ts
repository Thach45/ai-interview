import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../features/auth/types';

// Helper to set/remove cookie for middleware
const setTokenCookie = (token: string | null) => {
  if (typeof document === 'undefined') return;
  if (token) {
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  } else {
    document.cookie = 'token=; path=/; max-age=0';
  }
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        setTokenCookie(token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        setTokenCookie(null);
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
