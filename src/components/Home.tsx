import { useState, useEffect } from 'react';
import { ChecklistData } from '../types';
import { loadDraft } from '../services/storage';
import './Home.css';

interface HomeProps {
  onStartChecklist: (data: Partial<ChecklistData>) => void;
  onViewHistory: () => void;
}

const MACHINES = [
  'Escavadeira Hidráulica',
  'Retroescavadeira',
  'Pá Carregadeira',
  'Motoniveladora',
  'Rolo Compactador',
  'Trator de Esteiras',
  'Caminhão Basculante',
  'Mini Escavadeira',
  'Skid Steer',
  'Outra',
];

export const Home: React.FC<HomeProps> = ({ onStartChecklist, onViewHistory }) => {
  const [operator, setOperator] = useState('');
  const [machine, setMachine] = useState('');
  const [location, setLocation] = useState('');
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    const draft = loadDraft();
    setHasDraft(!!draft);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!operator.trim() || !machine.trim() || !location.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    onStartChecklist({
      operator: operator.trim(),
      machine: machine.trim(),
      location: location.trim(),
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
            <label htmlFor="operator">Nome do Operador *</label>
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
            <label htmlFor="machine">Máquina *</label>
            <select
              id="machine"
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
              required
            >
              <option value="">Selecione a máquina</option>
              {MACHINES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
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
