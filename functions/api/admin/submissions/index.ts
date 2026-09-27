// GET /api/admin/submissions?status=submitted — moderation queue.
import type { Ctx } from '../../../_lib/env';
import { json } from '../../../_lib/http';
import { submissionStatuses } from '../../../../src/data/forms';

export const onRequestGet = async ({ request, env, data }: Ctx) => {
  const status = new URL(request.url).searchParams.get('status');
  const filter = status && (submissionStatuses as readonly string[]).includes(status) ? status : null;
  const rows = await env.DB.prepare(
    `SELECT id, created_at, status, title, contribution_type, campaign, age_range, country, guardian_status,
            CASE WHEN anonymous = 1 THEN 'Anonymous' ELSE COALESCE(display_name, full_name) END AS shown_as,
            file_name IS NOT NULL AS has_file
     FROM submissions ${filter ? 'WHERE status = ?' : ''} ORDER BY created_at DESC LIMIT 200`,
  )
    .bind(...(filter ? [filter] : []))
    .all();
  const counts = await env.DB.prepare('SELECT status, COUNT(*) AS n FROM submissions GROUP BY status').all();
  return json({ admin: data.admin, submissions: rows.results, counts: counts.results });
};
