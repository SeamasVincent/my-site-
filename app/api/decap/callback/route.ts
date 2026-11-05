import { NextRequest } from 'next/server';
import {
  GITHUB_REDIRECT_URI,
  OAUTH_STATE_COOKIE,
  popupResponse,
  readCookie,
  validOAuthState,
} from '@/app/lib/decap-oauth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const state = params.get('state');
  const cookieState = readCookie(request, OAUTH_STATE_COOKIE);
  if (!validOAuthState(state, cookieState)) {
    return popupResponse({ error: 'The GitHub authorization request expired or could not be verified.', status: 400, clearStateCookie: true });
  }

  if (params.has('error')) {
    return popupResponse({ error: 'GitHub authorization was declined.', status: 400, clearStateCookie: true });
  }

  const code = params.get('code');
  if (!code || code.length > 2048) {
    return popupResponse({ error: 'GitHub did not return an authorization code.', status: 400, clearStateCookie: true });
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return popupResponse({ error: 'GitHub OAuth is not configured.', status: 503, clearStateCookie: true });
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    const payload: unknown = await tokenResponse.json();
    const token = typeof payload === 'object' && payload !== null && 'access_token' in payload
      ? payload.access_token
      : null;

    if (!tokenResponse.ok || typeof token !== 'string' || token.length < 20 || token.length > 4096) {
      return popupResponse({ error: 'GitHub could not complete authorization.', status: 502, clearStateCookie: true });
    }

    return popupResponse({ token, clearStateCookie: true });
  } catch {
    return popupResponse({ error: 'GitHub could not complete authorization.', status: 502, clearStateCookie: true });
  }
}
