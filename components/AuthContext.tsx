"use client";

import { createContext, useCallback, useContext, useState } from 'react';

interface AuthContextType {
  isOpen: boolean;
  view: 'signin' | 'signup';
  openAuth: (view?: 'signin' | 'signup') => void;
  closeAuth: () => void;
  switchView: (view: 'signin' | 'signup') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'signin' | 'signup'>('signin');

  const openAuth = useCallback((v: 'signin' | 'signup' = 'signin') => {
    setView(v);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => setIsOpen(false), []);

  const switchView = useCallback((v: 'signin' | 'signup') => setView(v), []);

  return (
    <AuthContext.Provider value={{ isOpen, view, openAuth, closeAuth, switchView }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
