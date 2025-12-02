import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const USER_STORAGE_KEY = 'terraplanagem_user';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar usuário do localStorage
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Chamar função de login do banco
      const { data, error } = await supabase.rpc('login_user', {
        p_email: email,
        p_password: password
      });

      if (error) {
        throw new Error('Erro ao conectar com o servidor');
      }

      if (!data || data.length === 0) {
        throw new Error('Email ou senha incorretos');
      }

      const loginResult = data[0];

      if (!loginResult.success) {
        throw new Error(loginResult.message || 'Email ou senha incorretos');
      }

      // Criar objeto de usuário
      const userObj: User = {
        id: loginResult.user_id,
        email: loginResult.email,
        full_name: loginResult.full_name,
        role: loginResult.role
      };

      // Salvar no state e localStorage
      setUser(userObj);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));

    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
