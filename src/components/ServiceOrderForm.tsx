import { useState, useRef } from 'react';
import { ServiceOrder } from '../types';
import { saveServiceOrder, getNextOrderNumber } from '../services/supabase';
import { generateServiceOrderPDF } from '../services/serviceOrderPdf';
import { generateServiceOrderExcel } from '../services/serviceOrderExcel';
import './ServiceOrderForm.css';

interface ServiceOrderFormProps {
  onBack: () => void;
}

export const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<ServiceOrder>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    vehicle: '',
    km_initial: '',
    km_final: '',
    equipment: '',
    tag: '',
    horimeter: '',
    maintenance_type: [],
    service_description: '',
    parts_applied: '',
    observations: '',
    mechanic: '',
    responsible: '',
  });

  // Load order number on mount
  useState(() => {
    getNextOrderNumber().then(setOrderNumber);
  });

  const handleChange = (field: keyof ServiceOrder, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleMaintenanceTypeToggle = (type: string) => {
    const types = formData.maintenance_type || [];
    if (types.includes(type)) {
      handleChange('maintenance_type', types.filter(t => t !== type));
    } else {
      handleChange('maintenance_type', [...types, type]);
    }
  };

  const handleExport = async (type: 'pdf' | 'excel') => {
    if (!formData.date || !formData.vehicle) {
      alert('Por favor, preencha ao menos a data e o veículo.');
      return;
    }

    setLoading(true);

    try {
      // Save to database first
      const currentOrderNumber = orderNumber || await getNextOrderNumber();
      const orderToSave = {
        ...formData,
        order_number: currentOrderNumber,
      };

      await saveServiceOrder(orderToSave);

      // Generate export
      if (type === 'pdf') {
        await generateServiceOrderPDF(orderToSave);
        alert('✅ PDF gerado com sucesso!');
      } else {
        await generateServiceOrderExcel(orderToSave);
        alert('✅ Excel gerado com sucesso!');
      }

      // Increment order number for next order
      setOrderNumber(currentOrderNumber + 1);
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        vehicle: '',
        km_initial: '',
        km_final: '',
        equipment: '',
        tag: '',
        horimeter: '',
        maintenance_type: [],
        service_description: '',
        parts_applied: '',
        observations: '',
        mechanic: '',
        responsible: '',
      });
    } catch (error) {
      console.error('Error exporting service order:', error);
      alert('❌ Erro ao gerar ordem de serviço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-order-form" ref={formRef}>
      <div className="form-header card">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Voltar
        </button>
        <h2>Ordem de Serviço Interno</h2>
        <div className="export-buttons">
          <button
            className="btn btn-success"
            onClick={() => handleExport('pdf')}
            disabled={loading}
          >
            📄 Gerar PDF
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleExport('excel')}
            disabled={loading}
          >
            📊 Gerar Excel
          </button>
        </div>
      </div>

      <div className="order-form-container card">
        <div className="order-header">
          <div className="company-info">
            <img src="/logo.png" alt="Logo" className="company-logo" />
            <div className="company-details">
              <strong>TERRAPLENAGEM GUIMARÃES SERRA LTDA</strong>
              <div>Endereço: Rod Celso Mello Azevedo nº24 321</div>
              <div>Dom Silverio - BH/MG CEP: 31.985-203</div>
              <div>CNPJ: 00.514.564/0001-42 TELEFONE: 31.3495-9108</div>
            </div>
          </div>
          <div className="order-number-box">
            <div className="order-label">ORDEM DE SERVIÇO INTERNA</div>
            <div className="order-number-label">Nº</div>
            <div className="order-number">{orderNumber || '---'}</div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-row">
            <div className="form-field">
              <label>DATA:</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>HORA:</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>DADOS DO EQUIPAMENTO</h3>
          <div className="form-row">
            <div className="form-field">
              <label>VEÍCULO:</label>
              <input
                type="text"
                value={formData.vehicle}
                onChange={(e) => handleChange('vehicle', e.target.value)}
                placeholder="Ex: Escavadeira"
              />
            </div>
            <div className="form-field">
              <label>EQUIPAMENTO:</label>
              <input
                type="text"
                value={formData.equipment}
                onChange={(e) => handleChange('equipment', e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>KM INICIAL:</label>
              <input
                type="text"
                value={formData.km_initial}
                onChange={(e) => handleChange('km_initial', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>TAG:</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => handleChange('tag', e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>KM FINAL:</label>
              <input
                type="text"
                value={formData.km_final}
                onChange={(e) => handleChange('km_final', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>HORÍMETRO:</label>
              <input
                type="text"
                value={formData.horimeter}
                onChange={(e) => handleChange('horimeter', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>TIPO DE MANUTENÇÃO</h3>
          <div className="maintenance-types">
            {['PREDITIVA', 'PREVENTIVA', 'CORRETIVA', 'AVARIA', 'OPORTUNIDADE', 'OUTROS'].map(type => (
              <label key={type} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.maintenance_type.includes(type)}
                  onChange={() => handleMaintenanceTypeToggle(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>DESCRIÇÃO DOS SERVIÇOS</h3>
          <textarea
            className="description-textarea"
            value={formData.service_description}
            onChange={(e) => handleChange('service_description', e.target.value)}
            rows={8}
            placeholder="Descreva os serviços realizados..."
          />
        </div>

        <div className="form-section">
          <h3>PEÇAS APLICADAS</h3>
          <textarea
            className="description-textarea"
            value={formData.parts_applied}
            onChange={(e) => handleChange('parts_applied', e.target.value)}
            rows={4}
            placeholder="Liste as peças utilizadas..."
          />
        </div>

        <div className="form-section">
          <h3>OBSERVAÇÕES</h3>
          <textarea
            className="description-textarea"
            value={formData.observations}
            onChange={(e) => handleChange('observations', e.target.value)}
            rows={6}
            placeholder="Observações adicionais..."
          />
        </div>

        <div className="form-section signatures">
          <div className="signature-field">
            <label>MECÂNICO</label>
            <input
              type="text"
              value={formData.mechanic}
              onChange={(e) => handleChange('mechanic', e.target.value)}
              placeholder="Nome do mecânico"
            />
            <div className="signature-line"></div>
          </div>
          <div className="signature-field">
            <label>RESPONSÁVEL OBRA</label>
            <input
              type="text"
              value={formData.responsible}
              onChange={(e) => handleChange('responsible', e.target.value)}
              placeholder="Nome do responsável"
            />
            <div className="signature-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
