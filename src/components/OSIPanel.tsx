import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ServiceOrderForm } from './ServiceOrderForm';
import { ServiceOrderHistory } from './ServiceOrderHistory';
import './OSIPanel.css';

interface OSIPanelProps {
  onBack: () => void;
}

type TabView = 'home' | 'form' | 'history';

export const OSIPanel: React.FC<OSIPanelProps> = ({ onBack }) => {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabView>('home');

  const handleLogout = () => {
    signOut();
    onBack();
  };

  const handleBackToPanel = () => {
    setActiveTab('home');
  };

  // Renderizar conteúdo baseado na tab ativa
  if (activeTab === 'form') {
    return <ServiceOrderForm onBack={handleBackToPanel} />;
  }

  if (activeTab === 'history') {
    return <ServiceOrderHistory onBack={handleBackToPanel} />;
  }

  // Home do painel
  return (
    <div className="osi-panel">
      <div className="osi-header card">
        <div>
          <h2>Painel OSI</h2>
          <p>Ordem de Serviço Interno</p>
          {user && <span className="user-info">👤 {user.full_name || user.email}</span>}
        </div>
        <div className="osi-actions">
          <button className="btn btn-secondary" onClick={handleLogout}>
            🚪 Sair
          </button>
          <button className="btn btn-danger" onClick={onBack}>
            ← Voltar
          </button>
        </div>
      </div>

      <div className="osi-content">
        <div className="osi-card card" onClick={() => setActiveTab('form')}>
          <div className="osi-card-icon">📋</div>
          <h3>Gerar Ordem de Serviço</h3>
          <p>Criar uma nova ordem de serviço interno</p>
          <button className="btn btn-primary">
            ➕ Gerar Ordem
          </button>
        </div>

        <div className="osi-card card" onClick={() => setActiveTab('history')}>
          <div className="osi-card-icon">📚</div>
          <h3>Histórico de Ordens</h3>
          <p>Visualizar todas as ordens de serviço criadas</p>
          <button className="btn btn-primary">
            📖 Ver Histórico
          </button>
        </div>
      </div>
    </div>
  );
};
