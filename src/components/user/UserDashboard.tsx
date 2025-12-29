import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { useI18n } from '../../i18n/i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import BudgetManagement from '../budget/BudgetManagement';
import UserServices from './UserServices';
import './UserDashboard.css';

function UserDashboard() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [session, setSession] = useState(authService.getCurrentSession());
  const [activeTab, setActiveTab] = useState<'services' | 'budgets'>('services');

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

        <div className="user-tabs">
          <button
            className={`user-tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Mes Services
          </button>
          <button
            className={`user-tab ${activeTab === 'budgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('budgets')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Gestion Budgétaire
          </button>
        </div>

        <div className="user-content">
          {activeTab === 'services' && <UserServices />}
          {activeTab === 'budgets' && <BudgetManagement />}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;

