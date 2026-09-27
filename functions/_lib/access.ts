import type { Env } from './env';

// Verifies the Cloudflare Access JWT that Access adds to every request it lets
// through to /admin and /api/admin. Fails closed: if Access is not configured,
// nobody gets in (except localhost with DEV_ADMIN=1 during development).

type Jwk = JsonWebKey & { kid: string };
let certCache: { at: number; keys: Jwk[] } | null = null;

const b64urlToBytes = (s: string) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
};
const b64urlToJson = (s: string) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));

async function keys(team: string): Promise<Jwk[]> {
  if (certCache && Date.now() - certCache.at < 3600_000) return certCache.keys;
  const res = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error('Could not load Access certificates');
  const body = (await res.json()) as { keys: Jwk[] };
  certCache = { at: Date.now(), keys: body.keys };
  return body.keys;
}

/** Returns the signed-in administrator's email, or null. */
export async function adminEmail(request: Request, env: Env): Promise<string | null> {
  const url = new URL(request.url);
  if (env.DEV_ADMIN === '1' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) return 'dev@localhost';
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null;

  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token) return null;
  const [h, p, s] = token.split('.');
  if (!h || !p || !s) return null;
  try {
    const header = b64urlToJson(h) as { kid: string; alg: string };
    const payload = b64urlToJson(p) as { aud: string | string[]; exp: number; nbf?: number; email?: string; iss?: string };
    if (header.alg !== 'RS256') return null;
    const jwk = (await keys(env.ACCESS_TEAM_DOMAIN)).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(s), new TextEncoder().encode(`${h}.${p}`));
    if (!ok) return null;
    const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    const nowSec = Date.now() / 1000;
    if (!aud.includes(env.ACCESS_AUD)) return null;
    if (payload.exp < nowSec || (payload.nbf && payload.nbf > nowSec + 60)) return null;
    if (payload.iss && payload.iss !== `https://${env.ACCESS_TEAM_DOMAIN}.cloudflareaccess.com`) return null;
    return payload.email ?? 'service-token';
  } catch {
    return null;
  }
}
