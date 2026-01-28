import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations('Navigation');

  return (
    <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 py-4 md:px-12">
      <div className="text-white text-2xl font-bold italic">SEED</div>
      
      <div className="hidden md:flex gap-8 text-white/90 text-sm font-medium">
        <Link href="/">{t('home')}</Link>
        <Link href="/explore">{t('explore')}</Link>
        <Link href="/tech">{t('technology')}</Link>
        <Link href="/business">{t('business')}</Link>
        <Link href="/about">{t('about')}</Link>

      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold">
          {t('getApp')}
        </button>
      </div>
    </nav>
  );
}