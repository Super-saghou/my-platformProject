// Service pour l'import et l'export des données budgétaires
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type {
  BudgetImportRow,
  BudgetExportData,
} from '../types/budget';
import { budgetService } from './budgetService';
import { communeService } from './communeService';

export const importExportService = {
  // Exporter les données d'une commune en CSV
  exportToCSV: (communeId: string): void => {
    const commune = communeService.getCommuneById(communeId);
    if (!commune) {
      throw new Error('Commune non trouvée');
    }

    const data = budgetService.getCommuneBudgetData(communeId);
    const rows: BudgetImportRow[] = [];

    // Ajouter les recettes
    data.recettes.forEach((rubrique) => {
      rubrique.donnees.forEach((donnee) => {
        rows.push({
          annee: donnee.annee,
          rubrique: rubrique.code,
          type: 'recette',
          budgetVote: donnee.budgetVote,
          reel: donnee.reel,
        });
      });
    });

    // Ajouter les dépenses
    data.depenses.forEach((rubrique) => {
      rubrique.donnees.forEach((donnee) => {
        rows.push({
          annee: donnee.annee,
          rubrique: rubrique.code,
          type: 'depense',
          budgetVote: donnee.budgetVote,
          reel: donnee.reel,
        });
      });
    });

    // Convertir en CSV
    const csv = Papa.unparse(rows, {
      header: true,
      delimiter: ',',
    });

    // Télécharger le fichier
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `budget_${commune.nom}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Exporter les données d'une commune en Excel
  exportToExcel: (communeId: string): void => {
    const commune = communeService.getCommuneById(communeId);
    if (!commune) {
      throw new Error('Commune non trouvée');
    }

    const data = budgetService.getCommuneBudgetData(communeId);
    const workbook = XLSX.utils.book_new();

    // Feuille Recettes
    const recettesRows: any[] = [['Rubrique', 'Code', 'Année', 'Budget voté (DT)', 'Réel (DT)']];
    data.recettes.forEach((rubrique) => {
      rubrique.donnees.forEach((donnee) => {
        recettesRows.push([
          rubrique.nom,
          rubrique.code,
          donnee.annee,
          donnee.budgetVote,
          donnee.reel,
        ]);
      });
    });
    const recettesSheet = XLSX.utils.aoa_to_sheet(recettesRows);
    XLSX.utils.book_append_sheet(workbook, recettesSheet, 'Recettes');

    // Feuille Dépenses
    const depensesRows: any[] = [['Rubrique', 'Code', 'Année', 'Budget voté (DT)', 'Réel (DT)']];
    data.depenses.forEach((rubrique) => {
      rubrique.donnees.forEach((donnee) => {
        depensesRows.push([
          rubrique.nom,
          rubrique.code,
          donnee.annee,
          donnee.budgetVote,
          donnee.reel,
        ]);
      });
    });
    const depensesSheet = XLSX.utils.aoa_to_sheet(depensesRows);
    XLSX.utils.book_append_sheet(workbook, depensesSheet, 'Dépenses');

    // Feuille Événements futurs
    if (data.evenementsFuturs.length > 0) {
      const eventsRows: any[] = [
        ['Année', 'Description', 'Impact estimé (DT)', 'Rubrique', 'Type'],
      ];
      data.evenementsFuturs.forEach((event) => {
        eventsRows.push([
          event.annee,
          event.description,
          event.impactEstime,
          event.rubrique,
          event.type,
        ]);
      });
      const eventsSheet = XLSX.utils.aoa_to_sheet(eventsRows);
      XLSX.utils.book_append_sheet(workbook, eventsSheet, 'Événements futurs');
    }

    // Télécharger le fichier
    XLSX.writeFile(workbook, `budget_${commune.nom}_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  // Importer des données depuis un fichier CSV
  importFromCSV: (communeId: string, file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const rows = results.data as BudgetImportRow[];
            importExportService.processImportRows(communeId, rows);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  },

  // Importer des données depuis un fichier Excel
  importFromExcel: (communeId: string, file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const rows: BudgetImportRow[] = [];

          // Lire la feuille Recettes
          if (workbook.SheetNames.includes('Recettes')) {
            const sheet = workbook.Sheets['Recettes'];
            const sheetData = XLSX.utils.sheet_to_json(sheet) as any[];
            sheetData.forEach((row) => {
              rows.push({
                annee: parseInt(row['Année'] || row['annee']),
                rubrique: row['Code'] || row['code'],
                type: 'recette',
                budgetVote: parseFloat(row['Budget voté (DT)'] || row['budgetVote'] || 0),
                reel: parseFloat(row['Réel (DT)'] || row['reel'] || 0),
              });
            });
          }

          // Lire la feuille Dépenses
          if (workbook.SheetNames.includes('Dépenses')) {
            const sheet = workbook.Sheets['Dépenses'];
            const sheetData = XLSX.utils.sheet_to_json(sheet) as any[];
            sheetData.forEach((row) => {
              rows.push({
                annee: parseInt(row['Année'] || row['annee']),
                rubrique: row['Code'] || row['code'],
                type: 'depense',
                budgetVote: parseFloat(row['Budget voté (DT)'] || row['budgetVote'] || 0),
                reel: parseFloat(row['Réel (DT)'] || row['reel'] || 0),
              });
            });
          }

          importExportService.processImportRows(communeId, rows);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsArrayBuffer(file);
    });
  },

  // Traiter les lignes importées
  processImportRows: (communeId: string, rows: BudgetImportRow[]): void => {
    rows.forEach((row) => {
      try {
        budgetService.updateBudgetData(
          communeId,
          row.type,
          row.rubrique as any,
          row.annee,
          row.budgetVote || 0,
          row.reel || 0
        );
      } catch (error) {
        console.warn(`Erreur lors de l'import de la ligne:`, row, error);
      }
    });
  },

  // Générer un template CSV pour l'import
  generateTemplateCSV: (): void => {
    const template: BudgetImportRow[] = [
      {
        annee: 2024,
        rubrique: 'R1',
        type: 'recette',
        budgetVote: 100000,
        reel: 95000,
      },
      {
        annee: 2024,
        rubrique: 'D1',
        type: 'depense',
        budgetVote: 80000,
        reel: 78000,
      },
    ];

    const csv = Papa.unparse(template, {
      header: true,
      delimiter: ',',
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_budget_import.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Exporter les données au format JSON (pour intégration Python)
  exportToJSON: (communeId: string): string => {
    const commune = communeService.getCommuneById(communeId);
    if (!commune) {
      throw new Error('Commune non trouvée');
    }

    const data = budgetService.getCommuneBudgetData(communeId);
    
    const exportData: BudgetExportData = {
      commune,
      recettes: data.recettes,
      depenses: data.depenses,
      evenementsFuturs: data.evenementsFuturs,
    };

    return JSON.stringify(exportData, null, 2);
  },
};

