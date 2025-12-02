import { useState, useEffect } from 'react';
import { ServiceOrder } from '../types';
import { supabase } from '../services/supabase';
import { generateServiceOrderPDF } from '../services/serviceOrderPdf';
import { generateServiceOrderExcel } from '../services/serviceOrderExcel';
import './ServiceOrderHistory.css';

interface ServiceOrderHistoryProps {
  onBack: () => void;
}

export const ServiceOrderHistory: React.FC<ServiceOrderHistoryProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading orders:', error);
        alert('Erro ao carregar ordens de serviço');
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao carregar ordens de serviço');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (order: ServiceOrder, type: 'pdf' | 'excel') => {
    setExporting(`${order.id}-${type}`);
    try {
      if (type === 'pdf') {
        await generateServiceOrderPDF(order);
      } else {
        await generateServiceOrderExcel(order);
      }
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Erro ao gerar arquivo');
    } finally {
      setExporting(null);
    }
  };

  const toggleDetails = (order: ServiceOrder) => {
    setSelectedOrder(selectedOrder?.id === order.id ? null : order);
  };

  if (loading) {
    return (
      <div className="service-order-history">
        <div className="history-header card">
          <button className="btn btn-secondary" onClick={onBack}>
            ← Voltar
          </button>
          <h2>Histórico de Ordens de Serviço</h2>
        </div>
        <div className="loading-state card">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="service-order-history">
        <div className="history-header card">
          <button className="btn btn-secondary" onClick={onBack}>
            ← Voltar
          </button>
          <h2>Histórico de Ordens de Serviço</h2>
        </div>
        <div className="empty-state card">
          <h3>📋 Nenhuma ordem de serviço criada</h3>
          <p>As ordens de serviço criadas aparecerão aqui.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-order-history">
      <div className="history-header card">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Voltar
        </button>
        <h2>Histórico de Ordens de Serviço</h2>
        <div className="history-count">{orders.length} ordem(ns)</div>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card card">
            <div className="order-summary" onClick={() => toggleDetails(order)}>
              <div className="summary-main">
                <div className="order-number-badge">
                  OSI #{order.order_number}
                </div>
                <div className="order-info">
                  <h3>{order.vehicle}</h3>
                  <div className="order-meta">
                    <span>📅 {new Date(order.date).toLocaleDateString('pt-BR')}</span>
                    <span>⏰ {order.time}</span>
                    <span>🏷️ {order.tag || 'Sem TAG'}</span>
                  </div>
                </div>
              </div>
              <div className="expand-icon">
                {selectedOrder?.id === order.id ? '▼' : '▶'}
              </div>
            </div>

            {selectedOrder?.id === order.id && (
              <div className="order-details">
                <div className="details-grid">
                  <div className="detail-section">
                    <h4>Dados do Equipamento</h4>
                    <div className="detail-item">
                      <span className="label">Veículo:</span>
                      <span className="value">{order.vehicle}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Equipamento:</span>
                      <span className="value">{order.equipment || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">TAG:</span>
                      <span className="value">{order.tag || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">KM Inicial:</span>
                      <span className="value">{order.km_initial || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">KM Final:</span>
                      <span className="value">{order.km_final || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Horímetro:</span>
                      <span className="value">{order.horimeter || '-'}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Tipo de Manutenção</h4>
                    <div className="maintenance-badges">
                      {order.maintenance_type && order.maintenance_type.length > 0 ? (
                        order.maintenance_type.map((type, i) => (
                          <span key={i} className="badge">{type}</span>
                        ))
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                </div>

                {order.service_description && (
                  <div className="detail-section full-width">
                    <h4>Descrição dos Serviços</h4>
                    <p>{order.service_description}</p>
                  </div>
                )}

                {order.parts_applied && (
                  <div className="detail-section full-width">
                    <h4>Peças Aplicadas</h4>
                    <p>{order.parts_applied}</p>
                  </div>
                )}

                {order.observations && (
                  <div className="detail-section full-width">
                    <h4>Observações</h4>
                    <p>{order.observations}</p>
                  </div>
                )}

                <div className="detail-section full-width">
                  <h4>Responsáveis</h4>
                  <div className="detail-item">
                    <span className="label">Mecânico:</span>
                    <span className="value">{order.mechanic || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Responsável Obra:</span>
                    <span className="value">{order.responsible || '-'}</span>
                  </div>
                </div>

                <div className="order-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleExport(order, 'pdf')}
                    disabled={exporting === `${order.id}-pdf`}
                  >
                    {exporting === `${order.id}-pdf` ? '⏳ Gerando...' : '📄 Baixar PDF'}
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleExport(order, 'excel')}
                    disabled={exporting === `${order.id}-excel`}
                  >
                    {exporting === `${order.id}-excel` ? '⏳ Gerando...' : '📊 Baixar Excel'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
