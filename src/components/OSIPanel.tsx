import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ServiceOrderForm } from './ServiceOrderForm';
import './OSIPanel.css';

interface OSIPanelProps {
  onBack: () => void;
}

export const OSIPanel: React.FC<OSIPanelProps> = ({ onBack }) => {
  const { signOut } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const handleLogout = async () => {
    await signOut();
    onBack();
  };

  if (showForm) {
    return <ServiceOrderForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="osi-panel">
      <div className="osi-header card">
        <div>
          <h2>Painel OSI</h2>
          <p>Ordem de Serviço Interno</p>
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
        <div className="osi-card card">
          <div className="osi-card-icon">📋</div>
          <h3>Gerar Ordem de Serviço</h3>
          <p>Criar uma nova ordem de serviço interno</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            ➕ Gerar Ordem
          </button>
        </div>
      </div>
    </div>
  );
};
