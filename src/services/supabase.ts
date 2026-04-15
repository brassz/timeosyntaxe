import { createClient } from '@supabase/supabase-js';
import { saveOSILocal, getOSILocal, saveOSIPending, removeOSIPending } from './storage';

// Configuração do Supabase (principal)
// IMPORTANTE: Adicione suas credenciais do Supabase no arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Configuração do Supabase (máquinas) — pode apontar para outro projeto
const supabaseMachinesUrl =
  import.meta.env.VITE_SUPABASE_URL_MAQUINAS || supabaseUrl;
const supabaseMachinesAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY_MAQUINAS || supabaseAnonKey;

// Verificar se as credenciais foram configuradas
const isSupabaseConfigured = 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseMachines = createClient(supabaseMachinesUrl, supabaseMachinesAnonKey);

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

export type MachineStatus = 'NO_PATIO' | 'EM_SERVICO' | 'NA_MECANICA';

export interface DBMachine {
  id: string;
  company_id: string;
  name: string;
  model: string | null;
  plate: string | null;
  current_hourmeter: number | null;
  status: MachineStatus;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const companyId = import.meta.env.VITE_COMPANY_ID as string | undefined;

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

export const getMachinesFromDB = async (): Promise<DBMachine[]> => {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    let query = supabaseMachines
      .from('machines')
      .select('*')
      .eq('active', true)
      .order('name', { ascending: true });

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching machines:', error);
      return [];
    }

    return (data || []) as DBMachine[];
  } catch (error) {
    console.error('Exception fetching machines:', error);
    return [];
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
  // Processar fotos: enviar base64 para o bucket do Supabase
  let osiToSave = { ...osi };
  if (osi.photos && osi.photos.length > 0 && isSupabaseConfigured) {
    const photoUrls: string[] = [];
    for (let i = 0; i < osi.photos.length; i++) {
      const photo = osi.photos[i];
      if (photo.startsWith('data:')) {
        const url = await uploadOSIPhotoToStorage(photo, osi.order_number, i);
        photoUrls.push(url || photo); // Se falhar upload, mantém base64
      } else {
        photoUrls.push(photo); // Já é URL
      }
    }
    osiToSave = { ...osiToSave, photos: photoUrls };
  }

  // Sempre salvar no localStorage primeiro (backup imediato)
  const osiWithId = {
    id: Date.now(), // ID temporário
    ...osiToSave,
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
    console.log('🔵 Tentando salvar OSI no Supabase:', osiToSave);
    
    // Timeout de 10 segundos para mobile
    const timeout = isMobileDevice() ? 10000 : 5000;
    const savePromise = supabase
      .from('osi_orders')
      .insert([osiToSave])
      .select();

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao salvar no Supabase')), timeout);
    });

    const { data, error } = await Promise.race([savePromise, timeoutPromise]) as any;

    if (error) {
      console.error('❌ Error saving OSI:', error);
      console.error('Detalhes:', JSON.stringify(error, null, 2));
      
      // Em caso de erro, marcar como pendente para sincronização posterior
      saveOSIPending(osiToSave);
      console.warn('⚠️ OSI salva localmente e marcada para sincronização posterior');
      
      // Retornar a versão local
      return osiWithId as DBOSI;
    }

    if (!data || data.length === 0) {
      console.error('❌ Nenhum dado retornado do Supabase');
      saveOSIPending(osiToSave);
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
    saveOSIPending(osiToSave);
    console.warn('⚠️ Erro ao salvar no Supabase, usando armazenamento local');
    
    return osiWithId as DBOSI;
  }
};

export const getOSIHistory = async () => {
  // Sempre buscar do localStorage primeiro (mais rápido e funciona offline)
  const localOrders = getOSILocal();
  console.log(`📦 ${localOrders.length} OSI encontradas no localStorage`);

  if (!isSupabaseConfigured) {
    const allOrders = localOrders.length > 0 ? localOrders : mockOSIOrders;
    // Ordenar por data (mais recente primeiro)
    allOrders.sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || a.date).getTime();
      const dateB = new Date(b.created_at || b.date).getTime();
      return dateB - dateA;
    });
    return allOrders;
  }

  // Tentar buscar do Supabase com timeout
  let supabaseOrders: any[] = [];
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
    } else if (data && data.length > 0) {
      console.log(`✅ ${data.length} OSI encontradas no Supabase`);
      supabaseOrders = data;
    }
  } catch (error) {
    console.error('Exception fetching OSI history:', error);
    console.warn('⚠️ Usando dados do localStorage devido ao erro');
  }

  // Mesclar todas as OSI (Supabase + localStorage)
  const mergedMap = new Map<number, any>();
  
  // Primeiro adicionar todas do Supabase (prioridade)
  supabaseOrders.forEach((osi: any) => {
    mergedMap.set(osi.order_number, osi);
  });
  
  // Depois adicionar as locais que não estão no Supabase
  localOrders.forEach((localOSI: any) => {
    if (!mergedMap.has(localOSI.order_number)) {
      mergedMap.set(localOSI.order_number, localOSI);
    }
  });
  
  // Converter map para array e ordenar por data (mais recente primeiro)
  const allOrders = Array.from(mergedMap.values());
  allOrders.sort((a: any, b: any) => {
    const dateA = new Date(a.created_at || a.date).getTime();
    const dateB = new Date(b.created_at || b.date).getTime();
    return dateB - dateA;
  });
  
  console.log(`📋 Total de ${allOrders.length} OSI no histórico (${supabaseOrders.length} do Supabase + ${localOrders.length} locais)`);
  
  return allOrders;
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

// ============================================
// FUNÇÕES PARA SUPABASE STORAGE (PDFs)
// ============================================

