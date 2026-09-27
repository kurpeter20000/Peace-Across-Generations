// Every /api/admin/* request must carry a valid Cloudflare Access identity.
import type { Ctx } from '../../_lib/env';
import { adminEmail } from '../../_lib/access';
import { ensureSchema } from '../../_lib/db';
import { json } from '../../_lib/http';

export const onRequest = async (ctx: Ctx) => {
  const email = await adminEmail(ctx.request, ctx.env);
  if (!email) return json({ error: 'Not authorised. Sign in through Cloudflare Access.' }, 401);
  if (ctx.request.method !== 'GET' && ctx.request.headers.get('x-pag-admin') !== '1') {
    return json({ error: 'Missing admin header' }, 400); // blocks cross-site form posts
  }
  ctx.data.admin = email;
  await ensureSchema(ctx.env);
  const res = await ctx.next();
  const out = new Response(res.body, res);
  out.headers.set('cache-control', 'no-store');
  out.headers.set('x-robots-tag', 'noindex');
  return out;
};
