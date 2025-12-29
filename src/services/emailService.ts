// Email service to send MFA codes via Resend API
// Utilise un backend API pour sécuriser l'envoi d'emails

interface MFACode {
  code: string;
  email: string;
  expiresAt: number; // timestamp
  attempts: number; // track failed attempts
}

const MFA_CODES_KEY = 'platform_mfa_codes';
const MAX_ATTEMPTS = 3;
const CODE_EXPIRY_MINUTES = 10;

// Generate a 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Get all stored MFA codes
function getStoredCodes(): Record<string, MFACode> {
  try {
    const stored = localStorage.getItem(MFA_CODES_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

// Save MFA codes
function saveCodes(codes: Record<string, MFACode>): void {
  localStorage.setItem(MFA_CODES_KEY, JSON.stringify(codes));
}

// Clean expired codes
function cleanExpiredCodes(): void {
  const codes = getStoredCodes();
  const now = Date.now();
  const validCodes: Record<string, MFACode> = {};

  for (const [email, codeData] of Object.entries(codes)) {
    if (codeData.expiresAt > now) {
      validCodes[email] = codeData;
    }
  }

  if (Object.keys(validCodes).length !== Object.keys(codes).length) {
    saveCodes(validCodes);
  }
}

export const emailService = {
  // Send MFA code to email via backend API
  async sendMFACode(email: string): Promise<string> {
    // Clean expired codes first
    cleanExpiredCodes();

    // Generate code
    const code = generateCode();
    const expiresAt = Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000;

    // Store code
    const codes = getStoredCodes();
    codes[email] = {
      code,
      email,
      expiresAt,
      attempts: 0,
    };
    saveCodes(codes);

    // Envoyer l'email via l'API backend
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/send-mfa-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          expiryMinutes: CODE_EXPIRY_MINUTES,
        }),
      });

      if (response.ok) {
        await response.json();
        console.log(`✅ Code MFA envoyé par email à ${email}`);
        return code;
      } else {
        const error = await response.json();
        console.warn(`⚠️ Erreur API: ${error.message || 'Erreur inconnue'}`);
        // En mode développement, afficher le code
        if (import.meta.env.DEV) {
          console.log(`📧 [DEV MODE] MFA Code pour ${email}: ${code}`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      // En mode développement, afficher le code même en cas d'erreur
      if (import.meta.env.DEV) {
        console.log(`📧 [DEV MODE] MFA Code pour ${email}: ${code}`);
        console.log('⚠️ Le backend API n\'est pas disponible. Le code est affiché dans la console.');
      }
      // Ne pas bloquer le processus si l'email échoue
      // Le code est toujours stocké et peut être vérifié
    }

    return code; // Retourner le code pour l'affichage en mode développement
  },

  // Verify MFA code
  verifyCode(email: string, inputCode: string): { valid: boolean; message: string } {
    cleanExpiredCodes();

    const codes = getStoredCodes();
    const codeData = codes[email];

    if (!codeData) {
      return {
        valid: false,
        message: 'Aucun code trouvé. Veuillez demander un nouveau code.',
      };
    }

    // Check if code expired
    if (Date.now() > codeData.expiresAt) {
      delete codes[email];
      saveCodes(codes);
      return {
        valid: false,
        message: 'Le code a expiré. Veuillez demander un nouveau code.',
      };
    }

    // Check attempts
    if (codeData.attempts >= MAX_ATTEMPTS) {
      delete codes[email];
      saveCodes(codes);
      return {
        valid: false,
        message: 'Trop de tentatives échouées. Veuillez demander un nouveau code.',
      };
    }

    // Verify code
    if (codeData.code !== inputCode) {
      codeData.attempts += 1;
      codes[email] = codeData;
      saveCodes(codes);

      const remainingAttempts = MAX_ATTEMPTS - codeData.attempts;
      return {
        valid: false,
        message: `Code invalide. ${remainingAttempts} tentative${remainingAttempts !== 1 ? 's' : ''} restante${remainingAttempts !== 1 ? 's' : ''}.`,
      };
    }

    // Code is valid - remove it
    delete codes[email];
    saveCodes(codes);

    return {
      valid: true,
      message: 'Code vérifié avec succès!',
    };
  },

  // Get remaining time for code (in seconds)
  getRemainingTime(email: string): number {
    const codes = getStoredCodes();
    const codeData = codes[email];

    if (!codeData) return 0;

    const remaining = codeData.expiresAt - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
  },

  // Check if code exists and is valid
  hasValidCode(email: string): boolean {
    cleanExpiredCodes();
    const codes = getStoredCodes();
    const codeData = codes[email];
    return codeData !== undefined && Date.now() < codeData.expiresAt;
  },
};
