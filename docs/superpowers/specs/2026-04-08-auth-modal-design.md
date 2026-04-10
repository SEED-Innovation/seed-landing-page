# Auth Modal — Design Spec
**Date:** 2026-04-08  
**Status:** Approved (v2 — post-review)

---

## Overview

Add a Sign In / Sign Up modal to the Seed landing page. The modal overlays the current page (no navigation away). It is triggered by a "Sign In" button added to the Navbar. Auth wiring is **frontend UI only** — no real API calls in this iteration.

---

## Presentation

- **Style:** Centered modal overlay with a semi-transparent dark backdrop
- **Animation:** Fade-in + scale-up on open, fade-out on close
- **Close:** Click backdrop or an ✕ button in the top-right corner
- **Mobile:** Full-screen on small viewports (`sm:max-w-md` on larger)
- **RTL:** Full Arabic support matching the site's existing `locale`-based i18n (next-intl)

---

## Navbar Change

A **"Sign In"** button is added to `Navbar.tsx`:
- **Desktop:** positioned to the left of the existing "Get App" button
- **Mobile sidebar:** also added inside the mobile `AnimatePresence` drawer, alongside the existing CTA section
- Style: outlined purple button (`border border-[#7C3AED] text-[#7C3AED]`) to contrast with the filled "Get App" CTA
- Translation key lives in the **existing `Common.Navbar` namespace**: `Common.Navbar.signIn`
  - `en`: `"Sign In"`
  - `ar`: `"تسجيل الدخول"`
- Clicking it calls `openAuth('signin')` from `useAuth()`

---

## Component Tree

| File | Purpose |
|------|---------|
| `components/AuthContext.tsx` | Context + `AuthProvider` + `useAuth()` hook (follows `BookingContext.tsx` pattern; kept in `components/` for consistency) |
| `components/AuthModal.tsx` | Modal shell — backdrop, close ✕ button, open/close animation, view toggle state |
| `components/AuthSignInForm.tsx` | Sign In form contents |
| `components/AuthSignUpForm.tsx` | Sign Up form contents |
| `Navbar.tsx` | Adds "Sign In" button (desktop + mobile sidebar) |

**Render location:** `AuthProvider` wraps the app inside `ClientWrapper` in `app/[locale]/layout.tsx`. `AuthModal` is rendered once inside `AuthProvider` (or directly inside `ClientWrapper`) so it is accessible from every page.

```
NextIntlClientProvider
  ClientWrapper
    AuthProvider          ← new
      AuthModal           ← new (renders portal/fixed overlay)
      Navbar
      <main>{children}</main>
      Footer
```

Note: `BookingProvider` is page-scoped (only wraps the facility detail page). `AuthProvider` is layout-scoped because the modal must be reachable from any page.

---

## AuthContext (`components/AuthContext.tsx`)

```ts
interface AuthContextType {
  isOpen: boolean;
  view: 'signin' | 'signup';
  openAuth: (view?: 'signin' | 'signup') => void;  // opens modal, defaults to 'signin'
  closeAuth: () => void;
  switchView: (view: 'signin' | 'signup') => void;  // switches view while modal is already open
}

export function AuthProvider({ children }: { children: React.ReactNode }) { ... }
export function useAuth() { ... }  // throws if used outside AuthProvider
```

`openAuth` and `switchView` are intentionally separate:
- `openAuth` is called externally (e.g., Navbar button) — it sets `isOpen = true` and sets the view
- `switchView` is called internally from within the modal forms (the "Don't have an account? Sign up" link) — it only changes the view without touching `isOpen`

---

## Modal Views

### Sign In View

**Header:** Seed logo icon + "Welcome back" / "مرحباً بعودتك" + subtitle

**Social buttons (full-width, stacked):**
1. Continue with Google (white button, Google SVG logo)
2. Continue with Apple (black button, Apple SVG logo)

**Divider:** translated via `Auth.orContinueWith`

**Fields:**
- Email or Phone Number (label: `Auth.emailOrPhone`, placeholder shows both formats)
- Password (label: `Auth.password`, show/hide eye toggle)

**Extras:**
- "Forgot password?" link (right-aligned, purple, `Auth.forgotPassword`, no-op for now)

**CTA:** `Auth.signIn` — purple gradient button, full-width

**Footer link:** `Auth.noAccount` + `Auth.signUp` link → calls `switchView('signup')`

---

### Sign Up View

**Header:** Seed logo icon + "Create account" / "إنشاء حساب" + subtitle

**Social buttons (side-by-side, half-width each):**
1. Google
2. Apple

**Divider:** `Auth.orFillDetails`

**Fields (in order):**
1. Username (`Auth.username`, placeholder: `@username`)
2. Email (`Auth.email`, placeholder: `name@email.com`)
3. Phone Number (`Auth.phoneNumber`) — Saudi only: fixed `🇸🇦 +966` prefix chip + number input
4. Password (`Auth.password`, show/hide toggle)

**Policy Agreement checkbox (required):**

Uses next-intl `rich()` API to embed hyperlinks inline:

```tsx
t.rich('Auth.agreeToTerms', {
  tos:     (chunks) => <a href={`/${locale}/terms-of-service`} target="_blank">{chunks}</a>,
  tou:     (chunks) => <a href={`/${locale}/terms-of-use`}     target="_blank">{chunks}</a>,
  privacy: (chunks) => <a href={`/${locale}/privacy`}          target="_blank">{chunks}</a>,
  refund:  (chunks) => <a href={`/${locale}/refund-policy`}    target="_blank">{chunks}</a>,
})
```

