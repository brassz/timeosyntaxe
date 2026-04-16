import { useState, useEffect } from 'react';
import { ChecklistData } from '../types';
import { loadDraft, loadMachinesCache, saveMachinesCache, CachedMachineOption } from '../services/storage';
import { getMachinesFromDB } from '../services/supabase';
import './Home.css';

interface HomeProps {
  onStartChecklist: (data: Partial<ChecklistData>) => void;
  onViewHistory: () => void;
}

const FALLBACK_MACHINES: CachedMachineOption[] = [
  { id: 'fallback-escavadeira', name: 'Escavadeira Hidráulica', label: 'Escavadeira Hidráulica' },
  { id: 'fallback-retro', name: 'Retroescavadeira', label: 'Retroescavadeira' },
  { id: 'fallback-pa', name: 'Pá Carregadeira', label: 'Pá Carregadeira' },
  { id: 'fallback-motoniveladora', name: 'Motoniveladora', label: 'Motoniveladora' },
  { id: 'fallback-rolo', name: 'Rolo Compactador', label: 'Rolo Compactador' },
  { id: 'fallback-trator-esteiras', name: 'Trator de Esteiras', label: 'Trator de Esteiras' },
  { id: 'fallback-trator-agricola', name: 'Trator Agrícola', label: 'Trator Agrícola' },
  { id: 'fallback-caminhao', name: 'Caminhão', label: 'Caminhão' },
  { id: 'fallback-caminhao-basculante', name: 'Caminhão Basculante', label: 'Caminhão Basculante' },
  { id: 'fallback-mini-escavadeira', name: 'Mini Escavadeira', label: 'Mini Escavadeira' },
  { id: 'fallback-skid', name: 'Skid Steer', label: 'Skid Steer' },
  { id: 'fallback-outra', name: 'Outra', label: 'Outra' },
];

export const Home: React.FC<HomeProps> = ({ onStartChecklist, onViewHistory }) => {
  const [operator, setOperator] = useState('');
  const [machineId, setMachineId] = useState('');
  const [machineName, setMachineName] = useState('');
  const [machineSearch, setMachineSearch] = useState('');
  const [location, setLocation] = useState('');
  const [tag, setTag] = useState('');
  const [horimeter, setHorimeter] = useState('');
  const [mileage, setMileage] = useState('');
  const [hasDraft, setHasDraft] = useState(false);
  const [machineOptions, setMachineOptions] = useState<CachedMachineOption[]>(() => {
    const cached = loadMachinesCache();
    return cached.length > 0 ? cached : FALLBACK_MACHINES;
  });
  const [isLoadingMachines, setIsLoadingMachines] = useState(false);

  useEffect(() => {
    const draft = loadDraft();
    setHasDraft(!!draft);
  }, []);

  useEffect(() => {
    const loadMachines = async () => {
      setIsLoadingMachines(true);
      try {
        const machines = await getMachinesFromDB();
        if (!machines || machines.length === 0) return;

        const options: CachedMachineOption[] = machines
          .filter((m) => m.active)
          .map((m) => {
            const plate = m.plate?.trim() || null;
            const model = m.model?.trim() || '';
            const labelParts = [m.name, model].filter(Boolean);
            const label = `${labelParts.join(' - ')}${plate ? ` (${plate})` : ''}`;
            return {
              id: m.id,
              name: m.name,
              label,
              status: m.status,
              plate,
            };
          });

        if (options.length > 0) {
          setMachineOptions(options);
          saveMachinesCache(options);
        }
      } catch (error) {
        console.error('Erro ao carregar máquinas:', error);
      } finally {
        setIsLoadingMachines(false);
      }
    };

    void loadMachines();
  }, []);

  const normalizedQuery = machineSearch.trim().toLowerCase();
  const filteredMachines = normalizedQuery
    ? machineOptions.filter((m) => {
        const haystack = `${m.name} ${m.label} ${m.plate ?? ''}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : machineOptions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!operator.trim() || !machineId.trim() || !location.trim() || !tag.trim() || !horimeter.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onStartChecklist({
      operator: operator.trim(),
      machine: machineName.trim(),
      location: location.trim(),
      tag: tag.trim(),
      horimeter: horimeter.trim(),
      mileage: mileage.trim(),
    });
  };

  return (
    <div className="home">
      <div className="home-content">
        <div className="welcome-card card">
          <h2>Bem-vindo!</h2>
          <p>
            Preencha as informações abaixo para começar.
          </p>
        </div>

        {hasDraft && (
          <div className="alert alert-info">
            ℹ️ Você possui um checklist em andamento. Ao iniciar um novo, o rascunho anterior será substituído.
          </div>
        )}

        <form onSubmit={handleSubmit} className="home-form card">
          <h3>Iniciar Novo Checklist</h3>

          <div className="form-group">
            <label htmlFor="operator">Inspecionado por *</label>
            <input
              id="operator"
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tag">TAG *</label>
            <input
              id="tag"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Ex: TAG-001, EQ-123, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="machine">Máquina *</label>
            <input
              type="text"
              value={machineSearch}
              onChange={(e) => setMachineSearch(e.target.value)}
              placeholder="Buscar por nome ou TAG..."
              style={{ marginBottom: '0.5rem' }}
            />
            <select
              id="machine"
              value={machineId}
              onChange={(e) => {
                const id = e.target.value;
                setMachineId(id);
                const selected = machineOptions.find((m) => m.id === id);
                setMachineName(selected?.name ?? '');
              }}
              required
              disabled={isLoadingMachines && machineOptions.length === 0}
            >
              <option value="">Selecione a máquina</option>
              {filteredMachines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            {isLoadingMachines && (
              <small style={{ color: 'var(--color-gray)' }}>
                Carregando máquinas do sistema...
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="location">Local da Operação *</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Obra Centro, Canteiro A, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="horimeter">Horímetro Atual *</label>
            <input
              id="horimeter"
              type="text"
              value={horimeter}
              onChange={(e) => setHorimeter(e.target.value)}
              placeholder="Ex: 1234.5"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mileage">Quilometragem (se aplicável)</label>
            <input
              id="mileage"
              type="text"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="Ex: 45678"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-large">
            🚜 Iniciar Checklist
          </button>
        </form>

        <button onClick={onViewHistory} className="btn btn-secondary btn-large">
          📋 Ver Histórico de Checklists
        </button>
      </div>
    </div>
  );
};
