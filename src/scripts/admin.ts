// Admin dashboard. All user-submitted text is inserted with textContent,
// never innerHTML, so a submission can never run code in an admin's browser.

type Row = Record<string, unknown>;
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;

const api = async (path: string, body?: unknown) => {
  const res = await fetch(`/api/admin/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'content-type': 'application/json', 'x-pag-admin': '1' } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  });
  const data = (await res.json().catch(() => ({}))) as Row;
  if (!res.ok) throw new Error(String(data.error ?? `Request failed (${res.status})`));
  return data;
};

const el = (tag: string, text?: unknown, cls?: string) => {
  const e = document.createElement(tag);
  if (text !== undefined && text !== null) e.textContent = String(text);
  if (cls) e.className = cls;
  return e;
};
const when = (iso: unknown) => (iso ? new Date(String(iso)).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '');
const statusPill = (s: unknown) => el('span', String(s).replace('_', ' '), `status status--${s}`);
const showError = (msg: string) => { const b = $('[data-admin-error]'); b.textContent = msg; b.hidden = false; };
const clearError = () => { $('[data-admin-error]').hidden = true; };

// ---------- Submissions ----------
let statusFilter = '';
let selected: string | null = null;
const transitions: Record<string, [string, string][]> = {
  submitted: [['pending_review', 'Start review'], ['rejected', 'Reject']],
  pending_review: [['approved', 'Approve'], ['rejected', 'Reject'], ['submitted', 'Back to submitted']],
  approved: [['published', 'Mark as published'], ['pending_review', 'Back to review'], ['rejected', 'Reject']],
  rejected: [['pending_review', 'Reopen']],
  published: [['approved', 'Unpublish (withdrawn)']],
};

async function loadSubmissions() {
  const data = await api(`submissions${statusFilter ? `?status=${statusFilter}` : ''}`);
  $('[data-admin-who]').textContent = `Signed in as ${data.admin}`;
  const counts = Object.fromEntries(((data.counts as Row[]) ?? []).map((c) => [c.status, c.n]));
  document.querySelectorAll<HTMLButtonElement>('[data-status]').forEach((b) => {
    const s = b.dataset.status!;
    const n = s ? counts[s] ?? 0 : Object.values(counts).reduce((a: number, v) => a + Number(v), 0);
    b.textContent = `${s ? s.replace('_', ' ') : 'All'} (${n})`;
  });
  const tbody = $('[data-sub-list]');
  tbody.replaceChildren();
  const rows = data.submissions as Row[];
  if (!rows.length) {
    const tr = el('tr'); const td = el('td', 'Nothing here yet.'); (td as HTMLTableCellElement).colSpan = 4; tr.append(td); tbody.append(tr);
  }
  for (const r of rows) {
    const tr = el('tr');
    tr.dataset.id = String(r.id);
    tr.tabIndex = 0;
    if (r.id === selected) tr.setAttribute('aria-current', 'true');
    const title = el('td');
    title.append(el('strong', r.title), el('br'), el('small', `${r.shown_as} · ${r.country}${r.guardian_status === 'pending' ? ' · under 18: guardian check needed' : ''}`));
    const st = el('td'); st.append(statusPill(r.status));
    tr.append(el('td', when(r.created_at)), title, el('td', r.contribution_type), st);
    const open = () => openSubmission(String(r.id));
    tr.addEventListener('click', open);
    tr.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
    tbody.append(tr);
  }
}

async function openSubmission(id: string) {
  selected = id;
  document.querySelectorAll('[data-sub-list] tr').forEach((tr) => tr.toggleAttribute('aria-current', (tr as HTMLElement).dataset.id === id));
  const { submission: s, log } = (await api(`submissions/${id}`)) as { submission: Row; log: Row[] };
  const box = $('[data-sub-detail]');
  box.hidden = false;
  box.replaceChildren();
  const h = el('h2', s.title); const p = el('p'); p.append(statusPill(s.status), document.createTextNode(`  Ref ${s.id}`));
  box.append(h, p);

  if (s.guardian_status === 'pending') {
    box.append(el('p', 'Under 18: contact the parent or guardian and confirm consent before approving.', 'warn'));
  }

  const kv = el('dl', undefined, 'kv');
  const add = (k: string, v: unknown) => { if (v !== null && v !== undefined && v !== '') kv.append(el('dt', k), el('dd', v)); };
  add('Received', when(s.created_at));
  add('Full name (private)', s.full_name);
  add('Show as', s.anonymous ? 'Anonymous' : s.display_name || s.full_name);
  add('Email (private)', s.email);
  add('Phone (private)', s.phone);
  add('Location', [s.city && `${s.city} (private)`, s.region, s.country].filter(Boolean).join(', '));
  add('Age range', s.age_range);
  add('Guardian', s.guardian_name ? `${s.guardian_name} — ${s.guardian_contact} (${s.guardian_status})` : null);
  add('Type', s.contribution_type);
  add('Campaign', s.campaign);
  add('Language', s.language);
  add('Message', s.message);
  add('Link', s.link_url);
  add('Social handle', s.social_handle);
  add('May tag', s.may_tag ? 'Yes' : 'No');
  add('Safety note', s.safety_note);
  add('Reviewed', s.reviewed_by ? `${s.reviewed_by}, ${when(s.reviewed_at)}` : null);
  add('Published at', s.published_url);
  box.append(kv);

  if (s.file_name) {
    const a = el('a', `Download file: ${s.file_name} (${Math.round(Number(s.file_size) / 1024)} KB)`) as HTMLAnchorElement;
    a.href = `/api/admin/file/${encodeURIComponent(String(s.id))}`;
    const fp = el('p'); fp.append(a); box.append(fp);
    box.append(el('p', 'Open downloaded files with care. Check photos for faces of children, locations and weapons before publishing.', 'muted'));
  }

  const actions = el('div', undefined, 'actions');
  if (s.guardian_status === 'pending' || s.guardian_status === 'verified') {
    const next = s.guardian_status === 'pending' ? 'verified' : 'pending';
    const b = el('button', next === 'verified' ? 'Guardian consent verified' : 'Mark guardian check as pending', 'mini');
    b.addEventListener('click', () => update(id, { guardian_status: next }));
    actions.append(b);
  }
  let urlInput: HTMLInputElement | null = null;
  if (s.status === 'approved') {
    urlInput = el('input') as HTMLInputElement;
    urlInput.type = 'text';
    urlInput.placeholder = 'Published page address, e.g. /stories/my-letter/';
    urlInput.value = String(s.published_url ?? '');
    box.append(urlInput);
  }
  for (const [next, label] of transitions[String(s.status)] ?? []) {
    const b = el('button', label, 'mini');
    b.addEventListener('click', () => update(id, { status: next, published_url: urlInput?.value || undefined }));
    actions.append(b);
  }
  box.append(actions);

  const notes = el('textarea') as HTMLTextAreaElement;
  notes.rows = 4;
  notes.value = String(s.moderator_notes ?? '');
  notes.setAttribute('aria-label', 'Moderator notes');
  const save = el('button', 'Save notes', 'mini');
  save.addEventListener('click', () => update(id, { notes: notes.value }));
  box.append(el('h3', 'Moderator notes (private)'), notes, save);

  if (log.length) {
    box.append(el('h3', 'History'));
    const ul = el('ul');
    for (const l of log) ul.append(el('li', `${when(l.at)} — ${l.actor}: ${l.action}${l.detail ? ` (${l.detail})` : ''}`));
    box.append(ul);
  }
}

async function update(id: string, body: Row) {
  try {
    clearError();
    await api(`submissions/${id}`, body);
    await loadSubmissions();
    await openSubmission(id);
  } catch (e) {
    showError((e as Error).message);
  }
}

// ---------- Enquiries ----------
async function loadEnquiries() {
  const { enquiries } = (await api('enquiries')) as { enquiries: Row[] };
  const tbody = $('[data-enq-list]');
  tbody.replaceChildren();
  for (const r of enquiries) {
    const tr = el('tr');
    const sel = el('select') as HTMLSelectElement;
    for (const s of ['new', 'in_progress', 'closed']) { const o = el('option', s.replace('_', ' ')) as HTMLOptionElement; o.value = s; o.selected = r.status === s; sel.append(o); }
    sel.addEventListener('change', () => api('enquiries', { id: r.id, status: sel.value }).catch((e) => showError(e.message)));
    const msg = el('td');
    msg.append(el('div', r.message));
    if (r.interests) msg.append(el('small', `Interests: ${r.interests}`));
    if (r.organisation) msg.append(el('small', ` Organisation: ${r.organisation}`));
    const st = el('td'); st.append(sel);
    tr.append(el('td', when(r.created_at)), el('td', r.type), el('td', `${r.name}${r.country ? ` (${r.country})` : ''}`), el('td', `${r.email}${r.phone ? ` · ${r.phone}` : ''}`), msg, st);
    tbody.append(tr);
  }
  if (!enquiries.length) { const tr = el('tr'); const td = el('td', 'No enquiries yet.') as HTMLTableCellElement; td.colSpan = 6; tr.append(td); tbody.append(tr); }
}

// ---------- Newsletter ----------
async function loadSubscribers() {
  const { subscribers } = (await api('subscribers')) as { subscribers: Row[] };
  $('[data-sub-count]').textContent = String(subscribers.filter((s) => s.status === 'active').length);
  const tbody = $('[data-subs-list]');
  tbody.replaceChildren();
  for (const r of subscribers) {
    const tr = el('tr');
    const btn = el('button', r.status === 'active' ? 'Unsubscribe' : 'Reactivate', 'mini');
    btn.addEventListener('click', async () => {
      await api('subscribers', { email: r.email, status: r.status === 'active' ? 'unsubscribed' : 'active' }).catch((e) => showError(e.message));
      loadSubscribers();
    });
    const st = el('td', `${r.status} `); st.append(btn);
    tr.append(el('td', when(r.created_at)), el('td', r.email), el('td', r.source), st);
    tbody.append(tr);
  }
}

// ---------- Engagement ----------
async function loadStats() {
  const d = (await api('stats')) as { since: string; events: Row[]; subscribers: number; submissions: Row[]; enquiries: Row[] };
  $('[data-stats-since]').textContent = `Since ${d.since}. Counts only — no cookies or personal data.`;
  const ev = $('[data-stats-events]');
  ev.replaceChildren(...(d.events.length ? d.events : [{ name: 'No clicks recorded yet', total: '' }]).map((r) => {
    const tr = el('tr'); tr.append(el('td', r.name), el('td', r.total, 'num')); return tr;
  }));
  const totals = $('[data-stats-totals]');
  const rows: [string, unknown][] = [
    ['Newsletter subscribers', d.subscribers],
    ...d.submissions.map((s) => [`Submissions: ${String(s.status).replace('_', ' ')}`, s.n] as [string, unknown]),
    ...d.enquiries.map((s) => [`Enquiries: ${s.type}`, s.n] as [string, unknown]),
  ];
  totals.replaceChildren(...rows.map(([k, v]) => { const tr = el('tr'); tr.append(el('td', k), el('td', v, 'num')); return tr; }));
}

// ---------- Tabs ----------
const loaders: Record<string, () => Promise<void>> = { submissions: loadSubmissions, enquiries: loadEnquiries, subscribers: loadSubscribers, stats: loadStats };
document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    document.querySelectorAll<HTMLElement>('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== tab.dataset.tab));
    clearError();
    loaders[tab.dataset.tab!]().catch((e) => showError(e.message));
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-status]').forEach((b) => {
  b.addEventListener('click', () => {
    statusFilter = b.dataset.status!;
    document.querySelectorAll('[data-status]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    loadSubmissions().catch((e) => showError(e.message));
  });
});

loadSubmissions().catch((e) => {
  $('[data-admin-who]').textContent = 'Not signed in';
  showError(`${e.message} If this is the live site, make sure Cloudflare Access protects /admin and the ACCESS_TEAM_DOMAIN and ACCESS_AUD settings are set (see README).`);
});
