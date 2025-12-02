import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Checklist } from './components/Checklist';
import { History } from './components/History';
import { LoginModal } from './components/LoginModal';
import { OSIPanel } from './components/OSIPanel';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChecklistData } from './types';
import { getDarkMode, setDarkMode, initDB } from './services/storage';
import './App.css';

type View = 'home' | 'checklist' | 'history' | 'osi';

function AppContent() {
  const [view, setView] = useState<View>('home');
  const [checklistData, setChecklistData] = useState<Partial<ChecklistData> | null>(null);
  const [darkMode, setDarkModeState] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    initDB();
    const isDarkMode = getDarkMode();
    setDarkModeState(isDarkMode);
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Redirect to OSI panel when user logs in
  useEffect(() => {
    if (user) {
      setShowLoginModal(false);
      setView('osi');
    }
  }, [user]);

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

  const handleLoginClick = () => {
    if (user) {
      setView('osi');
    } else {
      setShowLoginModal(true);
    }
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
            <button className="btn-login" onClick={handleLoginClick}>
              {user ? '🔓 Painel OSI' : '🔐 Login'}
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
        {view === 'osi' && user && <OSIPanel onBack={handleBack} />}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--color-gray)',
        fontSize: '0.9rem'
      }}>
        © 2025 Terraplanagem Guimarães - Todos os direitos reservados
      </footer>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
