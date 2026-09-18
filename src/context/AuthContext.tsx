import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';
import type { User } from '@/types';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from storage on mount
  useEffect(() => {
    const stored = authService.getCurrentUser();
    setUser(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (
    email: string,
    password: string,
    rememberMe = false,
  ) => {
    const result = await authService.login({ email, password, rememberMe });
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error?.message };
  }, []);

  const signup = useCallback(async (
    name: string,
    email: string,
    password: string,
  ) => {
    const result = await authService.signup({ name, email, password });
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error?.message };
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
