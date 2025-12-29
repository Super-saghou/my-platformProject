# Backend API - Service d'envoi d'emails MFA

Ce serveur API gère l'envoi sécurisé des codes MFA via Resend.

## Installation

```bash
npm install
```

## Configuration

1. Copiez `.env.example` vers `.env`
2. Configurez vos variables d'environnement (voir `RESEND_SETUP.md`)

## Démarrage

**Développement** :
```bash
npm run dev
```

**Production** :
```bash
npm start
```

Le serveur démarre sur le port 3001 par défaut.

## Endpoints

### POST /api/send-mfa-code

Envoie un code MFA par email.

**Body** :
```json
{
  "email": "user@example.com",
  "code": "123456",
  "expiryMinutes": 10
}
```

**Response** :
```json
{
  "success": true,
  "message": "Code MFA envoyé avec succès",
  "emailId": "email_id_from_resend"
}
```

### GET /api/health

Vérifie l'état du service.

**Response** :
```json
{
  "status": "ok",
  "service": "MFA Email Service",
  "resendConfigured": true
}
```

## Déploiement

Voir `RESEND_SETUP.md` pour les instructions de déploiement en production.

