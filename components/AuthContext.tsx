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
  socialLogin as apiSocialLogin,
  normalizeSaudiPhone,
  isTokenExpired,
  getTokenExpiry,
  decodeJwtPayload,
  EMAIL_RE,
  SAUDI_PHONE,
  type LoginResponse,
  type User,
  type AuthResult,
  type SignUpData,
  type AuthApiError,
  type SocialLoginPayload,
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
  socialLogin: (payload: SocialLoginPayload) => Promise<AuthResult>;
  confirmEmail: (code: string) => Promise<AuthResult>;
  resendVerification: () => Promise<{ ok: boolean }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
        refreshTimerRef.current = null;
        setUser(null);
        localStorage.removeItem(STORAGE_USER);
        localStorage.removeItem(STORAGE_TOKENS);
      }
    }, delay);
  }, []);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      try {
        const savedUser   = localStorage.getItem(STORAGE_USER);
        const savedTokens = localStorage.getItem(STORAGE_TOKENS);
        if (!savedUser || !savedTokens) return;

        const tokens: LoginResponse = JSON.parse(savedTokens);

        if (isTokenExpired(tokens.accessToken, 0)) {
          try {
            const fresh = await refreshTokens(tokens.refreshToken);
            const next: LoginResponse = {
              idToken:      fresh.idToken,
              accessToken:  fresh.accessToken,
              refreshToken: fresh.refreshToken ?? tokens.refreshToken,
              userId:       fresh.userId ?? tokens.userId,
            };
            if (!cancelled) {
              localStorage.setItem(STORAGE_TOKENS, JSON.stringify(next));
              setUser(JSON.parse(savedUser));
              scheduleRefresh(next.accessToken, next.refreshToken);
            }
          } catch {
            if (!cancelled) {
              localStorage.removeItem(STORAGE_USER);
              localStorage.removeItem(STORAGE_TOKENS);
            }
          }
        } else {
          if (!cancelled) {
            setUser(JSON.parse(savedUser));
            scheduleRefresh(tokens.accessToken, tokens.refreshToken);
          }
        }
      } catch {
        // Ignore malformed data
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    };
    hydrate();
    return () => {
      cancelled = true;
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [scheduleRefresh]);

  const finalizeLogin = useCallback((newUser: User, tokens: LoginResponse) => {
    setUser(newUser);
    localStorage.setItem(STORAGE_USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_TOKENS, JSON.stringify(tokens));
    scheduleRefresh(tokens.accessToken, tokens.refreshToken);
    setPendingUsername(null);
    pendingPasswordRef.current = null;
    pendingUserDataRef.current = null;
    setIsOpen(false);
  }, [scheduleRefresh]);

  const openAuth = useCallback((v: 'signin' | 'signup' = 'signin') => {
    setView(v);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
    setPendingUsername(null);
    pendingPasswordRef.current = null;
    pendingUserDataRef.current = null;
    setView('signin');
  }, []);

  const switchView = useCallback((v: 'signin' | 'signup') => {
    setView(v);
  }, []);

  const cancelConfirm = useCallback(() => {
    setPendingUsername(null);
    pendingPasswordRef.current = null;
    pendingUserDataRef.current = null;
    setView('signin');
    // Does NOT close the modal — user stays in the open modal
  }, []);

  const signIn = useCallback(async (identifier: string, password: string): Promise<AuthResult> => {
    try {
      const tokens = await login(identifier, password);
      const isEmail = EMAIL_RE.test(identifier);
      const isPhone = SAUDI_PHONE.test(identifier.replace(/\s/g, ''));
      // Note: LoginResponse does not return full profile data.
      // phone is always ''; username is inferred from the identifier type.
      const claims = decodeJwtPayload(tokens.idToken);
      const newUser: User = {
        userId:   tokens.userId,
        username: (typeof claims['cognito:username'] === 'string' ? claims['cognito:username'] : null)
                  ?? (isEmail ? identifier.split('@')[0] : isPhone ? '' : identifier),
        email:    (typeof claims.email === 'string' ? claims.email : null) ?? (isEmail ? identifier : ''),
        phone:    typeof claims.phone_number === 'string' ? claims.phone_number : '',
        picture:  typeof claims.picture === 'string' ? claims.picture : undefined,
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

  const socialLogin = useCallback(async (payload: SocialLoginPayload): Promise<AuthResult> => {
    try {
      const tokens = await apiSocialLogin(payload);
      const claims = decodeJwtPayload(tokens.idToken);
      const newUser: User = {
        userId:   tokens.userId,
        username: (typeof claims['cognito:username'] === 'string' ? claims['cognito:username'] : null)
                  ?? payload.userInfo.email.split('@')[0],
        email:    (typeof claims.email === 'string' ? claims.email : null)
                  ?? payload.userInfo.email,
        phone:    typeof claims.phone_number === 'string' ? claims.phone_number : '',
        picture:  payload.userInfo.photoURL
                  ?? (typeof claims.picture === 'string' ? claims.picture : undefined),
      };
      finalizeLogin(newUser, tokens);
      return { ok: true };
    } catch {
      return { ok: false, errorKey: 'socialLoginFailed' };
    }
  }, [finalizeLogin]);

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
        const claims2 = decodeJwtPayload(tokens.idToken);
        const pic2   = typeof claims2.picture      === 'string' ? claims2.picture      : undefined;
        const phone2 = typeof claims2.phone_number === 'string' ? claims2.phone_number : (ud?.phone ?? '');
        const email2 = typeof claims2.email        === 'string' ? claims2.email        : (ud?.email ?? '');
        const uname2 = (typeof claims2['cognito:username'] === 'string' ? claims2['cognito:username'] : null) ?? ud?.username ?? pendingUsername;
        const newUser: User = {
          userId:  tokens.userId,
          username: uname2,
          email:    email2,
          phone:    phone2,
          picture:  pic2,
        };
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
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    setUser(null);
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_TOKENS);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, authLoading, pendingUsername, isOpen, view,
      openAuth, closeAuth, switchView, cancelConfirm,
      signIn, signUp, socialLogin, confirmEmail, resendVerification, signOut,
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
