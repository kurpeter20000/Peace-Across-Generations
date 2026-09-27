import type { Env } from './env';

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

/** Redirect after a form POST (works without JavaScript). */
export const seeOther = (request: Request, path: string) =>
  new Response(null, { status: 303, headers: { location: new URL(path, request.url).toString(), 'cache-control': 'no-store' } });

/** Send the visitor back to the form with an error code the page can explain. */
export function backWithError(request: Request, fallbackPath: string, code: string) {
  const ref = request.headers.get('referer');
  let path = fallbackPath;
  if (ref) {
    const u = new URL(ref);
    if (u.origin === new URL(request.url).origin) path = u.pathname;
  }
  return seeOther(request, `${path}?error=${encodeURIComponent(code)}#form`);
}

/** Reject cross-site form posts. */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // some privacy browsers omit it on same-origin posts
  return origin === new URL(request.url).origin;
}

export function field(form: FormData, name: string, max = 500): string {
  const v = form.get(name);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export const checked = (form: FormData, name: string) => form.get(name) === 'on' || form.get(name) === 'yes';

export const isEmail = (s: string) => /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/.test(s) && s.length <= 254;

export const isHttpUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
};

/** Bots fill the hidden "website" field; humans take more than 3 seconds. */
export function looksLikeBot(form: FormData): boolean {
  if (field(form, 'website')) return true;
  const started = Number(field(form, 'started', 20));
  return Number.isFinite(started) && started > 0 && Date.now() - started < 3000;
}

async function sha256(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Fixed-window rate limit per hashed IP. Raw IP addresses are never stored.
 * Returns true when the request is allowed.
 */
export async function rateLimit(env: Env, request: Request, bucket: string, limit: number, windowSec = 3600) {
  const ip = request.headers.get('cf-connecting-ip') ?? 'local';
  const window = Math.floor(Date.now() / 1000 / windowSec);
  const key = `${bucket}:${await sha256(`${env.HASH_SALT ?? 'pag'}|${ip}|${window}`)}`;
  const expires = (window + 1) * windowSec;
  const row = await env.DB.prepare(
    `INSERT INTO rate_limits (key, count, expires_at) VALUES (?, 1, ?)
     ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count`,
  ).bind(key, expires).first<{ count: number }>();
  // Opportunistic clean-up of expired windows.
  if (Math.random() < 0.05) await env.DB.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(Math.floor(Date.now() / 1000)).run();
  return (row?.count ?? 1) <= limit;
}
