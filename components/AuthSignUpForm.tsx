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
