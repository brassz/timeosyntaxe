import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
// IMPORTANTE: Adicione suas credenciais do Supabase aqui
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interfaces para o banco de dados
export interface DBUser {
  id: number;
  username: string;
  password: string;
  name: string;
  created_at: string;
}

export interface DBChecklist {
  id: string;
  operator: string;
  machine: string;
  location: string;
  date: string;
  horimeter: string;
  mileage: string;
  tag: string;
  items: any;
  completed: boolean;
  created_at: string;
}

export interface DBOSI {
  id: number;
  order_number: number;
  date: string;
  time: string;
  vehicle: string;
  equipment: string;
  km_inicial: string;
  km_final: string;
  tag: string;
  horimeter: string;
  maintenance_type: {
    preditiva: boolean;
    preventiva: boolean;
    corretiva: boolean;
    avaria: boolean;
    oportunidade: boolean;
    outros: boolean;
  };
  services_description: string;
  parts_applied: string;
  observations: string;
  mechanic: string;
  responsible: string;
  created_at: string;
  created_by: string;
}

// Funções de autenticação (sem usar Supabase Auth)
export const loginUser = async (username: string, password: string): Promise<DBUser | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      console.error('Login error:', error);
      return null;
    }

    return data as DBUser;
  } catch (error) {
    console.error('Login exception:', error);
    return null;
  }
};

// Funções para Checklists
export const saveChecklistToDB = async (checklist: any) => {
  try {
    const { error } = await supabase
      .from('checklists')
      .insert([{
        id: checklist.id,
        operator: checklist.operator,
        machine: checklist.machine,
        location: checklist.location,
        date: checklist.date,
        horimeter: checklist.horimeter,
        mileage: checklist.mileage,
        tag: checklist.tag,
        items: checklist.items,
        completed: checklist.completed
      }]);

    if (error) {
      console.error('Error saving checklist:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception saving checklist:', error);
    return false;
  }
};

export const getChecklistsFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('checklists')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching checklists:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching checklists:', error);
    return [];
  }
};

export const deleteChecklistFromDB = async (id: string) => {
  try {
    const { error } = await supabase
      .from('checklists')
      .delete()
      .eq('id', id);

    return !error;
  } catch (error) {
    console.error('Exception deleting checklist:', error);
    return false;
  }
};

// Função para limpar checklists antigos (mais de 7 dias)
export const cleanOldChecklists = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { error } = await supabase
      .from('checklists')
      .delete()
      .lt('created_at', sevenDaysAgo.toISOString());

    if (error) {
      console.error('Error cleaning old checklists:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception cleaning old checklists:', error);
    return false;
  }
};

// Funções para OSI (Ordem de Serviço Interna)
export const getNextOrderNumber = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('osi_orders')
      .select('order_number')
      .order('order_number', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return 2200; // Número inicial baseado na imagem
    }

    return data[0].order_number + 1;
  } catch (error) {
    console.error('Exception getting next order number:', error);
    return 2200;
  }
};

export const saveOSI = async (osi: Omit<DBOSI, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('osi_orders')
      .insert([osi])
      .select();

    if (error) {
      console.error('Error saving OSI:', error);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Exception saving OSI:', error);
    return null;
  }
};

export const getOSIHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('osi_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching OSI history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching OSI history:', error);
    return [];
  }
};

export const getOSIById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('osi_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching OSI:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching OSI:', error);
    return null;
  }
};
