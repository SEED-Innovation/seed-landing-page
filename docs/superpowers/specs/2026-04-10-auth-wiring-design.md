# Auth Wiring Design
**Date:** 2026-04-10
**Status:** Approved

---

## 1. Goal

Wire the existing auth modal UI (sign-in / sign-up forms, AuthContext, AuthModal) to the real SEED API, mirroring the working implementation in the P1_padel project. After this, users can create accounts, verify their email, and sign in — with sessions persisted across page reloads.

---

## 2. API Contract

All endpoints: `POST https://api.seedco.sa/api/auth/<path>`  
All requests: `Content-Type: application/json`

| Endpoint | Body | Response |
|---|---|---|
| `/auth/register` | `{ username, email, phone, password, confirmPassword }` | `204 No Content` |
| `/auth/login` | `{ identifier, password }` | `{ idToken, accessToken, refreshToken, userId }` |
| `/auth/confirm-signup` | `{ username, code }` | `204 No Content` |
| `/auth/resend-code` | `{ username }` | `204 No Content` |
| `/auth/refresh` | `{ refreshToken }` | `{ idToken, accessToken, refreshToken, userId }` |

**Phone normalisation:** Saudi local `05XXXXXXXX` → `+9665XXXXXXXX` before sending to register.

**Error shape:**
```json
{ "code": "USERNAME_TAKEN", "message": "...", "username": "optional" }
```
Code may embed a username: `ACCOUNT_EXISTS_UNVERIFIED::someuser` — split on `::`.

**Known error codes:**
- `USERNAME_TAKEN` — sign-up: username already registered
- `PHONE_IN_USE` — sign-up: phone already registered
- `ACCOUNT_EXISTS_VERIFIED` — sign-up: account already fully active
- `ACCOUNT_EXISTS_UNVERIFIED` — sign-up: account exists but not confirmed; auto-redirect to confirm view
- `USER_NOT_CONFIRMED` — sign-in: account exists but email unconfirmed; auto-redirect to confirm view + resend code
- `INVALID_CODE` / `EXPIRED_CODE` — confirm view: bad or stale verification code

---

## 3. Session Management

- **Storage:** `localStorage` keys `seed-user` (JSON `User`) and `seed-tokens` (JSON `Tokens`).
- **Hydration:** on `AuthProvider` mount, read localStorage; if access token is expired, attempt silent refresh via `/auth/refresh`; if refresh also fails, clear session.
- **Auto-refresh timer:** schedule a `setTimeout` to re-call `/auth/refresh` 60 s before the access token's `exp` claim. On refresh success, persist new tokens and reschedule. On failure, sign out.
- **JWT decode:** split on `.`, base64-decode the middle segment, parse JSON, read `exp * 1000`. No library required.
- **Sign out:** clear both localStorage keys, cancel the refresh timer, set `user = null`.

---

## 4. Components & Files

### 4.1 `lib/auth-api.ts` (new)

Pure API + utility functions. No React. Exports:

```ts
register(payload: RegisterPayload): Promise<void>
login(identifier: string, password: string): Promise<LoginResponse>
confirmSignup(username: string, code: string): Promise<void>
resendCode(username: string): Promise<void>
refreshTokens(refreshToken: string): Promise<LoginResponse>
normalizeSaudiPhone(raw: string): string
getTokenExpiry(jwt: string): number      // ms timestamp, 0 if unparseable
isTokenExpired(jwt: string, bufferMs?): boolean
```

Types:
```ts
interface RegisterPayload { username; email; phone; password; confirmPassword }
interface LoginResponse   { idToken; accessToken; refreshToken; userId }
interface AuthApiError    { code: string; message: string; pendingUsername?: string }
```

Base URL: `const AUTH_BASE = 'https://api.seedco.sa/api/auth'` — also exported so other files don't hardcode it.

Internal `request<T>(path, body)` function handles `fetch`, JSON parse, and throws `AuthApiError` on non-2xx.

### 4.2 `components/AuthContext.tsx` (rewrite)

**State:**
```ts
user: User | null
authLoading: boolean          // true until localStorage hydration completes
pendingUsername: string | null  // non-null = confirm-email view is active
isOpen: boolean
view: 'signin' | 'signup'     // kept for backward compat; confirm driven by pendingUsername
```

