// GET /api/admin/stats — engagement counts for the last 30 days.
import type { Ctx } from '../../_lib/env';
import { json } from '../../_lib/http';

export const onRequestGet = async ({ env }: Ctx) => {
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
  const [events, subs, subsByStatus, enquiries] = await Promise.all([
    env.DB.prepare('SELECT name, SUM(count) AS total FROM event_counts WHERE day >= ? GROUP BY name ORDER BY total DESC').bind(since).all(),
    env.DB.prepare("SELECT COUNT(*) AS n FROM subscribers WHERE status = 'active'").first<{ n: number }>(),
    env.DB.prepare('SELECT status, COUNT(*) AS n FROM submissions GROUP BY status').all(),
    env.DB.prepare('SELECT type, COUNT(*) AS n FROM enquiries GROUP BY type').all(),
  ]);
  return json({ since, events: events.results, subscribers: subs?.n ?? 0, submissions: subsByStatus.results, enquiries: enquiries.results });
};
