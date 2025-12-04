import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
// IMPORTANTE: Adicione suas credenciais do Supabase no arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Verificar se as credenciais foram configuradas
const isSupabaseConfigured = 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função auxiliar para verificar configuração
export const checkSupabaseConfig = (): boolean => {
  return isSupabaseConfigured;
};

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
  photos?: string[];
  created_at: string;
  created_by: string;
}

// Usuários de teste (quando Supabase não está configurado)
const mockUsers: DBUser[] = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Administrador', created_at: new Date().toISOString() },
  { id: 2, username: 'mecanico', password: 'mecanico123', name: 'João Silva', created_at: new Date().toISOString() },
  { id: 3, username: 'supervisor', password: 'supervisor123', name: 'Maria Santos', created_at: new Date().toISOString() }
];

// Funções de autenticação (sem usar Supabase Auth)
export const loginUser = async (username: string, password: string): Promise<DBUser | null> => {
  // Modo offline: usar usuários mockados
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase não configurado! Usando modo offline com usuários de teste.');
    const user = mockUsers.find(u => u.username === username && u.password === password);
    return user || null;
  }

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
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase não configurado! Checklist salvo apenas localmente.');
    return true; // Simula sucesso
  }

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
  if (!isSupabaseConfigured) {
    return []; // Retorna vazio no modo offline
  }

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
  if (!isSupabaseConfigured) {
    return true; // Simula sucesso
  }

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
  if (!isSupabaseConfigured) {
    return true; // Simula sucesso no modo offline
  }

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
let mockOrderNumber = 2200; // Contador offline
const mockOSIOrders: DBOSI[] = []; // Storage offline

export const getNextOrderNumber = async (): Promise<number> => {
  if (!isSupabaseConfigured) {
    return mockOrderNumber++;
  }

  try {
    const { data, error } = await supabase
      .from('osi_orders')
      .select('order_number')
      .order('order_number', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return 2200;
    }

    return data[0].order_number + 1;
  } catch (error) {
    console.error('Exception getting next order number:', error);
    return 2200;
  }
};

export const saveOSI = async (osi: Omit<DBOSI, 'id' | 'created_at'>) => {
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase não configurado! OSI salva apenas em memória (será perdida ao recarregar).');
    const mockOSI = {
      id: mockOSIOrders.length + 1,
      ...osi,
      created_at: new Date().toISOString()
    };
    mockOSIOrders.unshift(mockOSI);
    return mockOSI;
  }

  try {
    console.log('🔵 Tentando salvar OSI no Supabase:', osi);
    
    const { data, error } = await supabase
      .from('osi_orders')
      .insert([osi])
      .select();

    if (error) {
      console.error('❌ Error saving OSI:', error);
      console.error('Detalhes:', JSON.stringify(error, null, 2));
      return null;
    }

    console.log('✅ OSI salva com sucesso:', data[0]);
    return data[0];
  } catch (error) {
    console.error('❌ Exception saving OSI:', error);
    return null;
  }
};

export const getOSIHistory = async () => {
  if (!isSupabaseConfigured) {
    return mockOSIOrders; // Retorna dados offline
  }

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
  if (!isSupabaseConfigured) {
    return mockOSIOrders.find(o => o.id === id) || null;
  }

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
