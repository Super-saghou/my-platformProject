import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import translations from '../i18n/translations';
import MFACodeVerification from './MFACodeVerification';
import './Login.css';

type LoginStep = 'credentials' | 'mfa';

function Login() {
  const navigate = useNavigate();
  // Use Arabic translations for login page by default
  const t = translations.ar;
  const [currentStep, setCurrentStep] = useState<LoginStep>('credentials');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = t.login.emailRequired;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t.login.emailInvalid;
    }

    if (!formData.password) {
      newErrors.password = t.login.passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = t.login.passwordMinLength;
    }

    setErrors(newErrors);

    // If no errors, verify credentials and proceed to MFA step
    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true);
      
      // Simulate API call delay (in production, replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Verify credentials
      const user = authService.authenticate(formData.email, formData.password);
      
      if (!user) {
        setErrors({
          email: t.login.invalidCredentials,
          password: t.login.invalidCredentials,
        });
        setIsLoading(false);
        return;
      }

      if (!user.isActive) {
        setErrors({
          email: t.login.accountDeactivated,
          password: '',
        });
        setIsLoading(false);
        return;
      }
      
      // Store authenticated user for MFA step
      setAuthenticatedUser(user);
      
      // Credentials are valid, proceed to MFA step
      setCurrentStep('mfa');
      setIsLoading(false);
    }
  };

  const handleMFAVerify = () => {
    // MFA code verified successfully
    if (!authenticatedUser) {
      // This shouldn't happen, but handle it anyway
      setErrors({ email: 'Session expired. Please login again.', password: '' });
      setCurrentStep('credentials');
      setAuthenticatedUser(null);
      return;
    }

    // Save user session
    authService.login(authenticatedUser);
    
    // Redirect based on role
    if (authenticatedUser.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  const handleMFABack = () => {
    // Go back to credentials step
    setCurrentStep('credentials');
  };

  // Show MFA step if credentials are validated
  if (currentStep === 'mfa') {
    return (
      <MFACodeVerification
        email={formData.email}
        onVerify={handleMFAVerify}
        onBack={handleMFABack}
      />
    );
  }

  // Show credentials step
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">{t.login.title}</h1>
          <p className="login-subtitle">{t.login.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t.login.emailLabel}
            </label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder={t.login.emailPlaceholder}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t.login.passwordLabel}
            </label>
            <div className="input-wrapper password-input-wrapper">
              <svg
                className="input-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder={t.login.passwordPlaceholder}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" />
              <span>{t.login.rememberMe}</span>
            </label>
            <a href="#" className="forgot-password">
              {t.login.forgotPassword}
            </a>
          </div>

          <button
            type="submit"
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                {t.login.signingIn}
              </>
            ) : (
              t.login.signIn
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {t.login.noAccount}{' '}
            <a href="#" className="signup-link">
              {t.login.signUp}
            </a>
          </p>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="bg-decoration bg-decoration-1"></div>
      <div className="bg-decoration bg-decoration-2"></div>
      <div className="bg-decoration bg-decoration-3"></div>
    </div>
  );
}

export default Login;

