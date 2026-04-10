import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientWrapper from '@/components/ClientWrapper';
import { AuthProvider } from '@/components/AuthContext';
import AuthModal from '@/components/AuthModal';
import "../globals.css";
import { Metadata } from 'next';

// ─── Constants ───────────────────────────────────────────────────────────────
const BASE_URL = 'https://seedco.sa';
const OG_IMAGE  = `${BASE_URL}/icons/og-image.png`;

// ─── Per-locale copy ─────────────────────────────────────────────────────────
const COPY = {
  en: {
    titleTemplate:   '%s | SEED – The Future of Tennis AI and Padel AI',
    titleDefault:    'SEED | The Future of Tennis AI and Padel AI in Saudi Arabia',
    description:     'SEED is Saudi Arabia’s first House of expertise in Racket Sports AI. Housing a complete platform for both players and sports facilities.',
    ogTitle:         'SEED – The Future of Tennis AI and Padel AI',
    ogDescription:   'SEED is Saudi Arabia’s first House of expertise in Racket Sports AI. Housing a complete platform for both players and sports facilities.',
    ogLocale:        'en_US',
    keywords:        'tennis coaching Saudi Arabia, padel courts booking, AI tennis coach, SEED tennis, tennis Riyadh, padel Jeddah, racket sports AI, sports technology KSA',
  },
  ar: {
    titleTemplate:   '%s | سييد - مستقبل الذكاء الاصطناعي للتنس و البادل',
    titleDefault:    'سييد | مستقبل الذكاء الاصطناعي للتنس و البادل في السعودية',
    description:     'سييد هو أول بيت خبرة سعودي مختص في الذكاء الاصطناعي لرياضات التنس و البادل. مع منصات مخصصة للاعبين و المنشآت الرياضية.',
    ogTitle:         'سييد – مستقبل الذكاء الاصطناعي للتنس و البادل',
    ogDescription:   'سييد هو أول بيت خبرة سعودي مختص في الذكاء الاصطناعي لرياضات التنس و البادل. مع منصات مخصصة للاعبين و المنشآت الرياضية.',
    ogLocale:        'ar_SA',
    keywords:        'تدريب تنس السعودية, حجز ملاعب بادل, مدرب تنس ذكاء اصطناعي, سيد تنس, تنس الرياض, بادل جدة, منصة تنس السعودية, تقنية رياضية',
  },
} as const;

// ─── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const copy = isAr ? COPY.ar : COPY.en;
  const canonical = `${BASE_URL}/${locale}`;

  return {
    // ── Required ──────────────────────────────────────────────────────────────
    metadataBase: new URL(BASE_URL),                // makes relative URLs resolve
    title: {
      template: copy.titleTemplate,
      default:  copy.titleDefault,
    },
    description: copy.description,

    // ── Discoverability ───────────────────────────────────────────────────────
    keywords:    copy.keywords,
    applicationName: 'SEED',
    authors:     [{ name: 'SEED', url: BASE_URL }],
    creator:     'SEED',
    publisher:   'SEED',
    category:    'Sports & Fitness',

    // ── Canonical & alternates ────────────────────────────────────────────────
    alternates: {
      canonical,
      languages: {
        'en':    `${BASE_URL}/en`,
        'ar':    `${BASE_URL}/ar`,
        'x-default': `${BASE_URL}/en`,
      },
    },

    // ── Robots ────────────────────────────────────────────────────────────────
    robots: {
      index:           true,
      follow:          true,
      googleBot: {
        index:         true,
        follow:        true,
        'max-image-preview':  'large',
        'max-snippet':        -1,
        'max-video-preview':  -1,
      },
    },

    // ── Open Graph ────────────────────────────────────────────────────────────
    openGraph: {
      title:       copy.ogTitle,
      description: copy.ogDescription,
      url:         canonical,
      siteName:    'SEED',
      locale:      copy.ogLocale,
      type:        'website',
      images: [
        {
          url:    OG_IMAGE,
          width:  1200,
          height: 630,
          alt:    isAr ? 'منصة سيد للتنس والبادل' : 'SEED Tennis & Padel Platform',
          type:   'image/png',
        },
      ],
    },

    // ── Twitter / X ───────────────────────────────────────────────────────────
    twitter: {
      card:        'summary_large_image',
      title:       copy.ogTitle,
      description: copy.ogDescription,
      site:        '@SEEDtennisKSA',   // update to your actual handle
      creator:     '@SEEDtennisKSA',
      images:      [OG_IMAGE],
    },

    // ── Icons ─────────────────────────────────────────────────────────────────
    icons: {
      icon:             [
        { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icons/favicon.ico' },
      ],
      apple:            '/icons/apple-touch-icon.png',
      shortcut:         '/icons/favicon.ico',
    },

    // ── Verification (add your tokens) ────────────────────────────────────────
    verification: {
      google: 'YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN',   

    },
  };
}

// ─── Viewport (separate export as per Next.js 14+ spec) ──────────────────────
export const viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,      // was 1 — locking zoom hurts accessibility & Lighthouse
  themeColor:   [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#0F172A' },
  ],
};

// ─── Static params ────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default async function LocaleLayout({
  children,
  params,
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
  const isAr = locale === 'ar';

  // ── JSON-LD structured data (Organisation + WebSite) ──────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':       'Organization',
        '@id':         `${BASE_URL}/#organization`,
        name:          'SEED',
        url:           BASE_URL,
        logo: {
          '@type':  'ImageObject',
          url:      `${BASE_URL}/icons/og-image.png`,
          width:    1200,
          height:   630,
        },
        sameAs: [
          'https://twitter.com/SEEDtennisKSA',    // update with real profiles
          'https://www.instagram.com/seed.tennis',
        ],
        description: isAr
          ? 'سييد هو أول بيت خبرة سعودي مختص في الذكاء الاصطناعي لرياضات التنس و البادل. مع منصات مخصصة للاعبين و المنشآت الرياضية.'
          : 'SEED is Saudi Arabia’s first House of expertise in Racket Sports AI. Housing a complete platform for both players and sports facilities.',
        areaServed:  { '@type': 'Country', name: 'Saudi Arabia' },
        knowsAbout:  ['Tennis', 'Padel', 'AI Coaching', 'Sports Technology'],
      },
      {
        '@type':          'WebSite',
        '@id':            `${BASE_URL}/#website`,
        url:              BASE_URL,
        name:             'SEED',
        publisher:        { '@id': `${BASE_URL}/#organization` },
        inLanguage:       ['en', 'ar'],
        potentialAction: {
          '@type':       'SearchAction',
          target:        `${BASE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang={locale} dir={direction}>
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen text-slate-900 bg-white antialiased">
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}