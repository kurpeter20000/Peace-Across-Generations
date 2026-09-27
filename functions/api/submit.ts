// POST /api/submit — "Share your voice" contributions.
// Nothing is ever published automatically: every submission starts as
// "submitted" and waits for the team in the moderation queue (/admin).
import type { Ctx } from '../_lib/env';
import { ensureSchema, newId, now } from '../_lib/db';
import { backWithError, checked, field, isEmail, isHttpUrl, looksLikeBot, rateLimit, sameOrigin, seeOther } from '../_lib/http';
import { ageRanges, contributionTypes, upload } from '../../src/data/forms';

const FORM_PATH = '/take-action/share-your-voice/';

export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 });
  if (!env.DB || !env.UPLOADS) return backWithError(request, FORM_PATH, 'unavailable');
  const len = Number(request.headers.get('content-length') ?? 0);
  if (len > upload.maxBytes + 1024 * 1024) return backWithError(request, FORM_PATH, 'file-too-large');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return backWithError(request, FORM_PATH, 'invalid');
  }
  // Pretend success to bots so they don't retry.
  if (looksLikeBot(form)) return seeOther(request, `${FORM_PATH}thanks/`);

  await ensureSchema(env);
  if (!(await rateLimit(env, request, 'submit', 10))) return backWithError(request, FORM_PATH, 'too-many');

  const d = {
    fullName: field(form, 'full_name', 120),
    displayName: field(form, 'display_name', 120),
    anonymous: checked(form, 'anonymous'),
    email: field(form, 'email', 254),
    phone: field(form, 'phone', 40),
    country: field(form, 'country', 80),
    region: field(form, 'region', 80),
    city: field(form, 'city', 80),
    ageRange: field(form, 'age_range', 20),
    type: field(form, 'contribution_type', 40),
    campaign: field(form, 'campaign', 120),
    title: field(form, 'title', 200),
    message: field(form, 'message', 8000),
    language: field(form, 'language', 80),
    link: field(form, 'link_url', 500),
    social: field(form, 'social_handle', 120),
    mayTag: checked(form, 'may_tag'),
    consent: checked(form, 'consent'),
    ownWork: checked(form, 'own_work'),
    guardianName: field(form, 'guardian_name', 120),
    guardianContact: field(form, 'guardian_contact', 254),
    guardianConsent: checked(form, 'guardian_consent'),
    safety: field(form, 'safety_note', 1000),
  };

  const required = [d.fullName, d.email, d.country, d.ageRange, d.type, d.title, d.message];
  if (required.some((v) => !v)) return backWithError(request, FORM_PATH, 'missing');
  if (!isEmail(d.email)) return backWithError(request, FORM_PATH, 'email');
  if (!ageRanges.some((a) => a.value === d.ageRange)) return backWithError(request, FORM_PATH, 'invalid');
  if (!contributionTypes.some((t) => t.value === d.type)) return backWithError(request, FORM_PATH, 'invalid');
  if (!d.consent || !d.ownWork) return backWithError(request, FORM_PATH, 'consent');
  if (d.link && !isHttpUrl(d.link)) return backWithError(request, FORM_PATH, 'link');

  const minor = d.ageRange === 'under-18';
  if (minor && (!d.guardianName || !d.guardianContact || !d.guardianConsent)) return backWithError(request, FORM_PATH, 'guardian');

  const id = newId();

  // Optional file → private R2 bucket (never publicly readable).
  let file: { key: string; name: string; type: string; size: number } | null = null;
  const f = form.get('file');
  if (f && typeof f !== 'string' && f.size > 0) {
    if (f.size > upload.maxBytes) return backWithError(request, FORM_PATH, 'file-too-large');
    const ext = (f.name.split('.').pop() ?? '').toLowerCase();
    if (!(upload.extensions as readonly string[]).includes(ext)) return backWithError(request, FORM_PATH, 'file-type');
    const safeName = f.name.replace(/[^\w.\- ]+/g, '_').slice(-100);
    const key = `submissions/${id}/${crypto.randomUUID()}.${ext}`;
    await env.UPLOADS.put(key, f.stream(), {
      httpMetadata: { contentType: 'application/octet-stream' },
      customMetadata: { originalName: safeName, declaredType: f.type.slice(0, 100), submission: id },
    });
    file = { key, name: safeName, type: f.type.slice(0, 100), size: f.size };
  }

  if (!file && !d.link && d.message.length < 20) return backWithError(request, FORM_PATH, 'empty');

  const t = now();
  await env.DB.prepare(
    `INSERT INTO submissions (id, created_at, updated_at, status, full_name, display_name, anonymous, email, phone,
      country, region, city, age_range, contribution_type, campaign, title, message, language, link_url,
      file_key, file_name, file_type, file_size, social_handle, may_tag, consent, own_work,
      guardian_name, guardian_contact, guardian_consent, guardian_status, safety_note)
     VALUES (?, ?, ?, 'submitted', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id, t, t, d.fullName, d.displayName || null, d.anonymous ? 1 : 0, d.email, d.phone || null,
      d.country, d.region || null, d.city || null, d.ageRange, d.type, d.campaign || null, d.title, d.message,
      d.language || null, d.link || null, file?.key ?? null, file?.name ?? null, file?.type ?? null, file?.size ?? null,
      d.social || null, d.mayTag ? 1 : 0, 1, 1,
      minor ? d.guardianName : null, minor ? d.guardianContact : null, minor ? 1 : 0,
      minor ? 'pending' : 'not_required', d.safety || null,
    )
    .run();

  return seeOther(request, `${FORM_PATH}thanks/?ref=${id}`);
};
