import { useState, useEffect } from 'react';
import { budgetService } from '../../services/budgetService';
import { importExportService } from '../../services/importExportService';
import type {
  CommuneBudgetData,
  RecetteCategory,
  DepensePart,
} from '../../types/budget';
import './BudgetDataEntry.css';

interface BudgetDataEntryProps {
  communeId: string;
}

function BudgetDataEntry({ communeId }: BudgetDataEntryProps) {
  const [activeTab, setActiveTab] = useState<'recettes' | 'depenses'>('recettes');
  const [data, setData] = useState<CommuneBudgetData | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    loadData();
  }, [communeId]);

  const loadData = () => {
    const budgetData = budgetService.getCommuneBudgetData(communeId);
    setData(budgetData);
  };

  const handleCellChange = (
    type: 'recette' | 'depense',
    rubriqueCode: RecetteCategory | DepensePart,
    annee: number,
    field: 'budgetVote' | 'reel',
    value: string
  ) => {
    if (!data) return;

    const numValue = parseFloat(value) || 0;
    
    if (numValue < 0) {
      setValidationMessage('Les valeurs ne peuvent pas être négatives');
      return;
    }

    try {
      // Obtenir la valeur actuelle
      const rubriques = type === 'recette' ? data.recettes : data.depenses;
      const rubrique = rubriques.find((r) => r.code === rubriqueCode);
      if (!rubrique) return;

      const existingData = rubrique.donnees.find((d) => d.annee === annee);
      const currentBudgetVote = existingData?.budgetVote || 0;
      const currentReel = existingData?.reel || 0;

      budgetService.updateBudgetData(
        communeId,
        type,
        rubriqueCode,
        annee,
        field === 'budgetVote' ? numValue : currentBudgetVote,
        field === 'reel' ? numValue : currentReel
      );

      loadData();
      setValidationMessage(null);
    } catch (error) {
      setValidationMessage(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    }
  };

  const handleAddYear = (type: 'recette' | 'depense', rubriqueCode: RecetteCategory | DepensePart) => {
    const newYear = prompt('Entrez l\'année à ajouter:');
    if (!newYear) return;

    const year = parseInt(newYear);
    if (isNaN(year) || year < 2018) {
      setValidationMessage('L\'année doit être supérieure ou égale à 2018');
      return;
    }

    try {
      budgetService.addYearToRubrique(communeId, type, rubriqueCode, year);
      loadData();
      setValidationMessage(null);
    } catch (error) {
      setValidationMessage(error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'année');
    }
  };

  const handleValidateBalance = () => {
    setIsValidating(true);
    setValidationMessage(null);

    try {
      const result = budgetService.validateBudgetBalance(communeId, selectedYear);
      setValidationMessage(result.message);
      
      if (!result.valid) {
        setTimeout(() => {
          setIsValidating(false);
        }, 3000);
      } else {
        setIsValidating(false);
      }
    } catch (error) {
      setValidationMessage(error instanceof Error ? error.message : 'Erreur lors de la validation');
      setIsValidating(false);
    }
  };

  const handleExportCSV = () => {
    try {
      importExportService.exportToCSV(communeId);
      setValidationMessage('Export CSV réussi');
    } catch (error) {
      setValidationMessage(error instanceof Error ? error.message : 'Erreur lors de l\'export');
    }
  };

  const handleExportExcel = () => {
    try {
      importExportService.exportToExcel(communeId);
      setValidationMessage('Export Excel réussi');
    } catch (error) {
      setValidationMessage(error instanceof Error ? error.message : 'Erreur lors de l\'export');
    }
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.csv')) {
        await importExportService.importFromCSV(communeId, file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        await importExportService.importFromExcel(communeId, file);
      } else {
        setValidationMessage('Format de fichier non supporté. Utilisez CSV ou Excel.');
        return;
      }
      loadData();
      setValidationMessage('Import réussi');
    } catch (error) {
      setValidationMessage(error instanceof Error ? error.message : 'Erreur lors de l\'import');
    }
  };

  const handleDownloadTemplate = () => {
    importExportService.generateTemplateCSV();
  };

  if (!data) {
    return <div className="loading">Chargement...</div>;
  }

  // Obtenir toutes les années disponibles
  const allYears = new Set<number>();
  data.recettes.forEach((r) => r.donnees.forEach((d) => allYears.add(d.annee)));
  data.depenses.forEach((r) => r.donnees.forEach((d) => allYears.add(d.annee)));
  const years = Array.from(allYears).sort();

  const rubriques = activeTab === 'recettes' ? data.recettes : data.depenses;
  const budgetType = activeTab === 'recettes' ? 'recette' : 'depense';

  return (
    <div className="budget-data-entry">
      <div className="budget-header">
        <div className="budget-tabs">
          <button
            className={`tab-button ${activeTab === 'recettes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recettes')}
          >
            Recettes (12 catégories)
          </button>
          <button
            className={`tab-button ${activeTab === 'depenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('depenses')}
          >
            Dépenses (11 parties)
          </button>
        </div>
        <div className="budget-actions">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="year-select"
          >
            {years.length > 0 ? (
              years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            ) : (
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
            )}
          </select>
          <button className="btn-validate" onClick={handleValidateBalance} disabled={isValidating}>
            {isValidating ? 'Validation...' : 'Valider équilibre'}
          </button>
          <button className="btn-export" onClick={handleExportCSV}>
            Export CSV
          </button>
          <button className="btn-export" onClick={handleExportExcel}>
            Export Excel
          </button>
          <label className="btn-import">
            Import
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImportFile}
              style={{ display: 'none' }}
            />
          </label>
          <button className="btn-template" onClick={handleDownloadTemplate}>
            Template CSV
          </button>
        </div>
      </div>

      {validationMessage && (
        <div className={`validation-message ${validationMessage.includes('Erreur') || validationMessage.includes('non respecté') ? 'error' : 'success'}`}>
          {validationMessage}
        </div>
      )}

      <div className="budget-table-container">
        <table className="budget-table">
          <thead>
            <tr>
              <th>Rubrique</th>
              <th>Code</th>
              {years.map((year) => (
                <th key={year} className="year-column">
                  <div>{year}</div>
                  <div className="sub-columns">
                    <span>Voté</span>
                    <span>Réel</span>
                  </div>
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rubriques.map((rubrique) => (
              <tr key={rubrique.code}>
                <td className="rubrique-name">{rubrique.nom}</td>
                <td className="rubrique-code">{rubrique.code}</td>
                {years.map((year) => {
                  const donnee = rubrique.donnees.find((d) => d.annee === year);
                  return (
                    <td key={year} className="year-cell">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={donnee?.budgetVote || 0}
                        onChange={(e) =>
                          handleCellChange(
                            budgetType,
                            rubrique.code as RecetteCategory | DepensePart,
                            year,
                            'budgetVote',
                            e.target.value
                          )
                        }
                        className="cell-input"
                        placeholder="0"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={donnee?.reel || 0}
                        onChange={(e) =>
                          handleCellChange(
                            budgetType,
                            rubrique.code as RecetteCategory | DepensePart,
                            year,
                            'reel',
                            e.target.value
                          )
                        }
                        className="cell-input"
                        placeholder="0"
                      />
                    </td>
                  );
                })}
                <td>
                  <button
                    className="btn-add-year"
                    onClick={() => handleAddYear(budgetType, rubrique.code as RecetteCategory | DepensePart)}
                  >
                    + Année
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BudgetDataEntry;

