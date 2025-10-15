import api from './api';
import { Availability, CreateAvailabilityData } from '../types';

export const availabilityService = {
  async getProviderAvailability(providerId: string): Promise<Availability[]> {
    const response = await api.get<Availability[]>(`/availability/provider/${providerId}`);
    return response.data;
  },

  async getMyAvailability(): Promise<Availability[]> {
    const response = await api.get<Availability[]>('/availability/my');
    return response.data;
  },

  async createAvailability(data: CreateAvailabilityData): Promise<{ message: string; availability: Availability }> {
    const response = await api.post<{ message: string; availability: Availability }>('/availability', data);
    return response.data;
  },

  async updateAvailability(id: string, data: Partial<CreateAvailabilityData & { active: boolean }>): Promise<{ message: string; availability: Availability }> {
    const response = await api.put<{ message: string; availability: Availability }>(`/availability/${id}`, data);
    return response.data;
  },

  async deleteAvailability(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/availability/${id}`);
    return response.data;
  },
};