const PDF_BUCKET_NAME = 'pdfs';

// Criar bucket se não existir (deve ser feito manualmente no Supabase Dashboard)
// Storage > Create bucket > Nome: "pdfs" > Public: false (ou true se quiser acesso público)

/**
 * Converte base64 data URL em Blob
 */
const dataURLtoBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
};

/**
 * Faz upload de uma foto de OSI para o Supabase Storage
 * @param photoData Base64 data URL ou Blob da foto
 * @param orderNumber Número da ordem
 * @param index Índice da foto
 * @returns URL pública da foto ou null em caso de erro
 */
export const uploadOSIPhotoToStorage = async (
  photoData: string | Blob,
  orderNumber: number,
  index: number
): Promise<string | null> => {
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase não configurado! Foto não será salva no storage.');
    return null;
  }

  try {
    const blob = typeof photoData === 'string' 
      ? dataURLtoBlob(photoData) 
      : photoData;
    
    const ext = blob.type === 'image/png' ? 'png' : 'jpg';
    const timestamp = Date.now();
    const filePath = `osi/photos/OSI_${orderNumber}_${timestamp}_${index}.${ext}`;

    console.log(`📤 Enviando foto OSI: ${filePath}`);

    const { error } = await supabase.storage
      .from(PDF_BUCKET_NAME)
      .upload(filePath, blob, {
        contentType: blob.type,
        upsert: true
      });

    if (error) {
      console.error('❌ Erro ao fazer upload da foto:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(PDF_BUCKET_NAME)
      .getPublicUrl(filePath);

    if (urlData?.publicUrl) {
      console.log('✅ Foto enviada:', urlData.publicUrl);
      return urlData.publicUrl;
    }
    return null;
  } catch (error) {
    console.error('❌ Exception ao fazer upload da foto:', error);
    return null;
  }
};

/**
 * Faz upload de um PDF para o Supabase Storage
 * @param pdfBlob Blob do PDF gerado
 * @param fileName Nome do arquivo (ex: "Checklist_123_2024-01-01.pdf")
 * @param folder Pasta dentro do bucket (ex: "checklists" ou "osi")
 * @returns URL pública do PDF ou null em caso de erro
 */
export const uploadPDFToStorage = async (
  pdfBlob: Blob,
  fileName: string,
  folder: 'checklists' | 'osi'
): Promise<string | null> => {
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase não configurado! PDF não será salvo no storage.');
    return null;
  }

  try {
    const filePath = `${folder}/${fileName}`;
    
    console.log(`📤 Fazendo upload do PDF: ${filePath}`);
    
    // Verificar se o bucket existe
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.warn('⚠️ Erro ao verificar buckets:', bucketError);
    } else {
      const bucketExists = buckets?.some(b => b.name === PDF_BUCKET_NAME);
      if (!bucketExists) {
        console.warn(`⚠️ Bucket "${PDF_BUCKET_NAME}" não encontrado! Crie o bucket no Supabase Dashboard.`);
        console.warn('📖 Consulte o arquivo CONFIGURAR_BUCKET_PDFS.md para instruções.');
        return null;
      }
    }
    
    const { data, error } = await supabase.storage
      .from(PDF_BUCKET_NAME)
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true // Substitui se já existir
      });

    if (error) {
      // Se o erro for "Bucket not found", dar mensagem mais clara
      if (error.message?.includes('not found') || error.message?.includes('Bucket')) {
        console.error('❌ Bucket não encontrado! Crie o bucket "pdfs" no Supabase Dashboard.');
        console.error('📖 Consulte o arquivo CONFIGURAR_BUCKET_PDFS.md para instruções.');
      } else {
        console.error('❌ Erro ao fazer upload do PDF:', error);
      }
      return null;
    }

    console.log('✅ PDF enviado com sucesso:', data.path);

    // Obter URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from(PDF_BUCKET_NAME)
      .getPublicUrl(filePath);

    if (urlData?.publicUrl) {
      console.log('🔗 URL pública do PDF:', urlData.publicUrl);
      return urlData.publicUrl;
    }

    return null;
  } catch (error) {
    console.error('❌ Exception ao fazer upload do PDF:', error);
    return null;
  }
};

/**
 * Faz download de um PDF do Supabase Storage
 * @param filePath Caminho do arquivo (ex: "checklists/Checklist_123.pdf")
 * @returns Blob do PDF ou null em caso de erro
 */
export const downloadPDFFromStorage = async (filePath: string): Promise<Blob | null> => {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase.storage
      .from(PDF_BUCKET_NAME)
      .download(filePath);

    if (error) {
      console.error('❌ Erro ao baixar PDF:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('❌ Exception ao baixar PDF:', error);
    return null;
  }
};

/**
 * Lista todos os PDFs de uma pasta
 * @param folder Pasta dentro do bucket (ex: "checklists" ou "osi")
 * @returns Lista de arquivos ou array vazio
 */
export const listPDFsFromStorage = async (folder: 'checklists' | 'osi'): Promise<any[]> => {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase.storage
      .from(PDF_BUCKET_NAME)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('❌ Erro ao listar PDFs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Exception ao listar PDFs:', error);
    return [];
  }
};

/**
 * Deleta um PDF do Supabase Storage
 * @param filePath Caminho do arquivo (ex: "checklists/Checklist_123.pdf")
 * @returns true se deletado com sucesso
 */
export const deletePDFFromStorage = async (filePath: string): Promise<boolean> => {
  if (!isSupabaseConfigured) {
    return false;
  }

  try {
    const { error } = await supabase.storage
      .from(PDF_BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('❌ Erro ao deletar PDF:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Exception ao deletar PDF:', error);
    return false;
  }
};
