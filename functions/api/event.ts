// POST /api/event — privacy-friendly counters for CTA clicks, video plays and
// form starts. Stores only (day, event name, page path, count): no cookies,
// no IP addresses, no user identifiers.
import type { Ctx } from '../_lib/env';
import { ensureSchema } from '../_lib/db';

const ALLOWED = /^[a-z0-9][a-z0-9:_-]{0,60}$/;

export const onRequestPost = async ({ request, env }: Ctx) => {
  try {
    const body = (await request.json()) as { e?: string; p?: string };
    const name = String(body.e ?? '');
    const path = String(body.p ?? '/').slice(0, 200);
    if (!env.DB || !ALLOWED.test(name) || !path.startsWith('/')) return new Response(null, { status: 204 });
    await ensureSchema(env);
    await env.DB.prepare(
      `INSERT INTO event_counts (day, name, path, count) VALUES (?, ?, ?, 1)
       ON CONFLICT(day, name, path) DO UPDATE SET count = count + 1`,
    )
      .bind(new Date().toISOString().slice(0, 10), name, path)
      .run();
  } catch {
    /* counting must never break the page */
  }
  return new Response(null, { status: 204 });
};
