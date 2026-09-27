// The only site-wide JavaScript: menu, low-data toggle, email links,
// day counter refresh and video facades. Everything works without it.
import { commitmentDay, fmt } from '../lib/day';

const root = document.documentElement;

// ---- Mobile menu ----
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.getElementById('site-menu');
if (menuBtn && menu) {
  const setOpen = (open: boolean) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.toggleAttribute('data-open', open);
  };
  menuBtn.addEventListener('click', () => setOpen(menuBtn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      menuBtn.focus();
    }
  });
}

// ---- Low-data mode ----
const ldBtn = document.querySelector<HTMLButtonElement>('[data-lowdata-toggle]');
if (ldBtn) {
  const sync = () => {
    const on = root.getAttribute('data-lowdata') === 'on';
    ldBtn.setAttribute('aria-pressed', String(on));
    const state = ldBtn.querySelector('[data-state]');
    if (state) state.textContent = on ? 'On' : 'Off';
  };
  sync();
  ldBtn.addEventListener('click', () => {
    const on = root.getAttribute('data-lowdata') !== 'on';
    if (on) root.setAttribute('data-lowdata', 'on');
    else root.removeAttribute('data-lowdata');
    try { localStorage.setItem('pag-lowdata', on ? 'on' : 'off'); } catch { /* storage unavailable */ }
    sync();
  });
}

// ---- Email links (obfuscated in the HTML) ----
document.querySelectorAll<HTMLAnchorElement>('a[data-eu]').forEach((a) => {
  const address = `${a.dataset.eu}@${a.dataset.ed}`;
  const params: string[] = [];
  if (a.dataset.subject) params.push(`subject=${encodeURIComponent(a.dataset.subject)}`);
  if (a.dataset.body) params.push(`body=${encodeURIComponent(a.dataset.body)}`);
  a.href = `mailto:${address}${params.length ? `?${params.join('&')}` : ''}`;
  if (a.hasAttribute('data-show-address')) {
    const span = a.querySelector('span');
    if (span) span.textContent = address;
  }
});

// ---- Day counter (in case the page was built on an earlier day) ----
const s = commitmentDay();
document.querySelectorAll<HTMLElement>('[data-daycounter="inline"]').forEach((el) => {
  el.textContent =
    s.kind === 'before' ? 'Begins 21 September 2026'
    : s.kind === 'after' ? '3,000 days completed'
    : `Day ${fmt(s.day)} of 3,000 Days for Peace`;
});
if (s.kind === 'during') {
  document.querySelectorAll<HTMLElement>('[data-dc-day]').forEach((el) => (el.textContent = fmt(s.day)));
  document.querySelectorAll<HTMLElement>('[data-dc-togo]').forEach((el) => (el.textContent = fmt(s.daysToGo)));
  document.querySelectorAll<SVGRectElement>('[data-dc-bar]').forEach((el) => el.setAttribute('width', String(Math.max(s.percent, 0.6))));
}

// ---- Video facades: load the embed only when asked ----
document.querySelectorAll<HTMLButtonElement>('[data-video-embed]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = btn.dataset.videoEmbed!;
    iframe.title = btn.dataset.videoTitle ?? 'Video';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.className = 'video-frame';
    btn.replaceWith(iframe);
  });
});

// ---- Privacy-friendly counters (no cookies, no identifiers) ----
const track = (e: string) => {
  try {
    const body = JSON.stringify({ e, p: location.pathname });
    if (!navigator.sendBeacon?.('/api/event', new Blob([body], { type: 'application/json' }))) {
      fetch('/api/event', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => {});
    }
  } catch { /* never break the page */ }
};
document.addEventListener('click', (ev) => {
  const el = (ev.target as Element | null)?.closest<HTMLElement>('[data-track]');
  if (el?.dataset.track) track(el.dataset.track);
  if ((ev.target as Element | null)?.closest('[data-video-embed]')) track('video:play');
});

// ---- Forms ----
const errors: Record<string, string> = {
  missing: 'Please fill in all the required fields.',
  email: 'Please check your email address.',
  consent: 'Please tick the consent boxes so we can review your contribution.',
  guardian: 'Because you are under 18, we need your parent or guardian’s name, their phone or email, and their agreement.',
  'file-too-large': 'Your file is too large (50 MB maximum). Please send a link, or use WhatsApp instead.',
  'file-type': 'That file type isn’t accepted. Please send a photo, audio, video, PDF or document.',
  link: 'Please check the link. It should start with https://',
  empty: 'Please add your message, a file or a link.',
  'too-many': 'Too many attempts from this connection. Please try again in an hour.',
  invalid: 'Something went wrong. Please try again.',
  'no-uploads': 'File uploads aren’t switched on yet. Please paste a link to your work (YouTube, Google Drive) or send the file by WhatsApp or email.',
  unavailable: 'Our online form isn’t switched on yet. Please send your work or message by WhatsApp or email for now — sorry!',
};
const params = new URLSearchParams(location.search);
const errCode = params.get('error');
document.querySelectorAll<HTMLFormElement>('form').forEach((form) => {
  const started = form.querySelector<HTMLInputElement>('[data-form-started]');
  if (started) started.value = String(Date.now());
  if (errCode) {
    const box = form.querySelector<HTMLElement>('[data-form-error]');
    if (box && (form.id === location.hash.slice(1) || form.closest('#form') || !form.id)) {
      box.textContent = errors[errCode] ?? errors.invalid;
      box.hidden = false;
    }
  }
  form.addEventListener('submit', (ev) => {
    const file = form.querySelector<HTMLInputElement>('input[type="file"][data-max-bytes]');
    const max = Number(file?.dataset.maxBytes ?? 0);
    if (file?.files?.[0] && max && file.files[0].size > max) {
      ev.preventDefault();
      const box = form.querySelector<HTMLElement>('[data-form-error]');
      if (box) { box.textContent = errors['file-too-large']; box.hidden = false; box.scrollIntoView({ block: 'center' }); }
      return;
    }
    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    if (form.dataset.trackForm) track(`form:${form.dataset.trackForm}`);
  });
});

// Guardian section: shown only for under-18s (always shown without JavaScript).
const age = document.querySelector<HTMLSelectElement>('[data-age]');
const guardian = document.querySelector<HTMLElement>('[data-guardian]');
if (age && guardian) {
  const syncGuardian = () => {
    const minor = age.value === 'under-18';
    guardian.hidden = !minor;
    guardian.querySelectorAll<HTMLInputElement>('[data-guardian-required]').forEach((i) => (i.required = minor));
  };
  age.addEventListener('change', syncGuardian);
  syncGuardian();
}

// Pre-select a campaign from ?campaign=<slug>.
const campaignSelect = document.querySelector<HTMLSelectElement>('[data-campaign-select]');
const wanted = params.get('campaign');
if (campaignSelect && wanted && [...campaignSelect.options].some((o) => o.value === wanted)) campaignSelect.value = wanted;

// Show the submission reference on the thank-you page.
const ref = params.get('ref');
const refBox = document.querySelector<HTMLElement>('[data-show-ref]');
if (ref && refBox && /^PAG-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(ref)) {
  refBox.querySelector('[data-ref]')!.textContent = ref;
  refBox.hidden = false;
}