**Methods (all wrapped in `useCallback`):**
```ts
openAuth(view?: 'signin' | 'signup'): void
closeAuth(): void              // also clears pendingUsername + pending refs
switchView(view): void
signIn(identifier, password): Promise<AuthResult>
signUp(data: SignUpData): Promise<AuthResult>
confirmEmail(code): Promise<AuthResult>
resendVerification(): Promise<void>
signOut(): void
```

`AuthResult = { ok: boolean; error?: string; needsConfirm?: boolean }`

**Internal refs (in-memory only, never persisted):**
- `pendingPasswordRef` — password kept for auto-login after confirmation
- `pendingUserDataRef` — full sign-up fields for rich `User` after confirmation

**`finalizeLogin(user, tokens)`:** sets state, writes localStorage, starts refresh timer, clears pending refs, closes modal.

**`signIn` logic:**
1. Call `login(identifier, password)`.
2. On success → `finalizeLogin`.
3. On `USER_NOT_CONFIRMED` → set `pendingUsername`, store password ref, call `resendCode`, return `{ ok: false, needsConfirm: true }`.
4. Other errors → return `{ ok: false, error: 'Auth.errors.signInFailed' }`.

**`signUp` logic:**
1. Normalize phone, call `register(...)`.
2. On success → set `pendingUsername`, store password + user refs, return `{ ok: true, needsConfirm: true }`.
3. On `ACCOUNT_EXISTS_UNVERIFIED` → set pending state, resend code, return `{ ok: false, needsConfirm: true }`.
4. Other errors → return `{ ok: false, error: mapped key }`.

**`confirmEmail` logic:**
1. Call `confirmSignup(pendingUsername, code)`.
2. On success → auto-login with stored password ref → `finalizeLogin`.
3. If auto-login fails → `closeAuth()`, return `{ ok: true }` (still confirmed).
4. Errors → return `{ ok: false, error: mapped key }`.

### 4.3 `components/AuthConfirmForm.tsx` (new)

View shown after sign-up or when login detects `USER_NOT_CONFIRMED`.

- Single `<input type="text" inputMode="numeric" maxLength={6}>` accepting digits only.
- "Verify" submit button — disabled until 6 digits entered.
- "Resend code" button — calls `resendVerification()`, shows brief success message for 4 s.
- "Back to Sign In" link — calls `switchView('signin')` + clears confirm state.
- Loading state on submit.
- Inline error display for `INVALID_CODE` / `EXPIRED_CODE`.
- Animated envelope icon header (consistent with existing modal style).
- Full i18n (`Auth.confirm.*` keys).

### 4.4 `components/AuthSignInForm.tsx` (update)

Replace `console.log` stub with real flow:
1. Call `signIn(emailOrPhone, password)` from context.
2. While loading: disable submit, show spinner inside button text.
3. On `needsConfirm`: context handles view switch (pendingUsername → confirm view in modal).
4. On `!ok`: display `t(`errors.${result.error}`)` as a `<p>` global error above the submit button.
5. On `ok`: modal closes automatically (handled by `finalizeLogin`).

Google / Apple buttons remain no-ops (console.log) — OAuth is out of scope.

Password validation stays at `min(1)` for sign-in (server validates).

### 4.5 `components/AuthSignUpForm.tsx` (update)

Replace stub with real flow + strengthen validation:

**Updated password zod rule:** `min(8).regex(/[A-Z]/, 'passwordWeak').regex(/[a-z]/, 'passwordWeak').regex(/[0-9]/, 'passwordWeak')` — single error key `passwordWeak` covers all three sub-rules.

**Password strength meter** (4 segments, below the input):
- Score 0–4: length≥8 (+1), uppercase (+1), lowercase (+1), digit (+1).
- Bar segments colored: red (1), orange (2), yellow (3), green (4).
- Label: Weak / Fair / Good / Strong (i18n).

**Submit flow:**
1. Call `signUp({ username, email, phone, password })`.
2. Loading state on button.
3. On `needsConfirm`: modal switches to confirm view automatically (pendingUsername set in context).
4. On `!ok`: show `t(`errors.${result.error}`)` global error.

### 4.6 `components/AuthModal.tsx` (update)

**3-view logic:** derive active view from `pendingUsername`:
```ts
const activeView = pendingUsername ? 'confirm' : view
```

