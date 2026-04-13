'use client';

/**
 * OAuth callback page for Cognito Hosted UI social login.
 *
 * When Cognito redirects back here after a Google / Apple sign-in, this page
 * reads the `code` (or `error`) from the query string, posts it to the opener
 * window via postMessage, then closes itself.
 *
 * Register  <YOUR_ORIGIN>/auth/callback  as an allowed callback URL in the
 * Cognito User Pool Client settings, and set NEXT_PUBLIC_COGNITO_REDIRECT_URI
 * to the same value.
 */

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function AuthCallbackInner() {
  const params = useSearchParams();

  useEffect(() => {
    const code  = params.get('code');
    const error = params.get('error');

    if (window.opener) {
      window.opener.postMessage(
        { type: 'cognito-oauth-callback', code, error },
        window.location.origin,
      );
    }

    window.close();
  }, [params]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p style={{ fontFamily: 'sans-serif', color: '#555' }}>Completing sign in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ fontFamily: 'sans-serif', color: '#555' }}>Completing sign in…</p>
      </div>
    }>
      <AuthCallbackInner />
    </Suspense>
  );
}
