# Auth Modal Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Sign In / Sign Up modal to the Seed landing page with Google, Apple, and email/phone-or-password auth (UI only — no real API calls).

**Architecture:** A layout-scoped `AuthProvider` exposes `openAuth`/`closeAuth` via React Context. `AuthModal` renders as a fixed overlay (portal-style) and hosts two swappable form components. A "Sign In" button in the Navbar triggers the modal from any page.

**Tech Stack:** Next.js 15 App Router, React 19, next-intl v4, react-hook-form v7, zod v4, @hookform/resolvers v5, Framer Motion v12, Tailwind CSS v4, Lucide React

---

## Chunk 1: i18n Keys + AuthContext

### Task 1: Add i18n keys

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/ar.json`

- [ ] **Step 1: Add `signIn` to `Common.Navbar` in `messages/en.json`**

Open `messages/en.json`. In the `Common.Navbar` object (currently ends with `"getApp": "Get App"`), add the new key:

```json
"Common": {
  "Navbar": {
    "home": "Home",
    "explore": "Explore Courts",
    "technology": "Technology",
    "business": "Seed Business",
    "about": "About Us",
    "getApp": "Get App",
    "signIn": "Sign In"
  },
```

- [ ] **Step 2: Add `Auth` namespace to `messages/en.json`**

After the closing `}` of `"Common"` and before the next top-level key, add:

```json
"Auth": {
  "signIn": "Sign In",
  "signUp": "Sign Up",
  "welcomeBack": "Welcome back",
  "welcomeBackSubtitle": "Sign in to your Seed account",
  "createAccount": "Create Account",
  "createAccountSubtitle": "Join Seed and start booking",
  "continueWithGoogle": "Continue with Google",
  "continueWithApple": "Continue with Apple",
  "orContinueWith": "or continue with",
  "orFillDetails": "or fill in your details",
  "emailOrPhone": "Email or Phone Number",
  "password": "Password",
  "forgotPassword": "Forgot password?",
  "username": "Username",
  "email": "Email",
  "phoneNumber": "Phone Number",
  "phoneSaudi": "Saudi",
  "noAccount": "Don't have an account?",
  "haveAccount": "Already have an account?",
  "agreeToTerms": "I agree to the <tos>Terms of Service</tos>, <tou>Terms of Use</tou>, <privacy>Privacy Policy</privacy>, and <refund>Refund Policy</refund>",
  "showPassword": "Show password",
  "hidePassword": "Hide password",
  "close": "Close",
  "errors": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email",
    "invalidPhone": "Enter a valid Saudi number (05XXXXXXXX)",
    "invalidEmailOrPhone": "Enter a valid email or Saudi phone number (05XXXXXXXX)",
    "passwordMin": "Password must be at least 8 characters",
    "mustAgree": "You must agree to the policies",
    "usernameMin": "Username must be at least 3 characters",
    "invalidUsername": "Username can only contain letters, numbers, and underscores"
  }
},
```

> **Note:** `errors.invalidEmailOrPhone` is an addition beyond the spec's key table. It is required because the sign-in field accepts *either* email or phone, so a combined error message is needed. The spec table listed them separately but did not account for the combined validator.

- [ ] **Step 3: Add `signIn` to `Common.Navbar` in `messages/ar.json`**

```json
"Common": {
  "Navbar": {
    "home": "الرئيسية",
    "explore": "استكشف الملاعب",
    "technology": "التقنيات",
    "business": "سييد الأعمال",
    "about": "من نحن",
    "getApp": "حمل التطبيق",
    "signIn": "تسجيل الدخول"
  },
```

- [ ] **Step 4: Add `Auth` namespace to `messages/ar.json`**

```json
"Auth": {
  "signIn": "تسجيل الدخول",
  "signUp": "إنشاء حساب",
  "welcomeBack": "مرحباً بعودتك",
  "welcomeBackSubtitle": "سجّل دخولك إلى حساب سييد",
  "createAccount": "إنشاء حساب",
  "createAccountSubtitle": "انضم إلى سييد وابدأ الحجز",
  "continueWithGoogle": "المتابعة مع Google",
  "continueWithApple": "المتابعة مع Apple",
  "orContinueWith": "أو تابع باستخدام",
  "orFillDetails": "أو أدخل بياناتك",
  "emailOrPhone": "البريد الإلكتروني أو رقم الجوال",
  "password": "كلمة المرور",
  "forgotPassword": "نسيت كلمة المرور؟",
  "username": "اسم المستخدم",
  "email": "البريد الإلكتروني",
  "phoneNumber": "رقم الجوال",
  "phoneSaudi": "سعودي",
  "noAccount": "ليس لديك حساب؟",
  "haveAccount": "لديك حساب بالفعل؟",
  "agreeToTerms": "أوافق على <tos>شروط الخدمة</tos> و<tou>شروط الاستخدام</tou> و<privacy>سياسة الخصوصية</privacy> و<refund>سياسة الاسترداد</refund>",
  "showPassword": "إظهار كلمة المرور",
  "hidePassword": "إخفاء كلمة المرور",
  "close": "إغلاق",
  "errors": {
    "required": "هذا الحقل مطلوب",
    "invalidEmail": "أدخل بريداً إلكترونياً صحيحاً",
    "invalidPhone": "أدخل رقم جوال سعودي صحيح (05XXXXXXXX)",
    "invalidEmailOrPhone": "أدخل بريداً إلكترونياً أو رقم جوال سعودي صحيح (05XXXXXXXX)",
    "passwordMin": "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
    "mustAgree": "يجب الموافقة على السياسات",
    "usernameMin": "اسم المستخدم يجب أن يكون 3 أحرف على الأقل",
    "invalidUsername": "اسم المستخدم يمكن أن يحتوي على أحرف وأرقام وشرطة سفلية فقط"
  }
},
```

- [ ] **Step 5: Verify no JSON syntax errors**

Run:
```bash
node -e "require('./messages/en.json'); console.log('en.json OK')"
node -e "require('./messages/ar.json'); console.log('ar.json OK')"
```

Expected: `en.json OK` and `ar.json OK` — no parse errors.

- [ ] **Step 6: Commit**

```bash
git add messages/en.json messages/ar.json
git commit -m "feat: add Auth i18n keys (en + ar)"
```

---

### Task 2: Create AuthContext

**Files:**
- Create: `components/AuthContext.tsx`

- [ ] **Step 1: Create `components/AuthContext.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```

Expected: no errors related to `AuthContext.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/AuthContext.tsx
git commit -m "feat: add AuthContext with AuthProvider and useAuth hook"
```

---

### Task 3: Create shared AuthIcons

Both form files need the same Google and Apple SVG icons. Extract them here once so neither form duplicates the markup.

**Files:**
- Create: `components/AuthIcons.tsx`

- [ ] **Step 1: Create `components/AuthIcons.tsx`**

```tsx
export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors in `AuthIcons.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/AuthIcons.tsx
git commit -m "feat: add shared GoogleIcon and AppleIcon for auth forms"
```

---

## Chunk 2: Sign In & Sign Up Forms

### Task 4: Create AuthSignInForm

**Files:**
- Create: `components/AuthSignInForm.tsx`

- [ ] **Step 1: Create `components/AuthSignInForm.tsx`**

```tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { GoogleIcon, AppleIcon } from '@/components/AuthIcons';

const SAUDI_PHONE = /^05\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signInSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'required')
    .refine((val) => EMAIL_RE.test(val) || SAUDI_PHONE.test(val), 'invalidEmailOrPhone'),
  password: z.string().min(1, 'required'),
});

type SignInData = z.infer<typeof signInSchema>;

export default function AuthSignInForm() {
  const t = useTranslations('Auth');
  const { switchView, closeAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({ resolver: zodResolver(signInSchema), mode: 'onTouched' });

  const onSubmit = (data: SignInData) => {
    console.log('Sign in data:', data);
    closeAuth();
  };

  type ErrKey = 'required' | 'invalidEmailOrPhone';

  const fieldError = (key: keyof SignInData) => {
    const msg = errors[key]?.message as ErrKey | undefined;
    if (!msg) return null;
    return (
      <p className="text-red-500 text-[10px] mt-1">
        {t(`errors.${msg}`)}
      </p>
    );
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-11 h-11 bg-gradient-to-br from-[#7C3AED] to-[#a855f7] rounded-[14px] mx-auto mb-3 flex items-center justify-center text-xl">
          🌱
        </div>
        <h2 className="text-lg font-extrabold text-slate-900">{t('welcomeBack')}</h2>
        <p className="text-xs text-slate-400 mt-1">{t('welcomeBackSubtitle')}</p>
      </div>

      {/* Social buttons */}
      <div className="flex flex-col gap-2 mb-5">
        <button
          type="button"
          onClick={() => console.log('Google sign in')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          <GoogleIcon />
          {t('continueWithGoogle')}
        </button>
        <button
          type="button"
          onClick={() => console.log('Apple sign in')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-black rounded-xl text-sm font-semibold text-white hover:bg-slate-900 transition-colors"
        >
          <AppleIcon />
          {t('continueWithApple')}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[11px] text-slate-400 font-medium">{t('orContinueWith')}</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {/* Email or phone */}
        <div>
          <label htmlFor="signin-emailOrPhone" className="block text-[11px] font-semibold text-slate-700 mb-1.5">
            {t('emailOrPhone')}
          </label>
          <input
            id="signin-emailOrPhone"
            type="text"
            autoComplete="username"
            placeholder="name@email.com or 05XXXXXXXX"
            {...register('emailOrPhone')}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-colors ${
              errors.emailOrPhone ? 'border-red-400' : 'border-slate-200'
            }`}
          />
          {fieldError('emailOrPhone')}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="signin-password" className="block text-[11px] font-semibold text-slate-700">
              {t('password')}
            </label>
            <button
              type="button"
              onClick={() => console.log('Forgot password')}
              className="text-[11px] text-[#7C3AED] font-semibold hover:underline"
            >
              {t('forgotPassword')}
            </button>
          </div>
          <div className="relative">
            <input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-colors pr-10 ${
                errors.password ? 'border-red-400' : 'border-slate-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? t('hidePassword') : t('showPassword')}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {fieldError('password')}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#9333ea] text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity mt-1"
        >
          {t('signIn')}
        </button>
      </form>

      {/* Toggle to sign up */}
      <p className="text-center text-[11px] text-slate-400 mt-5">
        {t('noAccount')}{' '}
        <button
          type="button"
          onClick={() => switchView('signup')}
          className="text-[#7C3AED] font-bold hover:underline"
        >
          {t('signUp')}
        </button>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors in `AuthSignInForm.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/AuthSignInForm.tsx
git commit -m "feat: add AuthSignInForm with email/phone + password + social buttons"
```

---

### Task 5: Create AuthSignUpForm

**Files:**
- Create: `components/AuthSignUpForm.tsx`

- [ ] **Step 1: Create `components/AuthSignUpForm.tsx`**

```tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { GoogleIcon, AppleIcon } from '@/components/AuthIcons';

const SAUDI_PHONE = /^05\d{8}$/;

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, 'usernameMin')
    .regex(/^[a-zA-Z0-9_]+$/, 'invalidUsername'),
  email: z
    .string()
    .min(1, 'required')
    .email('invalidEmail'),
  phone: z
    .string()
    .min(1, 'required')
    .regex(SAUDI_PHONE, 'invalidPhone'),
  password: z
    .string()
    .min(8, 'passwordMin'),
  agreedToTerms: z
    .boolean()
    .refine((v) => v === true, 'mustAgree'),
});

type SignUpData = z.infer<typeof signUpSchema>;

export default function AuthSignUpForm() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const { switchView, closeAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { agreedToTerms: false },
    mode: 'onTouched',
  });

  const agreedToTerms = watch('agreedToTerms');

  const onSubmit = (data: SignUpData) => {
    console.log('Sign up data:', data);
    closeAuth();
  };

  type ErrKey = 'required' | 'invalidEmail' | 'invalidPhone' | 'passwordMin' | 'mustAgree' | 'usernameMin' | 'invalidUsername';

  const fieldError = (key: keyof SignUpData) => {
    const msg = errors[key]?.message as ErrKey | undefined;
    if (!msg) return null;
    return (
      <p className="text-red-500 text-[10px] mt-1">
        {t(`errors.${msg}`)}
      </p>
    );
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="w-11 h-11 bg-gradient-to-br from-[#7C3AED] to-[#a855f7] rounded-[14px] mx-auto mb-3 flex items-center justify-center text-xl">
          🌱
        </div>
        <h2 className="text-lg font-extrabold text-slate-900">{t('createAccount')}</h2>
        <p className="text-xs text-slate-400 mt-1">{t('createAccountSubtitle')}</p>
      </div>

      {/* Social buttons — side by side */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => console.log('Google sign up')}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          <GoogleIcon />
          {t('continueWithGoogle')}
        </button>
        <button
          type="button"
          onClick={() => console.log('Apple sign up')}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-black rounded-xl text-xs font-semibold text-white hover:bg-slate-900 transition-colors"
        >
          <AppleIcon />
          {t('continueWithApple')}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[11px] text-slate-400 font-medium">{t('orFillDetails')}</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
        {/* Username */}
        <div>
          <label htmlFor="signup-username" className="block text-[11px] font-semibold text-slate-700 mb-1.5">
            {t('username')}
          </label>
          <input
            id="signup-username"
            type="text"
            autoComplete="username"
            placeholder="@username"
            {...register('username')}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-colors ${
              errors.username ? 'border-red-400' : 'border-slate-200'
            }`}
          />
          {fieldError('username')}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="block text-[11px] font-semibold text-slate-700 mb-1.5">
            {t('email')}
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="name@email.com"
            {...register('email')}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-colors ${
              errors.email ? 'border-red-400' : 'border-slate-200'
            }`}
          />
          {fieldError('email')}
        </div>

        {/* Phone — Saudi prefix chip */}
        <div>
          <label htmlFor="signup-phone" className="block text-[11px] font-semibold text-slate-700 mb-1.5">
            {t('phoneNumber')}{' '}
            <span className="text-slate-400 font-normal">({t('phoneSaudi')})</span>
          </label>
          <div className="flex gap-2" dir="ltr">
            <div className="flex items-center px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700 whitespace-nowrap select-none">
              🇸🇦 +966
            </div>
            <input
              id="signup-phone"
              type="tel"
              autoComplete="tel"
              placeholder="05XXXXXXXX"
              {...register('phone')}
              className={`flex-1 px-3 py-2.5 text-sm border rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-colors ${
                errors.phone ? 'border-red-400' : 'border-slate-200'
              }`}
            />
          </div>
          {fieldError('phone')}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="block text-[11px] font-semibold text-slate-700 mb-1.5">
            {t('password')}
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-colors pr-10 ${
                errors.password ? 'border-red-400' : 'border-slate-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? t('hidePassword') : t('showPassword')}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {fieldError('password')}
        </div>

        {/* Policy agreement */}
        <div className={`flex items-start gap-3 p-3 rounded-xl border ${errors.agreedToTerms ? 'bg-red-50 border-red-200' : 'bg-[#f8f7ff] border-[#ede9fe]'}`}>
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              id="signup-agree"
              type="checkbox"
              {...register('agreedToTerms')}
              className="sr-only"
            />
            <label
              htmlFor="signup-agree"
              className={`w-4 h-4 flex items-center justify-center rounded cursor-pointer border-2 transition-colors ${
                agreedToTerms ? 'bg-[#7C3AED] border-[#7C3AED]' : 'bg-white border-slate-300'
              }`}
            >
              {agreedToTerms && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true">
                  <path d="M1 3.5l2.5 2.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </label>
          </div>
          <p className="text-[10.5px] text-slate-500 leading-relaxed">
            {t.rich('agreeToTerms', {
              tos: (chunks) => (
                <a href={`/${locale}/terms-of-service`} target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] font-semibold underline underline-offset-2 hover:opacity-80">
                  {chunks}
                </a>
              ),
              tou: (chunks) => (
                <a href={`/${locale}/terms-of-use`} target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] font-semibold underline underline-offset-2 hover:opacity-80">
                  {chunks}
                </a>
              ),
              privacy: (chunks) => (
                <a href={`/${locale}/privacy`} target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] font-semibold underline underline-offset-2 hover:opacity-80">
                  {chunks}
                </a>
              ),
              refund: (chunks) => (
                <a href={`/${locale}/refund-policy`} target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] font-semibold underline underline-offset-2 hover:opacity-80">
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
        {fieldError('agreedToTerms')}

        {/* Submit */}
        <button
          type="submit"
          disabled={!agreedToTerms}
          className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#9333ea] text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mt-1"
        >
          {t('createAccount')}
        </button>
      </form>

      {/* Toggle to sign in */}
      <p className="text-center text-[11px] text-slate-400 mt-4">
        {t('haveAccount')}{' '}
        <button
          type="button"
          onClick={() => switchView('signin')}
          className="text-[#7C3AED] font-bold hover:underline"
        >
          {t('signIn')}
        </button>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors in `AuthSignUpForm.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/AuthSignUpForm.tsx
