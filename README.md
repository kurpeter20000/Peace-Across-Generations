# Peace Across Generations — website

*Every Voice. Every Generation. One Peace.*

The website of Peace Across Generations, an independent, youth-led, non-partisan peacebuilding initiative for South Sudan. The full specification is in [PAG_Website_Brief_for_Claude_Code.md](PAG_Website_Brief_for_Claude_Code.md).

It is a small, fast, static website built with [Astro](https://astro.build), designed to work on a cheap Android phone on a slow, expensive connection.

---

## For the content team: how to update the site

You don't need to code. Every change is a small text file edit. You can make edits directly on GitHub: open the file, click the pencil icon, make the change, then click **Commit changes**. The site rebuilds itself a minute or two later.

Placeholders that still need real information look like **`[TBD: …]`** on the site. Never replace one with a guess. Only use confirmed facts, names, numbers and links.

### 1. Add a new story (letter, poem, episode, talk…)

1. Go to `src/content/stories/`.
2. Open `_template.md` and copy all of its text.
3. Create a new file in the same folder. Name it after the story, in lower case with hyphens, ending in `.md`, e.g. `a-letter-to-my-grandchildren.md`. The file name becomes the web address: `/stories/a-letter-to-my-grandchildren/`. Don't start the name with `_`, and don't use `letters`, `creative`, `conversations`, `talks` or `90-seconds`.
4. Paste the template and fill in each line. Lines starting with `#` are optional; remove the `#` to use them.
5. Write the piece itself (or its summary) below the second `---` line.
6. Change `draft: true` to `draft: false` to publish.

**Safety checks run automatically.** The story will **not** appear on the site if:

- `consent: recorded:` is not `true`
- `ageGroup` is `under-18` and `guardianConsent` is not `true`
- the type is `explainer` or `talk` and it has no `sources`

Other rules to follow by hand:

- `contributorDisplayName`: the name the person *asked* to be shown. Use `"Anonymous"` if in doubt.
- `location`: country or state only. Never a village, camp, school or live location.
- `contentWarning: true` for anything about grief or loss.
- Images and audio go in `public/images/` and `public/audio/`. Keep images under 80 KB (max 1600 px wide) and audio at 48–64 kbps mono MP3. Write the real file size in `sizeMB`.
- Never publish a child's face without written guardian consent.

### 2. Add or publish a monthly theme

Themes live in `src/content/themes/`, one file per month. November to February already exist as **drafts**.

To publish a month:

1. Open its file (e.g. `lower-the-gun-raise-the-voice.md`).
2. Add the weekly **Peace Where We Live** actions under `weeklyActions:`, one per weekend:
   ```yaml
   weeklyActions:
     - weekOf: 2026-11-07
       action: "Greet someone from another community in their language."
   ```
3. Change `draft: true` to `draft: false`.

The home page, **This Month**, and **Take Part** pages automatically show the theme whose `startDate`–`endDate` includes today.

### 3. Update pilot progress

Once a month, after the learning review:

1. Open `src/data/pilot-progress.json`.
2. Change the numbers after `"current":` (only real, counted numbers).
3. Change `"lastUpdated"` to today's date, as `"YYYY-MM-DD"`.

### Other things you can edit

| What | File |
|---|---|
| WhatsApp number, social links, safeguarding email | `src/data/site.json` (replace `null` with the value in quotes) |
| Peace Talks dates, speakers, recordings | `src/content/talks/<month>.md` |
| Team names, bios, photos | `src/content/team/*.md` (set `open: false` when a role is filled) |
| Corrections log | `src/data/corrections.json` |
| Founding Creators wall (opt-in names only) | `src/data/founding-creators.json` |
| Clubs & circles pilot status | `src/data/pilot-status.json` |

---

## For developers

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/
npm run brand     # regenerate logo WebP, favicons and OG image from public/brand/pag-logo.png
```

- **Stack:** Astro 7, static output, content collections (`src/content.config.ts`) with Zod schemas, plain CSS with custom properties (`src/styles/global.css`). The only site-wide JS is `src/scripts/site.ts`.
- **Brand tokens:** all colours live at the top of `src/styles/global.css` (brief §4.2), including the dark-mode set.
- **Safeguarding guard:** `publishedStories()` in `src/lib/content.ts`. Always read stories through it, never with `getCollection('stories')` directly.
- **Security:** Astro emits a hashed Content-Security-Policy `<meta>` per page (`astro.config.mjs`). The low-data head script is hashed from `src/lib/inline-scripts.mjs`. Other headers are in `public/_headers`.
- **Email obfuscation:** use `<Email />` for every address. It is assembled client-side.
- **i18n:** UI strings in `src/i18n/en.json`. Add a language to `astro.config.mjs` `i18n.locales` and `src/i18n/index.ts` (Arabic needs `dir: 'rtl'`). Don't add a language switcher until a translated page exists.

### Deploying (Cloudflare Pages or Netlify)

- Build command `npm run build`, output directory `dist`, Node 22+.
- **Schedule a daily rebuild** (a deploy hook called by a cron, e.g. at 00:05 Africa/Juba). The day counter updates itself in the browser, but the current monthly theme and weekly action are chosen at build time.
- Analytics: add Cloudflare Web Analytics (cookie-free) from the Cloudflare dashboard. The CSP already allows `cloudflareinsights.com`.
- Set the final domain in `astro.config.mjs` (`SITE`) and `public/robots.txt`.
