# Auth Wiring Design
**Date:** 2026-04-10
**Status:** Approved

---

## 1. Goal

Wire the existing auth modal UI (sign-in / sign-up forms, AuthContext, AuthModal) to the real SEED API, mirroring the working implementation in the P1_padel project. After this, users can create accounts, verify their email, and sign in — with sessions persisted across page reloads.

---

## 2. API Contract

All endpoints: `POST https://api.seedco.sa/api/auth/<path>`  
Base constant (used only in `lib/auth-api.ts`): `const AUTH_BASE = 'https://api.seedco.sa/api/auth'`  
All requests: `Content-Type: application/json`

| Endpoint | Body | Success Response |
|---|---|---|
| `/auth/register` | `{ username, email, phone, password, confirmPassword }` | `204 No Content` |
| `/auth/login` | `{ identifier, password }` | `{ idToken, accessToken, refreshToken, userId }` |
| `/auth/confirm-signup` | `{ username, code }` | `204 No Content` |
| `/auth/resend-code` | `{ username }` | `204 No Content` |
| `/auth/refresh` | `{ refreshToken }` | `{ idToken, accessToken, refreshToken, userId }` |

**`identifier` accepted values for `/auth/login`:** email address, Saudi phone number (`+966…`), or username (alphanumeric + underscore). Confirmed from P1_padel: auto-login after confirmation passes `username` as identifier and it succeeds.

**Phone normalisation before register:** Saudi local `05XXXXXXXX` → `+9665XXXXXXXX`.

**Error shape:**
```json
{ "code": "USERNAME_TAKEN", "message": "...", "username": "optional-string" }
```
The top-level `username` field carries the account's username when relevant (e.g. `USER_NOT_CONFIRMED`, `ACCOUNT_EXISTS_UNVERIFIED`). Some codes also embed the username in the code string: `ACCOUNT_EXISTS_UNVERIFIED::someuser` — split on `::` to extract it, but prefer the top-level `username` field if present.

**Known error codes:**

| Code | Trigger | Handling |
|---|---|---|
| `WRONG_PASSWORD` / `USER_NOT_FOUND` | Wrong password or unknown identifier at login | Map to `signInFailed` |
| `USERNAME_TAKEN` | Sign-up: username already registered | Map to `usernameTaken` |
| `PHONE_IN_USE` | Sign-up: phone already registered | Map to `phoneInUse` |
| `ACCOUNT_EXISTS_VERIFIED` | Sign-up: fully active account exists | Map to `accountExists` |
| `ACCOUNT_EXISTS_UNVERIFIED` | Sign-up: account exists but unconfirmed | Auto-redirect to confirm, no error shown |
| `USER_NOT_CONFIRMED` | Sign-in: account not yet confirmed | Auto-redirect to confirm + resend code |
| `INVALID_CODE` | Confirm: bad verification code | Map to `invalidCode` |
| `EXPIRED_CODE` | Confirm: code past its TTL | Map to `invalidCode` |
| any other | Any endpoint | Map to `signInFailed` or `signUpFailed` per context |

---

## 3. Session Management

- **Storage:** `localStorage` keys `seed-user` (JSON `User`) and `seed-tokens` (JSON `LoginResponse` reused as token store — no separate `Tokens` type needed).
- **Hydration:** On `AuthProvider` mount (inside a `useEffect`), read localStorage. Call `isTokenExpired(accessToken, 0)` (buffer = 0 ms — do not use the default 60 s buffer here, to avoid premature refresh of tokens that still have time remaining). If expired, attempt silent refresh via `/auth/refresh`. If refresh also fails, clear both localStorage keys and leave `user = null`. Set `authLoading = false` in the `finally` block regardless.
- **Auto-refresh timer:** After every successful login or token refresh, schedule a `setTimeout` (stored in a `useRef<ReturnType<typeof setTimeout> | null>`) to re-call `/auth/refresh` 60 s before the access token's `exp` claim. On refresh success, persist new tokens and reschedule. On failure, call `signOut()`.
- **Cleanup:** The `useEffect` that schedules the timer returns a cleanup function that calls `clearTimeout(refreshTimerRef.current ?? undefined)`. This prevents double-timers in React 18 Strict Mode and avoids memory leaks on unmount.
- **JWT decode:** split on `.`, base64-decode the middle segment, parse JSON, read `exp * 1000`. Return `0` if any step throws. No external library required.
- **Sign out:** call `clearTimeout(refreshTimerRef.current ?? undefined)`, remove both localStorage keys, set `user = null`.

