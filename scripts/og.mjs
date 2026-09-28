// Generates a share image (1200×630, ≤100 KB) for every indexable page in
// dist/, from the page's og:title. Runs after `astro build` (npm run build).
// WhatsApp link previews are the main sharing channel, so every page gets one.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

const DIST = 'dist';
// Domain shown on the image, read from astro.config.mjs (SITE).
const HOST = readFileSync('astro.config.mjs', 'utf8').match(/const SITE = '([^']+)'/)?.[1].replace(/^https?:\/\//, '') ?? '';
const font = (w) => readFileSync(`node_modules/@fontsource/poppins/files/poppins-latin-${w}-normal.woff`);
const fonts = [
  { name: 'Poppins', data: font(400), weight: 400, style: 'normal' },
  { name: 'Poppins', data: font(600), weight: 600, style: 'normal' },
  { name: 'Poppins', data: font(700), weight: 700, style: 'normal' },
];

const trimmed = await sharp('public/brand/pag-logo.png').trim().resize({ width: 520 }).png().toBuffer({ resolveWithObject: true });
const logo = `data:image/png;base64,${trimmed.data.toString('base64')}`;
const logoH = Math.round((trimmed.info.height / trimmed.info.width) * 520);

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === '_astro' || name === 'og') continue;
      yield* htmlFiles(p);
    } else if (name === 'index.html') yield p;
  }
}

const h = (type, style, children) => ({ type, props: { style, children } });

async function render(title, eyebrow) {
  const size = title.length > 70 ? 50 : title.length > 42 ? 58 : 68;
  const tree = h('div', { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: '#EAF4FD', fontFamily: 'Poppins' }, [
    h('div', { display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '56px 72px 0' }, [
      { type: 'img', props: { src: logo, width: 520 * 0.62, height: logoH * 0.62, style: { marginBottom: 36 } } },
      eyebrow
        ? h('div', { fontSize: 24, fontWeight: 600, color: '#2E7130', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }, eyebrow)
        : null,
      h('div', { fontSize: size, fontWeight: 700, color: '#003366', lineHeight: 1.15, display: 'flex' }, title),
    ].filter(Boolean)),
    h('div', { height: 10, background: '#2E7130', display: 'flex' }, []),
    h('div', { height: 74, background: '#003366', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 72px', color: '#ffffff', fontSize: 26, fontWeight: 600 }, [
      h('div', { display: 'flex' }, 'Independent · Youth-led · Non-partisan'),
      h('div', { display: 'flex', fontWeight: 400, color: '#cfe0f2' }, HOST),
    ]),
  ]);
  const svg = await satori(tree, { width: 1200, height: 630, fonts });
  return sharp(Buffer.from(svg)).png({ palette: true, quality: 90, compressionLevel: 9, effort: 8 }).toBuffer();
}

let count = 0;
let biggest = 0;
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  if (/<meta name="robots" content="noindex/.test(html)) continue;
  const rel = relative(DIST, dirname(file)).split(sep).join('/');
  const path = rel || 'index';
  let title = decode(html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] ?? 'Peace Across Generations');
  let eyebrow = '';
  if (path === 'index') title = 'Every generation inherits something. We can decide what we pass on.';
  else if (path.startsWith('campaigns/')) eyebrow = 'Campaign';
  else if (path.startsWith('stories/')) eyebrow = 'Stories & Voices';
  else if (path.startsWith('blog/')) eyebrow = 'Blog';
  else if (path.startsWith('programmes/')) eyebrow = 'Programme';
  else if (path.startsWith('take-action/')) eyebrow = 'Take action';
  title = title.replace(/ — (campaign|this month’s campaign)$/, '');
  const png = await render(title, eyebrow);
  const out = join(DIST, 'og', `${path}.png`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, png);
  biggest = Math.max(biggest, png.length);
  count++;
}
console.log(`[og] ${count} share images written to dist/og (largest ${Math.round(biggest / 1024)} KB)`);
if (biggest > 100 * 1024) console.warn('[og] WARNING: a share image is over the 100 KB budget');