Message value (en):
```
"I agree to the <tos>Terms of Service</tos>, <tou>Terms of Use</tou>, <privacy>Privacy Policy</privacy>, and <refund>Refund Policy</refund>"
```

- Checkbox uses purple brand color (`#7C3AED`)
- "Create Account" button is **disabled** until checkbox is checked
- Links open in a new tab and are locale-aware

**CTA:** `Auth.createAccount` — purple gradient, full-width, disabled when checkbox unchecked

**Footer link:** `Auth.haveAccount` + `Auth.signIn` link → calls `switchView('signin')`

---

## Form Handling

- Use `react-hook-form` + `zod` (both already in project) for all validation
- **Sign In schema:**
  - `emailOrPhone`: required, non-empty string (email format OR Saudi phone `/^05\d{8}$/`)
  - `password`: required, min 1 char (no length check at sign-in)
- **Sign Up schema:**
  - `username`: required, min 3 chars, alphanumeric + underscores
  - `email`: required, valid email
  - `phone`: required, matches `/^05\d{8}$/` (stored without `+966` prefix; prefix is a fixed UI chip)
  - `password`: required, min 8 chars
  - `agreedToTerms`: must be `true`
- On submit: `console.log(data)` + close modal (placeholder — real API deferred)
- Inline field errors shown below each input, triggered on `blur` and on submit attempt

---

## i18n Keys

### `Common.Navbar` namespace (existing file, add one key)

| Key | EN | AR |
|-----|----|----|
| `signIn` | `"Sign In"` | `"تسجيل الدخول"` |

### `Auth` namespace (new section in messages files)

| Key | EN | AR |
|-----|----|----|
| `signIn` | `"Sign In"` | `"تسجيل الدخول"` |
| `signUp` | `"Sign Up"` | `"إنشاء حساب"` |
| `welcomeBack` | `"Welcome back"` | `"مرحباً بعودتك"` |
| `welcomeBackSubtitle` | `"Sign in to your Seed account"` | `"سجّل دخولك إلى حساب سييد"` |
| `createAccount` | `"Create Account"` | `"إنشاء حساب"` |
| `createAccountSubtitle` | `"Join Seed and start booking"` | `"انضم إلى سييد وابدأ الحجز"` |
| `continueWithGoogle` | `"Continue with Google"` | `"المتابعة مع Google"` |
| `continueWithApple` | `"Continue with Apple"` | `"المتابعة مع Apple"` |
| `orContinueWith` | `"or continue with"` | `"أو تابع باستخدام"` |
| `orFillDetails` | `"or fill in your details"` | `"أو أدخل بياناتك"` |
| `emailOrPhone` | `"Email or Phone Number"` | `"البريد الإلكتروني أو رقم الجوال"` |
| `password` | `"Password"` | `"كلمة المرور"` |
| `forgotPassword` | `"Forgot password?"` | `"نسيت كلمة المرور؟"` |
| `username` | `"Username"` | `"اسم المستخدم"` |
| `email` | `"Email"` | `"البريد الإلكتروني"` |
| `phoneNumber` | `"Phone Number"` | `"رقم الجوال"` |
| `phoneSaudi` | `"Saudi"` | `"سعودي"` |
| `noAccount` | `"Don't have an account?"` | `"ليس لديك حساب؟"` |
| `haveAccount` | `"Already have an account?"` | `"لديك حساب بالفعل؟"` |
| `agreeToTerms` | `"I agree to the <tos>Terms of Service</tos>, <tou>Terms of Use</tou>, <privacy>Privacy Policy</privacy>, and <refund>Refund Policy</refund>"` | `"أوافق على <tos>شروط الخدمة</tos> و<tou>شروط الاستخدام</tou> و<privacy>سياسة الخصوصية</privacy> و<refund>سياسة الاسترداد</refund>"` |
| `errors.required` | `"This field is required"` | `"هذا الحقل مطلوب"` |
| `errors.invalidEmail` | `"Please enter a valid email"` | `"أدخل بريداً إلكترونياً صحيحاً"` |
| `errors.invalidPhone` | `"Enter a valid Saudi number (05XXXXXXXX)"` | `"أدخل رقم جوال سعودي صحيح (05XXXXXXXX)"` |
| `errors.passwordMin` | `"Password must be at least 8 characters"` | `"كلمة المرور يجب أن تكون 8 أحرف على الأقل"` |
| `errors.mustAgree` | `"You must agree to the policies"` | `"يجب الموافقة على السياسات"` |
| `errors.usernameMin` | `"Username must be at least 3 characters"` | `"اسم المستخدم يجب أن يكون 3 أحرف على الأقل"` |

---

## Accessibility

- Focus trap inside modal when open
- `Escape` key closes modal
- `aria-modal="true"`, `role="dialog"` on modal container
- `aria-label` on close ✕ button
- All labels associated with inputs via `htmlFor` / `id`

---

## Out of Scope (this iteration)

- Real OAuth (Google / Apple) flows
- Real email/password auth API calls
- Password reset flow
- Session persistence / JWT storage
- User profile / avatar in Navbar after sign-in
