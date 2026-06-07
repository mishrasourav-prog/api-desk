import { useState } from 'react';
import type { AuthView } from '../types/auth';

export interface AuthState {
  view: AuthView;
  pendingEmail: string;
  resetToken: string | null;
  isAuthenticated: boolean;
}

export interface UseAuthReturn {
  authState: AuthState;
  navigateTo: (view: AuthView) => void;
  setPendingEmail: (email: string) => void;
  login: () => void;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [authState, setAuthState] = useState<AuthState>({
    view: 'login',
    pendingEmail: '',
    resetToken: null,
    isAuthenticated: false,
  });

  function navigateTo(view: AuthView) {
    setAuthState(prev => ({ ...prev, view }));
  }

  function setPendingEmail(email: string) {
    setAuthState(prev => ({ ...prev, pendingEmail: email }));
  }

  function login() {
    setAuthState(prev => ({ ...prev, isAuthenticated: true, view: 'dashboard' }));
  }

  function logout() {
    setAuthState({ view: 'login', pendingEmail: '', resetToken: null, isAuthenticated: false });
  }

  return { authState, navigateTo, setPendingEmail, login, logout };
}