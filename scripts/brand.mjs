// Generates optimised brand assets from public/brand/pag-logo.png (the full
// lock-up: dove symbol + wordmark + tagline) and public/brand/pag-icon.png
// (the dove symbol alone, used for favicons/app icons/social image).
// Run with: npm run brand
import sharp from 'sharp';
import { existsSync } from 'node:fs';

const src = 'public/brand/pag-logo.png';
const trimmed = await sharp(src).trim({ threshold: 5 }).toBuffer({ resolveWithObject: true });
console.log('trimmed logo', trimmed.info.width, 'x', trimmed.info.height);

// Header lock-up: 2x of ~200 px display width
for (const w of [400]) {
  const out = `public/brand/pag-logo-${w}.webp`;
  const info = await sharp(trimmed.data).resize({ width: w }).webp({ quality: 70, effort: 6 }).toFile(out);
  console.log(out, info.size, 'bytes');
  const png = `public/brand/pag-logo-${w}.png`;
  const pinfo = await sharp(trimmed.data).resize({ width: w }).png({ compressionLevel: 9, palette: true }).toFile(png);
  console.log(png, pinfo.size, 'bytes');
}

// Symbol (the dove) comes from its own dedicated file when present — far more
// reliable than cropping it out of the full lock-up — falling back to the
// left ~33.5% of the trimmed lock-up if no dedicated icon file exists.
const iconSrc = 'public/brand/pag-icon.png';
const symbol = existsSync(iconSrc)
  ? await sharp(iconSrc).trim({ threshold: 5 }).toBuffer({ resolveWithObject: true })
  : await (async () => {
      const { width, height } = trimmed.info;
      const symW = Math.round(width * 0.335);
      return sharp(trimmed.data).extract({ left: 0, top: 0, width: symW, height }).trim({ threshold: 5 }).toBuffer({ resolveWithObject: true });
    })();
const side = Math.max(symbol.info.width, symbol.info.height);
const pad = Math.round(side * 0.06);
const square = await sharp(symbol.data)
  .resize({ width: side, height: side, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: '#ffffff' })
  .png()
  .toBuffer();
for (const [size, name] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png']]) {
  const info = await sharp(square).resize(size, size).png({ compressionLevel: 9, palette: size > 32 }).toFile(`public/${name}`);
  console.log(name, info.size, 'bytes');
}

// Default Open Graph image (1200×630, ≤ 100 KB): logo + tagline on white.
const logoForOg = await sharp(trimmed.data).resize({ width: 760 }).png().toBuffer();
const ogText = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect y="570" width="1200" height="60" fill="#0F305F"/>
  <rect y="562" width="1200" height="8" fill="#318226"/>
  <text x="600" y="470" text-anchor="middle" font-family="Lora, Georgia, serif" font-weight="600" font-size="44" fill="#0F305F">Every Voice. Every Generation. One Peace.</text>
</svg>`);
const og = await sharp(ogText)
  .composite([{ input: logoForOg, top: 90, left: 220 }])
  .png({ palette: true, compressionLevel: 9 })
  .toFile('public/og-default.png');
console.log('og-default.png', og.size, 'bytes');
