export type ChecklistStatus = 'C' | 'N.C' | 'N.A' | null;

export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  status: ChecklistStatus;
  observation: string;
  photos: string[]; // Array de photo IDs do IndexedDB
}

export interface ChecklistData {
  id: string;
  operator: string;
  machine: string;
  location: string;
  date: string;
  horimeter: string;
  mileage: string;
  tag: string;
  items: ChecklistItem[];
  completed: boolean;
}

export interface Photo {
  id: string;
  checklistId: string;
  itemId: string;
  data: string; // base64
  timestamp: number;
  url?: string; // URL no Supabase Storage
}

// Tipos para OSI (Ordem de Serviço Interna)
export interface MaintenanceType {
  preditiva: boolean;
  preventiva: boolean;
  corretiva: boolean;
  avaria: boolean;
  oportunidade: boolean;
  outros: boolean;
}

export interface OSIData {
  id?: number;
  order_number: number;
  date: string;
  time: string;
  vehicle: string;
  equipment: string;
  km_inicial: string;
  km_final: string;
  tag: string;
  horimeter: string;
  maintenance_type: MaintenanceType;
  services_description: string;
  parts_applied: string;
  observations: string;
  mechanic: string;
  responsible: string;
  photos?: string[]; // Array de fotos em base64
  created_at?: string;
  created_by: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  created_at: string;
}
