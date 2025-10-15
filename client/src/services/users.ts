import api from './api';
import { User, UpdateProfileData, ChangePasswordData, PaginatedResponse } from '../types';

export const usersService = {
  async getUsers(params?: { role?: string; search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },

  async getUser(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<{ message: string; user: User }> {
    const response = await api.put<{ message: string; user: User }>('/users/profile', data);
    return response.data;
  },

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/users/password', data);
    return response.data;
  },

  async updateUser(id: string, data: Partial<User>): Promise<{ message: string; user: User }> {
    const response = await api.put<{ message: string; user: User }>(`/users/${id}`, data);
    return response.data;
  },

  async getProviders(): Promise<User[]> {
    const response = await api.get<User[]>('/users/providers/list');
    return response.data;
  },
};