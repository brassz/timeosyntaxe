import { useState, useEffect } from 'react';
import { User, OSIData, MaintenanceType } from '../types';
import { getNextOrderNumber, saveOSI, getOSIHistory } from '../services/supabase';
import { generateOSIPDF } from '../services/osiPdf';
import { generateOSIExcel } from '../services/osiExcel';
import './OSI.css';

interface OSIProps {
  user: User;
  onBack: () => void;
}

type OSITab = 'new' | 'history';

export const OSI: React.FC<OSIProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<OSITab>('new');
  const [orderNumber, setOrderNumber] = useState<number>(2200);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<OSIData[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<OSIData | null>(null);
  
  const [formData, setFormData] = useState<Omit<OSIData, 'id' | 'order_number' | 'created_at' | 'created_by'>>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    vehicle: '',
    equipment: '',
    km_inicial: '',
    km_final: '',
    tag: '',
    horimeter: '',
    maintenance_type: {
      preditiva: false,
      preventiva: false,
      corretiva: false,
      avaria: false,
      oportunidade: false,
      outros: false
    },
    services_description: '',
    parts_applied: '',
    observations: '',
    mechanic: '',
    responsible: '',
    photos: []
  });

  useEffect(() => {
    loadNextOrderNumber();
    loadHistory();
  }, []);

  const loadNextOrderNumber = async () => {
    const nextNumber = await getNextOrderNumber();
    setOrderNumber(nextNumber);
  };

  const loadHistory = async () => {
    const data = await getOSIHistory();
    setHistory(data);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMaintenanceTypeChange = (type: keyof MaintenanceType) => {
    setFormData(prev => ({
      ...prev,
      maintenance_type: {
        ...prev.maintenance_type,
        [type]: !prev.maintenance_type[type]
      }
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentPhotosCount = formData.photos?.length || 0;
    const MAX_PHOTOS = 10;

    if (currentPhotosCount >= MAX_PHOTOS) {
      alert(`Limite de ${MAX_PHOTOS} fotos atingido!`);
      e.target.value = '';
      return;
    }

    const remainingSlots = MAX_PHOTOS - currentPhotosCount;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      alert(`Você pode adicionar apenas mais ${remainingSlots} foto(s). Limite: ${MAX_PHOTOS} fotos.`);
    }

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => {
          const currentCount = prev.photos?.length || 0;
          if (currentCount >= MAX_PHOTOS) {
            return prev;
          }
          return {
            ...prev,
            photos: [...(prev.photos || []), base64]
          };
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSaveOSI = async () => {
    if ((!formData.vehicle && !formData.equipment) || !formData.services_description) {
      alert('Por favor, preencha pelo menos Veículo ou Equipamento e a Descrição dos Serviços');
      return;
    }

    setLoading(true);
    try {
      const osiData: Omit<OSIData, 'id' | 'created_at'> = {
        order_number: orderNumber,
        ...formData,
        created_by: user.username
      };

      console.log('📝 Salvando OSI:', osiData);
      const saved = await saveOSI(osiData);
      
      if (saved) {
        console.log('✅ OSI salva, recarregando histórico...');
        alert('✅ Ordem de Serviço salva com sucesso!');
        resetForm();
        await loadNextOrderNumber();
        await loadHistory();
      } else {
        console.error('❌ Falha ao salvar OSI');
        alert('❌ Erro ao salvar Ordem de Serviço. Verifique o console para detalhes.');
      }
    } catch (error) {
      console.error('❌ Exception ao salvar OSI:', error);
      alert('❌ Erro ao salvar Ordem de Serviço. Verifique o console para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async (data?: OSIData) => {
    const osiData = data || { order_number: orderNumber, ...formData, created_by: user.username };
    
    try {
      await generateOSIPDF(osiData as OSIData);
      alert('✅ PDF gerado com sucesso!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('❌ Erro ao gerar PDF');
    }
  };

  const handleGenerateExcel = async (data?: OSIData) => {
    const osiData = data || { order_number: orderNumber, ...formData, created_by: user.username };
    
    try {
      await generateOSIExcel(osiData as OSIData);
      alert('✅ Excel gerado com sucesso!');
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('❌ Erro ao gerar Excel');
    }
  };

  const handleSaveAndGeneratePDF = async () => {
    if ((!formData.vehicle && !formData.equipment) || !formData.services_description) {
      alert('Por favor, preencha pelo menos Veículo ou Equipamento e a Descrição dos Serviços');
      return;
    }

    setLoading(true);
    try {
      const osiData: Omit<OSIData, 'id' | 'created_at'> = {
        order_number: orderNumber,
        ...formData,
        created_by: user.username
      };

      console.log('📝 Salvando OSI antes de gerar PDF...');
      const saved = await saveOSI(osiData);
      
      if (!saved) {
        console.error('❌ saveOSI retornou null ou undefined');
        alert('❌ Erro ao salvar Ordem de Serviço. Verifique o console para detalhes.');
        setLoading(false);
        return;
      }

      console.log('✅ OSI salva:', saved);

      // Converter DBOSI para OSIData (garantir compatibilidade)
      const osiForPDF: OSIData = {
        id: saved.id,
        order_number: saved.order_number,
        date: saved.date || osiData.date,
        time: saved.time || osiData.time,
        vehicle: saved.vehicle || osiData.vehicle,
        equipment: saved.equipment || osiData.equipment,
        km_inicial: saved.km_inicial || osiData.km_inicial,
        km_final: saved.km_final || osiData.km_final,
        tag: saved.tag || osiData.tag,
        horimeter: saved.horimeter || osiData.horimeter,
        maintenance_type: saved.maintenance_type || osiData.maintenance_type,
        services_description: saved.services_description || osiData.services_description,
        parts_applied: saved.parts_applied || osiData.parts_applied,
        observations: saved.observations || osiData.observations,
        mechanic: saved.mechanic || osiData.mechanic,
        responsible: saved.responsible || osiData.responsible,
        photos: saved.photos || osiData.photos || [],
        created_by: saved.created_by || osiData.created_by,
        created_at: saved.created_at
      };

      console.log('📄 Gerando PDF com dados:', osiForPDF);
      try {
        await generateOSIPDF(osiForPDF);
        console.log('✅ PDF gerado com sucesso');
        alert('✅ Ordem de Serviço salva e PDF gerado com sucesso!');
      } catch (pdfError) {
        console.error('❌ Erro ao gerar PDF:', pdfError);
        console.error('Stack:', (pdfError as Error).stack);
        alert('⚠️ OSI salva com sucesso, mas houve erro ao gerar PDF. Tente gerar o PDF novamente pelo histórico.');
      }
      
      resetForm();
      await loadNextOrderNumber();
      await loadHistory();
    } catch (error) {
      console.error('❌ Erro ao processar Ordem de Serviço:', error);
      alert('❌ Erro ao processar Ordem de Serviço. Verifique o console para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndGenerateExcel = async () => {
    if ((!formData.vehicle && !formData.equipment) || !formData.services_description) {
      alert('Por favor, preencha pelo menos Veículo ou Equipamento e a Descrição dos Serviços');
      return;
    }

    setLoading(true);
    try {
      const osiData: Omit<OSIData, 'id' | 'created_at'> = {
        order_number: orderNumber,
        ...formData,
        created_by: user.username
      };

      console.log('📝 Salvando OSI antes de gerar Excel...');
      const saved = await saveOSI(osiData);
      
      if (!saved) {
        console.error('❌ saveOSI retornou null ou undefined');
        alert('❌ Erro ao salvar Ordem de Serviço. Verifique o console para detalhes.');
        setLoading(false);
        return;
      }

      console.log('✅ OSI salva:', saved);

      // Converter DBOSI para OSIData (garantir compatibilidade)
      const osiForExcel: OSIData = {
        id: saved.id,
        order_number: saved.order_number,
        date: saved.date || osiData.date,
        time: saved.time || osiData.time,
        vehicle: saved.vehicle || osiData.vehicle,
        equipment: saved.equipment || osiData.equipment,
        km_inicial: saved.km_inicial || osiData.km_inicial,
        km_final: saved.km_final || osiData.km_final,
        tag: saved.tag || osiData.tag,
        horimeter: saved.horimeter || osiData.horimeter,
        maintenance_type: saved.maintenance_type || osiData.maintenance_type,
        services_description: saved.services_description || osiData.services_description,
        parts_applied: saved.parts_applied || osiData.parts_applied,
        observations: saved.observations || osiData.observations,
        mechanic: saved.mechanic || osiData.mechanic,
        responsible: saved.responsible || osiData.responsible,
        photos: saved.photos || osiData.photos || [],
        created_by: saved.created_by || osiData.created_by,
        created_at: saved.created_at
      };

      console.log('📊 Gerando Excel com dados:', osiForExcel);
      try {
        await generateOSIExcel(osiForExcel);
        console.log('✅ Excel gerado com sucesso');
        alert('✅ Ordem de Serviço salva e Excel gerado com sucesso!');
      } catch (excelError) {
        console.error('❌ Erro ao gerar Excel:', excelError);
        console.error('Stack:', (excelError as Error).stack);
        alert('⚠️ OSI salva com sucesso, mas houve erro ao gerar Excel. Tente gerar o Excel novamente pelo histórico.');
      }
      
      resetForm();
      await loadNextOrderNumber();
      await loadHistory();
    } catch (error) {
      console.error('❌ Erro ao processar Ordem de Serviço:', error);
      alert('❌ Erro ao processar Ordem de Serviço. Verifique o console para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      vehicle: '',
      equipment: '',
      km_inicial: '',
      km_final: '',
      tag: '',
      horimeter: '',
      maintenance_type: {
        preditiva: false,
        preventiva: false,
        corretiva: false,
        avaria: false,
        oportunidade: false,
        outros: false
      },
      services_description: '',
      parts_applied: '',
      observations: '',
      mechanic: '',
      responsible: '',
      photos: []
    });
  };

  return (
    <div className="osi-container">
      <div className="osi-header card">
        <div className="osi-title">
          <h2>📋 OSI - Ordem de Serviço Interna</h2>
          <p>Usuário: <strong>{user.name}</strong></p>
        </div>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Voltar
        </button>
      </div>

      <div className="osi-tabs card">
        <button
          className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          ➕ Nova Ordem
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 Histórico
        </button>
      </div>

      {activeTab === 'new' && (
        <div className="osi-form card">
          <div className="form-header">
            <h3>Nova Ordem de Serviço</h3>
            <div className="order-number">Nº {orderNumber}</div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="section-title">Dados do Veículo</div>
          <p style={{ fontSize: '0.85em', color: '#666', marginTop: '-5px', marginBottom: '10px' }}>
            * Preencha pelo menos Veículo ou Equipamento
          </p>

          <div className="form-row">
            <div className="form-group">
              <label>Veículo</label>
              <input
                type="text"
                value={formData.vehicle}
                onChange={(e) => handleInputChange('vehicle', e.target.value)}
                placeholder="Ex: Caminhão Mercedes"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>KM Inicial</label>
              <input
                type="text"
                value={formData.km_inicial}
                onChange={(e) => handleInputChange('km_inicial', e.target.value)}
                placeholder="Ex: 12345"
              />
            </div>
            <div className="form-group">
              <label>KM Final</label>
              <input
                type="text"
                value={formData.km_final}
                onChange={(e) => handleInputChange('km_final', e.target.value)}
                placeholder="Ex: 12450"
              />
            </div>
          </div>

          <div className="section-title">Dados do Equipamento</div>

          <div className="form-row">
            <div className="form-group">
              <label>Equipamento</label>
              <input
                type="text"
                value={formData.equipment}
                onChange={(e) => handleInputChange('equipment', e.target.value)}
                placeholder="Ex: Caçamba"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>TAG</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => handleInputChange('tag', e.target.value)}
                placeholder="Ex: TG-001"
              />
            </div>
            <div className="form-group">
              <label>Horímetro</label>
              <input
                type="text"
                value={formData.horimeter}
                onChange={(e) => handleInputChange('horimeter', e.target.value)}
                placeholder="Ex: 1234.5"
              />
            </div>
          </div>

          <div className="section-title">Tipo de Manutenção</div>

          <div className="maintenance-types">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.maintenance_type.preditiva}
                onChange={() => handleMaintenanceTypeChange('preditiva')}
              />
              <span>Preditiva</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.maintenance_type.preventiva}
                onChange={() => handleMaintenanceTypeChange('preventiva')}
              />
              <span>Preventiva</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.maintenance_type.corretiva}
                onChange={() => handleMaintenanceTypeChange('corretiva')}
              />
              <span>Corretiva</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.maintenance_type.avaria}
                onChange={() => handleMaintenanceTypeChange('avaria')}
              />
              <span>Avaria</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.maintenance_type.oportunidade}
                onChange={() => handleMaintenanceTypeChange('oportunidade')}
              />
              <span>Oportunidade</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.maintenance_type.outros}
                onChange={() => handleMaintenanceTypeChange('outros')}
              />
              <span>Outros</span>
            </label>
          </div>

          <div className="section-title">Descrição dos Serviços *</div>
          <div className="form-group">
            <textarea
              value={formData.services_description}
              onChange={(e) => handleInputChange('services_description', e.target.value)}
              placeholder="Descreva detalhadamente os serviços realizados..."
              rows={6}
              required
            />
          </div>

          <div className="section-title">Peças Aplicadas</div>
          <div className="form-group">
            <textarea
              value={formData.parts_applied}
              onChange={(e) => handleInputChange('parts_applied', e.target.value)}
              placeholder="Liste as peças utilizadas..."
              rows={4}
            />
          </div>

          <div className="section-title">Observações</div>
          <div className="form-group">
            <textarea
              value={formData.observations}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              placeholder="Observações adicionais..."
              rows={4}
            />
          </div>

          <div className="section-title">📷 Fotos ({formData.photos?.length || 0}/10)</div>
          <div className="photo-upload-section">
            <label className={`photo-upload-button ${(formData.photos?.length || 0) >= 10 ? 'disabled' : ''}`}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                disabled={(formData.photos?.length || 0) >= 10}
                style={{ display: 'none' }}
              />
              <span>📸 Adicionar Fotos {(formData.photos?.length || 0) >= 10 ? '(Limite Atingido)' : ''}</span>
            </label>
            
            {formData.photos && formData.photos.length > 0 && (
              <div className="photos-grid">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <img src={photo} alt={`Foto ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={() => handleRemovePhoto(index)}
                      title="Remover foto"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {(!formData.photos || formData.photos.length === 0) && (
              <div className="no-photos">
                <p>Nenhuma foto adicionada</p>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mecânico</label>
              <input
                type="text"
                value={formData.mechanic}
                onChange={(e) => handleInputChange('mechanic', e.target.value)}
                placeholder="Nome do mecânico"
              />
            </div>
            <div className="form-group">
              <label>Responsável Obra</label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => handleInputChange('responsible', e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={loading}
            >
              🔄 Limpar
            </button>
            <button
              className="btn btn-info"
              onClick={handleSaveOSI}
              disabled={loading}
            >
              💾 Salvar
            </button>
            <button
              className="btn btn-warning"
              onClick={handleSaveAndGenerateExcel}
              disabled={loading}
            >
              📊 Salvar e Gerar Excel
            </button>
            <button
              className="btn btn-success"
              onClick={handleSaveAndGeneratePDF}
              disabled={loading}
            >
              📄 Salvar e Gerar PDF
            </button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="osi-history card">
          <h3>Histórico de Ordens de Serviço</h3>
          
          {history.length === 0 ? (
            <div className="empty-state">
              <p>📭 Nenhuma ordem de serviço encontrada</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-header" onClick={() => setSelectedHistory(selectedHistory?.id === item.id ? null : item)}>
                    <div className="history-info">
                      <strong>OSI Nº {item.order_number}</strong>
                      <span>{item.vehicle} - {item.equipment || 'N/A'}</span>
                    </div>
                    <div className="history-meta">
                      <span>{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                      <span>{item.created_by}</span>
                    </div>
                  </div>
                  
                  {selectedHistory?.id === item.id && (
                    <div className="history-details">
                      <div className="detail-row">
                        <strong>Data/Hora:</strong>
                        <span>{item.date} às {item.time}</span>
                      </div>
                      <div className="detail-row">
                        <strong>TAG:</strong>
                        <span>{item.tag || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <strong>KM:</strong>
                        <span>{item.km_inicial} → {item.km_final}</span>
                      </div>
                      <div className="detail-row">
                        <strong>Horímetro:</strong>
                        <span>{item.horimeter || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <strong>Tipo:</strong>
                        <span>
                          {Object.entries(item.maintenance_type)
                            .filter(([_, value]) => value)
                            .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                            .join(', ') || 'N/A'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <strong>Serviços:</strong>
                        <span>{item.services_description}</span>
                      </div>
                      {item.parts_applied && (
                        <div className="detail-row">
                          <strong>Peças:</strong>
                          <span>{item.parts_applied}</span>
                        </div>
                      )}
                      {item.observations && (
                        <div className="detail-row">
                          <strong>Observações:</strong>
                          <span>{item.observations}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <strong>Mecânico:</strong>
                        <span>{item.mechanic || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <strong>Responsável:</strong>
                        <span>{item.responsible || 'N/A'}</span>
                      </div>
                      
                      {item.photos && item.photos.length > 0 && (
                        <div className="detail-row detail-photos">
                          <strong>Fotos:</strong>
                          <div className="history-photos-grid">
                            {item.photos.map((photo, idx) => (
                              <div key={idx} className="history-photo-item">
                                <img 
                                  src={photo} 
                                  alt={`Foto ${idx + 1}`}
                                  onClick={() => window.open(photo, '_blank')}
                                  title="Clique para ampliar"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="history-actions">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleGeneratePDF(item)}
                        >
                          📄 Gerar PDF
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleGenerateExcel(item)}
                        >
                          📊 Gerar Excel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
