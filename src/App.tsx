import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Checklist } from './components/Checklist';
import { History } from './components/History';
import { Login } from './components/Login';
import { OSIDashboard } from './components/OSIDashboard';
import { OSIForm } from './components/OSIForm';
import { OSIHistory } from './components/OSIHistory';
import { ChecklistData } from './types';
import { getDarkMode, setDarkMode, initDB } from './services/storage';
import { isAuthenticated } from './services/auth';
import './App.css';

type View = 'home' | 'checklist' | 'history' | 'osi-login' | 'osi-dashboard' | 'osi-form' | 'osi-history';

function App() {
  const [view, setView] = useState<View>('home');
  const [checklistData, setChecklistData] = useState<Partial<ChecklistData> | null>(null);
  const [darkMode, setDarkModeState] = useState(false);
  const [osiAuthenticated, setOsiAuthenticated] = useState(false);

  useEffect(() => {
    initDB();
    const isDarkMode = getDarkMode();
    setDarkModeState(isDarkMode);
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Verificar se está autenticado no OSI
    setOsiAuthenticated(isAuthenticated());
  }, []);

  const handleStartChecklist = (data: Partial<ChecklistData>) => {
    setChecklistData(data);
    setView('checklist');
  };

  const handleViewHistory = () => {
    setView('history');
  };

  const handleBack = () => {
    setView('home');
    setChecklistData(null);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkModeState(newMode);
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  // OSI handlers
  const handleOSILogin = () => {
    setView('osi-login');
  };

  const handleOSILoginSuccess = () => {
    setOsiAuthenticated(true);
    setView('osi-dashboard');
  };

  const handleOSILogout = () => {
    setOsiAuthenticated(false);
    setView('home');
  };

  const handleOSIGerarOS = () => {
    setView('osi-form');
  };

  const handleOSIHistorico = () => {
    setView('osi-history');
  };

  const handleOSIBackToDashboard = () => {
    setView('osi-dashboard');
  };

  const handleOSIFormSuccess = () => {
    setView('osi-dashboard');
  };

  // Renderizar views do OSI se estiver no fluxo OSI
  if (view === 'osi-login') {
    return <Login onLoginSuccess={handleOSILoginSuccess} />;
  }

  if (osiAuthenticated && view === 'osi-dashboard') {
    return (
      <OSIDashboard
        onGerarOS={handleOSIGerarOS}
        onHistorico={handleOSIHistorico}
        onLogout={handleOSILogout}
      />
    );
  }

  if (osiAuthenticated && view === 'osi-form') {
    return (
      <OSIForm
        onBack={handleOSIBackToDashboard}
        onSuccess={handleOSIFormSuccess}
      />
    );
  }

  if (osiAuthenticated && view === 'osi-history') {
    return <OSIHistory onBack={handleOSIBackToDashboard} />;
  }

  // Renderizar aplicação principal (Checklist)
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-logo">
            <img src="/logo.png" alt="Terraplanagem Guimarães" className="logo-image" />
            <div className="header-text">
              <h1>Terraplanagem Guimarães</h1>
              <p>Sistema de Checklist de Máquinas Pesadas</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              onClick={handleOSILogin}
              className="btn-osi-login"
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                marginRight: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🔐 Painel OSI
            </button>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <span className="toggle-slider"></span>
              <span>{darkMode ? '🌙 Modo Escuro' : '☀️ Modo Claro'}</span>
            </label>
          </div>
        </div>
      </header>

      <main className="main">
        {view === 'home' && (
          <Home onStartChecklist={handleStartChecklist} onViewHistory={handleViewHistory} />
        )}
        {view === 'checklist' && checklistData && (
          <Checklist initialData={checklistData} onBack={handleBack} />
        )}
        {view === 'history' && <History onBack={handleBack} />}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--color-gray)',
        fontSize: '0.9rem'
      }}>
        © 2025 Terraplanagem Guimarães - Todos os direitos reservados
      </footer>
    </div>
  );
}

export default App;
