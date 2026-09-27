// POST /api/enquiry — volunteer, contributor, partner and contact forms.
import type { Ctx } from '../_lib/env';
import { ensureSchema, newId, now } from '../_lib/db';
import { backWithError, checked, field, isEmail, looksLikeBot, rateLimit, sameOrigin, seeOther } from '../_lib/http';
import { enquiryTypes } from '../../src/data/forms';

const pages: Record<(typeof enquiryTypes)[number], string> = {
  volunteer: '/take-action/volunteer/',
  contributor: '/take-action/become-a-contributor/',
  partner: '/take-action/partner/',
  contact: '/contact/',
};

export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 });
  if (!env.DB) return backWithError(request, '/contact/', 'unavailable');
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return backWithError(request, '/contact/', 'invalid');
  }
  const type = field(form, 'type', 20) as (typeof enquiryTypes)[number];
  if (!enquiryTypes.includes(type)) return backWithError(request, '/contact/', 'invalid');
  const page = pages[type];
  if (looksLikeBot(form)) return seeOther(request, `${page}thanks/`);

  await ensureSchema(env);
  if (!(await rateLimit(env, request, 'enquiry', 10))) return backWithError(request, page, 'too-many');

  const name = field(form, 'name', 120);
  const email = field(form, 'email', 254);
  const message = field(form, 'message', 5000);
  if (!name || !email || !message) return backWithError(request, page, 'missing');
  if (!isEmail(email)) return backWithError(request, page, 'email');
  if (!checked(form, 'consent')) return backWithError(request, page, 'consent');

  const interests = form.getAll('interests').filter((v): v is string => typeof v === 'string').map((v) => v.slice(0, 80)).slice(0, 20);

  const id = newId(type.slice(0, 3).toUpperCase());
  await env.DB.prepare(
    `INSERT INTO enquiries (id, created_at, type, name, email, phone, organisation, country, interests, message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, now(), type, name, email, field(form, 'phone', 40) || null, field(form, 'organisation', 160) || null,
      field(form, 'country', 80) || null, interests.length ? interests.join(', ') : null, message)
    .run();

  return seeOther(request, `${page}thanks/`);
};
