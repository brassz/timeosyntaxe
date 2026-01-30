import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ChecklistData, Photo } from '../types';
import { saveChecklistToDB, getChecklistsFromDB, deleteChecklistFromDB, cleanOldChecklists } from './supabase';

interface ChecklistDB extends DBSchema {
  photos: {
    key: string;
    value: Photo;
    indexes: { 'by-checklist': string };
  };
}

let db: IDBPDatabase<ChecklistDB> | null = null;

export const initDB = async () => {
  if (db) return db;
  
  db = await openDB<ChecklistDB>('terraplanagem-db', 1, {
    upgrade(db) {
      const photoStore = db.createObjectStore('photos', { keyPath: 'id' });
      photoStore.createIndex('by-checklist', 'checklistId');
    },
  });
  
  // Limpar checklists antigos ao inicializar
  await cleanOldChecklists();
  
  return db;
};

// LocalStorage para dados de checklist
export const saveDraft = (data: ChecklistData) => {
  localStorage.setItem('checklist-draft', JSON.stringify(data));
};

export const loadDraft = (): ChecklistData | null => {
  const draft = localStorage.getItem('checklist-draft');
  return draft ? JSON.parse(draft) : null;
};

export const deleteDraft = () => {
  localStorage.removeItem('checklist-draft');
};

// Salvar checklist completado (agora no Supabase + localStorage como backup)
export const saveCompletedChecklist = async (data: ChecklistData) => {
  // Salvar no Supabase
  try {
    await saveChecklistToDB(data);
  } catch (error) {
    console.error('Error saving to Supabase, using localStorage as backup:', error);
  }
  
  // Manter no localStorage como backup
  const checklists = getCompletedChecklistsLocal();
  checklists.unshift(data);
  localStorage.setItem('completed-checklists', JSON.stringify(checklists));
};

// Buscar checklists do Supabase (com fallback para localStorage)
export const getCompletedChecklists = async (): Promise<ChecklistData[]> => {
  try {
    const checklists = await getChecklistsFromDB();
    if (checklists && checklists.length > 0) {
      return checklists;
    }
  } catch (error) {
    console.error('Error fetching from Supabase, using localStorage:', error);
  }
  
  // Fallback para localStorage
  return getCompletedChecklistsLocal();
};

// Função local para buscar do localStorage
const getCompletedChecklistsLocal = (): ChecklistData[] => {
  const checklists = localStorage.getItem('completed-checklists');
  return checklists ? JSON.parse(checklists) : [];
};

// Deletar checklist (do Supabase e localStorage)
export const deleteCompletedChecklist = async (id: string) => {
  try {
    await deleteChecklistFromDB(id);
  } catch (error) {
    console.error('Error deleting from Supabase:', error);
  }
  
  const checklists = getCompletedChecklistsLocal().filter(c => c.id !== id);
  localStorage.setItem('completed-checklists', JSON.stringify(checklists));
};

// Limpar checklists locais antigos (mais de 7 dias)
export const cleanOldLocalChecklists = () => {
  const checklists = getCompletedChecklistsLocal();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const filtered = checklists.filter(c => {
    const checklistDate = new Date(c.date);
    return checklistDate > sevenDaysAgo;
  });
  
  localStorage.setItem('completed-checklists', JSON.stringify(filtered));
  
  return checklists.length - filtered.length; // Retorna quantos foram removidos
};

// IndexedDB para fotos
export const savePhoto = async (photo: Photo): Promise<void> => {
  const database = await initDB();
  await database.put('photos', photo);
};

export const getPhoto = async (id: string): Promise<Photo | undefined> => {
  const database = await initDB();
  return await database.get('photos', id);
};

export const getPhotosByChecklist = async (checklistId: string): Promise<Photo[]> => {
  const database = await initDB();
  return await database.getAllFromIndex('photos', 'by-checklist', checklistId);
};

export const deletePhoto = async (id: string): Promise<void> => {
  const database = await initDB();
  await database.delete('photos', id);
};

export const deletePhotosByChecklist = async (checklistId: string): Promise<void> => {
  const database = await initDB();
  const photos = await getPhotosByChecklist(checklistId);
  for (const photo of photos) {
    await database.delete('photos', photo.id);
  }
};

// Preferências
export const getDarkMode = (): boolean => {
  const darkMode = localStorage.getItem('dark-mode');
  return darkMode === 'true';
};

export const setDarkMode = (enabled: boolean): void => {
  localStorage.setItem('dark-mode', enabled ? 'true' : 'false');
};

// Funções para OSI (Ordem de Serviço Interna) - localStorage como fallback
const OSI_STORAGE_KEY = 'osi-orders';
const OSI_PENDING_KEY = 'osi-pending-sync';

// Salvar OSI no localStorage
export const saveOSILocal = (osi: any): void => {
  try {
    const orders = getOSILocal();
    orders.unshift(osi);
    // Manter apenas as últimas 1000 ordens
    const limited = orders.slice(0, 1000);
    localStorage.setItem(OSI_STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Erro ao salvar OSI no localStorage:', error);
  }
};

// Buscar OSI do localStorage
export const getOSILocal = (): any[] => {
  try {
    const orders = localStorage.getItem(OSI_STORAGE_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Erro ao buscar OSI do localStorage:', error);
    return [];
  }
};

// Salvar OSI pendente de sincronização
export const saveOSIPending = (osi: any): void => {
  try {
    const pending = getOSIPending();
    pending.push(osi);
    localStorage.setItem(OSI_PENDING_KEY, JSON.stringify(pending));
  } catch (error) {
    console.error('Erro ao salvar OSI pendente:', error);
  }
};

// Buscar OSI pendentes
export const getOSIPending = (): any[] => {
  try {
    const pending = localStorage.getItem(OSI_PENDING_KEY);
    return pending ? JSON.parse(pending) : [];
  } catch (error) {
    console.error('Erro ao buscar OSI pendentes:', error);
    return [];
  }
};

// Remover OSI pendente após sincronização bem-sucedida
export const removeOSIPending = (orderNumber: number): void => {
  try {
    const pending = getOSIPending();
    const filtered = pending.filter((osi: any) => osi.order_number !== orderNumber);
    localStorage.setItem(OSI_PENDING_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Erro ao remover OSI pendente:', error);
  }
};

// Limpar todas as OSI pendentes
export const clearOSIPending = (): void => {
  try {
    localStorage.removeItem(OSI_PENDING_KEY);
  } catch (error) {
    console.error('Erro ao limpar OSI pendentes:', error);
  }
};