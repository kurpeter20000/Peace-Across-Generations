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

// ---- Dropdown menus (About, Campaigns & Stories) ----
const subToggles = [...document.querySelectorAll<HTMLButtonElement>('[data-sub-toggle]')];
const closeSubs = (except?: HTMLButtonElement) =>
  subToggles.forEach((b) => b !== except && b.setAttribute('aria-expanded', 'false'));
subToggles.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = btn.getAttribute('aria-expanded') !== 'true';
    closeSubs(btn);
    btn.setAttribute('aria-expanded', String(open));
  });
});
document.addEventListener('click', (e) => {
  if (!(e.target as Element | null)?.closest('[data-sub]')) closeSubs();
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = subToggles.find((b) => b.getAttribute('aria-expanded') === 'true');
  if (open) { closeSubs(); open.focus(); }
});

// ---- Gentle fade-in of sections as they scroll into view ----
const reveals = document.querySelectorAll<HTMLElement>('.reveal');
if (reveals.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

// ---- Live countdown (days, hours, minutes, seconds) ----
document.querySelectorAll<HTMLElement>('[data-countdown]').forEach((box) => {
  const end = Date.parse(box.dataset.end!);
  const start = Date.parse(box.dataset.start!);
  const out = (k: string) => box.querySelector<HTMLElement>(`[data-cd="${k}"]`);
  const bar = box.querySelector<HTMLElement>('[data-cd-bar]');
  const tick = () => {
    const now = Date.now();
    const left = Math.max(0, end - now);
    const d = Math.floor(left / 86_400_000);
    const set = (k: string, v: string) => { const el = out(k); if (el && el.textContent !== v) el.textContent = v; };
    set('days', d.toLocaleString('en-GB'));
    set('hours', String(Math.floor(left / 3_600_000) % 24).padStart(2, '0'));
    set('minutes', String(Math.floor(left / 60_000) % 60).padStart(2, '0'));
    set('seconds', String(Math.floor(left / 1000) % 60).padStart(2, '0'));
    if (bar) bar.style.width = `${Math.min(100, Math.max(0.6, ((now - start) / (end - start)) * 100))}%`;
  };
  tick();
  setInterval(tick, 1000);
});

// ---- Pause button for the moving networks strip ----
document.querySelectorAll<HTMLButtonElement>('[data-marquee-toggle]').forEach((btn) => {
  const strip = btn.closest('.networks')?.querySelector<HTMLElement>('[data-marquee]');
  btn.addEventListener('click', () => {
    const paused = !strip?.hasAttribute('data-paused');
    strip?.toggleAttribute('data-paused', paused);
    btn.setAttribute('aria-pressed', String(paused));
    btn.textContent = paused ? 'Play' : 'Pause';
  });
});

// ---- Hero slideshow: cross-fade, auto-advance, pause, arrows, dots ----
document.querySelectorAll<HTMLElement>('[data-slider]').forEach((slider) => {
  const slides = [...slider.querySelectorAll<HTMLElement>('[data-slide]')];
  const dots = [...slider.querySelectorAll<HTMLButtonElement>('[data-slide-dot]')];
  const pauseBtn = slider.querySelector<HTMLButtonElement>('[data-slide-pause]');
  if (slides.length < 2) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer: number | undefined;
  let userPaused = reduce;
  let hoverPaused = false;
  const INTERVAL = 7000;

  // Load a slide's photo from its <template> just before it is needed.
  const ensure = (i: number) => {
    const t = slides[(i + slides.length) % slides.length].querySelector<HTMLTemplateElement>('template[data-slide-img]');
    if (t && !document.documentElement.hasAttribute('data-lowdata')) t.replaceWith(t.content.cloneNode(true));
  };
  const show = (next: number) => {
    index = (next + slides.length) % slides.length;
    ensure(index);
    ensure(index + 1);
    slides.forEach((s, i) => {
      const on = i === index;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', String(!on));
      s.toggleAttribute('inert', !on);
    });
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === index)));
  };
  const stop = () => { if (timer) { clearInterval(timer); timer = undefined; } };
  const start = () => {
    stop();
    if (!userPaused && !hoverPaused && !document.hidden) timer = window.setInterval(() => show(index + 1), INTERVAL);
  };
  const setPaused = (p: boolean) => {
    userPaused = p;
    slider.toggleAttribute('data-paused', p);
    if (pauseBtn) {
      pauseBtn.setAttribute('aria-pressed', String(p));
      pauseBtn.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
    }
    start();
  };

  slider.querySelector('[data-slide-prev]')?.addEventListener('click', () => { show(index - 1); start(); });
  slider.querySelector('[data-slide-next]')?.addEventListener('click', () => { show(index + 1); start(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); start(); }));
  pauseBtn?.addEventListener('click', () => setPaused(!userPaused));
  slider.addEventListener('mouseenter', () => { hoverPaused = true; stop(); });
  slider.addEventListener('mouseleave', () => { hoverPaused = false; start(); });
  slider.addEventListener('focusin', () => { hoverPaused = true; stop(); });
  slider.addEventListener('focusout', (e) => { if (!slider.contains(e.relatedTarget as Node)) { hoverPaused = false; start(); } });
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { show(index + 1); }
    if (e.key === 'ArrowLeft') { show(index - 1); }
  });
  // Swipe on phones.
  let x0: number | null = null;
  slider.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) { show(index + (dx < 0 ? 1 : -1)); start(); }
    x0 = null;
  });
  document.addEventListener('visibilitychange', start);

  slider.classList.add('is-ready');
  slides.forEach((s, i) => { s.setAttribute('aria-hidden', String(i !== 0)); s.toggleAttribute('inert', i !== 0); });
  dots.forEach((d, i) => d.setAttribute('aria-current', String(i === 0)));
  // Fetch the second photo once the page has finished loading.
  if (document.readyState === 'complete') ensure(1); else window.addEventListener('load', () => ensure(1), { once: true });
  setPaused(userPaused);
});
