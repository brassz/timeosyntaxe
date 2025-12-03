import { supabase } from './supabase';
import { OSIOrdem } from '../types';

// Criar nova ordem de serviço
export const createOrdem = async (ordem: OSIOrdem): Promise<OSIOrdem> => {
  try {
    const { data, error } = await supabase
      .from('osi_ordens')
      .insert([ordem])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar ordem:', error);
    throw new Error('Erro ao criar ordem de serviço');
  }
};

// Buscar todas as ordens
export const getOrdens = async (): Promise<OSIOrdem[]> => {
  try {
    const { data, error } = await supabase
      .from('osi_ordens')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar ordens:', error);
    throw new Error('Erro ao buscar ordens de serviço');
  }
};

// Buscar ordem por ID
export const getOrdemById = async (id: string): Promise<OSIOrdem | null> => {
  try {
    const { data, error } = await supabase
      .from('osi_ordens')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar ordem:', error);
    return null;
  }
};

// Atualizar ordem
export const updateOrdem = async (id: string, ordem: Partial<OSIOrdem>): Promise<OSIOrdem> => {
  try {
    const { data, error } = await supabase
      .from('osi_ordens')
      .update(ordem)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar ordem:', error);
    throw new Error('Erro ao atualizar ordem de serviço');
  }
};

// Deletar ordem
export const deleteOrdem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('osi_ordens')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao deletar ordem:', error);
    throw new Error('Erro ao deletar ordem de serviço');
  }
};

// Upload de arquivo para o Supabase Storage
export const uploadFile = async (
  file: Blob,
  fileName: string,
  bucket: string = 'osi-files'
): Promise<string> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    throw new Error('Erro ao fazer upload do arquivo');
  }
};

// Filtrar ordens
export const filterOrdens = async (filters: {
  startDate?: string;
  endDate?: string;
  numeroOS?: number;
  veiculo?: string;
  equipamento?: string;
}): Promise<OSIOrdem[]> => {
  try {
    let query = supabase
      .from('osi_ordens')
      .select('*');

    if (filters.startDate) {
      query = query.gte('data', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('data', filters.endDate);
    }
    if (filters.numeroOS) {
      query = query.eq('numero_os', filters.numeroOS);
    }
    if (filters.veiculo) {
      query = query.ilike('veiculo', `%${filters.veiculo}%`);
    }
    if (filters.equipamento) {
      query = query.ilike('equipamento', `%${filters.equipamento}%`);
    }

    const { data, error } = await query.order('criado_em', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao filtrar ordens:', error);
    throw new Error('Erro ao filtrar ordens de serviço');
  }
};
