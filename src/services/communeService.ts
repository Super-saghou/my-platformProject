// Service pour gérer les communes
import type { Commune } from '../types/budget';
import { budgetService } from './budgetService';

const COMMUNES_KEY = 'platform_communes';

export const communeService = {
  // Obtenir toutes les communes
  getAllCommunes: (): Commune[] => {
    try {
      const communesStr = localStorage.getItem(COMMUNES_KEY);
      if (!communesStr) return [];
      return JSON.parse(communesStr);
    } catch {
      return [];
    }
  },

  // Obtenir une commune par ID
  getCommuneById: (id: string): Commune | null => {
    const communes = communeService.getAllCommunes();
    return communes.find((c) => c.id === id) || null;
  },

  // Créer une nouvelle commune
  createCommune: (communeData: Omit<Commune, 'id' | 'createdAt' | 'updatedAt'>): Commune => {
    const communes = communeService.getAllCommunes();
    
    // Vérifier si le code existe déjà
    const existingCommune = communes.find((c) => c.code === communeData.code);
    if (existingCommune) {
      throw new Error('Une commune avec ce code existe déjà');
    }

    const newCommune: Commune = {
      ...communeData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    communes.push(newCommune);
    localStorage.setItem(COMMUNES_KEY, JSON.stringify(communes));
    
    return newCommune;
  },

  // Mettre à jour une commune
  updateCommune: (id: string, communeData: Partial<Omit<Commune, 'id' | 'createdAt'>>): Commune => {
    const communes = communeService.getAllCommunes();
    const communeIndex = communes.findIndex((c) => c.id === id);

    if (communeIndex === -1) {
      throw new Error('Commune non trouvée');
    }

    // Vérifier si le code est modifié et s'il existe déjà
    if (communeData.code && communeData.code !== communes[communeIndex].code) {
      const existingCommune = communes.find((c) => c.code === communeData.code);
      if (existingCommune) {
        throw new Error('Une commune avec ce code existe déjà');
      }
    }

    const updatedCommune: Commune = {
      ...communes[communeIndex],
      ...communeData,
      id: communes[communeIndex].id,
      createdAt: communes[communeIndex].createdAt,
      updatedAt: new Date().toISOString(),
    };

    communes[communeIndex] = updatedCommune;
    localStorage.setItem(COMMUNES_KEY, JSON.stringify(communes));
    
    return updatedCommune;
  },

  // Supprimer une commune
  deleteCommune: (id: string): void => {
    const communes = communeService.getAllCommunes();
    const filteredCommunes = communes.filter((c) => c.id !== id);
    
    if (filteredCommunes.length === communes.length) {
      throw new Error('Commune non trouvée');
    }

    localStorage.setItem(COMMUNES_KEY, JSON.stringify(filteredCommunes));
    
    // Supprimer aussi les données budgétaires associées
    budgetService.deleteCommuneBudgetData(id);
  },

  // Obtenir les communes assignées à un utilisateur
  getCommunesByUserId: (userId: string): Commune[] => {
    const communes = communeService.getAllCommunes();
    return communes.filter((c) => c.userId === userId);
  },
};

