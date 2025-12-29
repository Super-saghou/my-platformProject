// Service d'initialisation avec données de simulation
import { userService } from './auth';
import { communeService } from './communeService';
import { budgetService } from './budgetService';
import type { Commune } from '../types/budget';

const INIT_KEY = 'platform_data_initialized';

export const initDataService = {
  // Initialiser toutes les données de test
  initializeTestData: (): void => {
    // Vérifier si déjà initialisé
    if (localStorage.getItem(INIT_KEY) === 'true') {
      console.log('✅ Données déjà initialisées');
      return;
    }

    console.log('🔄 Initialisation des données de test...');

    try {
      // 1. Créer des utilisateurs de test
      initDataService.createTestUsers();

      // 2. Créer des communes de test
      const communes = initDataService.createTestCommunes();

      // 3. Créer des données budgétaires de test
      initDataService.createTestBudgetData(communes);

      localStorage.setItem(INIT_KEY, 'true');
      console.log('✅ Données de test initialisées avec succès!');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
    }
  },

  // Créer des utilisateurs de test
  createTestUsers: (): void => {
    const existingUsers = userService.getAllUsers();
    
    // Vérifier si l'admin existe déjà
    const adminExists = existingUsers.some(u => u.email === 'admin@platform.com');
    if (adminExists) {
      console.log('ℹ️ Utilisateurs déjà créés');
      return;
    }

    const testUsers = [
      {
        email: 'admin@platform.com',
        password: 'admin123',
        role: 'admin' as const,
        name: 'Administrateur Principal',
      },
      {
        email: 'receveur.tunis@municipalite.tn',
        password: 'receveur123',
        role: 'user' as const,
        name: 'Ahmed Ben Ali',
      },
      {
        email: 'financier.sfax@municipalite.tn',
        password: 'financier123',
        role: 'user' as const,
        name: 'Fatma Trabelsi',
      },
      {
        email: 'agent.sousse@municipalite.tn',
        password: 'agent123',
        role: 'user' as const,
        name: 'Mohamed Hammami',
      },
      {
        email: 'comptable.bizerte@municipalite.tn',
        password: 'comptable123',
        role: 'user' as const,
        name: 'Salma Khelifi',
      },
    ];

    testUsers.forEach((userData) => {
      try {
        userService.createUser(userData);
        console.log(`✅ Utilisateur créé: ${userData.email}`);
      } catch (error) {
        // Ignorer si l'utilisateur existe déjà
        console.log(`ℹ️ Utilisateur ${userData.email} existe déjà`);
      }
    });
  },

  // Créer des communes de test
  createTestCommunes: (): Commune[] => {
    const existingCommunes = communeService.getAllCommunes();
    if (existingCommunes.length > 0) {
      console.log('ℹ️ Communes déjà créées');
      return existingCommunes;
    }

    const testCommunes = [
      {
        nom: 'Tunis',
        code: '1000',
        gouvernorat: 'Tunis',
        delegation: 'Tunis Centre',
      },
      {
        nom: 'Sfax',
        code: '3000',
        gouvernorat: 'Sfax',
        delegation: 'Sfax Ville',
      },
      {
        nom: 'Sousse',
        code: '4000',
        gouvernorat: 'Sousse',
        delegation: 'Sousse Médina',
      },
      {
        nom: 'Bizerte',
        code: '7000',
        gouvernorat: 'Bizerte',
        delegation: 'Bizerte Nord',
      },
      {
        nom: 'Gabès',
        code: '6000',
        gouvernorat: 'Gabès',
        delegation: 'Gabès Centre',
      },
      {
        nom: 'Kairouan',
        code: '3100',
        gouvernorat: 'Kairouan',
        delegation: 'Kairouan Médina',
      },
    ];

    const createdCommunes: Commune[] = [];

    testCommunes.forEach((communeData) => {
      try {
        const commune = communeService.createCommune(communeData);
        createdCommunes.push(commune);
        console.log(`✅ Commune créée: ${commune.nom}`);
      } catch (error) {
        console.error(`❌ Erreur création commune ${communeData.nom}:`, error);
      }
    });

    // Assigner des communes aux utilisateurs
    const users = userService.getAllUsers();
    const receveur = users.find(u => u.email === 'receveur.tunis@municipalite.tn');
    const financier = users.find(u => u.email === 'financier.sfax@municipalite.tn');
    const agent = users.find(u => u.email === 'agent.sousse@municipalite.tn');
    const comptable = users.find(u => u.email === 'comptable.bizerte@municipalite.tn');

    if (receveur && createdCommunes[0]) {
      communeService.updateCommune(createdCommunes[0].id, { userId: receveur.id });
    }
    if (financier && createdCommunes[1]) {
      communeService.updateCommune(createdCommunes[1].id, { userId: financier.id });
    }
    if (agent && createdCommunes[2]) {
      communeService.updateCommune(createdCommunes[2].id, { userId: agent.id });
    }
    if (comptable && createdCommunes[3]) {
      communeService.updateCommune(createdCommunes[3].id, { userId: comptable.id });
    }

    return createdCommunes;
  },

  // Créer des données budgétaires de test
  createTestBudgetData: (communes: Commune[]): void => {
    const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

    communes.forEach((commune, index) => {
      // Générer des données réalistes avec une croissance progressive
      const baseMultiplier = 1000000 + (index * 200000); // Base différente par commune

      // Recettes
      const recetteCategories = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12'] as const;
      recetteCategories.forEach((category, catIndex) => {
        years.forEach((year) => {
          const yearIndex = year - 2018;
          const growth = 1 + (yearIndex * 0.05); // 5% de croissance annuelle
          const baseAmount = baseMultiplier * (0.5 + catIndex * 0.1) * growth;
          const budgetVote = Math.round(baseAmount * (0.95 + Math.random() * 0.1));
          const reel = Math.round(budgetVote * (0.85 + Math.random() * 0.15));

          try {
            budgetService.updateBudgetData(
              commune.id,
              'recette',
              category,
              year,
              budgetVote,
              reel
            );
          } catch (error) {
            // Ignorer les erreurs silencieusement
          }
        });
      });

      // Dépenses
      const depenseParts = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11'] as const;
      depenseParts.forEach((part, partIndex) => {
        years.forEach((year) => {
          const yearIndex = year - 2018;
          const growth = 1 + (yearIndex * 0.05);
          const baseAmount = baseMultiplier * (0.4 + partIndex * 0.12) * growth;
          const budgetVote = Math.round(baseAmount * (0.95 + Math.random() * 0.1));
          const reel = Math.round(budgetVote * (0.88 + Math.random() * 0.12));

          try {
            budgetService.updateBudgetData(
              commune.id,
              'depense',
              part,
              year,
              budgetVote,
              reel
            );
          } catch (error) {
            // Ignorer les erreurs silencieusement
          }
        });
      });

      // Ajouter quelques événements futurs
      const events = [
        {
          annee: 2026,
          description: 'Recrutement de 5 agents administratifs et 3 techniciens',
          impactEstime: 450000,
          rubrique: 'D1' as const,
          type: 'depense' as const,
        },
        {
          annee: 2026,
          description: 'Projet d\'aménagement de la place centrale',
          impactEstime: 1200000,
          rubrique: 'D5' as const,
          type: 'depense' as const,
        },
        {
          annee: 2027,
          description: 'Augmentation des recettes fiscales prévue',
          impactEstime: 800000,
          rubrique: 'R1' as const,
          type: 'recette' as const,
        },
      ];

      events.forEach((event) => {
        try {
          budgetService.addFutureEvent(commune.id, event);
        } catch (error) {
          // Ignorer les erreurs
        }
      });

      console.log(`✅ Données budgétaires créées pour ${commune.nom}`);
    });
  },

  // Réinitialiser toutes les données (pour tests)
  resetAllData: (): void => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
      localStorage.removeItem(INIT_KEY);
      localStorage.removeItem('platform_users');
      localStorage.removeItem('platform_communes');
      localStorage.removeItem('platform_budget_data');
      localStorage.removeItem('platform_session');
      console.log('✅ Toutes les données ont été réinitialisées');
      window.location.reload();
    }
  },
};
