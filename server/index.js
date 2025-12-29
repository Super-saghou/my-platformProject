// Backend API pour l'envoi d'emails MFA
// Utilise Resend pour l'envoi d'emails transactionnels

import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Initialiser Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Route pour envoyer le code MFA
app.post('/api/send-mfa-code', async (req, res) => {
  try {
    const { email, code, expiryMinutes } = req.body;

    // Validation
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email et code sont requis',
      });
    }

    // Vérifier que Resend est configuré
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key') {
      console.warn('⚠️ RESEND_API_KEY non configurée');
      return res.status(503).json({
        success: false,
        message: 'Service email non configuré. Vérifiez RESEND_API_KEY dans .env',
      });
    }

    // Vérifier l'adresse email de l'expéditeur
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: `Plateforme Budgétaire Municipale <${fromEmail}>`,
      to: [email],
      subject: 'Code de vérification - Plateforme Budgétaire Municipale',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code de vérification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Plateforme Budgétaire Municipale</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0;">Code de vérification</h2>
            
            <p>Bonjour,</p>
            
            <p>Vous avez demandé un code de vérification pour accéder à la plateforme.</p>
            
            <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Votre code de vérification est :</p>
              <p style="margin: 0; font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${code}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              ⏱️ Ce code est valide pendant <strong>${expiryMinutes} minutes</strong>.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              Si vous n'avez pas demandé ce code, veuillez ignorer cet email.
            </p>
            
            <p style="margin-top: 20px;">
              Cordialement,<br>
              <strong>L'équipe Plateforme Budgétaire Municipale</strong>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
Plateforme Budgétaire Municipale

Code de vérification

Bonjour,

Vous avez demandé un code de vérification pour accéder à la plateforme.

Votre code de vérification est : ${code}

Ce code est valide pendant ${expiryMinutes} minutes.

Si vous n'avez pas demandé ce code, veuillez ignorer cet email.

Cordialement,
L'équipe Plateforme Budgétaire Municipale
      `,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error.message,
      });
    }

    console.log(`✅ Email MFA envoyé à ${email} via Resend (ID: ${data?.id})`);

    return res.json({
      success: true,
      message: 'Code MFA envoyé avec succès',
      emailId: data?.id,
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'envoi de l\'email',
      error: error.message,
    });
  }
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MFA Email Service',
    resendConfigured: !!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key'),
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur API démarré sur le port ${PORT}`);
  console.log(`📧 Resend configuré: ${!!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key')}`);
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key') {
    console.warn('⚠️  RESEND_API_KEY non configurée. Configurez-la dans le fichier .env');
  }
});

