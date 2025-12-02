import { useState, useEffect, useRef } from 'react';
import { ChecklistData, ChecklistItem, ChecklistStatus, Photo } from '../types';
import { saveDraft, loadDraft, deleteDraft, saveCompletedChecklist, savePhoto, getPhoto, deletePhoto } from '../services/storage';
import { generatePDF } from '../services/pdf';
import './Checklist.css';

interface ChecklistProps {
  initialData: Partial<ChecklistData>;
  onBack: () => void;
}

// Checklist para Motoniveladora
const CHECKLIST_MOTONIVELADORA = [
  { name: 'Pino', category: 'PNEUS-ESTEIRAS' },
  { name: 'Bucha', category: 'PNEUS-ESTEIRAS' },
  { name: 'Pneus dianteiros', category: 'PNEUS-ESTEIRAS' },
  { name: 'Pneus traseiros', category: 'PNEUS-ESTEIRAS' },
  { name: 'Farol dianteiro', category: 'SINALIZAÇÃO' },
  { name: 'Farol traseiro', category: 'SINALIZAÇÃO' },
  { name: 'Luz de freio', category: 'SINALIZAÇÃO' },
  { name: 'Pisca alerta', category: 'SINALIZAÇÃO' },
  { name: 'Setas dianteiras', category: 'SINALIZAÇÃO' },
  { name: 'Setas traseiras', category: 'SINALIZAÇÃO' },
  { name: 'Buzina', category: 'SINALIZAÇÃO' },
  { name: 'Alarme sonoro de ré', category: 'SINALIZAÇÃO' },
  { name: 'Sistema de freios', category: 'SINALIZAÇÃO' },
  { name: 'Cabine', category: 'DIVERSOS' },
  { name: 'Portas', category: 'DIVERSOS' },
  { name: 'Limpador para-brisa', category: 'DIVERSOS' },
  { name: 'Parachoque', category: 'DIVERSOS' },
  { name: 'Giroflex', category: 'DIVERSOS' },
  { name: 'Mangueiras hidráulicas', category: 'DIVERSOS' },
  { name: 'Embuchamentos', category: 'DIVERSOS' },
  { name: 'Mesa', category: 'DIVERSOS' },
  { name: 'Painel', category: 'DIVERSOS' },
  { name: 'Horímetro', category: 'DIVERSOS' },
  { name: 'Cinto de segurança', category: 'SEGURANÇA' },
  { name: 'Extintor de incêndio', category: 'SEGURANÇA' },
  { name: 'Retrovisores', category: 'SEGURANÇA' },
  { name: 'Cone preto e amarelo refletivo (03)', category: 'SEGURANÇA' },
  { name: 'Vazamento de óleos', category: 'ÓLEOS' },
  { name: 'Troca de óleo', category: 'ÓLEOS' },
  { name: 'Nível de óleo motor de giro', category: 'ÓLEOS' },
  { name: 'Nível de óleo motor de tração', category: 'ÓLEOS' },
  { name: 'Nível de óleo hidráulico', category: 'ÓLEOS' },
  { name: 'Nível de óleo do motor', category: 'ÓLEOS' },
  { name: 'Bateria', category: 'OUTROS' },
  { name: 'Ar condicionado', category: 'OUTROS' },
];

