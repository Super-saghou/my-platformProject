import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/i18n';
import type { User, CreateUserData } from '../../types/user';
import './UserForm.css';

interface UserFormProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (userData: CreateUserData | Partial<User>) => void;
}

function UserForm({ user, onClose, onSubmit }: UserFormProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
      });
    }
  }, [user]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = `${t.userMgmt.name} is required`;
    }

    if (!formData.email.trim()) {
      newErrors.email = `${t.userMgmt.email} is required`;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!user && !formData.password) {
      newErrors.password = `${t.userMgmt.password} is required`;
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = user
      ? { ...formData, password: formData.password || undefined }
      : formData;

    onSubmit(submitData);
  };

  return (
    <div className="user-form-overlay" onClick={onClose}>
      <div className="user-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="user-form-header">
          <h3>{user ? t.userMgmt.editUser : t.userMgmt.createUser}</h3>
          <button onClick={onClose} className="close-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="name">{t.userMgmt.name} *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'input-error' : ''}
              placeholder="John Doe"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">{t.userMgmt.email} *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'input-error' : ''}
              placeholder="user@example.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {t.userMgmt.password} {user ? `(${t.userMgmt.passwordLeaveBlank})` : '*'}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={errors.password ? 'input-error' : ''}
              placeholder="••••••••"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">{t.userMgmt.role} *</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
              className="role-select"
            >
              <option value="user">{t.userMgmt.employee}</option>
              <option value="admin">{t.userMgmt.administrator}</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              {t.common.cancel}
            </button>
            <button type="submit" className="submit-button">
              {user ? t.userMgmt.updateUser : t.userMgmt.createUser}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;

