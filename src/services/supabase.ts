import { createClient } from '@supabase/supabase-js';
import { saveOSILocal, getOSILocal, saveOSIPending, removeOSIPending } from './storage';

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
  // Verificar no localStorage primeiro
  const localOrders = getOSILocal();
  let maxLocalNumber = 0;
  if (localOrders.length > 0) {
    maxLocalNumber = Math.max(...localOrders.map((o: any) => o.order_number || 0));
  }

  if (!isSupabaseConfigured) {
    const nextNumber = Math.max(mockOrderNumber, maxLocalNumber + 1);
    mockOrderNumber = nextNumber + 1;
    return nextNumber;
  }

  try {
    const timeout = isMobileDevice() ? 8000 : 4000;
    const fetchPromise = supabase
      .from('osi_orders')
      .select('order_number')
      .order('order_number', { ascending: false })
      .limit(1);

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), timeout);
    });

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

    if (error || !data || data.length === 0) {
      const nextNumber = Math.max(2200, maxLocalNumber + 1);
      return nextNumber;
    }

    const maxSupabaseNumber = data[0].order_number || 0;
    const nextNumber = Math.max(maxSupabaseNumber, maxLocalNumber) + 1;
    return nextNumber;
  } catch (error) {
    console.error('Exception getting next order number:', error);
    console.warn('⚠️ Usando número baseado em localStorage');
    const nextNumber = Math.max(2200, maxLocalNumber + 1);
    return nextNumber;
  }
};

// Detectar se é dispositivo móvel
const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const saveOSI = async (osi: Omit<DBOSI, 'id' | 'created_at'>) => {
  // Sempre salvar no localStorage primeiro (backup imediato)
  const osiWithId = {
    id: Date.now(), // ID temporário
    ...osi,
    created_at: new Date().toISOString()
  };
  saveOSILocal(osiWithId);
  console.log('💾 OSI salva no localStorage como backup');

  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase não configurado! OSI salva apenas localmente.');
    return osiWithId as DBOSI;
  }

  // Tentar salvar no Supabase com timeout
  try {
    console.log('🔵 Tentando salvar OSI no Supabase:', osi);
    
    // Timeout de 10 segundos para mobile
    const timeout = isMobileDevice() ? 10000 : 5000;
    const savePromise = supabase
      .from('osi_orders')
      .insert([osi])
      .select();

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao salvar no Supabase')), timeout);
    });

    const { data, error } = await Promise.race([savePromise, timeoutPromise]) as any;

    if (error) {
      console.error('❌ Error saving OSI:', error);
      console.error('Detalhes:', JSON.stringify(error, null, 2));
      
      // Em caso de erro, marcar como pendente para sincronização posterior
      saveOSIPending(osi);
      console.warn('⚠️ OSI salva localmente e marcada para sincronização posterior');
      
      // Retornar a versão local
      return osiWithId as DBOSI;
    }

    if (!data || data.length === 0) {
      console.error('❌ Nenhum dado retornado do Supabase');
      saveOSIPending(osi);
      return osiWithId as DBOSI;
    }

    console.log('✅ OSI salva com sucesso no Supabase:', data[0]);
    
    // Atualizar localStorage com o ID real do Supabase
    const savedOSI = data[0] as DBOSI;
    const localOrders = getOSILocal();
    const updatedOrders = localOrders.map((o: any) => 
      o.order_number === savedOSI.order_number ? savedOSI : o
    );
    localStorage.setItem('osi-orders', JSON.stringify(updatedOrders));
    
    // Remover da lista de pendentes se estava lá
    removeOSIPending(savedOSI.order_number);
    
    return savedOSI;
  } catch (error) {
    console.error('❌ Exception saving OSI:', error);
    console.error('Stack:', (error as Error).stack);
    
    // Em caso de exceção (timeout, network error, etc), usar localStorage
    saveOSIPending(osi);
    console.warn('⚠️ Erro ao salvar no Supabase, usando armazenamento local');
    
    return osiWithId as DBOSI;
  }
};

export const getOSIHistory = async () => {
  // Sempre buscar do localStorage primeiro (mais rápido e funciona offline)
  const localOrders = getOSILocal();
  console.log(`📦 ${localOrders.length} OSI encontradas no localStorage`);

  if (!isSupabaseConfigured) {
    return localOrders.length > 0 ? localOrders : mockOSIOrders;
  }

  // Tentar buscar do Supabase com timeout
  try {
    const timeout = isMobileDevice() ? 10000 : 5000;
    const fetchPromise = supabase
      .from('osi_orders')
      .select('*')
      .order('created_at', { ascending: false });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao buscar do Supabase')), timeout);
    });

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

    if (error) {
      console.error('Error fetching OSI history:', error);
      console.warn('⚠️ Usando dados do localStorage');
      return localOrders;
    }

    if (data && data.length > 0) {
      console.log(`✅ ${data.length} OSI encontradas no Supabase`);
      
      // Mesclar com dados locais (priorizar Supabase)
      const localMap = new Map(localOrders.map((o: any) => [o.order_number, o]));
      const merged = [...data];
      
      // Adicionar OSI locais que não estão no Supabase
      localOrders.forEach((localOSI: any) => {
        if (!merged.find((o: any) => o.order_number === localOSI.order_number)) {
          merged.push(localOSI);
        }
      });
      
      // Ordenar por data
      merged.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || a.date).getTime();
        const dateB = new Date(b.created_at || b.date).getTime();
        return dateB - dateA;
      });
      
      return merged;
    }

    return localOrders;
  } catch (error) {
    console.error('Exception fetching OSI history:', error);
    console.warn('⚠️ Usando dados do localStorage devido ao erro');
    return localOrders;
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
