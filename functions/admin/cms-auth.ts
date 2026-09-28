// GET /admin/cms-auth — sign-in bridge for the content editor.
//
// The editor opens this page in a popup (the standard Decap/Sveltia OAuth
// handshake). Instead of asking each team member for a GitHub account, we
// check their Cloudflare Access sign-in (the same email login as /admin) and
// hand the editor a repository-only GitHub token kept as a server secret.
// The token is only ever sent to a window on this same site.
import type { Ctx } from '../_lib/env';
import { adminEmail } from '../_lib/access';
import { audit, ensureSchema } from '../_lib/db';

const page = (provider: string, state: 'success' | 'error', content: Record<string, string>) => {
  const message = `authorization:${provider}:${state}:${JSON.stringify(content)}`;
  // Serialised safely for an inline script.
  const js = JSON.stringify(message).replaceAll('<', '\\u003c');
  const nonce = crypto.randomUUID().replaceAll('-', '');
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><title>Signing in…</title></head><body>
<p style="font-family:system-ui,sans-serif;padding:1rem">${state === 'success' ? 'Signing you in…' : 'Sign-in failed. You can close this window.'}</p>
<script nonce="${nonce}">
(() => {
  const message = ${js};
  const provider = ${JSON.stringify(provider)};
  window.addEventListener('message', (e) => {
    // Only answer the editor window on this same site.
    if (e.origin !== window.location.origin || e.source !== window.opener) return;
    if (e.data === 'authorizing:' + provider) {
      window.opener.postMessage(message, window.location.origin);
    }
  });
  if (window.opener) window.opener.postMessage('authorizing:' + provider, window.location.origin);
})();
</script></body></html>`,
    {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex',
        'referrer-policy': 'no-referrer',
        'content-security-policy': `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; frame-ancestors 'none'`,
      },
    },
  );
};

export const onRequestGet = async ({ request, env }: Ctx) => {
  const provider = new URL(request.url).searchParams.get('provider') ?? 'github';
  if (provider !== 'github') return page(provider, 'error', { provider, error: 'Only GitHub is supported.' });

  const email = await adminEmail(request, env);
  if (!email) {
    return page(provider, 'error', { provider, error: 'Please sign in through the Peace Across Generations admin login first (open /admin/ and sign in with your team email).' });
  }
  if (!env.GITHUB_CMS_TOKEN) {
    return page(provider, 'error', { provider, error: 'The content editor is not connected to GitHub yet (GITHUB_CMS_TOKEN is missing). See the README.' });
  }
  if (env.DB) {
    try { await ensureSchema(env); await audit(env, email, 'cms:sign-in', 'content-editor'); } catch { /* logging must not block sign-in */ }
  }
  return page(provider, 'success', { provider, token: env.GITHUB_CMS_TOKEN });
};