// Checklist para Trator Agrícola, Retro Escavadeira, Pá Carregadeira
const CHECKLIST_TRATOR_RETRO_PA = [
  { name: 'Pneus dianteiros', category: 'PNEUS-ESTEIRAS' },
  { name: 'Pneus traseiros', category: 'PNEUS-ESTEIRAS' },
  { name: 'Farol dianteiro', category: 'SINALIZAÇÃO' },
  { name: 'Farol traseiro', category: 'SINALIZAÇÃO' },
  { name: 'Luz de ré', category: 'SINALIZAÇÃO' },
  { name: 'Luz de freio', category: 'SINALIZAÇÃO' },
  { name: 'Pisca alerta', category: 'SINALIZAÇÃO' },
  { name: 'Setas dianteiras', category: 'SINALIZAÇÃO' },
  { name: 'Setas traseiras', category: 'SINALIZAÇÃO' },
  { name: 'Buzina', category: 'SINALIZAÇÃO' },
  { name: 'Alarme sonoro de ré', category: 'SINALIZAÇÃO' },
  { name: 'Sistema de freios', category: 'SINALIZAÇÃO' },
  { name: 'Cabine', category: 'DIVERSOS' },
  { name: 'Portas', category: 'DIVERSOS' },
  { name: 'Limpador para-brisa', category: 'DIVERSOS' },
  { name: 'Parachoque', category: 'DIVERSOS' },
  { name: 'Giroflex', category: 'DIVERSOS' },
  { name: 'Mangueiras hidráulicas', category: 'DIVERSOS' },
  { name: 'Embuchamentos', category: 'DIVERSOS' },
  { name: 'Painel', category: 'DIVERSOS' },
  { name: 'Horímetro', category: 'DIVERSOS' },
  { name: 'Cinto de segurança', category: 'SEGURANÇA' },
  { name: 'Extintor de incêndio', category: 'SEGURANÇA' },
  { name: 'Retrovisores', category: 'SEGURANÇA' },
  { name: 'Cone preto e amarelo refletivo (03)', category: 'SEGURANÇA' },
  { name: 'Vazamento de óleos', category: 'ÓLEOS' },
  { name: 'Troca de óleo', category: 'ÓLEOS' },
  { name: 'Nível de óleo motor de giro', category: 'ÓLEOS' },
  { name: 'Nível de óleo motor de tração', category: 'ÓLEOS' },
  { name: 'Nível de óleo hidráulico', category: 'ÓLEOS' },
  { name: 'Nível de óleo do motor', category: 'ÓLEOS' },
  { name: 'Bateria', category: 'OUTROS' },
  { name: 'Ar condicionado', category: 'OUTROS' },
];

// Checklist para Caminhão
const CHECKLIST_CAMINHAO = [
  { name: 'Pneus dianteiros', category: 'PNEUS-ESTEIRAS' },
  { name: 'Pneus traseiros', category: 'PNEUS-ESTEIRAS' },
  { name: 'Farol dianteiro', category: 'SINALIZAÇÃO' },
  { name: 'Farol traseiro', category: 'SINALIZAÇÃO' },
  { name: 'Luz de ré', category: 'SINALIZAÇÃO' },
  { name: 'Luz de freio', category: 'SINALIZAÇÃO' },
  { name: 'Pisca alerta', category: 'SINALIZAÇÃO' },
  { name: 'Setas dianteiras', category: 'SINALIZAÇÃO' },
  { name: 'Setas traseiras', category: 'SINALIZAÇÃO' },
  { name: 'Buzina', category: 'SINALIZAÇÃO' },
  { name: 'Alarme sonoro de ré', category: 'SINALIZAÇÃO' },
  { name: 'Sistema de freios', category: 'SINALIZAÇÃO' },
  { name: 'Cabine', category: 'DIVERSOS' },
  { name: 'Portas', category: 'DIVERSOS' },
  { name: 'Limpador para-brisa', category: 'DIVERSOS' },
  { name: 'Parachoque', category: 'DIVERSOS' },
  { name: 'Giroflex', category: 'DIVERSOS' },
  { name: 'Mangueiras hidráulicas', category: 'DIVERSOS' },
  { name: 'Embuchamentos', category: 'DIVERSOS' },
  { name: 'Painel', category: 'DIVERSOS' },
  { name: 'Horímetro', category: 'DIVERSOS' },
  { name: 'Cinto de segurança', category: 'SEGURANÇA' },
  { name: 'Extintor de incêndio', category: 'SEGURANÇA' },
  { name: 'Retrovisores', category: 'SEGURANÇA' },
  { name: 'Vazamento de óleos', category: 'ÓLEOS' },
  { name: 'Troca de óleo', category: 'ÓLEOS' },
  { name: 'Nível de óleo motor de giro', category: 'ÓLEOS' },
  { name: 'Nível de óleo motor de tração', category: 'ÓLEOS' },
  { name: 'Nível de óleo hidráulico', category: 'ÓLEOS' },
  { name: 'Nível de óleo do motor', category: 'ÓLEOS' },
  { name: 'Bateria', category: 'OUTROS' },
  { name: 'Ar condicionado', category: 'OUTROS' },
];

