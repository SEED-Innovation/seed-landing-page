// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all paths except for static files (images, etc.)
  matcher: ['/', '/(ar|en)/:path*']
};