Render `AuthConfirmForm` when `activeView === 'confirm'`, existing forms otherwise.

`AnimatePresence mode="wait"` now has 3 keyed children: `signin`, `signup`, `confirm`.

On close (backdrop click, Escape, X button) → `closeAuth()` which already clears `pendingUsername`.

### 4.7 `components/Navbar.tsx` (update)

**Logged-out state:** existing "Sign In" button — no change.

**Logged-in state:** replace Sign In button with an avatar button:
- Circle with user initials (first char of `user.username`, uppercased), purple background.
- Clicking it toggles a dropdown positioned below the button.
- Dropdown contains: user display name (bold), email (small grey), divider, "Sign Out" button.
- Clicking "Sign Out" calls `signOut()` from context.
- Clicking outside the dropdown closes it (`useEffect` click-outside listener).
- Same pattern for desktop and mobile sidebar.
- Full i18n for "Sign Out" label.

### 4.8 Environment & i18n

**`.env.local` / `.env.production`:** No new variables needed — `AUTH_BASE` hardcoded in `lib/auth-api.ts` matching the P1_padel value (`https://api.seedco.sa/api`). The existing `NEXT_PUBLIC_API_URL` is for landing-page endpoints only.

**`messages/en.json` — new keys under `Auth`:**
```json
"confirm": {
  "title": "Check your email",
  "subtitle": "We sent a 6-digit code to your email. Enter it below.",
  "codeLabel": "Verification code",
  "codePlaceholder": "123456",
  "verify": "Verify",
  "resend": "Resend code",
  "resendSuccess": "Code resent! Check your inbox.",
  "backToSignIn": "Back to sign in"
},
"errors": {
  "signInFailed": "Incorrect email/phone or password.",
  "invalidCode": "Invalid or expired code. Try again.",
  "usernameTaken": "That username is already taken.",
  "phoneInUse": "That phone number is already registered.",
  "accountExists": "An account with this email already exists.",
  "passwordWeak": "Password must be 8+ chars with uppercase, lowercase, and a number.",
  "signUpFailed": "Sign up failed. Please try again."
},
"passwordStrength": {
  "weak": "Weak",
  "fair": "Fair",
  "good": "Good",
  "strong": "Strong"
},
"signOut": "Sign Out"
```

**`messages/ar.json`:** matching Arabic translations for all new keys.

---

## 5. Data Flow

```
User fills sign-in form
  → AuthSignInForm.onSubmit
  → AuthContext.signIn(identifier, password)
  → lib/auth-api.login(identifier, password)
  → POST /auth/login
  ← { idToken, accessToken, refreshToken, userId }
  → finalizeLogin(): setUser, localStorage, scheduleRefresh, closeModal

User fills sign-up form
  → AuthSignUpForm.onSubmit
  → AuthContext.signUp(data)
  → lib/auth-api.register(payload)
  → POST /auth/register
  ← 204
  → setPendingUsername → modal switches to confirm view

User enters 6-digit code
  → AuthConfirmForm.onSubmit
  → AuthContext.confirmEmail(code)
  → lib/auth-api.confirmSignup(username, code)
  → POST /auth/confirm-signup
  ← 204
  → lib/auth-api.login(username, password)   ← auto-login
  → finalizeLogin()
```

---

## 6. Error Mapping

| API code | i18n key |
|---|---|
| `USERNAME_TAKEN` | `Auth.errors.usernameTaken` |
| `PHONE_IN_USE` | `Auth.errors.phoneInUse` |
| `ACCOUNT_EXISTS_VERIFIED` | `Auth.errors.accountExists` |
| `ACCOUNT_EXISTS_UNVERIFIED` | (auto-redirect to confirm, no error shown) |
| `USER_NOT_CONFIRMED` | (auto-redirect to confirm, no error shown) |
| `INVALID_CODE` / `EXPIRED_CODE` | `Auth.errors.invalidCode` |
| any other sign-in error | `Auth.errors.signInFailed` |
| any other sign-up error | `Auth.errors.signUpFailed` |

---

## 7. Out of Scope

- Google / Apple OAuth flows (buttons remain no-ops)
- Forgot password / reset password flow
- Protected routes (middleware auth guard)
- User profile page
- Avatar image upload
