/**
 * Social login via Cognito Hosted UI.
 *
 * Cognito handles the full OAuth handshake with Google / Apple / Facebook.
 * The frontend only needs:
 *   NEXT_PUBLIC_COGNITO_DOMAIN   — e.g. "seed-tennis.auth.eu-west-3.amazoncognito.com"
 *   NEXT_PUBLIC_COGNITO_CLIENT_ID — Cognito App Client ID
 *   NEXT_PUBLIC_COGNITO_REDIRECT_URI — registered callback URL for this web app
 *
 * No Google Client ID or Apple Service ID is required here.
 */

export interface SocialLoginResult {
  provider: 'google' | 'apple';
  /** Cognito access token */
  accessToken: string;
  /** Cognito ID token — contains user claims and identifies the Cognito source */
  idToken: string;
  /** Cognito refresh token */
  refreshToken: string;
  userInfo: {
    email: string;
    displayName?: string;
    photoURL?: string;
    id?: string;
  };
}

function resolveRedirectUri(): string {
  const configuredRedirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI?.trim();

  if (typeof window === 'undefined') {
    return configuredRedirectUri || '';
  }

  const currentOriginRedirectUri = `${window.location.origin}/auth/callback`;

  if (!configuredRedirectUri) {
    return currentOriginRedirectUri;
  }

  try {
    const configuredUrl = new URL(configuredRedirectUri);

    // Popup auth must round-trip back to the same site that opened it.
    if (configuredUrl.origin !== window.location.origin) {
      return currentOriginRedirectUri;
    }

    return configuredUrl.toString();
  } catch {
    return currentOriginRedirectUri;
  }
}

/* ─── JWT payload decoder ────────────────────────────────── */

function decodeJwtPayload(jwt: string): Record<string, unknown> {
  try {
    const part = jwt.split('.')[1];
    return JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

/* ─── Token exchange ─────────────────────────────────────── */

async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<{
  id_token: string;
  access_token: string;
  refresh_token: string;
}> {
  const domain   = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

  if (!domain || !clientId) {
    throw new Error('Cognito domain or client ID not configured');
  }

  const res = await fetch(`https://${domain}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:   'authorization_code',
      client_id:    clientId,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  return res.json();
}

/* ─── Popup launcher ─────────────────────────────────────── */

function openCognitoPopup(authUrl: string, redirectUri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const width  = 500;
    const height = 650;
    const left   = window.screenX + (window.outerWidth  - width)  / 2;
    const top    = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'cognito-social-login',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`,
    );

    if (!popup) {
      reject(new Error('Popup blocked. Please allow popups for this site.'));
      return;
    }

    const redirectOrigin = new URL(redirectUri).origin;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== redirectOrigin) return;
      if (typeof event.data !== 'object' || event.data.type !== 'cognito-oauth-callback') return;
      window.removeEventListener('message', onMessage);
      clearInterval(pollInterval);
      if (event.data.code) {
        resolve(event.data.code as string);
      } else {
        reject(new Error(event.data.error ?? 'OAuth cancelled'));
      }
    };

    window.addEventListener('message', onMessage);

    const pollInterval = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollInterval);
        window.removeEventListener('message', onMessage);
        reject(new Error('popup_closed_by_user'));
      }
    }, 500);
  });
}

/* ─── Public API ─────────────────────────────────────────── */

async function signInWithCognito(
  identityProvider: 'Google' | 'SignInWithApple',
  provider: 'google' | 'apple',
): Promise<SocialLoginResult> {
  const domain      = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
  const clientId    = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  const redirectUri = resolveRedirectUri();

  if (!domain || !clientId || !redirectUri) {
    throw new Error('Cognito domain or client ID not configured. Set NEXT_PUBLIC_COGNITO_DOMAIN and NEXT_PUBLIC_COGNITO_CLIENT_ID.');
  }

  const params = new URLSearchParams({
    identity_provider: identityProvider,
    client_id:         clientId,
    response_type:     'code',
    scope:             'email openid profile',
    redirect_uri:      redirectUri,
  });

  const authUrl = `https://${domain}/oauth2/authorize?${params}`;
  const code    = await openCognitoPopup(authUrl, redirectUri);
  const tokens  = await exchangeCodeForTokens(code, redirectUri);

  const claims  = decodeJwtPayload(tokens.id_token);
  const email   = typeof claims.email === 'string' ? claims.email : undefined;

  if (!email) throw new Error('Cognito did not return an email in the ID token');

  const cognitoUsername = typeof claims['cognito:username'] === 'string' ? claims['cognito:username'] as string : '';
  const name =
    typeof claims.name === 'string' && claims.name ? claims.name :
    cognitoUsername && !/^(SignInWithApple|Google|Facebook)_/i.test(cognitoUsername) ? cognitoUsername.replace(/[._-]/g, ' ') :
    email.split('@')[0];

  const picture = typeof claims.picture === 'string' ? claims.picture : undefined;
  const sub     = typeof claims.sub      === 'string' ? claims.sub     : undefined;

  return {
    provider,
    accessToken:  tokens.access_token,
    idToken:      tokens.id_token,
    refreshToken: tokens.refresh_token,
    userInfo: { email, displayName: name, photoURL: picture, id: sub },
  };
}

export function signInWithGoogle(): Promise<SocialLoginResult> {
  return signInWithCognito('Google', 'google');
}

export function signInWithApple(): Promise<SocialLoginResult> {
  return signInWithCognito('SignInWithApple', 'apple');
}
