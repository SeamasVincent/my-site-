import { randomBytes, timingSafeEqual } from 'node:crypto';

export const DECAP_ORIGIN = 'https://seamas.sokeafrica.com';
export const GITHUB_REDIRECT_URI = 'https://seamas.sokeafrica.com/api/decap/callback';
export const OAUTH_STATE_COOKIE = '__Host-decap_github_oauth_state';
export const OAUTH_STATE_MAX_AGE = 5 * 60;

export function newOAuthState() {
  return randomBytes(32).toString('base64url');
}

export function readCookie(request: Request, name: string) {
  const prefix = `${name}=`;
  const value = request.headers
    .get('cookie')
    ?.split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(prefix))
    ?.slice(prefix.length);

  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export function validOAuthState(state: string | null, cookieState: string | null) {
  if (!state || !cookieState || !/^[A-Za-z0-9_-]{43}$/.test(state) || !/^[A-Za-z0-9_-]{43}$/.test(cookieState)) {
    return false;
  }

  const stateBytes = Buffer.from(state);
  const cookieBytes = Buffer.from(cookieState);
  return stateBytes.length === cookieBytes.length && timingSafeEqual(stateBytes, cookieBytes);
}

export function stateCookie(state: string, maxAge = OAUTH_STATE_MAX_AGE) {
  return `${OAUTH_STATE_COOKIE}=${encodeURIComponent(state)}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

export function noStoreHeaders(extra: HeadersInit = {}) {
  const headers = new Headers(extra);
  headers.set('Cache-Control', 'no-store, max-age=0');
  headers.set('Pragma', 'no-cache');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('X-Content-Type-Options', 'nosniff');
  return headers;
}

function scriptJson(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function popupResponse(options: { token?: string; error?: string; status?: number; clearStateCookie?: boolean }) {
  const nonce = randomBytes(18).toString('base64url');
  const result = options.token
    ? { token: options.token, provider: 'github' }
    : { message: options.error || 'GitHub authorization failed.' };
  const outcome = options.token ? 'success' : 'error';
  const script = `(() => {
    const allowedOrigin = ${scriptJson(DECAP_ORIGIN)};
    const result = ${scriptJson(result)};
    const outcome = ${scriptJson(outcome)};
    const receiveAcknowledgment = event => {
      if (event.source !== window.opener || event.origin !== allowedOrigin || event.data !== 'authorizing:github') return;
      window.removeEventListener('message', receiveAcknowledgment);
      const payload = JSON.stringify(result);
      window.opener.postMessage('authorization:github:' + outcome + ':' + payload, allowedOrigin);
      window.setTimeout(() => window.close(), 100);
    };
    if (window.opener) {
      window.addEventListener('message', receiveAcknowledgment);
      window.opener.postMessage('authorizing:github', allowedOrigin);
    }
  })();`;

  const headers = noStoreHeaders({
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
  });
  if (options.clearStateCookie) headers.append('Set-Cookie', stateCookie('', 0));

  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="referrer" content="no-referrer"><title>GitHub authorization</title><body><p>${options.token ? 'Authorization complete. This window will close.' : 'GitHub authorization could not be completed.'}</p><script nonce="${nonce}">${script}</script></body></html>`;
  return new Response(html, { status: options.status || 200, headers });
}

export function textResponse(message: string, status: number, clearStateCookie = false) {
  const headers = noStoreHeaders({ 'Content-Type': 'text/plain; charset=utf-8' });
  if (clearStateCookie) headers.append('Set-Cookie', stateCookie('', 0));
  return new Response(message, { status, headers });
}
