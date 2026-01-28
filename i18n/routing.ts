import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ar'],      // Supported languages
  defaultLocale: 'en'         // Fallback language
});

// These helpers replace the standard Link/useRouter
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);