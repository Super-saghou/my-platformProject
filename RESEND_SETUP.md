# Configuration Resend pour l'envoi d'emails MFA

## Pourquoi Resend ?

Resend est un service d'email transactionnel moderne et fiable, parfait pour la production :
- ✅ **Gratuit** : 3000 emails/mois gratuits
- ✅ **Simple** : API simple et intuitive
- ✅ **Fiable** : Infrastructure professionnelle
- ✅ **Sécurisé** : Pas besoin de compte email personnel
- ✅ **Production-ready** : Utilisé par de nombreuses entreprises

## Guide de configuration

### 1. Créer un compte Resend

1. Allez sur [https://resend.com](https://resend.com)
2. Créez un compte gratuit
3. Vérifiez votre email

### 2. Vérifier un domaine (Optionnel mais recommandé)

Pour la production, vous devriez vérifier votre propre domaine :

1. Allez dans **Domains** > **Add Domain**
2. Ajoutez votre domaine (ex: `municipalite.tn`)
3. Suivez les instructions DNS pour vérifier le domaine
4. Une fois vérifié, vous pourrez envoyer depuis `noreply@votre-domaine.com`

**Note** : Pour les tests, vous pouvez utiliser le domaine de test `onboarding@resend.dev`

### 3. Créer une clé API

1. Allez dans **API Keys** > **Create API Key**
2. Donnez un nom à votre clé (ex: "Production MFA")
3. Copiez la clé (elle ne sera affichée qu'une seule fois !)

### 4. Configurer le backend

1. Allez dans le dossier `server/`
2. Créez un fichier `.env` à partir de `.env.example` :
   ```bash
   cd server
   cp .env.example .env
   ```

3. Éditez le fichier `.env` :
   ```env
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   RESEND_API_KEY=re_votre_cle_api_ici
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```

   Pour la production, utilisez votre domaine vérifié :
   ```env
   RESEND_FROM_EMAIL=Plateforme Budgétaire <noreply@votre-domaine.com>
   ```

### 5. Installer les dépendances du serveur

```bash
cd server
npm install
```

### 6. Démarrer le serveur API

**Mode développement** (avec rechargement automatique) :
```bash
npm run dev
```

**Mode production** :
```bash
npm start
```

Le serveur démarrera sur `http://localhost:3001`

### 7. Configurer le frontend

Dans le fichier `.env` à la racine du projet, ajoutez :

```env
VITE_API_URL=http://localhost:3001
```

Pour la production, remplacez par l'URL de votre serveur :
```env
VITE_API_URL=https://api.votre-domaine.com
```

### 8. Tester

1. Démarrez le serveur API : `cd server && npm run dev`
2. Démarrez le frontend : `npm run dev`
3. Allez sur la page de login
4. Cliquez sur "Mot de passe oublié"
5. Entrez votre email
6. Vérifiez votre boîte email !

## Déploiement en production

### Option 1 : Déployer le backend sur un VPS

1. **Serveur** : Utilisez un VPS (DigitalOcean, AWS, OVH, etc.)
2. **Process Manager** : Utilisez PM2 pour gérer le processus Node.js
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name mfa-api
   pm2 save
   pm2 startup
   ```
3. **Reverse Proxy** : Configurez Nginx pour proxy vers le backend
4. **SSL** : Utilisez Let's Encrypt pour HTTPS

### Option 2 : Déployer sur Vercel/Netlify (Frontend) + Railway/Render (Backend)

**Backend sur Railway** :
1. Créez un compte sur [Railway](https://railway.app)
2. Créez un nouveau projet
3. Connectez votre repo GitHub
4. Railway détectera automatiquement le dossier `server/`
5. Ajoutez les variables d'environnement dans Railway
6. Déployez !

**Frontend sur Vercel** :
1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez votre projet
3. Configurez `VITE_API_URL` avec l'URL de votre backend Railway
4. Déployez !

### Option 3 : Déployer tout sur un seul serveur

1. Servez le frontend build avec Nginx
2. Lancez le backend API avec PM2
3. Configurez Nginx pour servir les deux

## Sécurité en production

### ✅ Checklist de sécurité

- [ ] Utilisez HTTPS pour toutes les communications
- [ ] Ne commitez jamais les clés API dans Git
- [ ] Utilisez des variables d'environnement
- [ ] Limitez les tentatives d'envoi d'email (rate limiting)
- [ ] Validez les emails côté serveur
- [ ] Utilisez un domaine vérifié pour l'expéditeur
- [ ] Configurez SPF, DKIM, et DMARC pour votre domaine
- [ ] Surveillez les logs pour détecter les abus

### Rate Limiting (Recommandé)

Ajoutez rate limiting au serveur pour éviter les abus :

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requêtes par IP
  message: 'Trop de tentatives. Veuillez réessayer plus tard.',
});

app.use('/api/send-mfa-code', limiter);
```

## Dépannage

### L'email n'est pas envoyé

1. Vérifiez que le serveur API est démarré
2. Vérifiez les logs du serveur
3. Vérifiez que `RESEND_API_KEY` est correcte
4. Vérifiez que `RESEND_FROM_EMAIL` est vérifié dans Resend
5. Vérifiez la console du navigateur pour les erreurs

### Erreur "Invalid API Key"

- Vérifiez que la clé API est correcte dans `.env`
- Vérifiez que vous n'avez pas de caractères invisibles
- Recréez une nouvelle clé API si nécessaire

### Erreur "Domain not verified"

- Vérifiez votre domaine dans Resend
- Utilisez `onboarding@resend.dev` pour les tests
- Pour la production, vérifiez votre propre domaine

### Le code n'arrive pas

1. Vérifiez votre dossier spam
2. Vérifiez que l'adresse email est correcte
3. Attendez quelques secondes (l'envoi peut prendre jusqu'à 30 secondes)
4. Vérifiez les logs du serveur pour voir si l'email a été envoyé

## Alternatives

Si Resend ne vous convient pas, vous pouvez utiliser :

- **SendGrid** : 100 emails/jour gratuits
- **Mailgun** : 5000 emails/mois gratuits (pendant 3 mois)
- **AWS SES** : Très économique, mais plus complexe
- **Postmark** : Excellent pour les emails transactionnels

Pour changer de service, modifiez uniquement le fichier `server/index.js`.

