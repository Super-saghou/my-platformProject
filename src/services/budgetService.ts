// Service pour gérer les données budgétaires
import type {
  CommuneBudgetData,
  RubriqueData,
  FutureEvent,
  RecetteCategory,
  DepensePart,
} from '../types/budget';
import { RECETTE_CATEGORIES, DEPENSE_PARTS } from '../types/budget';

const BUDGET_DATA_KEY = 'platform_budget_data';

// Initialiser les données budgétaires pour une commune
const initializeBudgetData = (communeId: string): CommuneBudgetData => {
  const recettes: RubriqueData[] = Object.keys(RECETTE_CATEGORIES).map((code) => ({
    code: code as RecetteCategory,
    nom: RECETTE_CATEGORIES[code as RecetteCategory],
    donnees: [],
  }));

  const depenses: RubriqueData[] = Object.keys(DEPENSE_PARTS).map((code) => ({
    code: code as DepensePart,
    nom: DEPENSE_PARTS[code as DepensePart],
    donnees: [],
  }));

  return {
    communeId,
    recettes,
    depenses,
    evenementsFuturs: [],
    lastUpdated: new Date().toISOString(),
  };
};

export const budgetService = {
  // Obtenir les données budgétaires d'une commune
  getCommuneBudgetData: (communeId: string): CommuneBudgetData => {
    try {
      const allDataStr = localStorage.getItem(BUDGET_DATA_KEY);
      if (!allDataStr) {
        return initializeBudgetData(communeId);
      }
      
      const allData: Record<string, CommuneBudgetData> = JSON.parse(allDataStr);
      if (!allData[communeId]) {
        return initializeBudgetData(communeId);
      }
      
      return allData[communeId];
    } catch {
      return initializeBudgetData(communeId);
    }
  },

  // Sauvegarder les données budgétaires d'une commune
  saveCommuneBudgetData: (data: CommuneBudgetData): void => {
    try {
      const allDataStr = localStorage.getItem(BUDGET_DATA_KEY);
      const allData: Record<string, CommuneBudgetData> = allDataStr
        ? JSON.parse(allDataStr)
        : {};
      
      allData[data.communeId] = {
        ...data,
        lastUpdated: new Date().toISOString(),
      };
      
      localStorage.setItem(BUDGET_DATA_KEY, JSON.stringify(allData));
    } catch (error) {
      throw new Error('Erreur lors de la sauvegarde des données budgétaires');
    }
  },

  // Ajouter ou mettre à jour une donnée budgétaire
  updateBudgetData: (
    communeId: string,
    type: 'recette' | 'depense',
    rubriqueCode: RecetteCategory | DepensePart,
    annee: number,
    budgetVote: number,
    reel: number
  ): void => {
    const data = budgetService.getCommuneBudgetData(communeId);
    const rubriques = type === 'recette' ? data.recettes : data.depenses;
    const rubrique = rubriques.find((r) => r.code === rubriqueCode);
    
    if (!rubrique) {
      throw new Error('Rubrique non trouvée');
    }

    // Vérifier que les valeurs ne sont pas négatives
    if (budgetVote < 0 || reel < 0) {
      throw new Error('Les valeurs ne peuvent pas être négatives');
    }

    // Trouver ou créer la donnée pour cette année
    const existingDataIndex = rubrique.donnees.findIndex((d) => d.annee === annee);
    
    if (existingDataIndex >= 0) {
      rubrique.donnees[existingDataIndex] = { annee, budgetVote, reel };
    } else {
      rubrique.donnees.push({ annee, budgetVote, reel });
      // Trier par année
      rubrique.donnees.sort((a, b) => a.annee - b.annee);
    }

    budgetService.saveCommuneBudgetData(data);
  },

  // Ajouter une année à une rubrique
  addYearToRubrique: (
    communeId: string,
    type: 'recette' | 'depense',
    rubriqueCode: RecetteCategory | DepensePart,
    annee: number
  ): void => {
    const data = budgetService.getCommuneBudgetData(communeId);
    const rubriques = type === 'recette' ? data.recettes : data.depenses;
    const rubrique = rubriques.find((r) => r.code === rubriqueCode);
    
    if (!rubrique) {
      throw new Error('Rubrique non trouvée');
    }

    // Vérifier si l'année existe déjà
    if (rubrique.donnees.some((d) => d.annee === annee)) {
      throw new Error('Cette année existe déjà pour cette rubrique');
    }

    rubrique.donnees.push({ annee, budgetVote: 0, reel: 0 });
    rubrique.donnees.sort((a, b) => a.annee - b.annee);

    budgetService.saveCommuneBudgetData(data);
  },

  // Valider l'équilibre budgétaire (recettes = dépenses)
  validateBudgetBalance: (communeId: string, annee: number): { valid: boolean; message: string } => {
    const data = budgetService.getCommuneBudgetData(communeId);
    
    // Calculer le total des recettes pour l'année
    const totalRecettes = data.recettes.reduce((sum, rubrique) => {
      const donnee = rubrique.donnees.find((d) => d.annee === annee);
      return sum + (donnee?.budgetVote || 0);
    }, 0);

    // Calculer le total des dépenses pour l'année
    const totalDepenses = data.depenses.reduce((sum, rubrique) => {
      const donnee = rubrique.donnees.find((d) => d.annee === annee);
      return sum + (donnee?.budgetVote || 0);
    }, 0);

    if (Math.abs(totalRecettes - totalDepenses) > 0.01) {
      return {
        valid: false,
        message: `Équilibre non respecté pour ${annee}: Recettes = ${totalRecettes.toFixed(2)} DT, Dépenses = ${totalDepenses.toFixed(2)} DT`,
      };
    }

    return { valid: true, message: 'Équilibre respecté' };
  },

  // Ajouter un événement futur
  addFutureEvent: (
    communeId: string,
    event: Omit<FutureEvent, 'id' | 'createdAt' | 'updatedAt'>
  ): FutureEvent => {
    const data = budgetService.getCommuneBudgetData(communeId);
    
    const newEvent: FutureEvent = {
      ...event,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.evenementsFuturs.push(newEvent);
    data.evenementsFuturs.sort((a, b) => a.annee - b.annee);
    
    budgetService.saveCommuneBudgetData(data);
    return newEvent;
  },

  // Mettre à jour un événement futur
  updateFutureEvent: (communeId: string, eventId: string, updates: Partial<Omit<FutureEvent, 'id' | 'createdAt'>>): FutureEvent => {
    const data = budgetService.getCommuneBudgetData(communeId);
    const eventIndex = data.evenementsFuturs.findIndex((e) => e.id === eventId);
    
    if (eventIndex === -1) {
      throw new Error('Événement non trouvé');
    }

    const updatedEvent: FutureEvent = {
      ...data.evenementsFuturs[eventIndex],
      ...updates,
      id: data.evenementsFuturs[eventIndex].id,
      createdAt: data.evenementsFuturs[eventIndex].createdAt,
      updatedAt: new Date().toISOString(),
    };

    data.evenementsFuturs[eventIndex] = updatedEvent;
    budgetService.saveCommuneBudgetData(data);
    
    return updatedEvent;
  },

  // Supprimer un événement futur
  deleteFutureEvent: (communeId: string, eventId: string): void => {
    const data = budgetService.getCommuneBudgetData(communeId);
    data.evenementsFuturs = data.evenementsFuturs.filter((e) => e.id !== eventId);
    budgetService.saveCommuneBudgetData(data);
  },

  // Supprimer toutes les données budgétaires d'une commune
  deleteCommuneBudgetData: (communeId: string): void => {
    try {
      const allDataStr = localStorage.getItem(BUDGET_DATA_KEY);
      if (!allDataStr) return;
      
      const allData: Record<string, CommuneBudgetData> = JSON.parse(allDataStr);
      delete allData[communeId];
      
      localStorage.setItem(BUDGET_DATA_KEY, JSON.stringify(allData));
    } catch {
      // Ignorer les erreurs
    }
  },
};

