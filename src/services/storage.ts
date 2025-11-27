import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ChecklistData, Photo } from '../types';

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

export const saveCompletedChecklist = (data: ChecklistData) => {
  const checklists = getCompletedChecklists();
  checklists.unshift(data);
  localStorage.setItem('completed-checklists', JSON.stringify(checklists));
};

export const getCompletedChecklists = (): ChecklistData[] => {
  const checklists = localStorage.getItem('completed-checklists');
  return checklists ? JSON.parse(checklists) : [];
};

export const deleteCompletedChecklist = (id: string) => {
  const checklists = getCompletedChecklists().filter(c => c.id !== id);
  localStorage.setItem('completed-checklists', JSON.stringify(checklists));
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