// Checklist para Escavadeira
const CHECKLIST_ESCAVADEIRA = [
  { name: 'Rolete superior', category: 'PNEUS-ESTEIRAS' },
  { name: 'Rolete inferior', category: 'PNEUS-ESTEIRAS' },
  { name: 'Roda guia', category: 'PNEUS-ESTEIRAS' },
  { name: 'Pino', category: 'PNEUS-ESTEIRAS' },
  { name: 'Bucha', category: 'PNEUS-ESTEIRAS' },
  { name: 'Roda motriz', category: 'PNEUS-ESTEIRAS' },
  { name: 'Links', category: 'PNEUS-ESTEIRAS' },
  { name: 'Farol dianteiro', category: 'SINALIZAÇÃO' },
  { name: 'Farol traseiro', category: 'SINALIZAÇÃO' },
  { name: 'Luz de ré', category: 'SINALIZAÇÃO' },
  { name: 'Luz de freio', category: 'SINALIZAÇÃO' },
  { name: 'Pisca alerta', category: 'SINALIZAÇÃO' },
  { name: 'Buzina', category: 'SINALIZAÇÃO' },
  { name: 'Alarme sonoro de ré', category: 'SINALIZAÇÃO' },
  { name: 'Sistema de freios', category: 'SINALIZAÇÃO' },
  { name: 'Cabine', category: 'DIVERSOS' },
  { name: 'Portas', category: 'DIVERSOS' },
  { name: 'Limpador para-brisa', category: 'DIVERSOS' },
  { name: 'Parachoque', category: 'DIVERSOS' },
  { name: 'Giroflex', category: 'DIVERSOS' },
  { name: 'Mangueiras hidráulicas', category: 'DIVERSOS' },
  { name: 'Embuchamentos', category: 'DIVERSOS' },
  { name: 'Lâmina', category: 'DIVERSOS' },
  { name: 'Caçamba', category: 'DIVERSOS' },
  { name: 'Painel', category: 'DIVERSOS' },
  { name: 'Horímetro', category: 'DIVERSOS' },
  { name: 'Cinto de segurança', category: 'SEGURANÇA' },
  { name: 'Extintor de incêndio', category: 'SEGURANÇA' },
  { name: 'Retrovisores', category: 'SEGURANÇA' },
  { name: 'Cone preto e amarelo refletivo (03)', category: 'SEGURANÇA' },
  { name: 'Vazamento de óleos', category: 'ÓLEOS' },
  { name: 'Troca de óleo', category: 'ÓLEOS' },
  { name: 'Nível de óleo motor de giro', category: 'ÓLEOS' },
  { name: 'Nível de óleo motor de tração', category: 'ÓLEOS' },
  { name: 'Nível de óleo hidráulico', category: 'ÓLEOS' },
  { name: 'Nível de óleo do motor', category: 'ÓLEOS' },
  { name: 'Bateria', category: 'OUTROS' },
  { name: 'Ar condicionado', category: 'OUTROS' },
];

