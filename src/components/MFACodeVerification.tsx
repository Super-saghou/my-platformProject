import { useState, useEffect } from 'react';
import { emailService } from '../services/emailService';
import './MFACodeVerification.css';

interface MFACodeVerificationProps {
  email: string;
  onVerify: () => void;
  onBack: () => void;
}

function MFACodeVerification({ email, onVerify, onBack }: MFACodeVerificationProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Send code on mount
  useEffect(() => {
    sendCode();
  }, []);

  // Update remaining time
  useEffect(() => {
    const interval = setInterval(() => {
      const time = emailService.getRemainingTime(email);
      setRemainingTime(time);
      setCanResend(time === 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [email]);

  const sendCode = async () => {
    setIsSending(true);
    setError('');
    try {
      const generatedCode = await emailService.sendMFACode(email);
      setSentCode(generatedCode); // For demo - show code in UI
      setRemainingTime(600); // 10 minutes
      setCanResend(false);
    } catch (err) {
      setError('Failed to send code. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take last character
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newCode.every((digit) => digit !== '') && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < 6; i++) {
      newCode[i] = pastedData[i] || '';
    }
    setCode(newCode);

    // Auto-verify if complete
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    } else {
      // Focus next empty input
      const nextEmptyIndex = newCode.findIndex((digit) => !digit);
      if (nextEmptyIndex !== -1) {
        const nextInput = document.getElementById(`code-input-${nextEmptyIndex}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const codeString = codeToVerify || code.join('');
    
    if (codeString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = emailService.verifyCode(email, codeString);

    if (result.valid) {
      // Code verified successfully
      onVerify();
    } else {
      setError(result.message);
      // Clear code on error
      setCode(['', '', '', '', '', '']);
      const firstInput = document.getElementById('code-input-0');
      firstInput?.focus();
    }

    setIsLoading(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mfa-container">
      <div className="mfa-card">
        <div className="mfa-header">
          <button className="back-button" onClick={onBack} aria-label="Go back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="mfa-title">Verify Your Email</h2>
          <p className="mfa-subtitle">
            We've sent a 6-digit verification code to
            <br />
            <strong>{email}</strong>
          </p>
        </div>

        {/* Demo: Show code in development */}
        {sentCode && (
          <div className="demo-code-banner">
            <p>
              <strong>Demo Mode:</strong> Your code is{' '}
              <span className="demo-code">{sentCode}</span>
            </p>
            <p className="demo-note">
              In production, this code would be sent via email
            </p>
          </div>
        )}

        <div className="mfa-form">
          <div className="code-inputs-container">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`code-input ${error ? 'code-input-error' : ''}`}
                disabled={isLoading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && <div className="mfa-error">{error}</div>}

          <div className="mfa-timer">
            {remainingTime > 0 ? (
              <p>
                Code expires in <strong>{formatTime(remainingTime)}</strong>
              </p>
            ) : (
              <p className="code-expired">Code expired</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleVerify()}
            className={`verify-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || code.join('').length !== 6}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </button>

          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button
              type="button"
              onClick={sendCode}
              className="resend-button"
              disabled={isSending || !canResend}
            >
              {isSending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MFACodeVerification;

