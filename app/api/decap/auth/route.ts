import { NextRequest } from 'next/server';
import {
  GITHUB_REDIRECT_URI,
  newOAuthState,
  noStoreHeaders,
  stateCookie,
  textResponse,
} from '@/app/lib/decap-oauth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId || !process.env.GITHUB_OAUTH_CLIENT_SECRET) {
    return textResponse('GitHub OAuth is not configured.', 503);
  }

  const provider = request.nextUrl.searchParams.get('provider');
  if (provider && provider !== 'github') return textResponse('Unsupported OAuth provider.', 400);

  const state = newOAuthState();
  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', GITHUB_REDIRECT_URI);
  authorizeUrl.searchParams.set('scope', 'repo');
  authorizeUrl.searchParams.set('state', state);

  const headers = noStoreHeaders();
  headers.append('Set-Cookie', stateCookie(state));
  headers.set('Location', authorizeUrl.toString());
  return new Response(null, { status: 302, headers });
}
