// Email service to simulate sending MFA codes
// In production, this would call a backend API to send real emails

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
  // Send MFA code to email (simulated)
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

    // Simulate API delay (in production, this would be a real API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, you would send an actual email here
    // For now, we'll log it to console and show it in the UI
    console.log(`📧 MFA Code sent to ${email}: ${code}`);
    console.log('⚠️ In production, this code would be sent via email service (SendGrid, AWS SES, etc.)');

    return code; // Return code for demo purposes (in production, don't return it)
  },

  // Verify MFA code
  verifyCode(email: string, inputCode: string): { valid: boolean; message: string } {
    cleanExpiredCodes();

    const codes = getStoredCodes();
    const codeData = codes[email];

    if (!codeData) {
      return {
        valid: false,
        message: 'No code found. Please request a new code.',
      };
    }

    // Check if code expired
    if (Date.now() > codeData.expiresAt) {
      delete codes[email];
      saveCodes(codes);
      return {
        valid: false,
        message: 'Code has expired. Please request a new code.',
      };
    }

    // Check attempts
    if (codeData.attempts >= MAX_ATTEMPTS) {
      delete codes[email];
      saveCodes(codes);
      return {
        valid: false,
        message: 'Too many failed attempts. Please request a new code.',
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
        message: `Invalid code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
      };
    }

    // Code is valid - remove it
    delete codes[email];
    saveCodes(codes);

    return {
      valid: true,
      message: 'Code verified successfully!',
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

