// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(ar|en)/:path*',
    // Exclude .well-known and static files from locale routing
    '/((?!_next|_vercel|\\.well-known|.*\\.[^/]+$).*)',
  ],
};