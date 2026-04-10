"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  login,
  register,
  confirmSignup,
  resendCode,
  refreshTokens,
  normalizeSaudiPhone,
  isTokenExpired,
  getTokenExpiry,
  EMAIL_RE,
  SAUDI_PHONE,
  type LoginResponse,
  type User,
  type AuthResult,
  type SignUpData,
  type AuthApiError,
} from '@/lib/auth-api';

const STORAGE_USER   = 'seed-user';
const STORAGE_TOKENS = 'seed-tokens';

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  pendingUsername: string | null;
  isOpen: boolean;
  view: 'signin' | 'signup';
  openAuth: (view?: 'signin' | 'signup') => void;
  closeAuth: () => void;
  switchView: (view: 'signin' | 'signup') => void;
  cancelConfirm: () => void;
  signIn: (identifier: string, password: string) => Promise<AuthResult>;
  signUp: (data: SignUpData) => Promise<AuthResult>;
  confirmEmail: (code: string) => Promise<AuthResult>;
  resendVerification: () => Promise<{ ok: boolean }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authLoading: true,
  pendingUsername: null,
  isOpen: false,
  view: 'signin',
  openAuth: () => {},
  closeAuth: () => {},
  switchView: () => {},
  cancelConfirm: () => {},
  signIn: async () => ({ ok: false }),
  signUp: async () => ({ ok: false }),
  confirmEmail: async () => ({ ok: false }),
  resendVerification: async () => ({ ok: false }),
  signOut: () => {},
});

