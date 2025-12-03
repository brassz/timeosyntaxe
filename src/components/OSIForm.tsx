import { useState, FormEvent } from 'react';
import { OSIOrdem } from '../types';
import { createOrdem } from '../services/osi';
import { generatePDF } from '../services/osiPDF';
import { generateExcel } from '../services/osiExcel';
import './OSIForm.css';

interface OSIFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const OSIForm = ({ onBack, onSuccess }: OSIFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<OSIOrdem>({
    data: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    veiculo: '',
    equipamento: '',
    km_inicial: '',
    km_final: '',
    tag: '',
    horimetro: '',
    manut_preditiva: false,
    manut_preventiva: false,
    manut_corretiva: false,
    manut_avaria: false,
    manut_oportunidade: false,
    manut_outros: false,
    descricao_servicos: '',
    pecas_aplicadas: '',
    observacoes: '',
    mecanico: '',
    responsavel: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Criar ordem no banco
      const ordemCriada = await createOrdem(formData);

      // Gerar PDF
      const pdfUrl = await generatePDF(ordemCriada);
      
      // Gerar Excel
      const excelUrl = await generateExcel(ordemCriada);

      // Atualizar ordem com URLs dos arquivos
      await createOrdem({
        ...ordemCriada,
        pdf_url: pdfUrl,
        excel_url: excelUrl
      });

      alert('✅ Ordem de Serviço criada com sucesso!');
      onSuccess();
    } catch (err) {
      console.error('Erro ao criar OS:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar ordem de serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="osi-form-container">
      <div className="osi-form-header">
        <button onClick={onBack} className="btn-back">
          ← Voltar
        </button>
        <h1>📝 Gerar Ordem de Serviço Interna</h1>
      </div>

      <form onSubmit={handleSubmit} className="osi-form">
        {error && (
          <div className="form-error">
            🚫 {error}
          </div>
        )}

        {/* Informações Básicas */}
        <div className="form-section">
          <h2>Informações Básicas</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="data">Data *</label>
              <input
                id="data"
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hora">Hora *</label>
              <input
                id="hora"
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="veiculo">Veículo *</label>
              <input
                id="veiculo"
                type="text"
                name="veiculo"
                value={formData.veiculo}
                onChange={handleChange}
                placeholder="Ex: Caminhão Mercedes-Benz"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="equipamento">Equipamento *</label>
              <input
                id="equipamento"
                type="text"
                name="equipamento"
                value={formData.equipamento}
                onChange={handleChange}
                placeholder="Ex: Escavadeira Hidráulica"
                required
              />
            </div>
          </div>
        </div>

        {/* Medições */}
        <div className="form-section">
          <h2>Medições</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="km_inicial">KM Inicial</label>
              <input
                id="km_inicial"
                type="text"
                name="km_inicial"
                value={formData.km_inicial}
                onChange={handleChange}
                placeholder="Ex: 150000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="km_final">KM Final</label>
              <input
                id="km_final"
                type="text"
                name="km_final"
                value={formData.km_final}
                onChange={handleChange}
                placeholder="Ex: 150050"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tag">TAG</label>
              <input
                id="tag"
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Ex: TAG-001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="horimetro">Horímetro</label>
              <input
                id="horimetro"
                type="text"
                name="horimetro"
                value={formData.horimetro}
                onChange={handleChange}
                placeholder="Ex: 5000h"
              />
            </div>
          </div>
        </div>

        {/* Tipo de Manutenção */}
        <div className="form-section">
          <h2>Tipo de Manutenção</h2>
          <div className="checkbox-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="manut_preditiva"
                checked={formData.manut_preditiva}
                onChange={handleChange}
              />
              <span>Preditiva</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="manut_preventiva"
                checked={formData.manut_preventiva}
                onChange={handleChange}
              />
              <span>Preventiva</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="manut_corretiva"
                checked={formData.manut_corretiva}
                onChange={handleChange}
              />
              <span>Corretiva</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="manut_avaria"
                checked={formData.manut_avaria}
                onChange={handleChange}
              />
              <span>Avaria</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="manut_oportunidade"
                checked={formData.manut_oportunidade}
                onChange={handleChange}
              />
              <span>Oportunidade</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="manut_outros"
                checked={formData.manut_outros}
                onChange={handleChange}
              />
              <span>Outros</span>
            </label>
          </div>
        </div>

        {/* Descrição dos Serviços */}
        <div className="form-section">
          <h2>Descrição dos Serviços *</h2>
          <div className="form-group">
            <textarea
              name="descricao_servicos"
              value={formData.descricao_servicos}
              onChange={handleChange}
              placeholder="Descreva detalhadamente os serviços realizados..."
              rows={6}
              required
            />
          </div>
        </div>

        {/* Peças Aplicadas */}
        <div className="form-section">
          <h2>Peças Aplicadas</h2>
          <div className="form-group">
            <textarea
              name="pecas_aplicadas"
              value={formData.pecas_aplicadas}
              onChange={handleChange}
              placeholder="Liste as peças aplicadas (uma por linha)&#10;Ex:&#10;- Filtro de óleo - Código: 12345&#10;- Correia dentada - Código: 67890"
              rows={6}
            />
          </div>
        </div>

        {/* Observações */}
        <div className="form-section">
          <h2>Observações</h2>
          <div className="form-group">
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Observações adicionais..."
              rows={4}
            />
          </div>
        </div>

        {/* Responsáveis */}
        <div className="form-section">
          <h2>Responsáveis</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="mecanico">Mecânico *</label>
              <input
                id="mecanico"
                type="text"
                name="mecanico"
                value={formData.mecanico}
                onChange={handleChange}
                placeholder="Nome do mecânico responsável"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="responsavel">Responsável Obra *</label>
              <input
                id="responsavel"
                type="text"
                name="responsavel"
                value={formData.responsavel}
                onChange={handleChange}
                placeholder="Nome do responsável da obra"
                required
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="form-actions">
          <button type="button" onClick={onBack} className="btn-cancel" disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '⏳ Gerando OS...' : '✅ Gerar OS com PDF e Excel'}
          </button>
        </div>
      </form>
    </div>
  );
};