---

## 4. Types

All types below are defined in `lib/auth-api.ts` and imported where needed.

```ts
interface RegisterPayload {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

/** Returned by /auth/login and /auth/refresh. Also reused as the localStorage token store. */
interface LoginResponse {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
}

interface AuthApiError {
  code: string;
  message: string;
  /**
   * The account's username when relevant.
   * Sourced first from the top-level `username` field in the error body,
   * then from the `::` suffix in the code string (e.g. ACCOUNT_EXISTS_UNVERIFIED::alice).
   */
  pendingUsername?: string;
}

/** Stored in localStorage under 'seed-user' and exposed via context. */
interface User {
  userId: string;
  username: string;
  email: string;
  phone: string;   // may be empty string if not known at login time
}

/**
 * Returned from signIn / signUp / confirmEmail context methods.
 * errorKey is an i18n key suffix used as Auth.errors.{errorKey} — never a human-readable string.
 */
interface AuthResult {
  ok: boolean;
  errorKey?: string;
  /** When true, the modal should switch to the confirm-email view. */
  needsConfirm?: boolean;
}

/** Passed to AuthContext.signUp. confirmPassword is UI-only and not included here. */
interface SignUpData {
  username: string;
  email: string;
  phone: string;   // raw input; normalised inside signUp before calling register
  password: string;
}
```

**`AuthApiError` construction in `request<T>`:**
```ts
const raw = (data.code as string) ?? 'UNKNOWN';
const parts = raw.split('::');
const err: AuthApiError = {
  code: parts[0],
  message: (data.message as string) ?? `Request failed: ${res.status}`,
  // Prefer top-level username field; fall back to :: suffix
  pendingUsername: (data.username as string | undefined) ?? parts[1],
};
```

---

## 5. Components & Files

### 5.1 `lib/auth-api.ts` (new)

Pure API + utility functions. No React. All functions are named exports.

**`AUTH_BASE`** constant: `'https://api.seedco.sa/api/auth'` — also exported.

