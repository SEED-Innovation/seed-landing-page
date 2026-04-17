import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except static files and .well-known
    '/((?!_next|_vercel|\\.well-known|[^/]+\\.[^/]+$).*)',
    // Always match root
    '/',
  ],
};
