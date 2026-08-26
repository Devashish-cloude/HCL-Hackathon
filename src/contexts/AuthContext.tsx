import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/index.js';
import { authService } from '../services/authService.js';
import { useTheme } from './ThemeContext.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; name: string; targetRole?: string; experienceLevel?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserPreferences: (preferences: Partial<User>) => Promise<void>;
  updateUserProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('learnpath_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setTheme } = useTheme();

  const loadCurrentUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        if (res.user.theme === 'dark' || res.user.theme === 'light') {
          setTheme(res.user.theme as 'dark' | 'light', false);
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('learnpath_token');
      }
    } catch (err) {
      console.warn('Could not restore user session:', err);
      // Fallback demo user state if running standalone
      setUser({
        id: 'devashish-demo',
        email: 'devashish@learnpath.ai',
        name: 'Devashish',
        role: 'STUDENT',
        headline: 'Professional Learner',
        targetRole: 'Frontend Engineer',
        experienceLevel: 'Intermediate',
        theme: 'light',
        learningStreak: 14,
        totalHoursInvested: 38.0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res.success) {
        localStorage.setItem('learnpath_token', res.token);
        setToken(res.token);
        setUser(res.user);
        if (res.user.theme === 'dark' || res.user.theme === 'light') {
          setTheme(res.user.theme as 'dark' | 'light', false);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; name: string; targetRole?: string; experienceLevel?: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      if (res.success) {
        localStorage.setItem('learnpath_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('learnpath_token');
      setToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await loadCurrentUser();
  };

  const updateUserPreferences = async (preferences: Partial<User>) => {
    try {
      const res = await authService.updatePreferences(preferences);
      if (res.success && user) {
        setUser({ ...user, ...res.preferences });
        if (preferences.theme === 'dark' || preferences.theme === 'light') {
          setTheme(preferences.theme as 'dark' | 'light', false);
        }
      }
    } catch (err) {
      console.error('Failed to update preferences:', err);
    }
  };

  const updateUserProfile = async (profileData: Partial<User>) => {
    try {
      const res = await authService.updateProfile(profileData);
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateUserPreferences,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
