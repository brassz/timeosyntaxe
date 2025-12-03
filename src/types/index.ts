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
}

// ============ OSI Types ============

export interface Usuario {
  id: string;
  usuario: string;
  senha: string;
  nome: string;
  cargo: string;
}

export interface OSIOrdem {
  id?: string;
  numero_os?: number;
  data: string;
  hora: string;
  veiculo: string;
  equipamento: string;
  km_inicial: string;
  km_final: string;
  tag: string;
  horimetro: string;
  manut_preditiva: boolean;
  manut_preventiva: boolean;
  manut_corretiva: boolean;
  manut_avaria: boolean;
  manut_oportunidade: boolean;
  manut_outros: boolean;
  descricao_servicos: string;
  pecas_aplicadas: string;
  observacoes: string;
  mecanico: string;
  responsavel: string;
  pdf_url?: string;
  excel_url?: string;
  criado_em?: string;
}
