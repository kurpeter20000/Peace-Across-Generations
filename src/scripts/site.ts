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
