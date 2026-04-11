"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { GoogleIcon, AppleIcon } from '@/components/AuthIcons';
import { EMAIL_RE, SAUDI_PHONE, USERNAME_RE } from '@/lib/auth-api';

const signInSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'required')
    .refine(
      (val) => EMAIL_RE.test(val) || SAUDI_PHONE.test(val) || USERNAME_RE.test(val),
      'invalidEmailOrPhone',
    ),
  password: z.string().min(1, 'required'),
});

type SignInData = z.infer<typeof signInSchema>;
type ErrKey = 'required' | 'invalidEmailOrPhone';

export default function AuthSignInForm() {
  const t = useTranslations('Auth');
  const { switchView, signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [apiError, setApiError]         = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({ resolver: zodResolver(signInSchema), mode: 'onTouched' });

  const onSubmit = async (data: SignInData) => {
    setApiError(null);
    setLoading(true);
    const result = await signIn(data.emailOrPhone, data.password);
    setLoading(false);
    if (!result.ok && !result.needsConfirm) {
      setApiError(t(`errors.${result.errorKey ?? 'signInFailed'}` as Parameters<typeof t>[0]));
    }
    // needsConfirm: context sets pendingUsername → modal auto-switches to confirm view
    // ok: finalizeLogin closes modal automatically
  };

  const fieldError = (key: keyof SignInData) => {
    const msg = errors[key]?.message as ErrKey | undefined;
    if (!msg) return null;
    return <p role="alert" className="text-red-500 text-[10px] mt-1">{t(`errors.${msg}`)}</p>;
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
        <button type="button" onClick={() => console.log('Google sign in')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors">
          <GoogleIcon />{t('continueWithGoogle')}
        </button>
        <button type="button" onClick={() => console.log('Apple sign in')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-black rounded-xl text-sm font-semibold text-white hover:bg-slate-900 transition-colors">
          <AppleIcon />{t('continueWithApple')}
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
        {/* Email / phone / username */}
        <div>
          <label htmlFor="signin-emailOrPhone" className="block text-[11px] font-semibold text-slate-700 mb-1.5">
            {t('emailOrPhone')}
          </label>
          <input
            id="signin-emailOrPhone"
            type="text"
            autoComplete="username"
            placeholder="name@email.com, 05XXXXXXXX, or username"
            {...register('emailOrPhone', {
              onChange: () => setApiError(null),
            })}
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
            <button type="button" onClick={() => console.log('Forgot password')}
              className="text-[11px] text-[#7C3AED] font-semibold hover:underline">
              {t('forgotPassword')}
            </button>
          </div>
          <div className="relative">
            <input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password', {
                onChange: () => setApiError(null),
              })}
              className={`w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-colors pe-10 ${
                errors.password ? 'border-red-400' : 'border-slate-200'
              }`}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? t('hidePassword') : t('showPassword')}>
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {fieldError('password')}
        </div>

        {/* API error */}
        {apiError && (
          <p role="alert" className="text-red-500 text-xs text-center">{apiError}</p>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading} aria-busy={loading}
          className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#9333ea] text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed mt-1">
          {loading ? <><span aria-hidden="true">…</span><span className="sr-only">Loading…</span></> : t('signIn')}
        </button>
      </form>

      {/* Toggle to sign up */}
      <p className="text-center text-[11px] text-slate-400 mt-5">
        {t('noAccount')}{' '}
        <button type="button" onClick={() => switchView('signup')}
          className="text-[#7C3AED] font-bold hover:underline">
          {t('signUp')}
        </button>
      </p>
    </div>
  );
}
