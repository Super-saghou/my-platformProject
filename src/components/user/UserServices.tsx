import { useState, useEffect } from 'react';
import { authService } from '../../services/auth';
import { communeService } from '../../services/communeService';
import { budgetService } from '../../services/budgetService';
import type { Commune } from '../../types/budget';
import './UserServices.css';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'pending' | 'completed';
  progress?: number;
  date?: string;
}

function UserServices() {
  const [session] = useState(authService.getCurrentSession());
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [services, setServices] = useState<ServiceCard[]>([]);
  const [stats, setStats] = useState({
    totalCommunes: 0,
    totalBudget: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    if (session) {
      loadUserData();
      generateServices();
    }
  }, [session]);

  const loadUserData = () => {
    if (!session) return;

    const userCommunes = session.role === 'admin'
      ? communeService.getAllCommunes()
      : communeService.getCommunesByUserId(session.id);
    
    setCommunes(userCommunes);

    // Calculer les statistiques
    let totalBudget = 0;
    userCommunes.forEach((commune) => {
      const data = budgetService.getCommuneBudgetData(commune.id);
      const currentYear = new Date().getFullYear();
      data.recettes.forEach((r) => {
        const yearData = r.donnees.find((d) => d.annee === currentYear);
        if (yearData) {
          totalBudget += yearData.budgetVote;
        }
      });
    });

    setStats({
      totalCommunes: userCommunes.length,
      totalBudget,
      completedTasks: Math.floor(userCommunes.length * 0.7),
      pendingTasks: Math.ceil(userCommunes.length * 0.3),
    });
  };

  const generateServices = () => {
    if (!session) return;

    const mockServices: ServiceCard[] = [
      {
        id: '1',
        title: 'Saisie Budget 2025',
        description: 'Finalisation de la saisie des données budgétaires pour l\'année 2025',
        icon: '📊',
        status: 'active',
        progress: 75,
        date: new Date().toLocaleDateString('fr-FR'),
      },
      {
        id: '2',
        title: 'Validation Équilibre',
        description: 'Vérification de l\'équilibre recettes/dépenses pour toutes les communes',
        icon: '✅',
        status: 'pending',
        progress: 45,
        date: new Date(Date.now() + 86400000).toLocaleDateString('fr-FR'),
      },
      {
        id: '3',
        title: 'Export Données',
        description: 'Export des données budgétaires pour analyse et prévision',
        icon: '📤',
        status: 'completed',
        progress: 100,
        date: new Date(Date.now() - 172800000).toLocaleDateString('fr-FR'),
      },
      {
        id: '4',
        title: 'Mise à Jour Événements',
        description: 'Ajout des événements futurs pour le budget 2026',
        icon: '📅',
        status: 'active',
        progress: 30,
        date: new Date().toLocaleDateString('fr-FR'),
      },
      {
        id: '5',
        title: 'Rapport Mensuel',
        description: 'Génération du rapport mensuel des dépenses réelles',
        icon: '📄',
        status: 'pending',
        progress: 0,
        date: new Date(Date.now() + 259200000).toLocaleDateString('fr-FR'),
      },
      {
        id: '6',
        title: 'Révision Budget',
        description: 'Révision et ajustement du budget prévisionnel 2026',
        icon: '🔍',
        status: 'active',
        progress: 60,
        date: new Date().toLocaleDateString('fr-FR'),
      },
    ];

    setServices(mockServices);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#667eea';
      case 'pending':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'En cours';
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  return (
    <div className="user-services">
      <div className="services-header">
        <h2>Mes Services</h2>
        <p className="services-subtitle">Gestion de vos tâches et activités</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            🏛️
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCommunes}</div>
            <div className="stat-label">Communes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            💰
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {(stats.totalBudget / 1000000).toFixed(1)}M
            </div>
            <div className="stat-label">Budget Total (DT)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            ✅
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.completedTasks}</div>
            <div className="stat-label">Tâches Terminées</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            ⏳
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingTasks}</div>
            <div className="stat-label">En Attente</div>
          </div>
        </div>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-header">
              <div className="service-icon">{service.icon}</div>
              <div className="service-status" style={{ backgroundColor: getStatusColor(service.status) + '20', color: getStatusColor(service.status) }}>
                {getStatusLabel(service.status)}
              </div>
            </div>
            <div className="service-body">
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              {service.progress !== undefined && (
                <div className="service-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${service.progress}%`,
                        backgroundColor: getStatusColor(service.status),
                      }}
                    />
                  </div>
                  <span className="progress-text">{service.progress}%</span>
                </div>
              )}
            </div>
            <div className="service-footer">
              <span className="service-date">📅 {service.date}</span>
              <button className="service-action-btn">Voir détails →</button>
            </div>
          </div>
        ))}
      </div>

      {communes.length > 0 && (
        <div className="communes-preview">
          <h3>Mes Communes Assignées</h3>
          <div className="communes-list">
            {communes.map((commune) => (
              <div key={commune.id} className="commune-preview-card">
                <div className="commune-preview-icon">🏛️</div>
                <div className="commune-preview-info">
                  <h4>{commune.nom}</h4>
                  <p>{commune.gouvernorat} • {commune.code}</p>
                </div>
                <button className="commune-preview-btn">Gérer →</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserServices;
