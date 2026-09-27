// GET  /api/admin/submissions/:id — full submission (private details included).
// POST /api/admin/submissions/:id — change status / guardian check / notes.
import type { Ctx } from '../../../_lib/env';
import { audit, now } from '../../../_lib/db';
import { json } from '../../../_lib/http';
import { submissionStatuses, type SubmissionStatus } from '../../../../src/data/forms';

// Allowed moves in the moderation workflow.
const transitions: Record<SubmissionStatus, SubmissionStatus[]> = {
  submitted: ['pending_review', 'rejected'],
  pending_review: ['approved', 'rejected', 'submitted'],
  approved: ['published', 'pending_review', 'rejected'],
  rejected: ['pending_review'],
  published: ['approved'], // "unpublish" after a withdrawal request
};

export const onRequestGet = async ({ params, env }: Ctx) => {
  const row = await env.DB.prepare('SELECT * FROM submissions WHERE id = ?').bind(params.id).first();
  if (!row) return json({ error: 'Not found' }, 404);
  const log = await env.DB.prepare('SELECT at, actor, action, detail FROM audit_log WHERE target = ? ORDER BY id DESC LIMIT 50')
    .bind(params.id).all();
  return json({ submission: row, log: log.results });
};

export const onRequestPost = async ({ params, env, request, data }: Ctx) => {
  const id = String(params.id);
  const actor = String(data.admin);
  const row = await env.DB.prepare('SELECT status, guardian_status FROM submissions WHERE id = ?').bind(id)
    .first<{ status: SubmissionStatus; guardian_status: string }>();
  if (!row) return json({ error: 'Not found' }, 404);

  const body = (await request.json()) as { status?: string; guardian_status?: string; notes?: string; published_url?: string };
  const t = now();

  if (body.guardian_status) {
    if (!['pending', 'verified'].includes(body.guardian_status) || row.guardian_status === 'not_required') {
      return json({ error: 'Invalid guardian status' }, 400);
    }
    await env.DB.prepare('UPDATE submissions SET guardian_status = ?, updated_at = ? WHERE id = ?').bind(body.guardian_status, t, id).run();
    await audit(env, actor, `guardian:${body.guardian_status}`, id);
    row.guardian_status = body.guardian_status;
  }

  if (typeof body.notes === 'string') {
    await env.DB.prepare('UPDATE submissions SET moderator_notes = ?, updated_at = ? WHERE id = ?').bind(body.notes.slice(0, 5000), t, id).run();
    await audit(env, actor, 'notes', id);
  }

  if (body.status) {
    const next = body.status as SubmissionStatus;
    if (!(submissionStatuses as readonly string[]).includes(next) || !transitions[row.status].includes(next)) {
      return json({ error: `Cannot move from ${row.status} to ${next}` }, 400);
    }
    if ((next === 'approved' || next === 'published') && row.guardian_status === 'pending') {
      return json({ error: 'Guardian consent must be verified before approving a contribution from someone under 18.' }, 400);
    }
    const url = typeof body.published_url === 'string' ? body.published_url.slice(0, 300) : null;
    if (next === 'published' && !url) return json({ error: 'Add the published page address first.' }, 400);
    await env.DB.prepare(
      `UPDATE submissions SET status = ?, updated_at = ?, reviewed_by = ?, reviewed_at = ?,
         published_url = CASE WHEN ? IS NOT NULL THEN ? ELSE published_url END WHERE id = ?`,
    ).bind(next, t, actor, t, url, url, id).run();
    await audit(env, actor, `status:${next}`, id, url ?? undefined);
  }

  return json({ ok: true });
};
