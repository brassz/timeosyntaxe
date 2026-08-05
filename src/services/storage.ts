import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ChecklistData, Photo } from '../types';
import { isInlinePhotoRef, isRemotePhotoRef, photoRefToBase64 } from './photoUtils';

interface ChecklistDB extends DBSchema {
  photos: {
    key: string;
    value: Photo;
    indexes: { 'by-checklist': string };
  };
  drafts: {
    key: string;
    value: { key: string; data: ChecklistData; updatedAt: number };
  };
}

let db: IDBPDatabase<ChecklistDB> | null = null;

export const initDB = async () => {
  if (db) return db;

  db = await openDB<ChecklistDB>('terraplanagem-db', 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const photoStore = db.createObjectStore('photos', { keyPath: 'id' });
        photoStore.createIndex('by-checklist', 'checklistId');
      }
      if (oldVersion < 2) {
        db.createObjectStore('drafts', { keyPath: 'key' });
      }
    },
  });

  return db;
};

const DRAFT_STORAGE_KEY = 'checklist-draft';
const DRAFT_DB_KEY = 'active';
const COMPLETED_STORAGE_KEY = 'completed-checklists';

// Local cache do rascunho (localStorage + IndexedDB)
export const saveDraft = async (data: ChecklistData): Promise<void> => {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar rascunho no localStorage:', error);
  }

  try {
    const database = await initDB();
    await database.put('drafts', { key: DRAFT_DB_KEY, data, updatedAt: Date.now() });
  } catch (error) {
    console.error('Erro ao salvar rascunho no IndexedDB:', error);
  }
};

export const loadDraft = (): ChecklistData | null => {
  try {
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error('Erro ao carregar rascunho do localStorage:', error);
    return null;
  }
};

export const loadDraftAsync = async (): Promise<ChecklistData | null> => {
  const fromLocal = loadDraft();
  if (fromLocal) return fromLocal;

  try {
    const database = await initDB();
    const record = await database.get('drafts', DRAFT_DB_KEY);
    return record?.data ?? null;
  } catch (error) {
    console.error('Erro ao carregar rascunho do IndexedDB:', error);
    return null;
  }
};

export const deleteDraft = async (): Promise<void> => {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao remover rascunho do localStorage:', error);
  }

  try {
    const database = await initDB();
    await database.delete('drafts', DRAFT_DB_KEY);
  } catch (error) {
    console.error('Erro ao remover rascunho do IndexedDB:', error);
  }
};

/** Embute fotos em base64 no checklist para o histórico/PDF funcionar só com localStorage */
export const syncChecklistPhotosForSave = async (data: ChecklistData): Promise<ChecklistData> => {
  const items = await Promise.all(
    data.items.map(async (item) => {
      if (item.photos.length === 0) return item;

      const photoRefs = await Promise.all(
        item.photos.map(async (photoRef) => {
          if (isInlinePhotoRef(photoRef)) return photoRef;
          if (isRemotePhotoRef(photoRef)) {
            return (await photoRefToBase64(photoRef)) || photoRef;
          }

          const photo = await getPhoto(photoRef);
          return photo?.data || photoRef;
        })
      );

      return { ...item, photos: photoRefs };
    })
  );

  return { ...data, items };
};

const getCompletedChecklistsLocal = (): ChecklistData[] => {
  try {
    const checklists = localStorage.getItem(COMPLETED_STORAGE_KEY);
    return checklists ? JSON.parse(checklists) : [];
  } catch (error) {
    console.error('Erro ao ler checklists do localStorage:', error);
    return [];
  }
};

export const saveCompletedChecklist = async (data: ChecklistData) => {
  const checklistWithPhotos = await syncChecklistPhotosForSave(data);

  try {
    const checklists = getCompletedChecklistsLocal();
    const withoutSame = checklists.filter((c) => c.id !== checklistWithPhotos.id);
    withoutSame.unshift(checklistWithPhotos);
    localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(withoutSame));
  } catch (error) {
    console.error('Erro ao salvar checklist no localStorage:', error);
    // Se o localStorage encheu (fotos grandes), tenta salvar sem embutir base64 (só IDs)
    try {
      const checklists = getCompletedChecklistsLocal();
      const withoutSame = checklists.filter((c) => c.id !== data.id);
      withoutSame.unshift(data);
      localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(withoutSame));
    } catch (fallbackError) {
      console.error('Erro ao salvar checklist (fallback):', fallbackError);
      throw fallbackError;
    }
  }

  return checklistWithPhotos;
};

