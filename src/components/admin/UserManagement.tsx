import { useState } from 'react';
import { userService } from '../../services/auth';
import { useI18n } from '../../i18n/i18n';
import type { User, CreateUserData } from '../../types/user';
import UserForm from './UserForm';
import UserList from './UserList';
import './UserManagement.css';

interface UserManagementProps {
  users: User[];
  onUsersChange: () => void;
  onUserCreated: () => void;
}

function UserManagement({ users, onUsersChange, onUserCreated }: UserManagementProps) {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleFormSubmit = (userData: CreateUserData | Partial<User>) => {
    try {
      if (editingUser) {
        userService.updateUser(editingUser.id, userData as Partial<User>);
      } else {
        userService.createUser(userData as CreateUserData);
        onUserCreated();
      }
      onUsersChange();
      handleFormClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm(t.userMgmt.deleteConfirm)) {
      try {
        userService.deleteUser(id);
        onUsersChange();
      } catch (error) {
        alert(error instanceof Error ? error.message : 'An error occurred');
      }
    }
  };

  const handleToggleStatus = (id: string) => {
    try {
      userService.toggleUserStatus(id);
      onUsersChange();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(search) ||
      user.name.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
    );
  });

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div>
          <h2 className="section-title">{t.userMgmt.title}</h2>
          <p className="section-subtitle">{t.userMgmt.subtitle}</p>
        </div>
        <button onClick={handleCreateUser} className="create-user-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t.userMgmt.addUser}
        </button>
      </div>

      <div className="user-management-filters">
        <div className="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder={t.userMgmt.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="user-count">
          {filteredUsers.length} {t.userMgmt.usersFound}
        </div>
      </div>

      <UserList
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
      />

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default UserManagement;

