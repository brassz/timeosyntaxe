import { getSession, logout } from '../services/auth';
import './OSIDashboard.css';

interface OSIDashboardProps {
  onGerarOS: () => void;
  onHistorico: () => void;
  onLogout: () => void;
}

export const OSIDashboard = ({ onGerarOS, onHistorico, onLogout }: OSIDashboardProps) => {
  const session = getSession();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="osi-dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <img src="/logo.png" alt="Terraplanagem Guimarães" className="dashboard-logo" />
          <div>
            <h1>Painel OSI</h1>
            <p>Ordem de Serviço Interna - Terraplanagem Guimarães</p>
          </div>
        </div>
        <div className="user-info">
          <div className="user-details">
            <span className="user-name">👤 {session?.nome}</span>
            <span className="user-role">{session?.cargo}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Sair
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Bem-vindo ao Sistema OSI</h2>
          <p>Gerencie suas ordens de serviço de forma eficiente e organizada</p>
        </div>

        <div className="dashboard-actions">
          <button className="action-card primary" onClick={onGerarOS}>
            <div className="action-icon">📝</div>
            <div className="action-content">
              <h3>Gerar Ordem de Serviço</h3>
              <p>Criar nova ordem de serviço interna</p>
            </div>
          </button>

          <button className="action-card secondary" onClick={onHistorico}>
            <div className="action-icon">📊</div>
            <div className="action-content">
              <h3>Histórico de Ordens</h3>
              <p>Visualizar e gerenciar ordens anteriores</p>
            </div>
          </button>
        </div>

        <div className="dashboard-footer">
          <div className="info-boxes">
            <div className="info-box">
              <span className="info-icon">🔧</span>
              <span className="info-text">Sistema completo de gestão</span>
            </div>
            <div className="info-box">
              <span className="info-icon">📄</span>
              <span className="info-text">Geração automática de PDF e Excel</span>
            </div>
            <div className="info-box">
              <span className="info-icon">💾</span>
              <span className="info-text">Armazenamento seguro na nuvem</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
