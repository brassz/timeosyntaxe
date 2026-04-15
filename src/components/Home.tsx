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
  { value: 'Escavadeira Hidráulica', label: 'Escavadeira Hidráulica' },
  { value: 'Retroescavadeira', label: 'Retroescavadeira' },
  { value: 'Pá Carregadeira', label: 'Pá Carregadeira' },
  { value: 'Motoniveladora', label: 'Motoniveladora' },
  { value: 'Rolo Compactador', label: 'Rolo Compactador' },
  { value: 'Trator de Esteiras', label: 'Trator de Esteiras' },
  { value: 'Trator Agrícola', label: 'Trator Agrícola' },
  { value: 'Caminhão', label: 'Caminhão' },
  { value: 'Caminhão Basculante', label: 'Caminhão Basculante' },
  { value: 'Mini Escavadeira', label: 'Mini Escavadeira' },
  { value: 'Skid Steer', label: 'Skid Steer' },
  { value: 'Outra', label: 'Outra' },
];

export const Home: React.FC<HomeProps> = ({ onStartChecklist, onViewHistory }) => {
  const [operator, setOperator] = useState('');
  const [machine, setMachine] = useState('');
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
              value: m.name,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!operator.trim() || !machine.trim() || !location.trim() || !tag.trim() || !horimeter.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onStartChecklist({
      operator: operator.trim(),
      machine: machine.trim(),
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
            <select
              id="machine"
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
              required
              disabled={isLoadingMachines && machineOptions.length === 0}
            >
              <option value="">Selecione a máquina</option>
              {machineOptions.map((m) => (
                <option key={m.label} value={m.value}>
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
