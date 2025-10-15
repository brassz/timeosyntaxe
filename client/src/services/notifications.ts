import api from './api';
import { Notification, PaginatedResponse } from '../types';

export const notificationsService = {
  async getNotifications(params?: { page?: number; limit?: number; unreadOnly?: boolean }): Promise<PaginatedResponse<Notification> & { unreadCount: number }> {
    const response = await api.get<PaginatedResponse<Notification> & { unreadCount: number }>('/notifications', { params });
    return response.data;
  },

  async markAsRead(id: string): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead(): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/notifications/read-all');
    return response.data;
  },

  async deleteNotification(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/notifications/${id}`);
    return response.data;
  },
};