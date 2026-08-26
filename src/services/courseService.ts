import api from './api.js';
import { Course } from '../types/index.js';

export const courseService = {
  async getCourses(params?: { category?: string; search?: string }): Promise<{ success: boolean; data: Course[] }> {
    const res = await api.get<{ success: boolean; data: Course[] }>('/courses', { params });
    return res.data;
  },

  async getCourseBySlug(slug: string): Promise<{ success: boolean; data: Course }> {
    const res = await api.get<{ success: boolean; data: Course }>(`/courses/${slug}`);
    return res.data;
  },

  async updateProgress(data: { moduleId: string; isCompleted: boolean }): Promise<{ success: boolean; data: any }> {
    const res = await api.post('/progress/lesson', data);
    return res.data;
  },
};
