import { useState, useEffect } from 'react';
import { OSIOrdem } from '../types';
import { getOrdens, deleteOrdem, filterOrdens } from '../services/osi';
import './OSIHistory.css';

interface OSIHistoryProps {
  onBack: () => void;
}

export const OSIHistory = ({ onBack }: OSIHistoryProps) => {
  const [ordens, setOrdens] = useState<OSIOrdem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterNumeroOS, setFilterNumeroOS] = useState('');
  const [filterVeiculo, setFilterVeiculo] = useState('');
  const [filterEquipamento, setFilterEquipamento] = useState('');

  useEffect(() => {
    loadOrdens();
  }, []);

  const loadOrdens = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getOrdens();
      setOrdens(data);
    } catch (err) {
      setError('Erro ao carregar histórico de ordens');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await filterOrdens({
        startDate: filterStartDate,
        endDate: filterEndDate,
        numeroOS: filterNumeroOS ? parseInt(filterNumeroOS) : undefined,
        veiculo: filterVeiculo,
        equipamento: filterEquipamento
      });
      setOrdens(data);
    } catch (err) {
      setError('Erro ao filtrar ordens');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterNumeroOS('');
    setFilterVeiculo('');
    setFilterEquipamento('');
    loadOrdens();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
      return;
    }

    try {
      await deleteOrdem(id);
      alert('✅ Ordem de serviço excluída com sucesso!');
      loadOrdens();
    } catch (err) {
      alert('❌ Erro ao excluir ordem de serviço');
      console.error(err);
    }
  };

  const openFile = (url: string | undefined) => {
    if (!url) {
      alert('Arquivo não disponível');
      return;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="osi-history-container">
      <div className="history-header">
        <button onClick={onBack} className="btn-back">
          ← Voltar
        </button>
        <h1>📊 Histórico de Ordens de Serviço</h1>
      </div>

      {/* Filtros */}
      <div className="filters-container">
        <h2>🔍 Filtros</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Data Inicial</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Data Final</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Nº OS</label>
            <input
              type="number"
              value={filterNumeroOS}
              onChange={(e) => setFilterNumeroOS(e.target.value)}
              placeholder="Ex: 123"
            />
          </div>

          <div className="filter-group">
            <label>Veículo</label>
            <input
              type="text"
              value={filterVeiculo}
              onChange={(e) => setFilterVeiculo(e.target.value)}
              placeholder="Ex: Caminhão"
            />
          </div>

          <div className="filter-group">
            <label>Equipamento</label>
            <input
              type="text"
              value={filterEquipamento}
              onChange={(e) => setFilterEquipamento(e.target.value)}
              placeholder="Ex: Escavadeira"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={handleFilter} className="btn-filter">
            🔍 Filtrar
          </button>
          <button onClick={handleClearFilters} className="btn-clear">
            ✖️ Limpar Filtros
          </button>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="history-error">
          🚫 {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading">
          ⏳ Carregando...
        </div>
      )}

      {/* Tabela de Ordens */}
      {!loading && !error && (
        <div className="table-container">
          {ordens.length === 0 ? (
            <div className="no-data">
              📭 Nenhuma ordem de serviço encontrada
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Nº OS</th>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Veículo</th>
                  <th>Equipamento</th>
                  <th>Mecânico</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {ordens.map((ordem) => (
                  <tr key={ordem.id}>
                    <td className="text-center">
                      <strong>#{ordem.numero_os || 'N/A'}</strong>
                    </td>
                    <td>{ordem.data}</td>
                    <td>{ordem.hora}</td>
                    <td>{ordem.veiculo}</td>
                    <td>{ordem.equipamento}</td>
                    <td>{ordem.mecanico}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openFile(ordem.pdf_url)}
                          className="btn-action btn-pdf"
                          title="Abrir PDF"
                          disabled={!ordem.pdf_url}
                        >
                          📄 PDF
                        </button>
                        <button
                          onClick={() => openFile(ordem.excel_url)}
                          className="btn-action btn-excel"
                          title="Abrir Excel"
                          disabled={!ordem.excel_url}
                        >
                          📊 Excel
                        </button>
                        <button
                          onClick={() => handleDelete(ordem.id!)}
                          className="btn-action btn-delete"
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Resumo */}
      {!loading && !error && ordens.length > 0 && (
        <div className="summary">
          <p>📊 Total de ordens: <strong>{ordens.length}</strong></p>
        </div>
      )}
    </div>
  );
};
