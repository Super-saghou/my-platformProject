import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../../services/auth';
import { useI18n } from '../../i18n/i18n';
import type { User, CreateUserData } from '../../types/user';
import UserManagement from './UserManagement';
import LanguageSwitcher from '../LanguageSwitcher';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [session, setSession] = useState(authService.getCurrentSession());
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');

  useEffect(() => {
    // Check if user is authenticated and is admin
    const currentSession = authService.getCurrentSession();
    if (!currentSession) {
      navigate('/login');
      return;
    }

    if (currentSession.role !== 'admin') {
      navigate('/user/dashboard');
      return;
    }

    setSession(currentSession);
    loadUsers();
  }, [navigate]);

  const loadUsers = () => {
    const allUsers = userService.getAllUsers();
    setUsers(allUsers);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleUserCreated = () => {
    loadUsers();
    setActiveTab('users');
  };

  if (!session) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.isActive).length,
    adminUsers: users.filter((u) => u.role === 'admin').length,
    regularUsers: users.filter((u) => u.role === 'user').length,
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">{t.admin.title}</h1>
            <p className="dashboard-subtitle">{t.admin.subtitle}</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-details">
                <div className="user-name">{session.name}</div>
                <div className="user-email">{session.email}</div>
              </div>
              <div className="role-badge role-admin">Admin</div>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-dashboard-main">
        <nav className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            {t.admin.overview}
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {t.admin.userManagement}
          </button>
        </nav>

        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2 className="section-title">{t.admin.overview}</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon stat-icon-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.totalUsers}</div>
                    <div className="stat-label">{t.admin.totalUsers}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon stat-icon-success">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.activeUsers}</div>
                    <div className="stat-label">{t.admin.activeUsers}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon stat-icon-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.adminUsers}</div>
                    <div className="stat-label">{t.admin.administrators}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon stat-icon-info">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.regularUsers}</div>
                    <div className="stat-label">{t.admin.regularUsers}</div>
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h3 className="activity-title">{t.admin.recentActivity}</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">{t.admin.youLoggedIn}</p>
                      <p className="activity-time">{new Date(session.loginTime).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <UserManagement users={users} onUsersChange={loadUsers} onUserCreated={handleUserCreated} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

