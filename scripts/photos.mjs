// Turns the original photos in /images (not committed: too large) into
// web-ready copies in src/assets/photos/: rotated upright, max 1600 px,
// all metadata (including GPS location) removed. Astro then makes the
// small AVIF/WebP versions each page needs.
//
// Add a new photo: put it in /images, add a line below, run `npm run photos`.
import { mkdirSync, existsSync } from 'node:fs';
import sharp from 'sharp';

// original file name → web name
export const manifest = {
  '1.png': 'peace-sign-sunset',
  '1745265559254.jpg': 'founder-portrait',
  '2.png': 'peace-watercolour',
  '3.png': 'hands-joined-sunset',
  '4.png': 'hands-together-generations',
  '5.png': 'no-war-sign-fence',
  '6.png': 'children-tug-of-war',
  '7.png': 'young-woman-megaphone',
  '7K1A0952.JPG': 'group-with-booklets',
  '7K1A6071.JPG': 'football-match-1',
  '7K1A6075.JPG': 'football-match-2',
  '7K1A6076.JPG': 'football-match-3',
  '7K1A6082.JPG': 'football-match-4',
  '7K1A6104.JPG': 'football-duel',
  '7K1A6116.JPG': 'football-team-1',
  '7K1A6117.JPG': 'football-team-2',
  '7K1A6118.JPG': 'football-team-3',
  '7K1A6127.JPG': 'football-team-small',
  '7K1A6128.JPG': 'football-team-kneeling-1',
  '7K1A6129.JPG': 'football-team-kneeling-2',
  '8.png': 'peace-in-hands',
  '9.png': 'dove-and-earth',
  'IMG-20241125-WA0043.jpg': 'students-writing',
  'IMG-20241219-WA0026.jpg': 'workshop-room-1',
  'IMG-20241219-WA0027.jpg': 'workshop-room-2',
  'IMG-20241219-WA0031.jpg': 'workshop-discussion',
  'IMG-20241219-WA0034.jpg': 'workshop-room-3',
  'IMG-20241219-WA0035.jpg': 'workshop-group',
  'IMG_20240526_120145.jpg': 'field-visit',
  'Sep Intake Orientation-52 (1).jpg': 'founder-speaking',
  'Sep Intake Orientation-67.jpg': 'founder-listening',
  'candice-seplow-rd27HO_IJSo-unsplash.jpg': 'peace-sign-night',
  'claudio-schwarz-s6ivye-AqOY-unsplash.jpg': 'unity-in-diversity',
  'e1.png': 'certificates-group-1',
  'e2.png': 'certificates-students',
  'e4.png': 'certificates-group-2',
  'ev-Mz6vYiI8CSA-unsplash.jpg': 'stop-war-sign',
  'james-lee-XzrUCGx5diI-unsplash.jpg': 'love-crowd-beach',
  'suga-suga-wUjeq4KIvyk-unsplash.jpg': 'no-war-poster',
  'w3e.jpg': 'founder-at-event',
  'zaur-ibrahimov-antPbwiOpb8-unsplash.jpg': 'dove-stencil-imagine-peace',
};

// Photos stored sideways without a correct orientation tag (degrees clockwise).
const turn = { '7K1A6128.JPG': 270, '7K1A6129.JPG': 270 };

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('photos.mjs')) {
  mkdirSync('src/assets/photos', { recursive: true });
  let total = 0;
  for (const [src, name] of Object.entries(manifest)) {
    const out = `src/assets/photos/${name}.jpg`;
    if (!existsSync(`images/${src}`)) { console.warn(`missing images/${src}`); continue; }
    const info = await sharp(`images/${src}`)
      .rotate() // honour camera orientation, then drop EXIF
      .rotate(turn[src] ?? 0)
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(out); // sharp writes no metadata unless asked
    total += info.size;
    console.log(`${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
  console.log(`total ${(total / 1024 / 1024).toFixed(1)} MB`);
}
