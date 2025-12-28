// Authentication service to manage user session
import type { UserSession, User, CreateUserData, UpdateUserData } from '../types/user';

const AUTH_KEY = 'platform_session';
const USERS_KEY = 'platform_users';
const ADMIN_EMAIL = 'admin@platform.com'; // Default admin email
const ADMIN_PASSWORD = 'admin123'; // Default admin password (in production, change this!)

// Initialize default admin user if users don't exist
function initializeUsers(): void {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    const defaultUsers: User[] = [
      {
        id: '1',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD, // In production, this should be hashed
        role: 'admin',
        name: 'Administrator',
        createdAt: new Date().toISOString(),
        isActive: true,
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
}

// Initialize on load
initializeUsers();

export const authService = {
  // Authenticate user with email and password
  authenticate: (email: string, password: string): User | null => {
    const users = authService.getAllUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.isActive
    );

    if (!user) {
      return null;
    }

    // In production, compare hashed passwords
    if (user.password !== password) {
      return null;
    }

    return user;
  },

  // Save user session to localStorage
  login: (user: User): void => {
    const session: UserSession = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      loginTime: new Date().toISOString(),
    };
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  },

  // Get current user session
  getCurrentSession: (): UserSession | null => {
    const sessionStr = localStorage.getItem(AUTH_KEY);
    if (!sessionStr) return null;
    
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return localStorage.getItem(AUTH_KEY) !== null;
  },

  // Check if current user is admin
  isAdmin: (): boolean => {
    const session = authService.getCurrentSession();
    return session?.role === 'admin';
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem(AUTH_KEY);
  },

  // Get user email
  getUserEmail: (): string | null => {
    const session = authService.getCurrentSession();
    return session?.email || null;
  },

  // Get user role
  getUserRole: (): string | null => {
    const session = authService.getCurrentSession();
    return session?.role || null;
  },
};

// User management service (for admin)
export const userService = {
  // Get all users
  getAllUsers: (): User[] => {
    try {
      const usersStr = localStorage.getItem(USERS_KEY);
      if (!usersStr) return [];
      return JSON.parse(usersStr);
    } catch {
      return [];
    }
  },

  // Get user by ID
  getUserById: (id: string): User | null => {
    const users = userService.getAllUsers();
    return users.find((u) => u.id === id) || null;
  },

  // Get user by email
  getUserByEmail: (email: string): User | null => {
    const users = userService.getAllUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  // Create new user
  createUser: (userData: CreateUserData): User => {
    const users = userService.getAllUsers();
    
    // Check if email already exists
    if (userService.getUserByEmail(userData.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      email: userData.email,
      password: userData.password, // In production, hash this
      role: userData.role,
      name: userData.name,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return newUser;
  },

  // Update user
  updateUser: (id: string, userData: UpdateUserData): User => {
    const users = userService.getAllUsers();
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Check if email is being changed and if it already exists
    if (userData.email && userData.email !== users[userIndex].email) {
      if (userService.getUserByEmail(userData.email)) {
        throw new Error('User with this email already exists');
      }
    }

    const updatedUser: User = {
      ...users[userIndex],
      ...userData,
      id: users[userIndex].id, // Don't allow ID change
      createdAt: users[userIndex].createdAt, // Don't allow createdAt change
    };

    users[userIndex] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return updatedUser;
  },

  // Delete user
  deleteUser: (id: string): void => {
    const users = userService.getAllUsers();
    const filteredUsers = users.filter((u) => u.id !== id);
    
    if (filteredUsers.length === users.length) {
      throw new Error('User not found');
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
  },

  // Toggle user active status
  toggleUserStatus: (id: string): User => {
    const user = userService.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return userService.updateUser(id, { isActive: !user.isActive });
  },
};

// Export getAllUsers for authService
authService.getAllUsers = userService.getAllUsers;

