export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
  avatar?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  active: boolean;
  providerId: string;
  provider: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  clientId: string;
  serviceId: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  service: Service;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'EMAIL' | 'SMS' | 'PUSH';
  read: boolean;
  sentAt?: string;
  userId: string;
  senderId?: string;
  sender?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  details?: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AvailableSlots {
  availableSlots: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'CLIENT' | 'PROVIDER';
}

export interface CreateAppointmentData {
  serviceId: string;
  date: string;
  notes?: string;
}

export interface CreateServiceData {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface CreateAvailabilityData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateProfileData {
  name: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}