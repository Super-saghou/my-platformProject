import { useI18n } from '../../i18n/i18n';
import type { User } from '../../types/user';
import './UserList.css';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

function UserList({ users, onEdit, onDelete, onToggleStatus }: UserListProps) {
  const { t } = useI18n();
  
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <p>{t.userMgmt.noUsers}</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="user-list-header">
        <div className="header-cell">{t.userMgmt.name}</div>
        <div className="header-cell">{t.userMgmt.email}</div>
        <div className="header-cell">{t.userMgmt.role}</div>
        <div className="header-cell">{t.common.status}</div>
        <div className="header-cell">{t.userMgmt.createdAt}</div>
        <div className="header-cell actions">{t.common.actions}</div>
      </div>
      <div className="user-list-body">
        {users.map((user) => (
          <div key={user.id} className={`user-row ${!user.isActive ? 'inactive' : ''}`}>
            <div className="user-cell">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-name">{user.name}</div>
            </div>
            <div className="user-cell">{user.email}</div>
            <div className="user-cell">
              <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                {user.role === 'admin' ? t.userMgmt.administrator : t.userMgmt.employee}
              </span>
            </div>
            <div className="user-cell">
              <button
                onClick={() => onToggleStatus(user.id)}
                className={`status-toggle ${user.isActive ? 'active' : 'inactive'}`}
              >
                {user.isActive ? t.common.active : t.common.inactive}
              </button>
            </div>
            <div className="user-cell">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <div className="user-cell actions">
              <button
                onClick={() => onEdit(user)}
                className="action-button edit-button"
                title={t.common.edit}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(user.id)}
                className="action-button delete-button"
                title={t.common.delete}
                disabled={user.role === 'admin' && users.filter((u) => u.role === 'admin').length === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;

