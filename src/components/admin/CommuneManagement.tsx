import { useState, useEffect } from 'react';
import { communeService } from '../../services/communeService';
import type { Commune } from '../../types/budget';
import './CommuneManagement.css';

interface CommuneFormData {
  nom: string;
  code: string;
  gouvernorat: string;
  delegation: string;
}

function CommuneManagement() {
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCommune, setEditingCommune] = useState<Commune | null>(null);
  const [formData, setFormData] = useState<CommuneFormData>({
    nom: '',
    code: '',
    gouvernorat: '',
    delegation: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCommunes();
  }, []);

  const loadCommunes = () => {
    const allCommunes = communeService.getAllCommunes();
    setCommunes(allCommunes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingCommune) {
        communeService.updateCommune(editingCommune.id, formData);
      } else {
        communeService.createCommune(formData);
      }
      loadCommunes();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (commune: Commune) => {
    setEditingCommune(commune);
    setFormData({
      nom: commune.nom,
      code: commune.code,
      gouvernorat: commune.gouvernorat,
      delegation: commune.delegation || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commune ?')) {
      try {
        communeService.deleteCommune(id);
        loadCommunes();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      code: '',
      gouvernorat: '',
      delegation: '',
    });
    setEditingCommune(null);
    setShowForm(false);
    setError(null);
  };

  const filteredCommunes = communes.filter((commune) =>
    commune.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commune.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commune.gouvernorat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="commune-management">
      <div className="commune-header">
        <h2>Gestion des Communes</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Ajouter une commune
        </button>
      </div>

      {showForm && (
        <div className="commune-form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingCommune ? 'Modifier la commune' : 'Nouvelle commune'}</h3>
              <button className="close-button" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label>Nom de la commune *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gouvernorat *</label>
                <input
                  type="text"
                  value={formData.gouvernorat}
                  onChange={(e) => setFormData({ ...formData, gouvernorat: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Délégation</label>
                <input
                  type="text"
                  value={formData.delegation}
                  onChange={(e) => setFormData({ ...formData, delegation: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingCommune ? 'Modifier' : 'Créer'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="commune-search">
        <input
          type="text"
          placeholder="Rechercher une commune..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="commune-list">
        {filteredCommunes.length === 0 ? (
          <div className="empty-state">
            <p>Aucune commune trouvée</p>
          </div>
        ) : (
          <table className="commune-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Code</th>
                <th>Gouvernorat</th>
                <th>Délégation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommunes.map((commune) => (
                <tr key={commune.id}>
                  <td>{commune.nom}</td>
                  <td>{commune.code}</td>
                  <td>{commune.gouvernorat}</td>
                  <td>{commune.delegation || '-'}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(commune)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(commune.id)}
                    >
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

export default CommuneManagement;