// Checklist para Rolo Compactador
const CHECKLIST_ROLO = [
  { name: 'Pino', category: 'PNEUS-ESTEIRAS' },
  { name: 'Buchas', category: 'PNEUS-ESTEIRAS' },
  { name: 'Pneus traseiros', category: 'PNEUS-ESTEIRAS' },
  { name: 'Farol dianteiro', category: 'SINALIZAÇÃO' },
  { name: 'Farol traseiro', category: 'SINALIZAÇÃO' },
  { name: 'Buzina', category: 'SINALIZAÇÃO' },
  { name: 'Alarme sonoro de ré', category: 'SINALIZAÇÃO' },
  { name: 'Sistema de freios', category: 'SINALIZAÇÃO' },
  { name: 'Cabine', category: 'DIVERSOS' },
  { name: 'Portas', category: 'DIVERSOS' },
  { name: 'Limpador para-brisa', category: 'DIVERSOS' },
  { name: 'Parachoque', category: 'DIVERSOS' },
  { name: 'Giroflex', category: 'DIVERSOS' },
  { name: 'Mangueiras hidráulicas', category: 'DIVERSOS' },
  { name: 'Painel', category: 'DIVERSOS' },
  { name: 'Horímetro', category: 'DIVERSOS' },
  { name: 'Cinto de segurança', category: 'SEGURANÇA' },
  { name: 'Extintor de incêndio', category: 'SEGURANÇA' },
  { name: 'Retrovisores', category: 'SEGURANÇA' },
  { name: 'Cone preto e amarelo refletivo (03)', category: 'SEGURANÇA' },
  { name: 'Vazamento de óleos', category: 'ÓLEOS' },
  { name: 'Troca de óleo', category: 'ÓLEOS' },
  { name: 'Nível de óleo motor de tração', category: 'ÓLEOS' },
  { name: 'Nível de óleo hidráulico', category: 'ÓLEOS' },
  { name: 'Nível de óleo do motor', category: 'ÓLEOS' },
  { name: 'Bateria', category: 'OUTROS' },
  { name: 'Ar condicionado', category: 'OUTROS' },
];

// Função para selecionar o checklist correto baseado no tipo de máquina
const getChecklistByMachineType = (machine: string) => {
  const machineUpper = machine.toUpperCase();
  
  if (machineUpper.includes('MOTONIVELADORA')) {
    return CHECKLIST_MOTONIVELADORA;
  } else if (
    machineUpper.includes('TRATOR') ||
    machineUpper.includes('RETRO') ||
    machineUpper.includes('RETROESCAVADEIRA') ||
    machineUpper.includes('PÁ') ||
    machineUpper.includes('PA CARREGADEIRA')
  ) {
    return CHECKLIST_TRATOR_RETRO_PA;
  } else if (machineUpper.includes('CAMINHÃO') || machineUpper.includes('CAMINHAO')) {
    return CHECKLIST_CAMINHAO;
  } else if (machineUpper.includes('ESCAVADEIRA')) {
    return CHECKLIST_ESCAVADEIRA;
  } else if (machineUpper.includes('ROLO')) {
    return CHECKLIST_ROLO;
  } else {
    // Retorna o checklist padrão (Trator/Retro/Pá) se não identificar o tipo
    return CHECKLIST_TRATOR_RETRO_PA;
  }
};

