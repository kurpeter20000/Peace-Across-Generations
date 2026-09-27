# Peace Across Generations — website

*Building peace, one generation at a time.* Independent · Youth-led · Non-partisan

The website of Peace Across Generations, an independent, youth-led, non-partisan peacebuilding initiative connecting South Sudanese across communities, generations and borders. The original specification is in [PAG_Website_Brief_for_Claude_Code.md](PAG_Website_Brief_for_Claude_Code.md). The site structure (campaigns, Stories & Voices, Take Action, Resources, newsletter, moderated submissions) follows the later development brief. The brand colours are the ones sampled from the official logo.

It is a fast, mostly static website built with [Astro](https://astro.build) and hosted on Cloudflare Pages, designed to work on a cheap Android phone on a slow, expensive connection. Forms, the moderation queue and the newsletter run on Cloudflare Pages Functions with a D1 database and a private R2 bucket.

**Site map:** Home · About · Campaigns (`/campaigns/`, current one at `/campaigns/current/`) · Stories & Voices (`/stories/`) · Take Action (`/take-action/`: share your voice, volunteer, become a contributor, partner) · Resources · Blog · Events · Newsletter · Contact · Programmes · 3,000 Days · Standards · Admin (`/admin/`, team only).

---

## For the team: reviewing contributions (the admin area)

Go to **`/admin/`** and sign in with your team email (Cloudflare sends you a one-time code). Nothing anyone submits is ever published automatically.

**Submissions** move through: **Submitted → Pending review → Approved / Rejected → Published.**

1. Open a new submission and press **Start review**.
2. Check consent, facts and safety against the community guidelines. Download any file and look for children’s faces, locations and weapons.
3. **Under 18?** The dashboard shows a warning. Contact the parent or guardian, then press **Guardian consent verified**. Until you do, the piece cannot be approved.
4. **Approve** or **Reject**, and write a note so the rest of the team knows why.
5. To publish, add the piece as a story (see below, and put the submission reference in `submissionRef`). Then type its address (e.g. `/stories/letter-to-my-country/`) and press **Mark as published**.
6. If a contributor asks to withdraw their work, remove the story file and press **Unpublish (withdrawn)**.

Every action is logged with who did it and when. The other tabs show **Enquiries** (volunteers, contributors, partners, contact messages), **Newsletter** sign-ups (with a CSV export for any mail tool) and **Engagement** counts (button and video clicks, with no personal data).

---

## For the content team: how to update the site

You don't need to code. Every change is a small text file edit. You can make edits directly on GitHub: open the file, click the pencil icon, make the change, then click **Commit changes**. The site rebuilds itself a minute or two later.

Placeholders that still need real information look like **`[TBD: …]`** on the site. Never replace one with a guess. Only use confirmed facts, names, numbers and links.

### 1. Add a new story (letter, poem, video, conversation…)

1. Go to `src/content/stories/`.
2. Open `_template.md` and copy all of its text.
3. Create a new file in the same folder, named after the story in lower case with hyphens, e.g. `a-letter-to-my-grandchildren.md`. The file name becomes the web address: `/stories/a-letter-to-my-grandchildren/`. Don't start the name with `_`, and don't reuse a category name (`videos`, `stories`, `letters`, `poetry`, `music`, `art`, `drama`, `conversations`, `voices`).
4. Paste the template and fill in each line. Lines starting with `#` are optional; remove the `#` to use them.
5. Write the piece itself (or its summary) below the second `---` line.
6. Change `draft: true` to `draft: false` to publish.

**Photos:** put the photo in `src/content/stories/images/` and write `image: { src: "./images/photo-name.jpg", alt: "…" }`. The site automatically makes small, modern versions for phones and **removes hidden location data (GPS/EXIF)**. You can upload the original photo.

**Featured voices:** set `featured: true` and add a short `quote:` to show the piece on the home page.

**Safety checks run automatically.** The story will **not** appear on the site if:

- `consent: recorded:` is not `true`
- `ageGroup` is `under-18` and `guardianConsent` is not `true`
- the type is `explainer` or `talk` and it has no `sources`

Other rules to follow by hand:

- `contributorDisplayName`: the name the person *asked* to be shown. Use `"Anonymous"` if in doubt.
- `location`: country or state only. Never a village, camp, school or live location.
- `contentWarning: true` for anything about grief or loss.
- Audio goes in `public/audio/` at 48–64 kbps mono MP3; write the real file size in `sizeMB`.
- Never publish a child's face without written guardian consent.

### 2. Campaigns (one per month)

Campaigns live in `src/content/themes/`, one file per month. November to February already exist as **drafts**. Each campaign can have: `message`, `keyQuestions`, `objectives`, `contributionTypes`, `participation`, `videos`, `photos`, weekly **Peace Where We Live** actions and, after the month ends, honest `impact` results.

To publish a month:

1. Open its file (e.g. `lower-the-gun-raise-the-voice.md`).
2. Add the weekly actions under `weeklyActions:`, one per weekend:
   ```yaml
   weeklyActions:
     - weekOf: 2026-11-07
       action: "Greet someone from another community in their language."
   ```
3. Add the campaign `message` and `keyQuestions` (see September’s file for an example).
4. Change `draft: true` to `draft: false`.

The home page, `/campaigns/current/` and the Take Action pages automatically show the campaign whose `startDate`–`endDate` includes today.

### 3. Update pilot progress

Once a month, after the learning review:

1. Open `src/data/pilot-progress.json`.
2. Change the numbers after `"current":` (only real, counted numbers).
3. Change `"lastUpdated"` to today's date, as `"YYYY-MM-DD"`.

### 4. Blog posts

1. Go to `src/content/posts/`, copy `_template.md` into a new file named after the post (e.g. `new-school-opens-in-bor.md`).
2. Fill in the title, date, summary and category, and write the post under the second `---`.
3. List **at least one source**. A post without sources will not publish.
4. Change `draft: true` to `draft: false`.

The blog reports real progress in peace and development with facts and sources. It never praises or blames a party, government, official or armed actor, and it stays honest about what still needs to change.

### Other things you can edit

| What | File |
|---|---|
| Resources (guides, toolkits, videos, research) | `src/content/resources/` (copy `_template.md`; only list checked resources) |
| Events | `src/content/events/` (copy `_template.md`) |
| Contributor profiles (only with written consent) | `src/content/contributors/` (copy `_template.md`) |
| WhatsApp number, social links, safeguarding email, intro video | `src/data/site.json` (replace `null` with the value in quotes) |
| Peace Talks dates, speakers, recordings | `src/content/talks/<month>.md` |
| Team names, bios, photos | `src/content/team/*.md` (set `open: false` when a role is filled; photos in `src/content/team/images/`) |
| Corrections log | `src/data/corrections.json` |
| Founding Creators wall (opt-in names only) | `src/data/founding-creators.json` |
| Clubs & circles pilot status | `src/data/pilot-status.json` |

**Intro video:** upload videos to YouTube or Facebook (never to this repository). The home page video is set in `site.json` → `introVideo`. The player only loads when someone presses play, and Low-data mode shows a plain link instead.

---

## Setting up Cloudflare (one time)

Pages project: **peace-across-generations** (https://peace-across-generations.pages.dev). Bindings live in **`wrangler.toml`**. That file is the source of truth, so change bindings and variables there, not in the dashboard.

Done:

- ✅ D1 database `pag`, bound as `DB` (tables create themselves). Forms and the newsletter work.
- ✅ Secret `HASH_SALT` set on the production project.

Still to do:

1. **File uploads (R2):** in the Cloudflare dashboard, open **R2** and enable it (Cloudflare asks for a payment method, even on the free tier). Then run `npx wrangler r2 bucket create pag-uploads`, uncomment the `[[r2_buckets]]` block in `wrangler.toml`, and deploy. Until then, the form accepts text and links, and asks people to send files by link, WhatsApp or email.
2. **Protect the admin (Cloudflare Access):** Zero Trust → **Access → Applications → Add → Self-hosted**:
   - Domain `peace-across-generations.pages.dev` (and later `peace-agen.org`), with paths `admin` **and** `api/admin`.
   - Policy: **Allow** → *Emails* → each team member’s email.
   - Copy the application’s **AUD tag** and your **team name** (Zero Trust → Settings, e.g. `peace-agen` in `peace-agen.cloudflareaccess.com`). Put both in the `[vars]` block of `wrangler.toml`, then deploy.

   Until then, `/admin` shows the page but refuses to load any data.

**Deploying:** pushes to `main` deploy automatically when the GitHub connection is healthy. You can also deploy directly from this computer:

```sh
npm run build
npx wrangler pages deploy dist --project-name peace-across-generations --branch main
```

**Also:**

- **Daily rebuild** keeps the current campaign and weekly action correct. In the Pages project go to **Settings → Builds → Deploy hooks**, create a hook for `main`, then add its URL in GitHub under **Settings → Secrets and variables → Actions** as `CLOUDFLARE_DEPLOY_HOOK`. `.github/workflows/daily-rebuild.yml` calls it at 00:05 Juba time.
- **Analytics:** Pages project → **Metrics → Web Analytics** → enable (cookie-free).
- **Custom domain (`peace-agen.org`):** once registered, add it under the project's **Custom domains**. It is already set as `SITE` in `astro.config.mjs` and in `public/robots.txt`.

---

## For developers

```sh
npm install
npm run dev       # http://localhost:4321 (pages only, no forms)
npm run build     # static site in dist/ + share images (scripts/og.mjs)
npm run preview   # serve dist/
npm run brand     # regenerate logo WebP and favicons from public/brand/pag-logo.png

# Full local test with forms, admin, D1 and R2 (local simulation, no account needed):
npm run build
npx wrangler pages dev dist --d1 DB --r2 UPLOADS --binding DEV_ADMIN=1
# → http://localhost:8788, admin at /admin/ (DEV_ADMIN only works on localhost)
```

- **Stack:** Astro 7 static output + Cloudflare Pages Functions (`functions/`). Content collections are in `src/content.config.ts`, styling is plain CSS with custom properties (`src/styles/global.css`), and site-wide JS is `src/scripts/site.ts` (~3 KB). All forms work without JavaScript.
- **Server:** `functions/api/*`: `submit` (multipart, R2 upload), `enquiry`, `newsletter`, `event` (counters), and `admin/*` (Access-verified, see `functions/_lib/access.ts`). The schema lives in `functions/_lib/db.ts` and is created on first use. Form options are shared with the pages via `src/data/forms.ts`.
- **Safety:** every submission starts as `submitted`, and the status transitions are enforced server-side. Under-18 contributions can't be approved until the guardian is verified. Uploaded files are private and downloaded only as attachments. Admin UI renders user text with `textContent` only. Forms have a honeypot, a time check, same-origin checks and a per-hashed-IP rate limit.
- **Brand tokens:** colours sampled from the logo (navy `#003366`, green `#2E7130`, sky `#1086E1`) plus Sunrise Sand `#F7F3E9`, all at the top of `global.css`, including dark mode.
- **Content guards:** `publishedStories()` (consent, guardian and sources checks) and `publishedPosts()` (sources required) in `src/lib/content.ts`. Always read those collections through them.
- **Images:** `image()` fields go through Astro’s pipeline (AVIF/WebP, responsive, metadata stripped).
- **SEO:** per-page title, description, canonical and Open Graph tags. The per-page share images are generated into `dist/og/` after the build. JSON-LD covers Organization, Event, BlogPosting and PodcastEpisode. There's a sitemap (admin, API and thank-you pages excluded) and RSS for stories and the blog.
- **Security:** Astro emits a hashed CSP `<meta>` per page (`astro.config.mjs`). Other headers are in `public/_headers`, and old addresses redirect via `public/_redirects`.
- **i18n:** UI strings in `src/i18n/en.json`. Add a language to `astro.config.mjs` `i18n.locales` and `src/i18n/index.ts` (Arabic needs `dir: 'rtl'`).
