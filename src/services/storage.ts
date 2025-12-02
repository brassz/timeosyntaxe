import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ChecklistData, Photo } from '../types';
import { 
  saveChecklistToSupabase, 
  getChecklistsFromSupabase, 
  deleteChecklistFromSupabase,
  cleanupOldChecklists 
} from './supabase';

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
  
  // Run cleanup on init
  cleanupOldChecklists().catch(console.error);
  
  return db;
};

// LocalStorage para dados de checklist (draft)
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

// Supabase para checklists completos (com fallback para localStorage)
export const saveCompletedChecklist = async (data: ChecklistData) => {
  try {
    // Try to save to Supabase first
    await saveChecklistToSupabase(data);
  } catch (error) {
    console.error('Error saving to Supabase, using localStorage fallback:', error);
    // Fallback to localStorage
    const checklists = await getCompletedChecklists();
    checklists.unshift(data);
    localStorage.setItem('completed-checklists', JSON.stringify(checklists));
  }
};

export const getCompletedChecklists = async (): Promise<ChecklistData[]> => {
  try {
    // Try to get from Supabase first
    const data = await getChecklistsFromSupabase();
    return data;
  } catch (error) {
    console.error('Error fetching from Supabase, using localStorage fallback:', error);
    // Fallback to localStorage
    const checklists = localStorage.getItem('completed-checklists');
    return checklists ? JSON.parse(checklists) : [];
  }
};

export const deleteCompletedChecklist = async (id: string) => {
  try {
    // Try to delete from Supabase first
    await deleteChecklistFromSupabase(id);
  } catch (error) {
    console.error('Error deleting from Supabase, using localStorage fallback:', error);
    // Fallback to localStorage
    const checklists = await getCompletedChecklists();
    const filtered = checklists.filter(c => c.id !== id);
    localStorage.setItem('completed-checklists', JSON.stringify(filtered));
  }
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
