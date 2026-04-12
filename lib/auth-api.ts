// lib/auth-api.ts

export const AUTH_BASE = 'https://api.seedco.sa/api/auth';

export const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const SAUDI_PHONE = /^(?:\+966|966|0)5\d{7,8}$/;
export const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;

export interface RegisterPayload {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface AuthApiError {
  code: string;
  message: string;
  /**
   * The account's username when relevant.
   * Sourced first from the top-level `username` field in the error body,
   * then from the `::` suffix in the code string.
   */
  pendingUsername?: string;
}

export interface User {
  userId: string;
  username: string;
  email: string;
  phone: string;
  picture?: string;
}

/** Decode the full JWT payload and return it as a plain object. */
export function decodeJwtPayload(jwt: string): Record<string, unknown> {
  try {
    const payload = jwt.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch { return {}; }
}

export interface AuthResult {
  ok: boolean;
  /** i18n key suffix — used as Auth.errors.{errorKey}. Never a human-readable string. */
  errorKey?: string;
  needsConfirm?: boolean;
}

export interface SignUpData {
  username: string;
  email: string;
  phone: string;
  password: string;
}

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${AUTH_BASE}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let data: Record<string, unknown> = {};
  try { data = await res.json(); } catch { /* empty body on 2xx */ }

  if (!res.ok) {
    const raw = (data.code as string) ?? 'UNKNOWN';
    const parts = raw.split('::');
    const err: AuthApiError = {
      code: parts[0],
      message: (data.message as string) ?? `Request failed: ${res.status}`,
      pendingUsername: (data.username as string | undefined) ?? parts[1],
    };
    throw err;
  }

  return data as T;
}

/** Normalise any Saudi phone input to +9665XXXXXXXX */
export function normalizeSaudiPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('966')) return `+${digits}`;
  if (digits.startsWith('0'))   return `+966${digits.slice(1)}`;
  return `+966${digits}`;
}

/** Decode JWT exp claim → ms timestamp. Returns 0 if unparseable. */
export function getTokenExpiry(jwt: string): number {
  try {
    const payload = jwt.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded.exp === 'number' ? decoded.exp * 1000 : 0;
  } catch { return 0; }
}

/** True if the JWT is expired or expires within bufferMs milliseconds. */
export function isTokenExpired(jwt: string, bufferMs = 60_000): boolean {
  const expiry = getTokenExpiry(jwt);
  return expiry === 0 || Date.now() >= expiry - bufferMs;
}

export async function register(payload: RegisterPayload): Promise<void> {
  await request<void>('register', payload);
}

export async function login(identifier: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('login', { identifier, password });
}

export async function confirmSignup(username: string, code: string): Promise<void> {
  await request<void>('confirm-signup', { username, code });
}

export async function resendCode(username: string): Promise<void> {
  await request<void>('resend-code', { username });
}

export async function refreshTokens(refreshToken: string): Promise<LoginResponse> {
  return request<LoginResponse>('refresh', { refreshToken });
}
