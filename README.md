# Plateforme de Gestion Budgétaire Municipale - Tunisie

Plateforme web dédiée à la saisie et à la gestion des données nécessaires à la prévision et à la génération de budgets municipaux en Tunisie. Conforme à la nomenclature du Ministère des Affaires Locales et de l'Environnement (MALE) et à la Loi organique n° 2018-46.

## 🎯 Fonctionnalités Principales

### Authentification
- Page de login (email/mot de passe)
- Option "Mot de passe oublié" (simulé pour MVP)
- Gestion des rôles (Admin / Utilisateur standard)

### Gestion des Communes (Admin uniquement)
- Liste des communes avec recherche
- Ajout/suppression de communes
- Modification des informations des communes
- Chaque commune peut être assignée à un utilisateur

### Saisie des Données Budgétaires
- **Deux onglets** : Recettes (12 catégories) et Dépenses (11 parties)
- **Tableaux éditables** avec colonnes :
  - Année (2018-2026+)
  - Budget voté (DT)
  - Réel (DT)
- Bouton "Ajouter année" pour étendre les données (ex. 2027)
- **Validation automatique** :
  - Équilibre recettes = dépenses
  - Pas de valeurs négatives
  - Format DT (dinars tunisiens)

### Saisie des Événements Futurs
- Formulaire simple pour ajouter des événements prospectifs
- Champs : Année, Description, Impact estimé (DT), Rubrique concernée
- Stockage comme "régresseurs" pour future intégration avec Python/AI

### Import/Export
- **Import CSV/Excel** : Template fourni avec colonnes (Année, Rubrique, Voté, Réel)
- **Export CSV/Excel** : Toutes les données d'une commune
- **Export JSON** : Format compatible avec Python pour intégration future

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation
```bash
npm install
```

### Démarrage en développement
```bash
npm run dev
```

La plateforme sera accessible sur `http://localhost:5173`

### Build pour production
```bash
npm run build
```

## 👥 Utilisateurs par Défaut

Les données de test sont automatiquement initialisées au premier démarrage :

### Administrateur
- **Email** : `admin@platform.com`
- **Mot de passe** : `admin123`

### Utilisateurs de test
- **Receveur Tunis** : `receveur.tunis@municipalite.tn` / `receveur123`
- **Financier Sfax** : `financier.sfax@municipalite.tn` / `financier123`
- **Agent Sousse** : `agent.sousse@municipalite.tn` / `agent123`
- **Comptable Bizerte** : `comptable.bizerte@municipalite.tn` / `comptable123`

### Communes de test
6 communes sont créées automatiquement avec des données budgétaires complètes (2018-2026) :
- Tunis, Sfax, Sousse, Bizerte, Gabès, Kairouan

⚠️ **Important** : Changez ces identifiants en production !

## 📁 Structure du Projet

```
my-platform/
├── src/
│   ├── components/
│   │   ├── admin/          # Composants admin (gestion communes, utilisateurs)
│   │   ├── budget/         # Composants de saisie budgétaire
│   │   ├── user/           # Composants utilisateur
│   │   └── ...             # Autres composants (Login, Dashboard, etc.)
│   ├── services/
│   │   ├── auth.ts         # Service d'authentification
│   │   ├── communeService.ts    # Gestion des communes
│   │   ├── budgetService.ts    # Gestion des données budgétaires
│   │   └── importExportService.ts  # Import/Export CSV/Excel
│   ├── types/
│   │   ├── user.ts         # Types utilisateurs
│   │   └── budget.ts       # Types budgets, communes, etc.
│   └── i18n/               # Traductions (FR, AR, EN)
├── public/
└── package.json
```

## 🔧 Technologies Utilisées

- **React 19** avec TypeScript
- **Vite** pour le build et le développement
- **React Router** pour la navigation
- **localStorage** pour le stockage des données (MVP)
- **xlsx** et **papaparse** pour l'import/export CSV/Excel
- **i18n** pour la gestion multilingue (FR, AR, EN)

## 📊 Structure des Données

### Catégories de Recettes (12)
- R1 : Recettes fiscales
- R2 : Recettes non fiscales
- R3 : Recettes de la dette
- R4 : Recettes d'exploitation
- R5 : Recettes exceptionnelles
- R6 : Subventions et dotations
- R7 : Emprunts
- R8 : Fonds de concours
- R9 : Produits des cessions
- R10 : Produits financiers
- R11 : Autres recettes
- R12 : Recettes de régularisation

### Parties de Dépenses (11)
- D1 : Charges de personnel
- D2 : Charges de fonctionnement
- D3 : Charges d'intérêts
- D4 : Subventions et dotations
- D5 : Investissements
- D6 : Remboursements d'emprunts
- D7 : Charges exceptionnelles
- D8 : Fonds de concours
- D9 : Acquisitions d'immobilisations
- D10 : Autres dépenses
- D11 : Dépenses de régularisation

## 🔄 Intégration Python (Future)

La plateforme est conçue pour être compatible avec Python pour l'intégration future de calculs de prévision et d'IA. Les données peuvent être exportées en JSON via l'API `importExportService.exportToJSON()`.

Format JSON exporté :
```json
{
  "commune": { ... },
  "recettes": [ ... ],
  "depenses": [ ... ],
  "evenementsFuturs": [ ... ]
}
```

## 🌐 Langues Supportées

- **Français** (par défaut)
- **Arabe** (optionnel)
- **Anglais** (optionnel)

## ✅ Critères d'Acceptation

- ✅ UI intuitive (test utilisateur avec 3 agents municipaux)
- ✅ 0 bugs majeurs (ex. perte de données)
- ✅ Conformité 100% à la nomenclature MALE
- ✅ Responsive (mobile/desktop)
- ✅ Validation automatique des données

## 📧 Configuration Resend (Envoi réel d'emails MFA)

Pour activer l'envoi réel d'emails pour le code MFA en production :

1. **Suivez le guide complet** dans `RESEND_SETUP.md`
2. **Configurez le backend API** :
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Éditez .env avec vos clés Resend
   ```
3. **Démarrez le serveur API** :
   ```bash
   npm run dev
   ```
4. **Configurez le frontend** : Créez un `.env` à la racine avec :
   ```env
   VITE_API_URL=http://localhost:3001
   ```
5. Redémarrez l'application frontend

**Pourquoi Resend ?**
- ✅ Service professionnel d'emails transactionnels
- ✅ 3000 emails/mois gratuits
- ✅ Pas besoin de compte email personnel
- ✅ Parfait pour la production
- ✅ Infrastructure fiable et sécurisée

Sans configuration, le code MFA sera affiché dans la console (mode développement uniquement).

## 📝 Notes Importantes

- **Stockage** : Les données sont stockées dans le localStorage du navigateur (MVP). Pour la production, migrer vers une base de données.
- **Sécurité** : Les mots de passe ne sont pas hashés dans cette version MVP. Implémenter le hashing en production.
- **Calculs** : La plateforme ne gère pas les calculs de prévision ni la génération de rapports PDF - ces fonctionnalités seront développées séparément.
- **Données de test** : Les données de test sont automatiquement créées au premier démarrage. Pour les réinitialiser, utilisez `initDataService.resetAllData()` dans la console du navigateur.

## 🤝 Contribution

Pour contribuer au projet, veuillez suivre les conventions de code existantes et tester vos modifications avant de soumettre une pull request.

## 📄 Licence

Ce projet est développé pour le Ministère des Affaires Locales et de l'Environnement (MALE) - Tunisie.
