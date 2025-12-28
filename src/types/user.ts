// User types and roles

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
  role: UserRole;
  name: string;
  createdAt: string;
  isActive: boolean;
}

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  loginTime: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  role?: UserRole;
  name?: string;
  isActive?: boolean;
}

