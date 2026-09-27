// POST /api/newsletter — sign-ups are stored privately in D1 and can be
// exported from /admin to any mail tool later.
import type { Ctx } from '../_lib/env';
import { ensureSchema, newId, now } from '../_lib/db';
import { backWithError, checked, field, isEmail, looksLikeBot, rateLimit, sameOrigin, seeOther } from '../_lib/http';

export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 });
  if (!env.DB) return backWithError(request, '/newsletter/', 'unavailable');
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return backWithError(request, '/newsletter/', 'invalid');
  }
  if (looksLikeBot(form)) return seeOther(request, '/newsletter/thanks/');

  await ensureSchema(env);
  if (!(await rateLimit(env, request, 'newsletter', 20))) return backWithError(request, '/newsletter/', 'too-many');

  const email = field(form, 'email', 254).toLowerCase();
  if (!isEmail(email)) return backWithError(request, '/newsletter/', 'email');
  if (!checked(form, 'consent')) return backWithError(request, '/newsletter/', 'consent');

  await env.DB.prepare(
    `INSERT INTO subscribers (id, created_at, email, name, country, source, status) VALUES (?, ?, ?, ?, ?, ?, 'active')
     ON CONFLICT(email) DO UPDATE SET status = 'active'`,
  )
    .bind(newId('SUB'), now(), email, field(form, 'name', 120) || null, field(form, 'country', 80) || null, field(form, 'source', 120) || null)
    .run();

  return seeOther(request, '/newsletter/thanks/');
};
