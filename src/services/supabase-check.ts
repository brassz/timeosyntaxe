// Arquivo de diagnóstico para verificar variáveis de ambiente

export const checkEnvVariables = () => {
  console.log('🔍 Verificando variáveis de ambiente:');
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Definida (oculta)' : '❌ Não definida');
  
  if (import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co') {
    console.error('❌ URL do Supabase não foi configurada!');
    return false;
  }
  
  if (import.meta.env.VITE_SUPABASE_ANON_KEY === 'your-anon-key') {
    console.error('❌ Chave do Supabase não foi configurada!');
    return false;
  }
  
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('❌ Variáveis de ambiente não encontradas!');
    console.log('💡 Dica: Você reiniciou o servidor após criar o .env?');
    return false;
  }
  
  console.log('✅ Variáveis de ambiente configuradas corretamente!');
  return true;
};
