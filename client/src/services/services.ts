import api from './api';
import { Service, CreateServiceData } from '../types';

export const servicesService = {
  async getServices(): Promise<Service[]> {
    const response = await api.get<Service[]>('/services');
    return response.data;
  },

  async getService(id: string): Promise<Service> {
    const response = await api.get<Service>(`/services/${id}`);
    return response.data;
  },

  async createService(data: CreateServiceData): Promise<{ message: string; service: Service }> {
    const response = await api.post<{ message: string; service: Service }>('/services', data);
    return response.data;
  },

  async updateService(id: string, data: Partial<CreateServiceData & { active: boolean }>): Promise<{ message: string; service: Service }> {
    const response = await api.put<{ message: string; service: Service }>(`/services/${id}`, data);
    return response.data;
  },

  async deleteService(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/services/${id}`);
    return response.data;
  },

  async getMyServices(): Promise<Service[]> {
    const response = await api.get<Service[]>('/services/my/services');
    return response.data;
  },
};