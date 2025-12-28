import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { useI18n } from '../../i18n/i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import './UserDashboard.css';

function UserDashboard() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [session, setSession] = useState(authService.getCurrentSession());

  useEffect(() => {
    // Check if user is authenticated
    const currentSession = authService.getCurrentSession();
    if (!currentSession) {
      navigate('/login');
      return;
    }

    // Redirect admin to admin dashboard
    if (currentSession.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }

    setSession(currentSession);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!session) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="user-dashboard-container">
      <header className="user-dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">{t.user.title}</h1>
            <p className="dashboard-subtitle">{t.user.subtitle}</p>
          </div>
          <div className="header-right">
            <LanguageSwitcher />
            <div className="user-info">
              <div className="user-details">
                <div className="user-name">{session.name}</div>
                <div className="user-email">{session.email}</div>
              </div>
              <div className="role-badge role-user">{t.userMgmt.employee}</div>
            </div>
            <button onClick={handleLogout} className="logout-button">
              {t.common.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="user-dashboard-main">
        <div className="welcome-section">
          <h2>{t.common.welcome}, {session.name}!</h2>
          <p className="welcome-message">
            {t.user.loggedInAs} <strong>{session.email}</strong>
          </p>
          <p className="login-time">
            {t.user.loggedInAt}: {new Date(session.loginTime).toLocaleString()}
          </p>
        </div>

        <div className="accounting-modules">
          <div className="module-card">
            <div className="module-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3>{t.user.financialTransactions}</h3>
            <p>Record and manage all financial transactions</p>
            <button className="module-button">{t.user.openModule}</button>
          </div>

          <div className="module-card">
            <div className="module-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <h3>{t.user.reportsAnalytics}</h3>
            <p>Generate financial reports and analytics</p>
            <button className="module-button">{t.user.openModule}</button>
          </div>

          <div className="module-card">
            <div className="module-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <h3>{t.user.clientManagement}</h3>
            <p>Manage client accounts and information</p>
            <button className="module-button">{t.user.openModule}</button>
          </div>

          <div className="module-card">
            <div className="module-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3>{t.user.invoicesBilling}</h3>
            <p>Create and manage invoices</p>
            <button className="module-button">{t.user.openModule}</button>
          </div>

          <div className="module-card">
            <div className="module-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3>{t.user.timeTracking}</h3>
            <p>Track work hours and billable time</p>
            <button className="module-button">{t.user.openModule}</button>
          </div>

          <div className="module-card">
            <div className="module-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3>{t.user.documentManagement}</h3>
            <p>Store and organize accounting documents</p>
            <button className="module-button">{t.user.openModule}</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;