**Internal `request<T>(path: string, body: unknown): Promise<T>`:**
- `fetch(`${AUTH_BASE}/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })`
- On non-2xx: parse JSON body, construct `AuthApiError` per section 4, throw it.
- On 2xx with empty body: return `{}` cast as `T`.

**Module-level regex constants** (defined once here, imported where needed — do not duplicate):
```ts
export const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const SAUDI_PHONE = /^(?:\+966|966|0)(5[0-9])\d{7}$/;
export const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;
```

**Exports:**
```ts
register(payload: RegisterPayload): Promise<void>
login(identifier: string, password: string): Promise<LoginResponse>
confirmSignup(username: string, code: string): Promise<void>
resendCode(username: string): Promise<void>
refreshTokens(refreshToken: string): Promise<LoginResponse>
normalizeSaudiPhone(raw: string): string  // 05XXXXXXXX → +9665XXXXXXXX
getTokenExpiry(jwt: string): number       // ms timestamp, 0 if unparseable
isTokenExpired(jwt: string, bufferMs?: number): boolean  // default buffer 60_000 ms
```

### 5.2 `components/AuthContext.tsx` (rewrite)

**Context state:**
```ts
user: User | null
authLoading: boolean          // true until localStorage hydration completes; Navbar hides auth button while true
pendingUsername: string | null  // non-null = confirm-email view is active
isOpen: boolean
view: 'signin' | 'signup'
```

**Methods (all wrapped in `useCallback`):**
```ts
openAuth(view?: 'signin' | 'signup'): void   // defaults to 'signin' when called without an argument
closeAuth(): void      // closes modal; sets pendingUsername = null; clears both pending refs; resets view = 'signin'
switchView(view: 'signin' | 'signup'): void   // does NOT touch pendingUsername
cancelConfirm(): void  // sets pendingUsername = null; clears both pending refs; sets view = 'signin'; does NOT close modal
signIn(identifier: string, password: string): Promise<AuthResult>
signUp(data: SignUpData): Promise<AuthResult>
confirmEmail(code: string): Promise<AuthResult>
resendVerification(): Promise<{ ok: boolean }>  // returns ok:true on success, ok:false on API error
signOut(): void
```

**Internal refs (in-memory only, never persisted):**
- `pendingPasswordRef: useRef<string | null>(null)` — password for auto-login after confirmation
- `pendingUserDataRef: useRef<SignUpData | null>(null)` — full sign-up data for rich User build

Both refs are cleared in: `closeAuth`, `cancelConfirm`, and `finalizeLogin`.

**`finalizeLogin(user: User, tokens: LoginResponse)`:**
- `setUser(user)`
- `localStorage.setItem('seed-user', JSON.stringify(user))`
- `localStorage.setItem('seed-tokens', JSON.stringify(tokens))`
- schedule refresh timer
- `setPendingUsername(null)`
- clear `pendingPasswordRef.current = null` and `pendingUserDataRef.current = null`
- `setIsOpen(false)`

**`closeAuth`:**
- `setIsOpen(false)`
- `setPendingUsername(null)`
- clear both pending refs
- `setView('signin')`   ← resets to default so next open starts at sign-in

**`cancelConfirm`:**
- `setPendingUsername(null)`
- clear both pending refs
- `setView('signin')`
- does NOT call `setIsOpen(false)` — modal stays open

**`signIn` logic:**
1. Call `login(identifier, password)`.
2. On success → build `User`. Three cases based on identifier format:
   ```ts
   const isEmail = EMAIL_RE.test(identifier);
   const isPhone = /^(\+966|966|0)5\d{7,8}$/.test(identifier.replace(/\s/g, ''));
   const newUser: User = {
     userId: tokens.userId,
     username: isEmail ? identifier.split('@')[0] : isPhone ? '' : identifier,
     email:    isEmail ? identifier : '',
     phone:    '',
   };
   ```
   Call `finalizeLogin(newUser, tokens)`, return `{ ok: true }`.
   **Note:** Phone-only sign-in intentionally produces `username: ''` and `email: ''`. The Navbar degrades gracefully (avatar shows `?`, email row shows `—`). Enriching the profile with a `/me` call is out of scope for this iteration.
3. On `USER_NOT_CONFIRMED`:
   - If `apiErr.pendingUsername` is present (a real username string), set `pendingUsername = apiErr.pendingUsername`, store password in ref, call `resendCode` silently, return `{ ok: false, needsConfirm: true }`.
   - If `apiErr.pendingUsername` is absent (the API omitted it), return `{ ok: false, errorKey: 'signInFailed' }` — do NOT enter the confirm flow, because `confirmSignup` requires a username and one cannot be reliably inferred from an email or phone identifier.
4. Any other error → return `{ ok: false, errorKey: 'signInFailed' }`.

**`signUp` logic:**
1. `const phone = normalizeSaudiPhone(data.phone)`
2. Call `register({ ...data, phone, confirmPassword: data.password })`.
3. On success → `setPendingUsername(data.username)`, `pendingPasswordRef.current = data.password`, `pendingUserDataRef.current = data`. Return `{ ok: true, needsConfirm: true }`.
4. On `ACCOUNT_EXISTS_UNVERIFIED` → set same pending state, call `resendCode(apiErr.pendingUsername ?? data.username)` silently. Return `{ ok: false, needsConfirm: true }`.
5. Other errors → return `{ ok: false, errorKey: mapped key from error table }`.

**`confirmEmail` logic:**
1. Guard: if `pendingUsername === null`, return `{ ok: false, errorKey: 'signUpFailed' }`.
2. Guard: if `pendingPasswordRef.current === null`, call `closeAuth()`, return `{ ok: true }`.
3. Call `confirmSignup(pendingUsername, code)`.
4. On success → attempt auto-login:
   ```ts
   const tokens = await login(pendingUsername, pendingPasswordRef.current);
   ```
   Build `User` from `pendingUserDataRef.current` if available:
   ```ts
   const ud = pendingUserDataRef.current;
   const newUser: User = ud
     ? { userId: tokens.userId, username: ud.username, email: ud.email, phone: ud.phone }
     : { userId: tokens.userId, username: pendingUsername, email: '', phone: '' };
   ```
   Call `finalizeLogin(newUser, tokens)`, return `{ ok: true }`.
5. If auto-login throws → call `closeAuth()`, return `{ ok: true }` (account is confirmed, just not auto-signed-in).
6. If `confirmSignup` throws → return `{ ok: false, errorKey: mapped key }`.

**`resendVerification`:**
```ts
async (): Promise<{ ok: boolean }> => {
  if (!pendingUsername) return { ok: false };
  try {
    await resendCode(pendingUsername);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
```
Returns `{ ok: boolean }` so `AuthConfirmForm` can distinguish success from failure.

### 5.3 `components/AuthConfirmForm.tsx` (new)

- Animated envelope SVG icon header (purple-tinted, matching modal style).
- Title: `t('Auth.confirm.title')`, subtitle: `t('Auth.confirm.subtitle')`.
- Single `<input type="text" inputMode="numeric" maxLength={6}>` — strip non-digits on `onChange`, slice to 6.
- "Verify" submit button — disabled until `code.length === 6` and not loading.
- Loading state on submit (spinner in button text).
- Inline error `<p className="text-red-500 text-xs mt-1">` for API errors.
- **Resend button:**
  - Calls `resendVerification()` from context.
  - While awaiting: button text = `…`, disabled.
  - On `{ ok: true }`: clear any existing error display; show green success banner (`t('Auth.confirm.resendSuccess')`) for 4 s.
  - On `{ ok: false }`: show red error (`t('Auth.errors.signUpFailed')`) briefly (4 s).
- **Back to Sign In link:** calls `cancelConfirm()`, resets local `code` state and clears local errors.

### 5.4 `components/AuthSignInForm.tsx` (update)

**Validation update:** import `EMAIL_RE`, `SAUDI_PHONE`, and `USERNAME_RE` from `lib/auth-api.ts` (do not redefine them). Extend the `emailOrPhone` zod refine:
```ts
.refine(
  (val) => EMAIL_RE.test(val) || SAUDI_PHONE.test(val) || USERNAME_RE.test(val),
  'invalidEmailOrPhone',
)
```

Update the field label/placeholder to reflect all three accepted formats (e.g., placeholder `name@email.com, 05XXXXXXXX, or username`). Update `Auth.emailOrPhone` and `Auth.errors.invalidEmailOrPhone` i18n values accordingly.

**Submit wiring:**
1. Call `signIn(emailOrPhone, password)` from context.
2. While loading: disable submit, show spinner in button.
3. On `needsConfirm`: context sets `pendingUsername` → modal auto-switches to confirm view (no form action needed).
4. On `!ok && !needsConfirm`: show `t(`Auth.errors.${result.errorKey}`)` as `<p className="text-red-500 text-xs mt-1 text-center">` above the submit button. Clear on next form input change.
5. On `ok`: modal closes automatically via `finalizeLogin`.

Google / Apple buttons remain `console.log` stubs.

### 5.5 `components/AuthSignUpForm.tsx` (update)

**Updated password zod rule:**
```ts
z.string()
  .min(8, 'passwordWeak')
  .regex(/[A-Z]/, 'passwordWeak')
  .regex(/[a-z]/, 'passwordWeak')
  .regex(/[0-9]/, 'passwordWeak')
```

**Password strength meter** (4 segments below the password input, inside a `<div>`):
- Score = number of rules satisfied: length≥8, has uppercase, has lowercase, has digit. Range 0–4.
- **Hidden when `watch('password').length === 0`** (i.e., field is empty). Shown as soon as the user types any character.
- Bar: 4 equal segments. Score=1 → first segment red; score=2 → first two orange; score=3 → first three yellow; score=4 → all green.
- Label beside bar: `t(`Auth.passwordStrength.${['','weak','fair','good','strong'][score]}`)` (empty string for score=0 which only occurs while hidden anyway).

**Submit flow:**
1. Call `signUp({ username, email, phone, password })` from context.
2. Loading state on button.
3. On `needsConfirm`: context sets `pendingUsername` → modal switches to confirm view automatically.
4. On `!ok && !needsConfirm`: show `t(`Auth.errors.${result.errorKey}`)` as global error above submit button.

### 5.6 `components/AuthModal.tsx` (update)

**3-view derivation:**
```ts
const { isOpen, view, pendingUsername } = useAuth();
const activeView: 'signin' | 'signup' | 'confirm' = pendingUsername ? 'confirm' : view;
```

**`aria-label` updated:**
```ts
aria-label={
  activeView === 'confirm' ? t('Auth.confirm.title') :
  activeView === 'signin'  ? t('Auth.signIn') :
                             t('Auth.signUp')
}
```

`AnimatePresence mode="wait"` wraps 3 keyed `<motion.div>` children with keys `"signin"`, `"signup"`, `"confirm"`.

On close (backdrop click, Escape, X button) → call `closeAuth()`.

### 5.7 `components/Navbar.tsx` (update)

Import both `useTranslations('Auth')` (for `signOut`) and the existing `useTranslations('Common.Navbar')` inside the Navbar component. Use `tAuth('signOut')` for the sign-out label.

**While `authLoading === true`:** render nothing in place of the auth button (or a skeleton `w-9 h-9 rounded-full bg-slate-200 animate-pulse`). Do not render "Sign In" during this window to avoid a flash.

**Logged-out state (`user === null && !authLoading`):** existing "Sign In" button — no change.

**Logged-in state — desktop:**
- Avatar button: `<button className="w-9 h-9 rounded-full bg-[#7C3AED] text-white font-bold text-sm flex items-center justify-center">` showing `(user.username[0] ?? user.email[0] ?? '?').toUpperCase()` — guards against an empty `username` (e.g., when user signed in by phone).
- Clicking toggles `isDropdownOpen` local state.
- Dropdown (`position: absolute, top: 100%, end: 0, mt-2, w-48, rounded-xl, shadow-lg, bg-white, border border-slate-100, z-50`):
  1. `<p className="font-semibold text-slate-900 text-sm px-4 pt-3">` → `user.username`
  2. `<p className="text-slate-400 text-xs px-4 pb-2">` → `user.email || '—'`
  3. `<hr className="border-slate-100" />`
  4. `<button className="w-full text-start px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50">` → `tAuth('signOut')`, calls `signOut()`.
- Click-outside closes dropdown: `useEffect` adds `mousedown` listener on `document`; listener calls `setIsDropdownOpen(false)` if click target is outside a `dropdownRef`.

**While `authLoading === true` — mobile sidebar:** render nothing in place of the auth slot (same rule as desktop) to prevent a flash of the Sign In link before hydration completes.

**Logged-in state — mobile sidebar:**
- No nested dropdown. Instead, at the position where "Sign In" normally sits:
  1. Static username display: `<span className="font-semibold text-slate-900 text-sm">` → `user.username || user.email || '—'`
  2. A "Sign Out" sidebar nav item (styled same as other sidebar links, `text-red-500`) that calls `signOut()` and closes the sidebar (using the existing `setIsOpen(false)` / close-sidebar mechanism already present in `Navbar.tsx`).

---

## 6. Data Flow

```
── SIGN IN ──────────────────────────────────────────────────────
User fills sign-in form (email, phone, or username accepted)
  → AuthSignInForm.handleSubmit
  → AuthContext.signIn(identifier, password)
  → lib/auth-api.login(identifier, password)
  → POST /auth/login
  ← { idToken, accessToken, refreshToken, userId }
  → finalizeLogin(): setUser, localStorage × 2, scheduleRefresh, setIsOpen(false)

  ── on USER_NOT_CONFIRMED ──
  → setPendingUsername (from apiErr.pendingUsername), pendingPasswordRef ← password
  → resendCode(username) silently
  → activeView derives to 'confirm'

── SIGN UP ──────────────────────────────────────────────────────
User fills sign-up form
  → AuthSignUpForm.handleSubmit
  → AuthContext.signUp(data)
  → normalizeSaudiPhone(data.phone)
  → lib/auth-api.register(payload)
  → POST /auth/register  ← 204
  → setPendingUsername = data.username, pendingPasswordRef ← password, pendingUserDataRef ← data
  → activeView derives to 'confirm'

── CONFIRM EMAIL ────────────────────────────────────────────────
User enters 6-digit code
  → AuthConfirmForm.handleSubmit
  → AuthContext.confirmEmail(code)
  → guard 1: if pendingUsername === null → return { ok:false, errorKey:'signUpFailed' }
  → guard 2: if pendingPasswordRef.current === null → closeAuth(), return { ok:true }
             (modal closes silently; session is unrecoverable without the password)
  → lib/auth-api.confirmSignup(pendingUsername, code)
  → POST /auth/confirm-signup  ← 204
  → lib/auth-api.login(pendingUsername, pendingPasswordRef.current)  ← auto-login
  → POST /auth/login  ← { idToken, ... }
  → finalizeLogin(user, tokens)

── RESEND CODE ──────────────────────────────────────────────────
User clicks "Resend code"
  → AuthContext.resendVerification()
  → lib/auth-api.resendCode(pendingUsername)
  → POST /auth/resend-code  ← 204
  ← { ok: true }  → AuthConfirmForm shows 4 s green success banner; clears error display
  ← { ok: false } → AuthConfirmForm shows 4 s red error banner

── SIGN OUT ─────────────────────────────────────────────────────
User clicks "Sign Out" in Navbar dropdown / sidebar
  → AuthContext.signOut()
  → clearTimeout(refreshTimerRef.current)
  → localStorage.removeItem × 2
  → setUser(null)
  → Navbar renders Sign In button (or skeleton during authLoading)
```

---

## 7. Error Mapping

| API code | Context method | `errorKey` | i18n path |
|---|---|---|---|
| `WRONG_PASSWORD` / `USER_NOT_FOUND` | `signIn` | `signInFailed` | `Auth.errors.signInFailed` |
| `USER_NOT_CONFIRMED` | `signIn` | — (auto-redirect) | — |
| `USERNAME_TAKEN` | `signUp` | `usernameTaken` | `Auth.errors.usernameTaken` |
| `PHONE_IN_USE` | `signUp` | `phoneInUse` | `Auth.errors.phoneInUse` |
| `ACCOUNT_EXISTS_VERIFIED` | `signUp` | `accountExists` | `Auth.errors.accountExists` |
| `ACCOUNT_EXISTS_UNVERIFIED` | `signUp` | — (auto-redirect) | — |
| `INVALID_CODE` | `confirmEmail` | `invalidCode` | `Auth.errors.invalidCode` |
| `EXPIRED_CODE` | `confirmEmail` | `invalidCode` | `Auth.errors.invalidCode` |
| any other sign-in error | `signIn` | `signInFailed` | `Auth.errors.signInFailed` |
| any other sign-up error | `signUp` | `signUpFailed` | `Auth.errors.signUpFailed` |

---

## 8. i18n Keys

### `messages/en.json` — new/updated keys under `Auth`:
```json
"emailOrPhone": "Email, Phone, or Username",
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
  "required": "This field is required.",
  "invalidEmailOrPhone": "Enter a valid email, Saudi phone (05XXXXXXXX), or username.",
  "invalidEmail": "Enter a valid email address.",
  "invalidPhone": "Enter a valid Saudi phone number (05XXXXXXXX).",
  "invalidUsername": "Username must be 3–30 characters: letters, numbers, or underscores.",
  "passwordWeak": "Password must be 8+ characters with uppercase, lowercase, and a number.",
  "mustAgree": "You must agree to the policies to continue.",
  "signInFailed": "Incorrect credentials. Please try again.",
  "signUpFailed": "Sign up failed. Please try again.",
  "invalidCode": "Invalid or expired code. Try again.",
  "usernameTaken": "That username is already taken.",
  "phoneInUse": "That phone number is already registered.",
  "accountExists": "An account with this email already exists."
},
"passwordStrength": {
  "weak": "Weak",
  "fair": "Fair",
  "good": "Good",
  "strong": "Strong"
},
"signOut": "Sign Out"
```

### `messages/ar.json` — matching keys under `Auth`:
```json
"emailOrPhone": "البريد الإلكتروني أو رقم الجوال أو اسم المستخدم",
"confirm": {
  "title": "تحقق من بريدك الإلكتروني",
  "subtitle": "أرسلنا رمزاً مكوناً من 6 أرقام إلى بريدك الإلكتروني. أدخله أدناه.",
  "codeLabel": "رمز التحقق",
  "codePlaceholder": "123456",
  "verify": "تحقق",
  "resend": "إعادة إرسال الرمز",
  "resendSuccess": "تم إعادة إرسال الرمز! تحقق من صندوق الوارد.",
  "backToSignIn": "العودة إلى تسجيل الدخول"
},
"errors": {
  "required": "هذا الحقل مطلوب.",
  "invalidEmailOrPhone": "أدخل بريداً إلكترونياً صالحاً أو رقم جوال سعودي (05XXXXXXXX) أو اسم مستخدم.",
  "invalidEmail": "أدخل بريداً إلكترونياً صالحاً.",
  "invalidPhone": "أدخل رقم جوال سعودي صالحاً (05XXXXXXXX).",
  "invalidUsername": "اسم المستخدم يجب أن يكون 3–30 حرفاً: أحرف أو أرقام أو شرطات سفلية.",
  "passwordWeak": "كلمة المرور يجب أن تحتوي على 8 أحرف مع حرف كبير وصغير ورقم.",
  "mustAgree": "يجب الموافقة على السياسات للمتابعة.",
  "signInFailed": "بيانات الدخول غير صحيحة. حاول مجدداً.",
  "signUpFailed": "فشل إنشاء الحساب. حاول مجدداً.",
  "invalidCode": "الرمز غير صالح أو منتهي الصلاحية. حاول مجدداً.",
  "usernameTaken": "اسم المستخدم هذا محجوز مسبقاً.",
  "phoneInUse": "رقم الجوال هذا مسجل بالفعل.",
  "accountExists": "يوجد حساب بهذا البريد الإلكتروني مسبقاً."
},
"passwordStrength": {
  "weak": "ضعيفة",
  "fair": "مقبولة",
  "good": "جيدة",
  "strong": "قوية"
},
"signOut": "تسجيل الخروج"
```

---

## 9. Out of Scope

- Google / Apple OAuth flows (buttons remain `console.log` stubs)
- Forgot password / reset password flow
- Protected routes (middleware auth guard)
- User profile page
- Avatar image upload