git commit -m "feat: add AuthSignUpForm with all fields, Saudi phone prefix, policy agreement"
```

---

## Chunk 3: AuthModal + Layout Integration

### Task 6: Create AuthModal

**Files:**
- Create: `components/AuthModal.tsx`

- [ ] **Step 1: Create `components/AuthModal.tsx`**

```tsx
"use client";

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/AuthContext';
import AuthSignInForm from '@/components/AuthSignInForm';
import AuthSignUpForm from '@/components/AuthSignUpForm';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export default function AuthModal() {
  const t = useTranslations('Auth');
  const { isOpen, view, closeAuth } = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape + focus trap (Tab / Shift+Tab cycling)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuth();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeAuth]);

  // Move initial focus into the panel when it opens
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const first = panelRef.current.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panelRef.current).focus();
  }, [isOpen]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAuth}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="auth-panel"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label={view === 'signin' ? t('signIn') : t('signUp')}
            ref={panelRef}
            tabIndex={-1}
            className="fixed inset-0 flex items-center justify-center z-[201] p-4 pointer-events-none"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90dvh] overflow-y-auto pointer-events-auto p-6">
              {/* Close button */}
              <button
                onClick={closeAuth}
                aria-label={t('close')}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
              >
                <X size={18} />
              </button>

              {/* Swap between sign in and sign up */}
              <AnimatePresence mode="wait" initial={false}>
                {view === 'signin' ? (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.15 }}
                  >
                    <AuthSignInForm />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.15 }}
                  >
                    <AuthSignUpForm />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors in `AuthModal.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/AuthModal.tsx
git commit -m "feat: add AuthModal with backdrop, animation, focus trap, and Escape key"
```

