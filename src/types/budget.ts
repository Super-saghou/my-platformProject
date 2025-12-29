// Types pour la gestion des budgets municipaux tunisiens
// Conformes à la nomenclature MALE et Loi organique n° 2018-46

// Catégories de recettes (12 catégories selon MALE)
export type RecetteCategory =
  | 'R1' // Recettes fiscales
  | 'R2' // Recettes non fiscales
  | 'R3' // Recettes de la dette
  | 'R4' // Recettes d'exploitation
  | 'R5' // Recettes exceptionnelles
  | 'R6' // Subventions et dotations
  | 'R7' // Emprunts
  | 'R8' // Fonds de concours
  | 'R9' // Produits des cessions
  | 'R10' // Produits financiers
  | 'R11' // Autres recettes
  | 'R12'; // Recettes de régularisation

// Parties de dépenses (11 parties selon MALE)
export type DepensePart =
  | 'D1' // Charges de personnel
  | 'D2' // Charges de fonctionnement
  | 'D3' // Charges d'intérêts
  | 'D4' // Subventions et dotations
  | 'D5' // Investissements
  | 'D6' // Remboursements d'emprunts
  | 'D7' // Charges exceptionnelles
  | 'D8' // Fonds de concours
  | 'D9' // Acquisitions d'immobilisations
  | 'D10' // Autres dépenses
  | 'D11'; // Dépenses de régularisation

// Données budgétaires pour une année
export interface BudgetData {
  annee: number;
  budgetVote: number; // En dinars tunisiens (DT)
  reel: number; // En dinars tunisiens (DT)
}

// Données pour une rubrique (recette ou dépense)
export interface RubriqueData {
  code: RecetteCategory | DepensePart;
  nom: string;
  donnees: BudgetData[];
}

// Événement futur (régresseur)
export interface FutureEvent {
  id: string;
  annee: number;
  description: string;
  impactEstime: number; // En DT
  rubrique: RecetteCategory | DepensePart;
  type: 'recette' | 'depense';
  createdAt: string;
  updatedAt: string;
}

// Commune
export interface Commune {
  id: string;
  nom: string;
  code: string; // Code postal ou code administratif
  gouvernorat: string;
  delegation?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string; // Utilisateur assigné (optionnel)
}

// Données budgétaires complètes d'une commune
export interface CommuneBudgetData {
  communeId: string;
  recettes: RubriqueData[];
  depenses: RubriqueData[];
  evenementsFuturs: FutureEvent[];
  lastUpdated: string;
}

// Noms des catégories de recettes
export const RECETTE_CATEGORIES: Record<RecetteCategory, string> = {
  R1: 'Recettes fiscales',
  R2: 'Recettes non fiscales',
  R3: 'Recettes de la dette',
  R4: 'Recettes d\'exploitation',
  R5: 'Recettes exceptionnelles',
  R6: 'Subventions et dotations',
  R7: 'Emprunts',
  R8: 'Fonds de concours',
  R9: 'Produits des cessions',
  R10: 'Produits financiers',
  R11: 'Autres recettes',
  R12: 'Recettes de régularisation',
};

// Noms des parties de dépenses
export const DEPENSE_PARTS: Record<DepensePart, string> = {
  D1: 'Charges de personnel',
  D2: 'Charges de fonctionnement',
  D3: 'Charges d\'intérêts',
  D4: 'Subventions et dotations',
  D5: 'Investissements',
  D6: 'Remboursements d\'emprunts',
  D7: 'Charges exceptionnelles',
  D8: 'Fonds de concours',
  D9: 'Acquisitions d\'immobilisations',
  D10: 'Autres dépenses',
  D11: 'Dépenses de régularisation',
};

// Types pour l'import/export
export interface BudgetImportRow {
  annee: number;
  rubrique: string;
  type: 'recette' | 'depense';
  budgetVote?: number;
  reel?: number;
}

export interface BudgetExportData {
  commune: Commune;
  recettes: RubriqueData[];
  depenses: RubriqueData[];
  evenementsFuturs: FutureEvent[];
}