export const getCompletedChecklists = async (): Promise<ChecklistData[]> => {
  return getCompletedChecklistsLocal();
};

export const deleteCompletedChecklist = async (id: string) => {
  const checklists = getCompletedChecklistsLocal().filter((c) => c.id !== id);
  localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(checklists));
  await deletePhotosByChecklist(id);
};

export const cleanOldLocalChecklists = () => {
  const checklists = getCompletedChecklistsLocal();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const filtered = checklists.filter((c) => {
    const checklistDate = new Date(c.date);
    return checklistDate > sevenDaysAgo;
  });

  localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(filtered));

  return checklists.length - filtered.length;
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

export const resolveChecklistPhotoData = async (photoRef: string): Promise<string | null> => {
  if (isInlinePhotoRef(photoRef)) return photoRef;

  if (isRemotePhotoRef(photoRef)) {
    return photoRefToBase64(photoRef);
  }

  const photo = await getPhoto(photoRef);
  if (!photo) return null;
  if (photo.url) {
    return (await photoRefToBase64(photo.url)) || photo.data;
  }
  return photo.data;
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

// Cache de máquinas
const MACHINES_CACHE_KEY = 'machines-cache-v1';
const MACHINES_CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h

export type CachedMachineOption = {
  id: string;
  name: string;
  label: string;
  status?: string;
  plate?: string | null;
};

export const saveMachinesCache = (machines: CachedMachineOption[]): void => {
  try {
    localStorage.setItem(
      MACHINES_CACHE_KEY,
      JSON.stringify({ updatedAt: Date.now(), machines })
    );
  } catch (error) {
    console.error('Erro ao salvar cache de máquinas:', error);
  }
};

export const loadMachinesCache = (): CachedMachineOption[] => {
  try {
    const raw = localStorage.getItem(MACHINES_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { updatedAt?: number; machines?: any[] };
    if (!parsed?.machines || !Array.isArray(parsed.machines)) return [];
    if (parsed.updatedAt && Date.now() - parsed.updatedAt > MACHINES_CACHE_TTL_MS) return [];

    return parsed.machines
      .map((m: any): CachedMachineOption | null => {
        const id = (m.id ?? m.value ?? m.label) as string | undefined;
        const name = (m.name ?? m.value ?? m.label) as string | undefined;
        const label = (m.label ?? name) as string | undefined;
        if (!id || !name || !label) return null;
        return {
          id,
          name,
          label,
          status: m.status,
          plate: m.plate ?? null,
        };
      })
      .filter(Boolean) as CachedMachineOption[];
  } catch (error) {
    console.error('Erro ao carregar cache de máquinas:', error);
    return [];
  }
};

// Funções para OSI (mantidas para se reativar no futuro)
const OSI_STORAGE_KEY = 'osi-orders';
const OSI_PENDING_KEY = 'osi-pending-sync';

export const saveOSILocal = (osi: any): void => {
  try {
    const orders = getOSILocal();
    orders.unshift(osi);
    const limited = orders.slice(0, 1000);
    localStorage.setItem(OSI_STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Erro ao salvar OSI no localStorage:', error);
  }
};

export const getOSILocal = (): any[] => {
  try {
    const orders = localStorage.getItem(OSI_STORAGE_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Erro ao buscar OSI do localStorage:', error);
    return [];
  }
};

export const saveOSIPending = (osi: any): void => {
  try {
    const pending = getOSIPending();
    pending.push(osi);
    localStorage.setItem(OSI_PENDING_KEY, JSON.stringify(pending));
  } catch (error) {
    console.error('Erro ao salvar OSI pendente:', error);
  }
};

export const getOSIPending = (): any[] => {
  try {
    const pending = localStorage.getItem(OSI_PENDING_KEY);
    return pending ? JSON.parse(pending) : [];
  } catch (error) {
    console.error('Erro ao buscar OSI pendentes:', error);
    return [];
  }
};

export const removeOSIPending = (orderNumber: number): void => {
  try {
    const pending = getOSIPending();
    const filtered = pending.filter((osi: any) => osi.order_number !== orderNumber);
    localStorage.setItem(OSI_PENDING_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Erro ao remover OSI pendente:', error);
  }
};

export const clearOSIPending = (): void => {
  try {
    localStorage.removeItem(OSI_PENDING_KEY);
  } catch (error) {
    console.error('Erro ao limpar OSI pendentes:', error);
  }
};