export const Checklist: React.FC<ChecklistProps> = ({ initialData, onBack }) => {
  const [checklist, setChecklist] = useState<ChecklistData>(() => {
    const draft = loadDraft();
    if (draft && draft.operator === initialData.operator) {
      return draft;
    }

    const selectedChecklist = getChecklistByMachineType(initialData.machine || '');

    return {
      id: Date.now().toString(),
      operator: initialData.operator || '',
      machine: initialData.machine || '',
      location: initialData.location || '',
      date: new Date().toISOString(),
      horimeter: '',
      mileage: '',
      tag: initialData.tag || '',
      items: selectedChecklist.map((item, index) => ({
        id: `item-${index}`,
        name: item.name,
        category: item.category,
        status: null,
        observation: '',
        photos: [],
      })),
      completed: false,
    };
  });

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [photoPreview, setPhotoPreview] = useState<{ [key: string]: string[] }>({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadPhotoPreviews = async () => {
      const previews: { [key: string]: string[] } = {};
      for (const item of checklist.items) {
        if (item.photos.length > 0) {
          const photoDataArray: string[] = [];
          for (const photoId of item.photos) {
            const photo = await getPhoto(photoId);
            if (photo) {
              photoDataArray.push(photo.data);
            }
          }
          previews[item.id] = photoDataArray;
        }
      }
      setPhotoPreview(previews);
    };

    loadPhotoPreviews();
  }, [checklist.items]);

  useEffect(() => {
    if (!checklist.completed) {
      saveDraft(checklist);
    }
  }, [checklist]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!checklist.completed) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [checklist.completed]);

  const updateItem = (index: number, updates: Partial<ChecklistItem>) => {
    setChecklist((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...updates } : item)),
    }));
  };

  const handleStatusChange = (index: number, status: ChecklistStatus) => {
    updateItem(index, { status });
  };

  const handleObservationChange = (index: number, observation: string) => {
    updateItem(index, { observation });
  };

  const handlePhotoUpload = async (index: number, files: FileList | null) => {
    if (!files) return;

    const item = checklist.items[index];
    const newPhotoIds: string[] = [];
    const newPreviews: string[] = [...(photoPreview[item.id] || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      // Converter para base64
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = async (e) => {
          const base64 = e.target?.result as string;
          const photoId = `${checklist.id}-${item.id}-${Date.now()}-${i}`;
          
          const photo: Photo = {
            id: photoId,
            checklistId: checklist.id,
            itemId: item.id,
            data: base64,
            timestamp: Date.now(),
          };

          await savePhoto(photo);
          newPhotoIds.push(photoId);
          newPreviews.push(base64);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    updateItem(index, { photos: [...item.photos, ...newPhotoIds] });
    setPhotoPreview((prev) => ({ ...prev, [item.id]: newPreviews }));
  };

  const handlePhotoDelete = async (index: number, photoIndex: number) => {
    const item = checklist.items[index];
    const photoId = item.photos[photoIndex];

    await deletePhoto(photoId);

    const newPhotos = item.photos.filter((_, i) => i !== photoIndex);
    updateItem(index, { photos: newPhotos });

    const newPreviews = (photoPreview[item.id] || []).filter((_, i) => i !== photoIndex);
    setPhotoPreview((prev) => ({ ...prev, [item.id]: newPreviews }));
  };

  const handleDiscardDraft = () => {
    if (confirm('Tem certeza que deseja descartar este checklist? Todos os dados serão perdidos.')) {
      deleteDraft();
      onBack();
    }
  };

  const handleFinishChecklist = async () => {
    const unanswered = checklist.items.filter((item) => !item.status).length;
    
    if (unanswered > 0) {
      if (!confirm(`Existem ${unanswered} itens não respondidos. Deseja continuar mesmo assim?`)) {
        return;
      }
    }

    setIsGeneratingPDF(true);

    try {
      const completedChecklist = { ...checklist, completed: true };
      await saveCompletedChecklist(completedChecklist);
      deleteDraft();
      
      await generatePDF(completedChecklist);
      
      alert('✅ Checklist finalizado e PDF gerado com sucesso!');
      onBack();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('❌ Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const currentItem = checklist.items[currentItemIndex];
  const progress = Math.round((checklist.items.filter((i) => i.status).length / checklist.items.length) * 100);

  return (
    <div className="checklist">
      <div className="checklist-header card">
        <div className="header-compact">
          <div className="header-summary">
            <div className="header-main-info">
              <strong>{checklist.operator}</strong> · {checklist.machine}
            </div>
            <button 
              className="header-toggle"
              onClick={() => setHeaderCollapsed(!headerCollapsed)}
              aria-label="Toggle detalhes"
            >
              {headerCollapsed ? '▼' : '▲'}
            </button>
          </div>
          
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            <span className="progress-text">{progress}%</span>
          </div>
        </div>

        {!headerCollapsed && (
          <div className="header-details">
            <div className="checklist-info">
              <div className="info-row">
                <span className="info-label">TAG:</span>
                <span className="info-value">{checklist.tag}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Local:</span>
                <span className="info-value">{checklist.location}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Data/Hora:</span>
                <span className="info-value">{new Date(checklist.date).toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="horimeter">Horímetro *</label>
              <input
                id="horimeter"
                type="text"
                value={checklist.horimeter}
                onChange={(e) => setChecklist({ ...checklist, horimeter: e.target.value })}
                placeholder="Ex: 1234.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mileage">Quilometragem (se aplicável)</label>
              <input
                id="mileage"
                type="text"
                value={checklist.mileage}
                onChange={(e) => setChecklist({ ...checklist, mileage: e.target.value })}
                placeholder="Ex: 45678"
              />
            </div>
          </div>
        )}
      </div>

      <div className="checklist-navigation">
        <button
          className="nav-btn nav-prev"
          onClick={() => setCurrentItemIndex(Math.max(0, currentItemIndex - 1))}
          disabled={currentItemIndex === 0}
        >
          ← Anterior
        </button>
        <div className="item-counter">
          <span className="counter-main">{currentItemIndex + 1}/{checklist.items.length}</span>
        </div>
        <button
          className="nav-btn nav-next"
          onClick={() => setCurrentItemIndex(Math.min(checklist.items.length - 1, currentItemIndex + 1))}
          disabled={currentItemIndex === checklist.items.length - 1}
        >
          Próximo →
        </button>
      </div>

      <div className="checklist-item card">
        <h3 className="item-title">{currentItem.name}</h3>

        <div className="status-buttons">
          <button
            className={`status-btn status-c ${currentItem.status === 'C' ? 'active' : ''}`}
            onClick={() => handleStatusChange(currentItemIndex, 'C')}
          >
            ✓ Confere
          </button>
          <button
            className={`status-btn status-nc ${currentItem.status === 'N.C' ? 'active' : ''}`}
            onClick={() => handleStatusChange(currentItemIndex, 'N.C')}
          >
            ✗ Não Confere
          </button>
          <button
            className={`status-btn status-na ${currentItem.status === 'N.A' ? 'active' : ''}`}
            onClick={() => handleStatusChange(currentItemIndex, 'N.A')}
          >
            − Não Aplica
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="observation">Observação</label>
          <textarea
            id="observation"
            value={currentItem.observation}
            onChange={(e) => handleObservationChange(currentItemIndex, e.target.value)}
            placeholder="Descreva detalhes, problemas encontrados, etc."
          />
        </div>

        <div className="photo-section">
          <label>Fotos ({currentItem.photos.length})</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handlePhotoUpload(currentItemIndex, e.target.files)}
          />
          <button
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            📷 Adicionar Fotos
          </button>

          {photoPreview[currentItem.id] && photoPreview[currentItem.id].length > 0 && (
            <div className="photo-preview">
              {photoPreview[currentItem.id].map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo} alt={`Foto ${index + 1}`} />
                  <button
                    className="photo-delete"
                    onClick={() => handlePhotoDelete(currentItemIndex, index)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="checklist-actions">
        <button className="btn btn-danger" onClick={handleDiscardDraft}>
          🗑️ Descartar
        </button>
        <button
          className="btn btn-success"
          onClick={handleFinishChecklist}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? '⏳ Gerando...' : '✓ Finalizar'}
        </button>
      </div>

      <div className="item-list-toggle">
        <button 
          className="toggle-all-items"
          onClick={() => setShowAllItems(!showAllItems)}
        >
          {showAllItems ? '▲ Ocultar todos os itens' : '▼ Ver todos os itens'}
        </button>
      </div>

      {showAllItems && (
        <div className="item-list card">
          <h4>Todos os Itens</h4>
          <div className="item-grid">
            {checklist.items.map((item, index) => (
              <button
                key={item.id}
                className={`item-badge ${item.status ? `badge-${item.status.toLowerCase().replace('.', '')}` : 'badge-pending'} ${
                  index === currentItemIndex ? 'active' : ''
                }`}
                onClick={() => {
                  setCurrentItemIndex(index);
                  setShowAllItems(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="badge-number">{index + 1}</span>
                <span className="badge-status">{item.status || '?'}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
