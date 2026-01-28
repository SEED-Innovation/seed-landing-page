import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import "../globals.css";
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 1. Validate that the incoming `locale` is supported
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 2. Load the dictionary for this language
  const messages = await getMessages();

  // 3. Determine the direction (Right-to-Left for Arabic)
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body className="min-h-screen bg-white text-slate-900">
        <NextIntlClientProvider messages={messages}>
         <Navbar/>

          <main>{children}</main>

          <footer className="mt-10 p-10 bg-slate-50 text-center">
            © 2026 Bilingual App
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}