---

### Task 7: Wire AuthProvider and AuthModal into layout

**Files:**
- Modify: `app/[locale]/layout.tsx`

The layout currently has this structure inside `<body>`:
```
NextIntlClientProvider
  ClientWrapper
    Navbar
    <main>{children}</main>
    Footer
```

- [ ] **Step 1: Add imports to `app/[locale]/layout.tsx`**

At the top of the file, after the existing imports, add:

```tsx
import { AuthProvider } from '@/components/AuthContext';
import AuthModal from '@/components/AuthModal';
```

- [ ] **Step 2: Wrap `ClientWrapper` children with `AuthProvider` and add `AuthModal`**

Find this block:
```tsx
<ClientWrapper>
  <Navbar />
  <main className="flex-1">
    {children}
  </main>
  <Footer />
</ClientWrapper>
```

Replace it with:
```tsx
<ClientWrapper>
  <AuthProvider>
    <AuthModal />
    <Navbar />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </AuthProvider>
</ClientWrapper>
```

- [ ] **Step 3: Verify the dev server compiles without errors**

```bash
npm run dev
```

Open http://localhost:3000 — the page should load normally (no visual change yet, the modal is just not triggered).

Expected: no red compile errors in terminal.

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/layout.tsx
git commit -m "feat: wire AuthProvider and AuthModal into locale layout"
```

---

## Chunk 4: Navbar — Sign In Button

### Task 8: Add Sign In button to Navbar

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Import `useAuth` in `components/Navbar.tsx`**

At the top of the file, add:
```tsx
import { useAuth } from '@/components/AuthContext';
```

- [ ] **Step 2: Call `useAuth` inside the `Navbar` component**

Inside `const Navbar = () => {`, after the existing hooks (`useTranslations`, `useLocale`, etc.), add:
```tsx
const { openAuth } = useAuth();
```

- [ ] **Step 3: Add Sign In button on desktop**

Find the desktop actions block:
```tsx
<div className="hidden lg:block">
  <button 
    onClick={() => setIsModalOpen(true)}
    className="bg-[#1E293B] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:cursor-pointer transition-transform active:scale-95"
  >
    <Smartphone size={18} />
    <span>{t('getApp')}</span>
  </button>
</div>
```

Add a Sign In button **before** the Get App button (inside the same `<div className="flex items-center gap-6 z-20">`):

```tsx
<div className="hidden lg:block">
  <button
    onClick={() => openAuth('signin')}
    className="border border-[#7C3AED] text-[#7C3AED] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#7C3AED]/5 transition-colors"
  >
    {t('signIn')}
  </button>
</div>
<div className="hidden lg:block">
  <button 
    onClick={() => setIsModalOpen(true)}
    className="bg-[#1E293B] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:cursor-pointer transition-transform active:scale-95"
  >
    <Smartphone size={18} />
    <span>{t('getApp')}</span>
  </button>
</div>
```

- [ ] **Step 4: Add Sign In button in the mobile sidebar**

Find the mobile sidebar bottom CTA section:
```tsx
<div className="mt-auto pt-8 space-y-4">
  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
    <span className="text-sm font-bold text-slate-500">{isRtl ? 'اللغة' : 'Language'}</span>
    <LanguageSwitcher />
  </div>
  <button 
    onClick={() => { setIsOpen(false); setIsModalOpen(true); }}
    className="bg-[#1E293B] text-white px-6 py-4 rounded-2xl flex items-center gap-2 w-full justify-center font-bold"
  >
    <Smartphone size={18} />
    <span>{t('getApp')}</span>
  </button>
</div>
```

Replace with (adds Sign In button above Get App):
```tsx
<div className="mt-auto pt-8 space-y-4">
  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
    <span className="text-sm font-bold text-slate-500">{isRtl ? 'اللغة' : 'Language'}</span>
    <LanguageSwitcher />
  </div>
  <button
    onClick={() => { setIsOpen(false); openAuth('signin'); }}
    className="border-2 border-[#7C3AED] text-[#7C3AED] px-6 py-4 rounded-2xl flex items-center gap-2 w-full justify-center font-bold hover:bg-[#7C3AED]/5 transition-colors"
  >
    {t('signIn')}
  </button>
  <button 
    onClick={() => { setIsOpen(false); setIsModalOpen(true); }}
    className="bg-[#1E293B] text-white px-6 py-4 rounded-2xl flex items-center gap-2 w-full justify-center font-bold"
  >
    <Smartphone size={18} />
    <span>{t('getApp')}</span>
  </button>
</div>
```

- [ ] **Step 5: Manually verify**

1. Run `npm run dev` (if not already running)
2. Open http://localhost:3000/en
3. Verify: a purple outlined "Sign In" button appears in the desktop navbar to the left of "Get App"
4. Click "Sign In" → the auth modal should open with the Sign In form
5. Click "Don't have an account? Sign up" → modal should switch to Sign Up form
6. Verify all 4 policy links in the checkbox text are purple and underlined
7. Try clicking a policy link → should open the correct page in a new tab
8. Click the ✕ button or backdrop → modal should close
9. Press Escape with modal open → modal should close
10. Switch to Arabic (http://localhost:3000/ar) → verify all text is Arabic and layout is RTL

- [ ] **Step 6: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: add Sign In button to Navbar (desktop + mobile sidebar)"
```
