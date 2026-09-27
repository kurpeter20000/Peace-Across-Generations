// GET  /api/admin/enquiries — volunteer / contributor / partner / contact messages.
// POST /api/admin/enquiries — { id, status: new|in_progress|closed, notes? }
import type { Ctx } from '../../_lib/env';
import { audit } from '../../_lib/db';
import { json } from '../../_lib/http';

export const onRequestGet = async ({ env }: Ctx) => {
  const rows = await env.DB.prepare('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 300').all();
  return json({ enquiries: rows.results });
};

export const onRequestPost = async ({ env, request, data }: Ctx) => {
  const b = (await request.json()) as { id?: string; status?: string; notes?: string };
  if (!b.id || !['new', 'in_progress', 'closed'].includes(String(b.status))) return json({ error: 'Invalid' }, 400);
  await env.DB.prepare('UPDATE enquiries SET status = ?, notes = COALESCE(?, notes) WHERE id = ?')
    .bind(b.status, typeof b.notes === 'string' ? b.notes.slice(0, 5000) : null, b.id).run();
  await audit(env, String(data.admin), `enquiry:${b.status}`, b.id);
  return json({ ok: true });
};
