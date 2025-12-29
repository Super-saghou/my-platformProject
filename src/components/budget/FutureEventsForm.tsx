import { useState, useEffect } from 'react';
import { budgetService } from '../../services/budgetService';
import type { FutureEvent, RecetteCategory, DepensePart } from '../../types/budget';
import { RECETTE_CATEGORIES, DEPENSE_PARTS } from '../../types/budget';
import './FutureEventsForm.css';

interface FutureEventsFormProps {
  communeId: string;
}

function FutureEventsForm({ communeId }: FutureEventsFormProps) {
  const [events, setEvents] = useState<FutureEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FutureEvent | null>(null);
  const [formData, setFormData] = useState({
    annee: new Date().getFullYear(),
    description: '',
    impactEstime: 0,
    rubrique: '' as RecetteCategory | DepensePart | '',
    type: 'depense' as 'recette' | 'depense',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, [communeId]);

  const loadEvents = () => {
    const data = budgetService.getCommuneBudgetData(communeId);
    setEvents(data.evenementsFuturs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.rubrique) {
      setError('Veuillez sélectionner une rubrique');
      return;
    }

    try {
      if (editingEvent) {
        budgetService.updateFutureEvent(communeId, editingEvent.id, {
          ...formData,
          rubrique: formData.rubrique as RecetteCategory | DepensePart,
        });
      } else {
        budgetService.addFutureEvent(communeId, {
          ...formData,
          rubrique: formData.rubrique as RecetteCategory | DepensePart,
        });
      }
      loadEvents();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (event: FutureEvent) => {
    setEditingEvent(event);
    setFormData({
      annee: event.annee,
      description: event.description,
      impactEstime: event.impactEstime,
      rubrique: event.rubrique,
      type: event.type,
    });
    setShowForm(true);
  };

  const handleDelete = (eventId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        budgetService.deleteFutureEvent(communeId, eventId);
        loadEvents();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      annee: new Date().getFullYear(),
      description: '',
      impactEstime: 0,
      rubrique: '' as RecetteCategory | DepensePart | '',
      type: 'depense' as 'recette' | 'depense',
    });
    setEditingEvent(null);
    setShowForm(false);
    setError(null);
  };

  const availableRubriques = formData.type === 'recette'
    ? Object.entries(RECETTE_CATEGORIES).map(([code, nom]) => ({ code, nom }))
    : Object.entries(DEPENSE_PARTS).map(([code, nom]) => ({ code, nom }));

  return (
    <div className="future-events-form">
      <div className="events-header">
        <h2>Événements Futurs</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Ajouter un événement
        </button>
      </div>

      {showForm && (
        <div className="event-form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}</h3>
              <button className="close-button" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label>Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    setFormData({ ...formData, type: e.target.value as 'recette' | 'depense', rubrique: '' });
                  }}
                  required
                >
                  <option value="recette">Recette</option>
                  <option value="depense">Dépense</option>
                </select>
              </div>
              <div className="form-group">
                <label>Rubrique *</label>
                <select
                  value={formData.rubrique}
                  onChange={(e) => setFormData({ ...formData, rubrique: e.target.value as RecetteCategory | DepensePart })}
                  required
                >
                  <option value="">Sélectionner une rubrique</option>
                  {availableRubriques.map(({ code, nom }) => (
                    <option key={code} value={code}>
                      {code} - {nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Année *</label>
                <input
                  type="number"
                  min="2018"
                  value={formData.annee}
                  onChange={(e) => setFormData({ ...formData, annee: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Ex: Recruter 2 ingénieurs + 6 ouvriers"
                />
              </div>
              <div className="form-group">
                <label>Impact estimé (DT) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.impactEstime}
                  onChange={(e) => setFormData({ ...formData, impactEstime: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingEvent ? 'Modifier' : 'Créer'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="events-list">
        {events.length === 0 ? (
          <div className="empty-state">
            <p>Aucun événement futur enregistré</p>
          </div>
        ) : (
          <table className="events-table">
            <thead>
              <tr>
                <th>Année</th>
                <th>Type</th>
                <th>Rubrique</th>
                <th>Description</th>
                <th>Impact estimé (DT)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.annee}</td>
                  <td>
                    <span className={`type-badge ${event.type}`}>
                      {event.type === 'recette' ? 'Recette' : 'Dépense'}
                    </span>
                  </td>
                  <td className="rubrique-code">{event.rubrique}</td>
                  <td className="description-cell">{event.description}</td>
                  <td className="impact-cell">{event.impactEstime.toLocaleString('fr-FR')} DT</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(event)}>
                      Modifier
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(event.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default FutureEventsForm;