function codeToErrorKey(code: string): string {
  switch (code) {
    case 'USERNAME_TAKEN':          return 'usernameTaken';
    case 'PHONE_IN_USE':            return 'phoneInUse';
    case 'ACCOUNT_EXISTS_VERIFIED': return 'accountExists';
    default:                        return 'signUpFailed';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]                   = useState<User | null>(null);
  const [authLoading, setAuthLoading]     = useState(true);
  const [isOpen, setIsOpen]               = useState(false);
  const [view, setView]                   = useState<'signin' | 'signup'>('signin');
  const [pendingUsername, setPendingUsername] = useState<string | null>(null);

  const pendingPasswordRef  = useRef<string | null>(null);
  const pendingUserDataRef  = useRef<SignUpData | null>(null);
  const refreshTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingRefs = () => {
    pendingPasswordRef.current = null;
    pendingUserDataRef.current = null;
  };

  const scheduleRefresh = useCallback((accessToken: string, storedRefreshToken: string) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const expiry = getTokenExpiry(accessToken);
    if (!expiry) return;
    const delay = expiry - Date.now() - 60_000;
    if (delay <= 0) return;
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const fresh = await refreshTokens(storedRefreshToken);
        const saved = localStorage.getItem(STORAGE_TOKENS);
        const prev: LoginResponse | null = saved ? JSON.parse(saved) : null;
        const next: LoginResponse = {
          idToken:      fresh.idToken,
          accessToken:  fresh.accessToken,
          refreshToken: fresh.refreshToken ?? prev?.refreshToken ?? storedRefreshToken,
          userId:       fresh.userId ?? prev?.userId ?? '',
        };
        localStorage.setItem(STORAGE_TOKENS, JSON.stringify(next));
        scheduleRefresh(next.accessToken, next.refreshToken);
      } catch {
        // Refresh failed — sign out
        setUser(null);
        localStorage.removeItem(STORAGE_USER);
        localStorage.removeItem(STORAGE_TOKENS);
      }
    }, delay);
  }, []);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        const savedUser   = localStorage.getItem(STORAGE_USER);
        const savedTokens = localStorage.getItem(STORAGE_TOKENS);
        if (!savedUser || !savedTokens) return;

        const tokens: LoginResponse = JSON.parse(savedTokens);

        if (isTokenExpired(tokens.accessToken, 0)) {
          // bufferMs=0: only refresh if truly expired, not just within the 60 s window
          try {
            const fresh = await refreshTokens(tokens.refreshToken);
            const next: LoginResponse = {
              idToken:      fresh.idToken,
              accessToken:  fresh.accessToken,
              refreshToken: fresh.refreshToken ?? tokens.refreshToken,
              userId:       fresh.userId ?? tokens.userId,
            };
            localStorage.setItem(STORAGE_TOKENS, JSON.stringify(next));
            setUser(JSON.parse(savedUser));
            scheduleRefresh(next.accessToken, next.refreshToken);
          } catch {
            localStorage.removeItem(STORAGE_USER);
            localStorage.removeItem(STORAGE_TOKENS);
          }
        } else {
          setUser(JSON.parse(savedUser));
          scheduleRefresh(tokens.accessToken, tokens.refreshToken);
        }
      } catch {
        // Ignore malformed data
      } finally {
        setAuthLoading(false);
      }
    };
    hydrate();
    return () => { if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current); };
  }, [scheduleRefresh]);

  const finalizeLogin = useCallback((newUser: User, tokens: LoginResponse) => {
    setUser(newUser);
    localStorage.setItem(STORAGE_USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_TOKENS, JSON.stringify(tokens));
    scheduleRefresh(tokens.accessToken, tokens.refreshToken);
    setPendingUsername(null);
    clearPendingRefs();
    setIsOpen(false);
  }, [scheduleRefresh]);

  const openAuth = useCallback((v: 'signin' | 'signup' = 'signin') => {
    setView(v);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
    setPendingUsername(null);
    clearPendingRefs();
    setView('signin');
  }, []);

  const switchView = useCallback((v: 'signin' | 'signup') => {
    setView(v);
  }, []);

  const cancelConfirm = useCallback(() => {
    setPendingUsername(null);
    clearPendingRefs();
    setView('signin');
    // Does NOT close the modal — user stays in the open modal
  }, []);

  const signIn = useCallback(async (identifier: string, password: string): Promise<AuthResult> => {
    try {
      const tokens = await login(identifier, password);
      const isEmail = EMAIL_RE.test(identifier);
      const isPhone = SAUDI_PHONE.test(identifier.replace(/\s/g, ''));
      const newUser: User = {
        userId:   tokens.userId,
        username: isEmail ? identifier.split('@')[0] : isPhone ? '' : identifier,
        email:    isEmail ? identifier : '',
        phone:    '',
      };
      finalizeLogin(newUser, tokens);
      return { ok: true };
    } catch (err) {
      const apiErr = err as AuthApiError;
      if (apiErr.code === 'USER_NOT_CONFIRMED') {
        if (!apiErr.pendingUsername) {
          // Cannot infer username from email/phone — cannot enter confirm flow safely
          return { ok: false, errorKey: 'signInFailed' };
        }
        setPendingUsername(apiErr.pendingUsername);
        pendingPasswordRef.current = password;
        try { await resendCode(apiErr.pendingUsername); } catch { /* silent */ }
        return { ok: false, needsConfirm: true };
      }
      return { ok: false, errorKey: 'signInFailed' };
    }
  }, [finalizeLogin]);

  const signUp = useCallback(async (data: SignUpData): Promise<AuthResult> => {
    const phone = normalizeSaudiPhone(data.phone);
    try {
      await register({ ...data, phone, confirmPassword: data.password });
      setPendingUsername(data.username);
      pendingPasswordRef.current  = data.password;
      pendingUserDataRef.current  = data;
      return { ok: true, needsConfirm: true };
    } catch (err) {
      const apiErr = err as AuthApiError;
      if (apiErr.code === 'ACCOUNT_EXISTS_UNVERIFIED') {
        const uname = apiErr.pendingUsername ?? data.username;
        setPendingUsername(uname);
        pendingPasswordRef.current = data.password;
        pendingUserDataRef.current = data;
        try { await resendCode(uname); } catch { /* silent */ }
        return { ok: false, needsConfirm: true };
      }
      return { ok: false, errorKey: codeToErrorKey(apiErr.code) };
    }
  }, []);

  const confirmEmail = useCallback(async (code: string): Promise<AuthResult> => {
    if (!pendingUsername) return { ok: false, errorKey: 'signUpFailed' };
    if (!pendingPasswordRef.current) {
      closeAuth();
      return { ok: true };
    }
    try {
      await confirmSignup(pendingUsername, code);
      // Auto-login with stored credentials
      const password = pendingPasswordRef.current;
      try {
        const tokens = await login(pendingUsername, password);
        const ud = pendingUserDataRef.current;
        const newUser: User = ud
          ? { userId: tokens.userId, username: ud.username, email: ud.email, phone: ud.phone }
          : { userId: tokens.userId, username: pendingUsername, email: '', phone: '' };
        finalizeLogin(newUser, tokens);
        return { ok: true };
      } catch {
        closeAuth();
        return { ok: true };
      }
    } catch (err) {
      const apiErr = err as AuthApiError;
      const key = apiErr.code === 'INVALID_CODE' || apiErr.code === 'EXPIRED_CODE'
        ? 'invalidCode'
        : 'signUpFailed';
      return { ok: false, errorKey: key };
    }
  }, [pendingUsername, finalizeLogin, closeAuth]);

  const resendVerification = useCallback(async (): Promise<{ ok: boolean }> => {
    if (!pendingUsername) return { ok: false };
    try {
      await resendCode(pendingUsername);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }, [pendingUsername]);

  const signOut = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    setUser(null);
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_TOKENS);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, authLoading, pendingUsername, isOpen, view,
      openAuth, closeAuth, switchView, cancelConfirm,
      signIn, signUp, confirmEmail, resendVerification, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
