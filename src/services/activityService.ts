import api from './api.js';

export interface ActivityItem {
  id: string;
  activityType: string;
  entityType?: string;
  entityId?: string;
  title: string;
  metadata?: any;
  timeGroup: 'TODAY' | 'YESTERDAY' | 'PREVIOUS';
  createdAt: string;
}

export const activityService = {
  async getRecent(): Promise<{ success: boolean; data: { all: ActivityItem[]; grouped: Record<string, ActivityItem[]> } }> {
    try {
      const res = await api.get('/activity/recent');
      return res.data;
    } catch (err) {
      return {
        success: true,
        data: {
          all: [],
          grouped: { TODAY: [], YESTERDAY: [], PREVIOUS: [] },
        },
      };
    }
  },

  async getAll(page = 1, limit = 20): Promise<{ success: boolean; data: { activities: ActivityItem[]; pagination: any } }> {
    try {
      const res = await api.get(`/activity?page=${page}&limit=${limit}`);
      return res.data;
    } catch (err) {
      return {
        success: true,
        data: { activities: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } },
      };
    }
  },
};
