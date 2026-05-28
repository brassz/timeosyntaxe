import { useState, useEffect } from 'react';
import { ChecklistData } from '../types';
import { getCompletedChecklists, deleteCompletedChecklist, syncChecklistPhotosForSave } from '../services/storage';
import { generatePDF } from '../services/pdf';
import './History.css';

interface HistoryProps {
  onBack: () => void;
}

export const History: React.FC<HistoryProps> = ({ onBack }) => {
  const [checklists, setChecklists] = useState<ChecklistData[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistData | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    const data = await getCompletedChecklists();
    setChecklists(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este checklist? Esta ação não pode ser desfeita.')) {
      await deleteCompletedChecklist(id);
      loadChecklists();
      if (selectedChecklist?.id === id) {
        setSelectedChecklist(null);
      }
    }
  };

  const handleRegeneratePDF = async (checklist: ChecklistData) => {
    setIsGeneratingPDF(true);
    try {
      const checklistWithPhotos = await syncChecklistPhotosForSave(checklist);
      await generatePDF(checklistWithPhotos);
      alert('✅ PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('❌ Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleViewDetails = (checklist: ChecklistData) => {
    setSelectedChecklist(selectedChecklist?.id === checklist.id ? null : checklist);
  };

  if (checklists.length === 0) {
    return (
      <div className="history">
        <div className="empty-state card">
          <h2>📋 Nenhum checklist finalizado</h2>
          <p>Os checklists finalizados aparecerão aqui.</p>
          <button className="btn btn-primary" onClick={onBack}>
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="history-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Voltar
        </button>
        <h2>Histórico de Checklists</h2>
        <div className="history-count">{checklists.length} registros</div>
      </div>

      <div className="checklist-list">
        {checklists.map((checklist) => (
          <div key={checklist.id} className="checklist-card card">
            <div className="checklist-summary" onClick={() => handleViewDetails(checklist)}>
              <div className="summary-header">
                <h3>{checklist.machine}</h3>
                <span className="summary-date">
                  {new Date(checklist.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="summary-details">
                <div className="detail-item">
                  <span className="detail-label">Inspecionado por:</span>
                  <span className="detail-value">{checklist.operator}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">TAG:</span>
                  <span className="detail-value">{checklist.tag || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Local:</span>
                  <span className="detail-value">{checklist.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Horímetro:</span>
                  <span className="detail-value">{checklist.horimeter}</span>
                </div>
              </div>
              <div className="summary-stats">
                {checklist.items.filter((i) => i.status === 'C').length} Confere,{' '}
                {checklist.items.filter((i) => i.status === 'N.C').length} Não Confere,{' '}
                {checklist.items.filter((i) => i.status === 'N.A').length} N/A
              </div>
            </div>

            {selectedChecklist?.id === checklist.id && (
              <div className="checklist-details">
                <div className="details-header">
                  <h4>Detalhes do Checklist</h4>
                </div>

                <div className="details-info">
                  <div className="info-grid">
                    <div>
                      <strong>Inspecionado por:</strong> {checklist.operator}
                    </div>
                    <div>
                      <strong>TAG:</strong> {checklist.tag || '-'}
                    </div>
                    <div>
                      <strong>Máquina:</strong> {checklist.machine}
                    </div>
                    <div>
                      <strong>Local:</strong> {checklist.location}
                    </div>
                    <div>
                      <strong>Data/Hora:</strong> {new Date(checklist.date).toLocaleString('pt-BR')}
                    </div>
                    <div>
                      <strong>Horímetro:</strong> {checklist.horimeter}
                    </div>
                    {checklist.mileage && (
                      <div>
                        <strong>Quilometragem:</strong> {checklist.mileage}
                      </div>
                    )}
                  </div>
                </div>

                <div className="details-items">
                  <h5>Itens do Checklist</h5>
                  <div className="items-table">
                    {checklist.items.map((item) => (
                      <div key={item.id} className="item-row">
                        <div className="item-name">{item.name}</div>
                        <div className={`item-status status-${item.status?.toLowerCase().replace('.', '') || 'pending'}`}>
                          {item.status || '-'}
                        </div>
                        <div className="item-observation">
                          {item.observation || '-'}
                        </div>
                        {item.photos.length > 0 && (
                          <div className="item-photos-count">
                            📷 {item.photos.length}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="checklist-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleRegeneratePDF(checklist)}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? '⏳ Gerando...' : '📄 Gerar PDF'}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(checklist.id)}
              >
                🗑️ Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
