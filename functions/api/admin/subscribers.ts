// GET /api/admin/subscribers          — JSON list
// GET /api/admin/subscribers?format=csv — CSV export for a mail tool
// POST /api/admin/subscribers          — { email, status: active|unsubscribed }
import type { Ctx } from '../../_lib/env';
import { audit } from '../../_lib/db';
import { json } from '../../_lib/http';

const csvCell = (v: unknown) => {
  const s = String(v ?? '');
  // Neutralise spreadsheet formula injection.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

export const onRequestGet = async ({ env, request, data }: Ctx) => {
  const rows = await env.DB.prepare('SELECT created_at, email, name, country, source, status FROM subscribers ORDER BY created_at DESC').all();
  if (new URL(request.url).searchParams.get('format') === 'csv') {
    await audit(env, String(data.admin), 'subscribers:export', 'subscribers');
    const cols = ['created_at', 'email', 'name', 'country', 'source', 'status'];
    const body = [cols.join(','), ...rows.results.map((r) => cols.map((c) => csvCell((r as Record<string, unknown>)[c])).join(','))].join('\r\n');
    return new Response(body, {
      headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="pag-subscribers.csv"' },
    });
  }
  return json({ subscribers: rows.results });
};

export const onRequestPost = async ({ env, request, data }: Ctx) => {
  const b = (await request.json()) as { email?: string; status?: string };
  if (!b.email || !['active', 'unsubscribed'].includes(String(b.status))) return json({ error: 'Invalid' }, 400);
  await env.DB.prepare('UPDATE subscribers SET status = ? WHERE email = ?').bind(b.status, b.email.toLowerCase()).run();
  await audit(env, String(data.admin), `subscriber:${b.status}`, b.email);
  return json({ ok: true });
};
