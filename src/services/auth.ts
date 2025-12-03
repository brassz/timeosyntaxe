import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

const SESSION_KEY = 'osi_user_session';

export interface UserSession {
  id: string;
  usuario: string;
  nome: string;
  cargo: string;
  timestamp: number;
}

// Salvar sessão no localStorage
export const saveSession = (user: UserSession): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

// Obter sessão atual
export const getSession = (): UserSession | null => {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;
  
  try {
    const userSession: UserSession = JSON.parse(session);
    // Validar se a sessão não expirou (24 horas)
    const now = Date.now();
    const sessionAge = now - userSession.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas
    
    if (sessionAge > maxAge) {
      clearSession();
      return null;
    }
    
    return userSession;
  } catch {
    return null;
  }
};

// Limpar sessão
export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

// Verificar se está autenticado
export const isAuthenticated = (): boolean => {
  return getSession() !== null;
};

// Fazer login
export const login = async (usuario: string, senha: string): Promise<UserSession> => {
  try {
    // Buscar usuário no banco
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', usuario)
      .single();

    if (error || !data) {
      throw new Error('Usuário ou senha inválidos');
    }

    // Comparar senha com bcrypt
    const senhaValida = await bcrypt.compare(senha, data.senha);
    
    if (!senhaValida) {
      throw new Error('Usuário ou senha inválidos');
    }

    // Criar sessão
    const session: UserSession = {
      id: data.id,
      usuario: data.usuario,
      nome: data.nome,
      cargo: data.cargo,
      timestamp: Date.now()
    };

    saveSession(session);
    return session;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro ao fazer login');
  }
};

// Fazer logout
export const logout = (): void => {
  clearSession();
};
