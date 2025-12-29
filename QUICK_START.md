# Guide de Démarrage Rapide

## 🚀 Démarrage en développement

### 1. Installer les dépendances

```bash
# Frontend
npm install

# Backend API
cd server
npm install
cd ..
```

### 2. Configurer l'envoi d'emails (Optionnel pour les tests)

Pour tester sans configurer Resend, le code MFA sera affiché dans la console.

Pour activer l'envoi réel d'emails :

1. Créez un compte sur [Resend.com](https://resend.com)
2. Obtenez votre clé API
3. Configurez le backend :
   ```bash
   cd server
   cp .env.example .env
   # Éditez .env et ajoutez votre RESEND_API_KEY
   ```
4. Configurez le frontend :
   ```bash
   # Créez .env à la racine
   echo "VITE_API_URL=http://localhost:3001" > .env
   ```

### 3. Démarrer l'application

**Option 1 : Démarrer tout en une commande**
```bash
npm run dev:all
```

**Option 2 : Démarrer séparément**

Terminal 1 (Backend) :
```bash
cd server
npm run dev
```

Terminal 2 (Frontend) :
```bash
npm run dev
```

### 4. Accéder à l'application

- Frontend : http://localhost:5173
- Backend API : http://localhost:3001

## 👤 Comptes de test

- **Admin** : `admin@platform.com` / `admin123`
- **Utilisateur** : `receveur.tunis@municipalite.tn` / `receveur123`

## 📧 Tester l'envoi d'emails

1. Allez sur la page de login
2. Cliquez sur "Mot de passe oublié"
3. Entrez votre email
4. Si Resend est configuré : vérifiez votre boîte email
5. Si non configuré : le code s'affiche dans la console du navigateur

## 🐛 Dépannage

### Le serveur API ne démarre pas

- Vérifiez que le port 3001 n'est pas utilisé
- Vérifiez que vous êtes dans le dossier `server/` pour installer les dépendances

### Les emails ne sont pas envoyés

- Vérifiez que le serveur API est démarré
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez les logs du serveur API
- En mode développement, le code s'affiche dans la console

## 📚 Documentation complète

- **Configuration Resend** : Voir `RESEND_SETUP.md`
- **Documentation générale** : Voir `README.md`

