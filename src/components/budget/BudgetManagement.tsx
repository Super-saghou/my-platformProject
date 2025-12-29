import { useState, useEffect } from 'react';
import { communeService } from '../../services/communeService';
import { authService } from '../../services/auth';
import type { Commune } from '../../types/budget';
import BudgetDataEntry from './BudgetDataEntry';
import FutureEventsForm from './FutureEventsForm';
import './BudgetManagement.css';

function BudgetManagement() {
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [selectedCommuneId, setSelectedCommuneId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'budget' | 'events'>('budget');

  useEffect(() => {
    loadCommunes();
  }, []);

  const loadCommunes = () => {
    const session = authService.getCurrentSession();
    if (!session) return;

    // Admin voit toutes les communes, utilisateur voit seulement celles qui lui sont assignées
    const allCommunes = session.role === 'admin'
      ? communeService.getAllCommunes()
      : communeService.getCommunesByUserId(session.id);
    
    setCommunes(allCommunes);
    
    // Sélectionner automatiquement la première commune si disponible
    if (allCommunes.length > 0 && !selectedCommuneId) {
      setSelectedCommuneId(allCommunes[0].id);
    }
  };

  const selectedCommune = communes.find((c) => c.id === selectedCommuneId);

  if (communes.length === 0) {
    return (
      <div className="budget-management-empty">
        <p>Aucune commune disponible. Veuillez contacter un administrateur pour ajouter une commune.</p>
      </div>
    );
  }

  return (
    <div className="budget-management">
      <div className="commune-selector">
        <label htmlFor="commune-select">Sélectionner une commune :</label>
        <select
          id="commune-select"
          value={selectedCommuneId || ''}
          onChange={(e) => setSelectedCommuneId(e.target.value)}
          className="commune-select"
        >
          <option value="">-- Sélectionner --</option>
          {communes.map((commune) => (
            <option key={commune.id} value={commune.id}>
              {commune.nom} ({commune.code}) - {commune.gouvernorat}
            </option>
          ))}
        </select>
      </div>

      {selectedCommuneId && selectedCommune && (
        <>
          <div className="commune-info">
            <h2>{selectedCommune.nom}</h2>
            <p>
              Code: {selectedCommune.code} | Gouvernorat: {selectedCommune.gouvernorat}
              {selectedCommune.delegation && ` | Délégation: ${selectedCommune.delegation}`}
            </p>
          </div>

          <div className="budget-sections">
            <div className="section-tabs">
              <button
                className={`section-tab ${activeSection === 'budget' ? 'active' : ''}`}
                onClick={() => setActiveSection('budget')}
              >
                Données Budgétaires
              </button>
              <button
                className={`section-tab ${activeSection === 'events' ? 'active' : ''}`}
                onClick={() => setActiveSection('events')}
              >
                Événements Futurs
              </button>
            </div>

            <div className="section-content">
              {activeSection === 'budget' && (
                <BudgetDataEntry communeId={selectedCommuneId} />
              )}
              {activeSection === 'events' && (
                <FutureEventsForm communeId={selectedCommuneId} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BudgetManagement;

