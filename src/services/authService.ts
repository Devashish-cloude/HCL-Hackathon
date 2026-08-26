import api from './api.js';
import { User } from '../types/index.js';

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const authService = {
  async register(data: { email: string; password: string; name: string; targetRole?: string; experienceLevel?: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    const res = await api.post('/auth/logout');
    return res.data;
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updatePreferences(preferences: Partial<User>): Promise<{ success: boolean; preferences: any }> {
    const res = await api.put('/users/preferences', preferences);
    return res.data;
  },

  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; user: User }> {
    const res = await api.put('/users/profile', profileData);
    return res.data;
  },
};
