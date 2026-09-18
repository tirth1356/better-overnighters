// ─── Auth Service ───
// Mock localStorage-backed auth service.
// Replace the implementation here to connect to a real backend.
// The interface (login, signup, logout, getCurrentUser, isAuthenticated)
// stays stable — callers do not need to change.

import type { User } from '@/types';

const AUTH_KEY   = 'familycare_auth_user';
const REMEMBER_KEY = 'familycare_remember_me';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface AuthError {
  field?: string;
  message: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: AuthError;
}

// ─── Mock user "database" ────────────────────────────────────────
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'user-001',
    name: 'Tirth Patel',
    email: 'tirth@familycare.app',
    password: 'password123',
    familyId: 'family-001',
    createdAt: '2024-01-15T10:00:00Z',
  },
];

// ─── Auth Service ─────────────────────────────────────────────────
export const authService = {
  /**
   * Log in with email and password.
   * Replace this implementation with a real API call.
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    // Simulate network delay
    await delay(800);

    const found = MOCK_USERS.find(
      u => u.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (!found) {
      return {
        success: false,
        error: { field: 'email', message: 'No account found with this email address.' },
      };
    }

    if (found.password !== credentials.password) {
      return {
        success: false,
        error: { field: 'password', message: 'Incorrect password. Please try again.' },
      };
    }

    const user: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      familyId: found.familyId,
      createdAt: found.createdAt,
    };

    const storage = credentials.rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_KEY, JSON.stringify(user));
    if (credentials.rememberMe) {
      localStorage.setItem(REMEMBER_KEY, 'true');
    }

    return { success: true, user };
  },

  /**
   * Register a new account.
   * Replace this implementation with a real API call.
   */
  async signup(data: SignupData): Promise<AuthResult> {
    await delay(1000);

    const exists = MOCK_USERS.find(
      u => u.email.toLowerCase() === data.email.toLowerCase()
    );

    if (exists) {
      return {
        success: false,
        error: { field: 'email', message: 'An account with this email already exists.' },
      };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      createdAt: new Date().toISOString(),
    };

    // In a real app, persist to backend here
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(newUser));

    return { success: true, user: newUser };
  },

  /**
   * Log the current user out.
   */
  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(REMEMBER_KEY);
  },

  /**
   * Get the currently authenticated user, or null.
   */
  getCurrentUser(): User | null {
    const raw =
      localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  /**
   * Returns true if there is an authenticated session.
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};

// ─── Utility ─────────────────────────────────────────────────────
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
