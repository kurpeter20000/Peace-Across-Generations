// Prepares the content editor before `astro build`:
// 1. copies Sveltia CMS from node_modules into public/admin/cms/ (self-hosted,
//    no third-party script CDN), and
// 2. lists the photo-library names from src/data/photos.ts for the editor's
//    campaign "gallery" picker (functions/_lib/photo-keys.json).
import { copyFileSync, readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';

const dist = 'node_modules/@sveltia/cms/dist';
mkdirSync('public/admin/cms', { recursive: true });
copyFileSync(`${dist}/sveltia-cms.js`, 'public/admin/cms/sveltia-cms.js');
cpSync(`${dist}/chunks`, 'public/admin/cms/chunks', { recursive: true, filter: (f) => !f.endsWith('.map') });

const keys = [...readFileSync('src/data/photos.ts', 'utf8').matchAll(/^\s{2}(\w+): p\(/gm)].map((m) => m[1]);
writeFileSync('functions/_lib/photo-keys.json', `${JSON.stringify(keys, null, 2)}\n`);
console.log(`[cms] editor copied; ${keys.length} library photos listed`);
