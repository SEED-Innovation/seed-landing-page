import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientWrapper from '@/components/ClientWrapper'; // المكون الجديد
import "../globals.css";
import { Metadata } from 'next';

// Metadata remains here (Server-side)
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';

  return {
    title: {
      template: `%s | ${isAr ? 'سيد - تدريب تنس بذكاء' : 'SEED - Smart Tennis Coaching'}`,
      default: isAr ? 'سيد | منصة تدريب التنس المدعومة بالذكاء الاصطناعي' : 'SEED | AI-Powered Tennis Coaching Platform',
    },
    description: isAr 
      ? 'سيد هي المنصة الأولى في السعودية لتدريب التنس باستخدام الذكاء الاصطناعي.' 
      : 'SEED is Saudi Arabia\'s premier AI-powered tennis coaching platform.',
    // ... rest of your metadata (unchanged)
    applicationName: 'SEED',
    openGraph: {
      title: isAr ? 'سيد - مستقبل تدريب التنس' : 'SEED - The Future of Tennis Coaching',
      url: `https://seedco.sa/${locale}`,
      siteName: 'SEED',
      images: [{ url: '/icons/og-image.png', width: 1200, height: 630 }],
      locale: locale,
      type: 'website',
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#7C3AED',
};

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

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className="scroll-smooth">
      <body className="min-h-screen text-slate-900 bg-white antialiased">
        <NextIntlClientProvider messages={messages}>
          {/* Wrap everything in the ClientWrapper to show the Loader */}
          <ClientWrapper>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </ClientWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}