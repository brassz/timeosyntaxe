import api from './api';
import { Appointment, CreateAppointmentData, AvailableSlots } from '../types';

export const appointmentsService = {
  async getAppointments(): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>('/appointments');
    return response.data;
  },

  async getAppointment(id: string): Promise<Appointment> {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  async createAppointment(data: CreateAppointmentData): Promise<{ message: string; appointment: Appointment }> {
    const response = await api.post<{ message: string; appointment: Appointment }>('/appointments', data);
    return response.data;
  },

  async updateAppointmentStatus(id: string, status: string): Promise<{ message: string; appointment: Appointment }> {
    const response = await api.put<{ message: string; appointment: Appointment }>(`/appointments/${id}/status`, { status });
    return response.data;
  },

  async cancelAppointment(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/appointments/${id}`);
    return response.data;
  },

  async getAvailableSlots(serviceId: string, date: string): Promise<AvailableSlots> {
    const response = await api.get<AvailableSlots>(`/availability/slots/${serviceId}?date=${date}`);
    return response.data;
  },
};