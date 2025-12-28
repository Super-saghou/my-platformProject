import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, type User } from '../services/auth';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Platform</h1>
          <div className="user-info">
            <div className="user-email">{user.email}</div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome to Platform!</h2>
          <p className="welcome-message">
            You have successfully signed in with <strong>{user.email}</strong>
          </p>
          <p className="login-time">
            Logged in at: {new Date(user.loginTime).toLocaleString()}
          </p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card">
            <h3>Your Dashboard</h3>
            <p>This is your main platform area. You can build your features here.</p>
          </div>

          <div className="dashboard-card">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-button">View Profile</button>
              <button className="action-button">Settings</button>
              <button className="action-button">Help & Support</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

