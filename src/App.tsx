import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Checklist } from './components/Checklist';
import { History } from './components/History';
import { ChecklistData } from './types';
import { getDarkMode, setDarkMode, initDB } from './services/storage';
import './App.css';

type View = 'home' | 'checklist' | 'history';

function App() {
  const [view, setView] = useState<View>('home');
  const [checklistData, setChecklistData] = useState<Partial<ChecklistData> | null>(null);
  const [darkMode, setDarkModeState] = useState(false);

  useEffect(() => {
    initDB();
    const isDarkMode = getDarkMode();
    setDarkModeState(isDarkMode);
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
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
