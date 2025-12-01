export type ChecklistStatus = 'C' | 'N.C' | 'N.A' | null;

export interface ChecklistItem {
  id: string;
  name: string;
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
}
