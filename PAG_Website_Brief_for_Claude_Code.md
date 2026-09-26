# Peace Across Generations — Website Brief for Claude Code

**Version:** 1.1 · 26 September 2026 (brand colours from the official logo)
**Owner:** Kur Peter Thon Aduot, Founder & Initiative Lead
**Sources:** *PAG Concept and Strategy v2.1* (Sept 2026) and *Programme Portfolio 2026–2027* (Sept 2026)

---

## 0. How to use this brief

This file is the full specification for building the Peace Across Generations website. Hand it to Claude Code with the prompt in **Section 14**. Everything in quotation blocks or under "Copy" is final draft website text and can be used as written. Anything marked `[TBD]` is a placeholder the team still has to supply.

Rules for the builder:

1. Where this brief and a design idea conflict, this brief wins.
2. Never invent facts, figures, partner names, speaker names, testimonials or photos of real people. Use clearly labelled placeholders instead.
3. Keep every page usable on a cheap Android phone on a slow, expensive mobile connection. That constraint shapes every technical decision below.

---

## 1. Project summary

**Peace Across Generations (PAG)** is an independent, youth-led, non-partisan peacebuilding initiative for South Sudan. It connects South Sudanese across communities, generations and borders to speak, listen, create and act for peace.

| Item | Value |
|---|---|
| Name | Peace Across Generations |
| Primary tagline | Every Voice. Every Generation. One Peace. |
| Supporting line | Building peace, one generation at a time. |
| Positioning | An independent, youth-led, non-partisan peacebuilding initiative connecting South Sudanese across communities, generations and borders. |
| Personality | Calm, courageous, hopeful, factual, non-partisan, creative, inclusive and deeply South Sudanese |
| Pilot | 21 September 2026 – 28 February 2027 (programmes run October–February) |
| Long-term commitment | 3,000 Days for Peace: 21 September 2026 – 7 December 2034 |
| Official email | peaceacrossgenerations@gmail.com |
| WhatsApp submission number | `[TBD]` |
| Social handles | Facebook `[TBD]`, Instagram `[TBD]`, TikTok `[TBD]`, YouTube `[TBD]`, X `[TBD]` |
| Domain | `[TBD]` (suggest peaceacrossgenerations.org) |

### Non-negotiables the website must reflect

- **Independence.** PAG is independent from EduPower Youth Foundation and from any political party, candidate, armed actor or government. The site must not link to or brand-associate with EduPower or any party.
- **Not a registered NGO.** During the pilot the site must never say "NGO", "organisation registered in…" or "charity". Use "initiative".
- **No overclaiming.** No invented impact numbers, no claims of presence in states where PAG is not active, no suggestion that messaging alone ends conflict.
- **Safety first.** No child's face or name without guardian consent, no graphic imagery, no weapons in imagery, no content that blames a whole community.
- **Foster Peace South Sudan is retired.** Mention it only once, on the About page, as the earlier initiative PAG continues and replaces. Do not use FPSS logos, handles or emails.

---

## 2. Audiences and what the site must do for each

| Audience | What they need from the site | Primary action |
|---|---|---|
| Young people 15–35 in South Sudan | Know what this month's theme is and how to take part cheaply | Submit via WhatsApp |
| Diaspora youth | Understand the initiative, contribute, amplify | Submit / share / volunteer |
| Schools and head teachers | Understand the Peace Clubs pilot and its safeguarding | Contact to host a club |
| Community groups (churches, youth associations, women's groups) | Understand Community Peace Circles | Contact to host a circle |
| Elders and families (often via a young person's phone) | Listen to Generations in Conversation | Play audio |
| Experts and speakers | Understand Peace Talks and speaker rules | Offer to speak |
| Partners, donors, journalists | Credibility, standards, independence, contact | Email |
| Friends of South Sudan worldwide | How to show solidarity without speaking for South Sudanese | Send a solidarity message |

**The site's single most important job:** turn a visitor into a participant this month. The "Take part" call to action appears on every page.

---

## 3. Technical requirements

### 3.1 Recommended stack

- **Framework:** Astro (static output) with content collections in Markdown/MDX. Minimal client JavaScript: only what a component truly needs (audio player, countdown, mobile menu).
- **Styling:** plain CSS with custom properties, or Tailwind with purge. No UI framework bundles.
- **Hosting:** Cloudflare Pages or Netlify (free tier), automatic deploy from GitHub.
- **Content editing:** Markdown files in the repo for v1. Optional v2: Decap CMS (git-based, free) so non-technical team members can publish a letter or episode.
- **Analytics:** privacy-friendly and cookie-free (Cloudflare Web Analytics or Plausible). No Facebook Pixel, no Google Analytics, no ad trackers.

### 3.2 Low-data performance budget (hard limits)

| Metric | Budget |
|---|---|
| Home page total transfer, first load | ≤ 400 KB |
| Any other page, first load (excluding user-played audio) | ≤ 300 KB |
| JavaScript per page | ≤ 30 KB compressed |
| Largest Contentful Paint on "Slow 4G" in Lighthouse | ≤ 2.5 s |
| Lighthouse Performance / Accessibility / Best Practices / SEO | ≥ 95 each |

How to hit it:

- Images: AVIF/WebP with JPEG fallback, responsive `srcset`, lazy-load below the fold, max 1600 px wide, target ≤ 80 KB per image.
- Fonts: one variable font family maximum, subset to Latin, `font-display: swap`; or system font stack.
- Audio: never autoplay; use `preload="none"`; serve 48–64 kbps mono MP3 (a 20-minute episode ≈ 7–10 MB) and show file size next to every play/download button, e.g. "Listen (8 MB)".
- Video: never self-host or embed heavy players on load. Use a lightweight facade (thumbnail + "Watch on Facebook/YouTube") that loads the embed only on click.
- A **"Low-data mode"** toggle in the header that hides all images and embeds and swaps them for text links. Remember the choice in `localStorage` (wrapped in try/catch). Respect `Save-Data` header / `navigator.connection.saveData` to switch it on automatically.
- Service worker (optional v2) to cache pages already visited for offline reading.

### 3.3 Accessibility

- WCAG 2.2 AA. Colour contrast ≥ 4.5:1 for body text.
- Every audio episode has a written English summary; transcripts where available.
- Every video has captions or a text summary.
- Keyboard navigable, visible focus states, skip-to-content link, semantic headings, `alt` text on every image.
- Plain language: aim for a reading level a secondary-school student reading in their second language can follow. Short sentences.

### 3.4 Languages

- English at launch.
- Build the site i18n-ready (Astro i18n routing, strings in a dictionary file) so Arabic (including Juba Arabic) and South Sudanese language pages can be added later. Arabic requires RTL support in the layout.
- Do not add a language switcher until at least one translated page exists. Individual pieces of content may already be in other languages; the content model supports a `language` field.

### 3.5 Privacy and security

- No user accounts in v1.
- No third-party cookies. If any cookie is ever added, add a consent banner.
- HTTPS only; security headers (CSP, X-Frame-Options, Referrer-Policy strict-origin-when-cross-origin).
- Obfuscate the email address against scrapers where displayed.

---

## 4. Brand and design direction

The brand colours are taken from the official logo (`public/brand/pag-logo.png`, supplied with this brief): a navy dove and wordmark, a sky-blue child, a navy young person and a green elder, with a green olive branch and swoosh. Build everything from the tokens below so they live in one file.

### 4.1 Logo

- File: `pag-logo.png` — horizontal lock-up, transparent background, 1376 × 716 px. Place it in `public/brand/`.
- Header: show the full lock-up at about 160–200 px wide on mobile. Also produce a compressed WebP (≤ 25 KB) for the header.
- Favicon and app icon: crop the symbol (dove over the three figures) into a square, export 32 px, 180 px and 512 px PNGs, plus an SVG if the designer can supply one.
- Clear space: keep at least the height of the "E" in PEACE empty around the logo.
- Do not recolour, stretch, add shadows or place the logo on busy photos.
- Dark mode: the navy parts disappear on a dark background. Until a reversed (white) version is supplied `[TBD]`, keep the header background white in both light and dark mode, or set the logo on a white rounded panel.
- The logo includes the tagline "Building peace, one generation at a time." — do not repeat it right next to the logo.

### 4.2 Brand palette (from the logo)

| Token | Value | Source in logo | Use |
|---|---|---|---|
| `--color-navy` | #003366 | Wordmark, dove outline, young person | Headings, header text, footer background, primary text links |
| `--color-sky` | #1086E1 | Child figure | Graphics, icons, illustration fills, large display text only (see contrast) |
| `--color-sky-text` | #0B6CB8 | Darker sky blue for accessibility | Sky-blue text and link hover on light backgrounds |
| `--color-green` | #2E7130 | Elder figure, "A" swoosh, divider | Primary buttons (white text), success states, highlights |
| `--color-leaf` | #6BAF3F | Lighter olive-leaf green | Decorative fills, progress bars, tag dots — never as text on white |
| `--color-white` | #FFFFFF | Dove | Cards, header |
| `--color-mist` | #F5F8FB | Very light blue-grey tint of navy | Page background, alternating sections |
| `--color-ink` | #1B1F24 | — | Body text |

**Contrast rules (WCAG AA, checked):**

| Pairing | Ratio | Allowed |
|---|---|---|
| Navy #003366 on white | 12.6 : 1 | All text |
| Green #2E7130 on white / white on green | 6.0 : 1 | All text; green buttons with white labels |
| Sky-text #0B6CB8 on white | 5.5 : 1 | All text |
| Sky #1086E1 on white / white on sky | 3.8 : 1 | Large text (24 px+, or 19 px bold) and graphics only — not body text or small button labels |
| Leaf #6BAF3F on white | 2.7 : 1 | Decoration only |

**Buttons:**
- Primary ("Take part", "Send your work"): green background, white text.
- Secondary: white background, navy border and navy text.
- WhatsApp button: green is already the primary colour, so give it the WhatsApp icon plus the label "Send on WhatsApp" for clarity.

**Dark mode** (`prefers-color-scheme: dark`), same hues, adjusted for contrast:

| Token | Dark value |
|---|---|
| Background | #0B1726 (deep navy) |
| Surface / cards | #13233A |
| Body text | #E6EDF5 |
| Headings and links | #5FB0F0 (light sky, 7.7 : 1) |
| Green accents and button background | #2E7130 with white text; green text uses #7CC47F (8.6 : 1) |

The blue, green and white palette reads as peace and growth and has no party-political association in South Sudan. Keep it clean: mostly white and mist backgrounds, navy text, green for action, and sky blue for warmth in illustrations.

### 4.3 Typography

- The logo wordmark is set in a geometric sans in the style of **Poppins** (bold capitals; italic spaced capitals in the tagline). Use **Poppins** for headings (weights 600 and 700, Latin subset, self-hosted WOFF2) so the site matches the logo.
- Body: system font stack (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`) to save data, or Poppins 400 if the budget allows. Minimum body size 17 px on mobile, line-height 1.6.
- Small labels and eyebrow text can echo the tagline: uppercase, letter-spacing 0.12em, navy, italic optional.

### 4.4 Visual language

- Motifs from the logo: the dove with an olive branch, three figures of different ages (child, young person, elder), the rising green swoosh and the leaf divider. Reuse the leaf-between-two-lines divider from the logo as the section separator across the site.
- Other motifs: the tree (gathering place for dialogue), sunrise and river, drawn as simple line art in navy, sky and green. Keep illustrations as small inline SVG.
- Photography: real contributors only, with consent. Until real photos exist, use illustrations, not stock photos of Africans (stock photos undermine trust and authenticity).
- Never: guns, military imagery, crying children, bodies, flames, maps highlighting conflict "hotspots", tribal marks used as decoration.
- Programme colour tags so users can recognise each programme across the site. Show each as a coloured dot or left border with navy label text (never coloured text on its own):
  - Youth Creative Peace — sky blue #1086E1 (the child: creativity, the newest voices)
  - Peace Clubs & Circles — green #2E7130 (growth, practice)
  - Peace Talks — navy #003366 (expertise, depth)
  - Generations in Conversation — leaf #6BAF3F with a navy outline (the olive branch passed between generations)

### 4.5 Voice for all site copy

Calm rather than aggressive. Human rather than abstract. Direct without lecturing. Poetic and memorable without making light of victims. Simple enough for multilingual readers. Non-partisan.

---

## 5. Sitemap

```
/                               Home
/about                          About us (story, vision, mission, independence, FPSS, team)
/3000-days                      The 3,000 Days for Peace commitment + pilot progress
/programmes                     Programmes overview (how they fit together)
  /programmes/youth-creative-peace
  /programmes/peace-clubs-and-circles
  /programmes/peace-talks
  /programmes/generations-in-conversation
  /programmes/running-threads   (Peace in 90 Seconds, Pause Before You Share,
                                 Peace Where We Live, 64 Voices One Future)
  /programmes/coming-next       (post-pilot programmes)
/this-month                     Current monthly theme hub (auto-points to current month)
  /themes/[slug]                One page per monthly theme (archive)
/take-part                      How to contribute + submission guide + prompts
  /take-part/submit             Submission instructions and consent
/stories                        The library: all published content, filterable
  /stories/letters              Letters for Peace
  /stories/creative             Poems, songs, art, photos, skits
  /stories/conversations        Generations in Conversation episodes
  /stories/talks                Peace Talks recordings
  /stories/90-seconds           Peace in 90 Seconds explainers
  /stories/[slug]               Single item page
/schools-and-communities        Host a Peace Club or Community Peace Circle
/pause-before-you-share         Digital responsibility hub + fact-checker links
/partner                        Partner, speak, volunteer, support
/standards                      Community standards, safeguarding, editorial promise
  /standards/safeguarding
  /standards/community-guidelines
  /standards/corrections-and-withdrawal
/report-a-concern               Safe reporting route
/contact                        Contact
/privacy                        Privacy notice
/404                            Friendly not-found page
```

### Primary navigation (mobile: hamburger)

Home · About · Programmes · This Month · Stories · **Take Part** (button)

### Footer

- Tagline and one-line positioning
- Links: About, 3,000 Days, Programmes, Schools & Communities, Partner, Standards, Report a concern, Privacy, Contact
- Email and WhatsApp
- Social icons `[TBD handles]`
- Independence line (every page): *"Peace Across Generations is an independent, youth-led, non-partisan initiative. It is not affiliated with any political party, candidate, armed actor, government or other organisation."*
- "Day [N] of 3,000" small counter
- © 2026 Peace Across Generations

---

## 6. Page-by-page content

### 6.1 Home `/`

**Section 1 — Hero**

> # Every Voice. Every Generation. One Peace.
> An independent, youth-led movement connecting South Sudanese across communities, generations and borders to speak, listen, create and act for peace.
>
> [Take part this month] [Listen to the conversations]

Beneath the buttons, a small live line: *"Day 6 of 3,000 Days for Peace"* (computed, see Component 8.1).

Visual: line-art illustration in brand colours of a child, a young person and an elder under a tree, echoing the three figures in the logo. White or mist background, navy headline, green primary button.

**Section 2 — This month's theme** (pulled from the current `theme` entry)

> **October: Unlearn Hate**
> What were you taught about people from other communities — and was it true?
> This month, write a letter to someone you were taught to distrust, or photograph a friendship across communities.
> [See this month's prompt]

**Section 3 — Why we exist**

> ## Peace cannot wait for someone else.
> South Sudan's young people are too often recruited, displaced or left out of decisions. They are also students, creators, entrepreneurs and organisers — the builders of everyday peace.
>
> Social media is our entry point, not our destination. We succeed when a post becomes a conversation, a conversation becomes an action, and an action becomes a peaceful habit.

**Section 4 — Four ways in** (four programme cards, each with icon, colour tag, one line and link)

| Card | Line |
|---|---|
| Youth Creative Peace | Turn your poem, song, drawing, photo or letter into a public message for peace. |
| Peace Clubs & Community Circles | A regular, supervised place for young people to practise peace face to face. |
| Peace Talks | One expert, one live conversation, every month — free, and small enough to share on WhatsApp. |
| Generations in Conversation | Young people ask. Elders answer. Together they decide what to pass on and what ends with them. |

Under the cards:
> Every month, all four programmes answer the same theme — so one idea reaches you as a poem, a club session, an expert talk and an elder's story.

**Section 5 — Latest stories** (3 most recent published items of any type; card shows type, title, contributor name or "Anonymous", language, and data size for audio)

Empty state before content exists: *"The first stories from our contributors are being reviewed with care. Check back soon — or be one of the first."* [Take part]

**Section 6 — Everyone has an entry point**

> ## You don't need money, a title or perfect English.
> A phone video. A handwritten letter. A voice note. A drawing, a poem, a song, a translation, an interview with your grandmother. If you have a phone, a pen or a voice, you can take part this month.
>
> The first 100 contributors will be recognised as **Founding Creators** — a status no one who joins later can have.
> [Take part]

**Section 7 — This week's small action** (Peace Where We Live; from current theme entry)

> **This weekend:** Read a Letter for Peace aloud at dinner, and ask one question about it.

**Section 8 — The 3,000-day promise** (short band)

> ## 3,000 days. One promise.
> From the International Day of Peace, 21 September 2026, to 7 December 2034, we commit to keeping peace visible, practical and passed between generations — before, during and after moments of crisis.
> [Read the commitment]

**Section 9 — Our promise to you** (trust band, 4 icons)

- **Non-partisan.** We endorse no party, candidate or armed actor.
- **Safe.** Every published piece has consent. Children need a guardian's consent too.
- **Factual.** We cite sources and correct our mistakes publicly.
- **Respectful.** We never blame a whole community.
[Read our standards]

---

### 6.2 About `/about`

> # About Peace Across Generations
>
> Peace Across Generations is an independent, youth-led and non-partisan peacebuilding initiative for South Sudan. We use storytelling, letters, art, intergenerational dialogue, responsible digital communication and safe community action to make peaceful choices more visible in everyday life.
>
> Young people are at the centre. But elders, parents, teachers, faith and traditional leaders, artists, journalists, public leaders, the diaspora and friends of South Sudan all have a place here.

**Our vision**
> A peaceful South Sudan where every generation chooses dialogue, dignity and shared responsibility over violence, hatred and inherited division.

**Our mission**
> To connect and mobilise South Sudanese inside the country and across the world to speak, listen, create and act for peace through inclusive storytelling, responsible media, intergenerational dialogue and practical local action.

**What we believe** (values grid, 9 tiles)

| Value | One line |
|---|---|
| Nonviolence | No incitement, retaliation, humiliation or celebration of violence. |
| Youth agency | Young people shape the agenda, create the content and lead safe actions. |
| Inclusion | Every community, gender, ability, region, generation and location. |
| Truth | Facts are sourced. Rumours are not amplified. |
| Dignity | Victims, survivors and communities are shown with consent, care and respect. |
| Non-partisanship | We endorse no party, candidate or armed actor, and hold everyone to the same standard. |
| Do no harm | No public value justifies foreseeable harm to a person or community. |
| Accountability | We correct errors, record complaints and report results honestly. |
| Hope with action | Hope paired with practical responsibility, not slogans. |

**What we say** (message bank — a rotating quote strip or grid)

- Peace is not someone else's department; it is a daily public responsibility.
- Young people do not need to wait for a title before becoming peacebuilders.
- No community can build South Sudan alone, and no child is born carrying an inherited enemy.
- A gun may silence a disagreement, but it cannot create justice, trust or lasting security.
- Moving forward does not require forgetting; it requires truth, justice, healing and a refusal to create new wounds.
- Before forwarding a rumour, ask who may be harmed if it is false.
- Leadership is measured by the lives protected, the trust built and the conflicts prevented.
- We should inherit culture and wisdom, not enemies and unfinished revenge.

**How change happens** (simple 6-step horizontal flow graphic)

Reach → Engage → Act → Connect → Learn → Sustain
> We will not claim that social media or public messaging alone can end armed conflict. We measure the contribution we make to participation, dialogue, social cohesion, responsible information-sharing and safe community action.

**Our independence**
> Peace Across Generations is independent from any political party, candidate, armed actor, government institution or other organisation. We may work with public institutions, civil society, media, schools, traditional and faith leaders and partners when that work advances peace and does not compromise our independence, safety or editorial standards.
> - No party, candidate or armed actor may use our name, logo, events or content as an endorsement.
> - We disclose partnerships and sponsorships where relevant.
> - During the pilot we are an initiative, not a registered NGO. We will say so honestly until that changes.

**Where we come from**
> Peace Across Generations continues the work of Foster Peace South Sudan, the founder's earlier youth peace initiative. We carried forward what met today's standards — school Peace Clubs, the 64 Voices idea and creative campaign materials — and refocused everything on safe, creative, intergenerational peacebuilding.

**Who we are** (team)

- Founder & Initiative Lead — **Kur Peter Thon Aduot** — bio `[TBD, 60–80 words]`, photo `[TBD]`
- Content & Creative Coordinator — `[TBD]`
- Community & Diaspora Engagement Coordinator — `[TBD]`
- Digital Safety, Moderation & Verification Lead — `[TBD]`
- Monitoring, Learning & Administration Coordinator — `[TBD]`

Build the team section so a role can show "Role open — [volunteer with us]" when unfilled. Do not display empty cards with fake names.

---

### 6.3 3,000 Days for Peace `/3000-days`

> # 3,000 Days for Peace
> **21 September 2026 – 7 December 2034**
>
> Peace advocacy too often appears only after a crisis and disappears when the headlines move on. We are committing to 3,000 consecutive days of keeping peace visible, practical and passed between generations — beginning on the International Day of Peace, 21 September 2026.
>
> This is a promise of continuity, not a rigid eight-year plan. Evidence, safety, community demand and partnerships — not ambition alone — will decide how fast we grow.

**Live counter** (Component 8.1): large "Day N of 3,000" + progress bar + "X days to go".

**The four phases** (timeline, current phase highlighted)

| Phase | Period | Purpose |
|---|---|---|
| 1. Prove the model | Sep 2026 – Feb 2027 | Launch safely; test content, participation, offline action, safeguards and partnerships. |
| 2. Deepen participation | 2027 – 2028 | Strengthen local and diaspora participation, language access, school and youth partnerships and repeat contributors. |
| 3. Build evidence and networks | 2029 – 2031 | Develop stronger learning products, partner-led activities and evidence-based advocacy if capacity allows. |
| 4. Sustain and transfer | 2032 – Dec 2034 | Consolidate lessons, strengthen local ownership and define the initiative's long-term future. |

**Pilot progress** (Component 8.5) — honest tracker of pilot targets, manually updated from a data file. Show "Target" and "So far" columns; "So far" starts at 0 and is updated monthly. Header note: *"Updated monthly after our learning review. Last updated: [date]."*

| Indicator | Pilot target |
|---|---|
| Creative contributions received | 100+ |
| Letters for Peace published | 24+ |
| Peace in 90 Seconds explainers | 32 |
| Youth–elder and youth–leader dialogues | 12 |
| Generations in Conversation episodes | 10 |
| Peace Talks sessions | 5 |
| Weekly peace action prompts | 26 |
| Documented offline peace actions | 24+ |
| Diaspora countries participating | 10+ |
| Women and girls among identifiable contributors | at least 40% |
| Published contributions with documented consent | 100% |
| School Peace Clubs (supervised pilot) | 2–3 |
| Community Peace Circles | 1–2 |

**Moments we mark each year** (small calendar strip)
18 June — International Day for Countering Hate Speech · 9 July — South Sudan Independence Day · 12 August — International Youth Day · 21 September — International Day of Peace and anniversary of the 3,000-day commitment · 9 January — anniversary of the 2005 Comprehensive Peace Agreement

---

### 6.4 Programmes overview `/programmes`

> # Our programmes
> Four core programmes, four running threads, one monthly theme.
> Every month, each programme answers the same theme, so one idea reaches people four ways: as a poem, a club session, an expert talk and an elder's story.

Overview table (render as cards on mobile):

| Programme | What it does | Who it's for | Rhythm |
|---|---|---|---|
| Youth Creative Peace | Turns creativity into public peace messages | Young creators 15–35, at home and in the diaspora | One themed challenge a month; one featured work a week; 4–5 Letters for Peace a month |
| Peace Clubs & Community Peace Circles | A regular, supervised place to practise peace | Secondary students; out-of-school youth 18–35 | Meet twice a month |
| Peace Talks | Brings peace and youth-empowerment experts to young people | Youth leaders, club members, students, diaspora | One live session a month, released as audio |
| Generations in Conversation | Honest conversations between young people and elders | Youth–elder pairs; listeners of every age | Two episodes a month |

Then a teaser for Running Threads and "Coming next" pages.

---

### 6.5 Youth Creative Peace `/programmes/youth-creative-peace`

> # Youth Creative Peace
> **Our front door. Anyone with a phone, a pen or a voice can take part this month.**
>
> Each month we announce one theme and one prompt. You answer in whatever form you are good at. We feature one work every week and name one Creator of the Month.

**What you can make** (six strand cards)

| Strand | What to make |
|---|---|
| Letters for Peace | An open letter of up to 500 words — or a voice note — to South Sudan, a leader, a future child, a former enemy or the next generation. |
| Poetry and spoken word | Written or performed poems in any language, with a short English summary. |
| Music | An original peace song. Send a 60-second clip. Watch for our Peace Song Challenge in November and February. |
| Visual art and photography | Drawings, posters, and phone photos of what peace looks like on an ordinary day. |
| Drama and comedy | A 2–5 minute phone skit. Comedy may laugh at habits and choices — never at a community. |
| Global solidarity | Friends of South Sudan: send a short message that supports South Sudanese voices without speaking for them. |

**How each month works** (4-step timeline)
1. **Week 1** — We announce the theme with one prompt and one example.
2. **Weeks 1–4** — You send your work by WhatsApp or email. We check every piece for consent and safety.
3. **Every week** — We feature one work, with the creator's story.
4. **Week 4** — We name the Creator of the Month.

**Recognition**
> Featured creators receive a certificate and a public thank-you. The first 100 contributors become **Founding Creators**. In February 2027 we will hold an online showcase of the pilot's best work.

**Before you send** (rules, short)
- It must be your own work, or properly credited.
- If you are under 18, a parent or guardian must consent too.
- No real weapons in photos, skits or art.
- No piece may name a whole community as guilty.

[Take part →] [Read Letters for Peace →]

---

### 6.6 Peace Clubs & Community Peace Circles `/programmes/peace-clubs-and-circles`

> # Peace Clubs & Community Peace Circles
> **Peace is something you practise, not just something you watch.**
> Twice a month, face to face, young people meet to talk, create and take one small action for peace.

Two-column comparison (stack on mobile):

| | School Peace Clubs | Community Peace Circles |
|---|---|---|
| Who | Secondary students | Out-of-school young adults, 18–35 |
| Size | 25–40 members, at least 40% girls | 12–20 people |
| Hosted by | The school, with a Patron or Matron named by the head teacher | A trusted group: church youth fellowship, youth association, student union or women's group |
| Meets | Twice a month, 60–90 minutes, during term | Once or twice a month, 90 minutes |
| Led by | Elected student leaders, supervised by the Patron or Matron | A volunteer from the host group, briefed by us |

**What happens in a club**
> One meeting a month follows our peace curriculum. The other uses that month's content — a Letter for Peace, a podcast clip or a Peace Talk — to start a discussion. Each month the club carries out one supervised school action, like a peace assembly, an art display or a short drama, and members take home a simple family question, such as asking a parent how disputes were settled when they were young.

**What happens in a circle**
> Every session has three steps: listen to a short piece of content, discuss one question, and agree one small action before the next meeting. If a live local dispute comes up, the facilitator refers it to chiefs or established mediators.

**Safety comes first** (highlighted box)
> Clubs begin only after every safeguarding condition is in place: an approved safeguarding policy and code of conduct, signed by every adult; a named safeguarding focal person; written permission from the head teacher; guardian consent for any student who appears in content; and referral contacts for any student who needs support.
>
> Clubs never handle or discuss handling real weapons, never offer counselling, never ask students to recount war experiences and never mediate serious disputes. Sharing is always voluntary, with the right to pass.

**Pilot status** (small status card, editable in data file)
> We are working with 2–3 secondary schools and 1–2 community groups during the pilot. First club meetings: November 2026.

[Host a club or circle →] (links to `/schools-and-communities`)

---

### 6.7 Peace Talks `/programmes/peace-talks`

> # Peace Talks
> **One expert. One live conversation. Every month. Free.**
> Peace Talks brings peace and youth-empowerment experts to young people — live on Facebook, then as an audio file small enough to share on WhatsApp.

**The format (45–60 minutes)**
1. The expert speaks for about 20 minutes on the month's theme.
2. A young co-host leads 20–25 minutes of questions from the audience.
3. We close with one practical action you can take that week.

> Every session pairs a peace topic with a skill you can use — for example, how hate speech spreads online, plus how to check a claim in two minutes.

**Built for low data**
- Live on Facebook — no new app to install.
- Audio-only version on WhatsApp within 48 hours.
- Short 60–90 second clips the week after.
- Free to community radio stations.
- **Watch parties:** a club or circle watches together on one phone or projector, so one data bundle serves thirty people.

**Upcoming and past talks** (list from `talks` collection; each with date, topic, speaker `[TBD]`, status: upcoming / recording available)

Pilot schedule (topics confirmed, speakers to be announced):

| Month | Topic |
|---|---|
| October | How hate speech spreads online — plus how to check a claim in two minutes |
| November | Courage without guns: masculinity, cattle and community safety — plus how to disagree without escalating |
| December | Leading without dividing: young people in civic life — plus public speaking |
| January | Grief, memory and healing: what helps and where to find support (education, not treatment) |
| February | What our generation builds next — a panel of pilot contributors, plus turning an idea into a project |

**Our speaker standard**
> Every speaker, whatever their position, speaks without campaigning or promoting a party. Officials and politicians take part only in issue-based sessions, under the same rules as everyone else. Factual claims are sourced. Audience questions are screened, and none may accuse a named person or community.

[Suggest a speaker or offer to speak →] (`/partner#speak`)

---

### 6.8 Generations in Conversation `/programmes/generations-in-conversation`

> # Generations in Conversation
> **Young people ask. Elders answer from what they have lived. Together they decide what should be passed forward — and what should end with them.**

**Formats**

| Format | What it is | Length |
|---|---|---|
| Main episode | A young person and an elder talk around one question, sometimes across communities | 15–25 minutes, twice a month |
| Ask an Elder | One elder, one question | 60 seconds, weekly |
| What I'd Tell My Younger Self | Elders, and people in their thirties, speak to teenagers | 1–2 minutes |
| Letters Across Generations | An elder and a young person write to each other | Occasional |
| 64 Voices, One Future | Each episode features a different community and ends with one question: *What should our children inherit, and what should end with us?* | Ongoing |

**Questions we ask**
- What were you taught about people from other communities, and was it true?
- Before guns were common, what made a young man respected?
- What did peace look like on an ordinary day when you were young?
- What is one thing you would ask my generation never to repeat?

**How we record with care**
> We explain consent in the elder's own language and record their agreement. Contributors can hear the edit before it is published, and can withdraw. We ask about wisdom, choices and hopes — not for graphic accounts of violence. We never name perpetrators or blame a community. Grief is welcome; pressure to forgive is not. Anyone can take part anonymously, voice only.

**Latest episodes** (from `episodes` collection; audio player with file size, English summary, language tag)

**Record a conversation in your family** (CTA)
> Have an elder whose story should be heard? Download our one-page interview guide `[TBD PDF]` and get in touch. Under 18? Interview only with an adult present.

---

### 6.9 Running threads `/programmes/running-threads`

> # Running through everything
> Four threads appear inside every programme. They keep our work consistent and practical.

**Peace in 90 Seconds**
> Short explainers from our founder and invited experts: one idea, one source, one action. One or two every week.
[Watch the explainers →]

**Pause Before You Share**
> Before you forward anything, ask three questions:
> 1. Who made this?
> 2. Who gains if I share it?
> 3. Who gets hurt if it is false?
[Learn the habit →] (`/pause-before-you-share`)

**Peace Where We Live**
> One small offline action every weekend — small enough for anyone to do.
> Examples: read a Letter for Peace aloud at dinner · ask an elder one question · greet someone from another community in their language · kindly correct one rumour.
[Tell us what you did →]

**64 Voices, One Future**
> South Sudan is home to many communities — the number 64 is widely used, though no official count exists. This thread is our commitment to hear from as many as we can, steadily and honestly. Contributors choose whether to name their community. We never lead with tribal labels. We have no quota, and we will never claim to have heard from everyone.

---

### 6.10 Coming next `/programmes/coming-next`

> # Coming after the pilot
> These programmes are worth doing well — so each will start only when our February 2027 review shows we have the partners, funding and safety arrangements to run it properly.

| Programme | What it would do | Earliest start |
|---|---|---|
| Play for Peace | Inter-community football, volleyball and wrestling with mixed teams and a peace conversation after each match | 2027 |
| Peace on Air | A regular radio slot built from our episodes, letters and talks | 2027 |
| Youth Peace Creators Fellowship | A cohort of 20–30 young people trained in storytelling, digital safety and facilitation | Mid-2027 |
| Diaspora Chapters | Volunteer focal points hosting circles and translating in countries with large South Sudanese communities | 2027 |
| Peace Forums | In-person Peace Talks, starting in Juba or Bor | Late 2027 |
| Youth Voices on Peace | A published report and anthology of the pilot's best work | 2027 |

[Interested in partnering on one of these? →]

---

### 6.11 This Month `/this-month` and theme pages `/themes/[slug]`

`/this-month` renders the `theme` entry whose date range contains today (fallback: next upcoming, else latest). Each theme page shows:

- Month, theme title, one-paragraph intro
- **The prompt** (creative challenge) with a "Take part" button
- What each programme is doing this month (4 blocks)
- Pause Before You Share focus for the month
- This week's Peace Where We Live action (weekly entries within the theme)
- Stories published under this theme (filtered list)

Theme data (create one Markdown file each):

| Month | Theme | Creative prompt | Peace Talks | Generations in Conversation | Clubs & circles | Pause Before You Share |
|---|---|---|---|---|---|---|
| Sep 2026 | Why Peace Cannot Wait | Write a Letter for Peace to South Sudan | — (launch) | — | — | — |
| Oct 2026 | Unlearn Hate | Write a letter to someone you were taught to distrust; photograph a friendship across communities | How hate speech spreads online, plus how to check a claim in two minutes | What were you taught about people from other communities, and was it true? | Schools approached; first community circle | The three-question sharing habit |
| Nov 2026 | Lower the Gun, Raise the Voice | Peace Song Challenge; skits on courage without guns | Courage without guns: masculinity, cattle and community safety, plus how to disagree without escalating | Before guns were common, what made a young man respected? | First club meetings; scenes from *The Land That Feeds Us All* | Rumours that trigger revenge: check before reacting |
| Dec 2026 | Leadership, Dialogue and Peaceful Public Life | Letters to leaders; "the leader I want to be" videos | Leading without dividing: young people in civic life, plus public speaking | A chief or teacher and a student leader on what makes leadership trusted | End-of-term peace assembly | Manipulated images and political content |
| Jan 2027 | Healing Without Forgetting | Letters Across Generations; poems on memory | Grief, memory and healing: what helps and where to find support (education, not treatment) | What do we remember, and what should end with us? (9 January: anniversary of the 2005 CPA) | Supervised holiday sessions; circles focus on listening | Never share images of victims |
| Feb 2027 | The Generation That Builds Peace | Second Peace Song Challenge; online showcase | What our generation builds next: pilot contributors' panel | Youth hosts and elders on commitments for the next phase | Clubs present one project; pilot review | Which habits have stuck |

Theme intros (copy):

- **Unlearn Hate:** *No child is born carrying an inherited enemy. This month we look honestly at what we were taught about other communities — and what we choose to unlearn.*
- **Lower the Gun, Raise the Voice:** *A gun may silence a disagreement, but it cannot create justice, trust or lasting security. This month is about courage that does not need a weapon.*
- **Leadership, Dialogue and Peaceful Public Life:** *Leadership is measured by the lives protected, the trust built and the conflicts prevented. This month we ask what trusted leadership looks like — at every age.*
- **Healing Without Forgetting:** *Moving forward does not require forgetting. This month makes space for grief and memory, with care — and with no pressure to forgive.*
- **The Generation That Builds Peace:** *Young people do not need to wait for a title. This month we celebrate what the pilot's contributors built, and decide together what comes next.*

---

### 6.12 Take Part `/take-part`

> # Take part
> You don't need money, a title, professional equipment or perfect English.

**Choose how** (5 pathway cards)

| Pathway | Examples | Best for |
|---|---|---|
| Create | Video, letter, poem, drawing, song, photo, short drama | Youth, artists, students, diaspora creators |
| Converse | Interview an elder, join a live session, talk as a family | Youth, elders, teachers, leaders |
| Act | School activity, peace wall, community reading, checking a rumour | Clubs, schools, community groups |
| Amplify | Translate, caption, share responsibly, introduce us to your network | Diaspora, media, supporters |
| Enable | Mentor, offer expertise, airtime, a safe venue or funding | Partners and professionals |

**This month's prompt** (pulled from current theme)

**Prompt bank** (evergreen)
- **Video:** What is one form of violence South Sudanese have normalised that our generation must reject?
- **Letter:** Write to a child who will inherit South Sudan in 2040. What must we change before then?
- **Elder interview:** What traditional practice helped your community prevent or resolve conflict?
- **Art:** What does peace look like in an ordinary South Sudanese day?
- **Leader response:** What concrete action will you take to protect young people from violence and hate?
- **Global solidarity:** What lesson from your community could encourage South Sudanese peacebuilders without speaking for them?

[How to send your work →] (`/take-part/submit`)

---

### 6.13 Submit `/take-part/submit`

> # How to send your work

**What you can send**
- A video, ideally 30–120 seconds, vertical or horizontal
- A Letter for Peace of up to 500 words — or a voice note and we will read it for you
- A drawing, photo, poem, song, short drama or spoken-word piece
- An interview with an elder, or a response from a community leader
- A short report of a peace action you did at home, at school, in your community or in the diaspora

**Tell us, with your work**
1. The name you want shown — or say if you want to stay anonymous or use a pen name
2. Your age group (under 18 / 18–24 / 25–35 / over 35)
3. Your country, and your state or community connection if you are comfortable sharing it
4. The language of your work, and a short English summary if you can
5. That the work is yours, or who you are crediting
6. That you agree we can lightly edit and publish it, and whether we may tag you
7. Anything we should know to keep you safe

**Under 18?** A parent or guardian must also agree. `[Download guardian consent form (PDF, TBD KB)]`

**Send it**
- **WhatsApp:** `[TBD number]` — big green button using `https://wa.me/[number]?text=` with a prefilled template (see below)
- **Email:** peaceacrossgenerations@gmail.com — button using `mailto:` with prefilled subject "Submission – [Month theme]" and body template

Prefilled template text:
```
Hello Peace Across Generations,
Here is my submission for [this month's theme].
Name to show (or "Anonymous"):
Age group:
Country / state:
Language:
Short English summary:
This is my own work: Yes / Credit to:
I agree you may edit lightly and publish: Yes
You may tag me: Yes / No
Anything we should know for my safety:
```

**What happens next**
> We check every piece for consent, facts and safety. If we need to change its meaning, translate it or change how you are named, we ask you first. You can ask us to remove your work at any time. [Corrections and withdrawal →]

**Why we may not publish something**
> We will not publish anything that calls for violence or revenge, uses slurs, blames a whole community, shows graphic images or real weapons, accuses a named person without evidence, or reveals someone's exact location. We may also hold back work that could put you at risk — your safety matters more than a post.

v1 deliberately has **no web form**: WhatsApp and email keep personal data out of third-party form services. (A form is a v2 decision; see Section 9.)

---

### 6.14 Stories (library) `/stories`

> # Stories
> Letters, poems, songs, art, conversations and talks from South Sudanese at home and around the world.

- Filters (client-side, lightweight, or separate static pages): Type · Theme · Language · Programme
- Card: type badge, title, contributor display name, theme, language, date, "Audio · 8 MB" or "Read · 3 min"
- Featured strip: "Creator of the Month" and "Founding Creators" wall (names only, or "Anonymous creator", opt-in)

**Single story page** `/stories/[slug]`
- Title, type, contributor name (or "Anonymous"), age group (optional), language, theme, date
- Body / audio player / video facade / image
- English summary or translation where content is in another language
- "Translated by / edited with the contributor's approval" note where relevant
- Sources (for explainers and talks)
- **One question** to reflect on and **one action** to take (from the quality standard — every piece has both)
- Share buttons: WhatsApp (first), Facebook, copy link. Plain links, no share-widget scripts.
- Footer note: *"Published with the contributor's consent. To request a correction or removal, [contact us]."*

---

### 6.15 Schools & Communities `/schools-and-communities`

> # Host a Peace Club or a Community Peace Circle

**For head teachers**
> A Peace Club gives 25–40 of your students a supervised space, twice a month, to practise dialogue, creativity and leadership. You name a Patron or Matron; students elect four leaders — President, Secretary, Programmes Coordinator and Media & Advocacy Lead. We provide the curriculum and monthly content.
>
> **What we need from you:** written permission, a named Patron or Matron, and help obtaining guardian consent for any student who will appear in photos or recordings.
>
> **What we guarantee:** every adult involved signs our code of conduct; a named safeguarding focal person; no student identified in public without consent; no weapons, trauma processing or dispute mediation in club sessions.

**For community groups**
> Already running a church youth fellowship, youth association, student union or women's group? A Community Peace Circle uses the trust you have already built. One of your volunteers leads, we brief them, and each session follows three simple steps: listen, discuss, act. During the pilot, circles are for adults aged 18–35.

**Pilot note:** *During the pilot we are working with a small number of schools and groups we can supervise directly. If we can't start with you now, we'll keep your details for the next phase.*

[Email us to host] (mailto with subject "Host a Peace Club" / "Host a Community Peace Circle")

Downloads `[TBD]`: School letter · Club concept note · Circle conversation guide

---

### 6.16 Pause Before You Share `/pause-before-you-share`

> # Pause Before You Share
> Rumours move faster than truth — and in South Sudan, a false message can cost lives.

**The habit** (large, memorable 3-card graphic)
1. **Who made this?**
2. **Who gains if I share it?**
3. **Who gets hurt if it is false?**

**Correcting a rumour**
> Lead with the truth. Don't repeat the false claim in a way that spreads it further. Be kind — people share rumours because they are afraid, not because they are bad.

**This month's focus** (from theme)

**Never share**
- Images of victims or bodies
- Messages that blame a whole community
- Unverified accusations against a named person
- Someone's exact location during tension

**Check with South Sudanese fact-checkers**
- #defyhatenow — `[URL TBD, verify]`
- 211Check — `[URL TBD, verify]`

(Builder: do not hard-code these URLs from memory; the team must confirm current links.)

---

### 6.17 Partner, speak, volunteer `/partner`

> # Work with us
> Partnerships should widen safe participation, reach and quality — without changing who we are: youth-led and non-partisan.

Anchored sections:

- **#speak — Speak at Peace Talks.** Peacebuilding practitioners, fact-checkers, mental-health educators (teaching, not treating), youth and community leaders, traditional and faith leaders, entrepreneurs, diaspora professionals and peers from other African countries. Speakers agree our speaker standard in writing.
- **#volunteer — Volunteer.** Translate, caption, recruit contributors, document approved actions, help with audio editing. Every volunteer signs our code of conduct.
- **#partner — Partner.** Schools and universities, youth networks, media and radio stations, peacebuilding and fact-checking organisations, diaspora associations, development partners.
- **#radio — Radio stations.** Our Peace Talks and conversation episodes are free to broadcast. `[Email us for radio-ready files]`
- **#support — Support.** In-kind support (data bundles for watch parties, a microphone, transport to elders, venues) is as valuable as money.

**Our partnership red lines** (box)
> - No funding or partnership may require endorsement of a party, candidate, armed actor or divisive agenda.
> - No partner may control a contributor's testimony or require us to publish unsafe content.
> - We disclose conflicts of interest and material partnerships.
> - We decline support that would undermine public trust in our independence.

No "Donate" payment button in v1 (no registered entity or bank account yet). Show: *"We are not accepting online donations during the pilot. To offer support, email us."*

---

### 6.18 Standards `/standards` (+ sub-pages)

> # Our standards
> Safety is part of the work, not paperwork after it.

**Community guidelines** `/standards/community-guidelines` — for comments, submissions and events:
We remove, and do not publish:
- Calls for violence, retaliation, collective punishment or forced displacement
- Ethnic slurs, dehumanising stereotypes, or naming an entire community as guilty
- Graphic images of bodies, sexual violence or distressed children
- Unverified accusations against identifiable individuals
- Precise live locations or details that could endanger people
- Real weapons used as props
- Any sexual exploitation, abuse, harassment or coercion
- A child's identifying details without consent and a safety check

We welcome respectful disagreement.

**Safeguarding** `/standards/safeguarding`
- Zero tolerance for sexual exploitation, abuse and harassment. Safe reporting, no retaliation.
- Guardian consent plus the young person's own agreement for anyone under 18. We minimise names, school uniforms and precise locations.
- Voluntary participation, right to stop, no pressure to forgive, no graphic retelling.
- **No unsafe heroism:** participants must not enter active conflict zones, confront armed actors, handle weapons, expose survivors or mediate serious disputes. We do not provide clinical trauma services or disarmament.
- Our full Policies & Safeguarding Manual is available on request `[or TBD PDF]`.

**Editorial promise**
One message · one human truth · one source · one action · one question · one safety review · one access check — for every major piece we publish.

**Corrections and withdrawal** `/standards/corrections-and-withdrawal`
> We correct factual errors publicly and promptly. If you contributed something and want it changed or removed, email peaceacrossgenerations@gmail.com with the subject "Withdrawal request". We will act as quickly as we can and confirm when it is done.

Keep a public **corrections log** (simple list from a data file: date, item, what changed).

---

### 6.19 Report a concern `/report-a-concern`

> # Report a concern
> If you are worried about the safety of a child or adult connected with our work, or about the behaviour of anyone representing Peace Across Generations, tell us. You will not face retaliation for raising a concern in good faith.

- Email: `[TBD dedicated safeguarding address, or peaceacrossgenerations@gmail.com with subject "Safeguarding – Confidential"]`
- Handled by our Safeguarding focal person, who is not the founder.
- **If someone is in immediate danger, contact local emergency services or a trusted local authority first.** `[TBD: verified South Sudan emergency and child helpline numbers — must be confirmed by the team before publishing]`

---

### 6.20 Contact `/contact`

> # Contact us
> Email: peaceacrossgenerations@gmail.com
> WhatsApp (submissions): `[TBD]`
> Follow us: `[TBD handles]`
> Based in South Sudan, working with South Sudanese everywhere.

Quick links: Send your work · Host a club · Speak · Media enquiries · Report a concern.

---

### 6.21 Privacy `/privacy`

Plain-language notice covering:
- What we collect (only what you send us with your work; no accounts)
- Why (to review, publish with consent and contact you about your work)
- Who sees it (restricted to the core team; public name is kept separate from private contact details)
- Analytics (cookie-free, no personal tracking)
- How long we keep it and how to ask for deletion
- Contact for privacy requests

Builder: draft this from the list above and mark it `[Draft – for team review]`.

### 6.22 404

> # This path doesn't lead anywhere — yet.
> Like peace, some roads are still being built. [Go home] [Take part]

---

## 7. Content model (Astro content collections)

Use Zod schemas. All content lives in `src/content/`.

### 7.1 `themes`
```yaml
title: "Unlearn Hate"
slug: "unlearn-hate"
month: "2026-10"
startDate: 2026-10-01
endDate: 2026-10-31
intro: "..."
creativePrompt: "..."
exampleLink: "/stories/..."        # optional
peaceTalk: "..."                    # topic line
conversationQuestion: "..."
clubsAndCircles: "..."
pauseFocus: "..."
weeklyActions:                      # Peace Where We Live
  - weekOf: 2026-10-03
    action: "Read a Letter for Peace aloud at dinner."
coreMessage: "No child is born carrying an inherited enemy."
```

### 7.2 `stories` (one collection for all published content)
```yaml
title: "..."
type: letter | poem | song | art | photo | drama | solidarity | episode | ask-an-elder | younger-self | talk | explainer | action-report
programme: creative | clubs | talks | conversations | threads
theme: "unlearn-hate"
date: 2026-10-14
contributorDisplayName: "Anonymous"        # never a legal name unless consented
anonymous: true
ageGroup: "18-24"                          # optional; omit for minors if safer
location: "Diaspora – Kenya"               # optional; country or state only, never precise
language: "Dinka"                          # language of the original
englishSummary: "..."
audio: { src: "/audio/ep01.mp3", sizeMB: 8.2, durationMin: 21 }   # optional
video: { platform: facebook | youtube, url: "...", thumbnail: "..." }  # optional
image: { src: "...", alt: "..." }          # optional
transcript: true | false
sources: [{ label: "...", url: "..." }]    # required for explainer and talk
reflectionQuestion: "..."
action: "..."
featured: false
creatorOfTheMonth: false
foundingCreator: false
consent:                                   # internal check, NOT rendered
  recorded: true
  guardianConsent: true | false | n/a
  reviewedBy2: true                        # two-person review for sensitive content
draft: false
```
**Build guard:** fail the build (or exclude the item and log a warning) if `consent.recorded !== true`, or if `ageGroup === "under-18"` and `guardianConsent !== true`, or if `type` is `explainer`/`talk` and `sources` is empty. Consent records themselves live offline; this field only confirms the check was done.

### 7.3 `talks` (schedule; recording links to a `stories` item once published)
```yaml
title, month, date, time, timezone: "Africa/Juba", topic, skill,
speaker: "TBD", coHost: "TBD", facebookLiveUrl, status: upcoming | live | recorded, recording: "stories/slug"
```

### 7.4 `team`
```yaml
role, name (nullable), bio, photo, open: true|false
```

### 7.5 Data files (`src/data/`)
- `site.json` — name, tagline, email, WhatsApp, socials, commitment start/end dates
- `pilot-progress.json` — indicator, target, current, lastUpdated
- `corrections.json` — date, item, change
- `partners.json` — empty at launch; only add with written agreement
- `founding-creators.json` — opt-in display names

---

## 8. Components

1. **DayCounter** — computes day number from 2026-09-21 (Day 1) to 2034-12-07 (Day 3,000) in `Africa/Juba` time. Before start: "Begins 21 September 2026". After end: "3,000 days completed". Render the number at build time and update client-side with a tiny script so it's correct without JS too (rebuild daily via scheduled deploy hook, or accept client update).
2. **ThemeBanner** — current month theme, prompt, CTA.
3. **ProgrammeCard** — icon, colour tag, title, one-liner, link.
4. **StoryCard** / **StoryList** with filters.
5. **ProgressTable** — target vs so-far, with "last updated" date, no animated vanity counters.
6. **AudioPlayer** — native `<audio preload="none">` with custom minimal controls, file size, duration, download link, English summary toggle.
7. **VideoFacade** — thumbnail + play button; loads embed only on click; "Low-data mode" shows a text link instead.
8. **WhatsAppButton** / **EmailButton** — prefilled templates.
9. **LowDataToggle** — in header.
10. **SafetyNote** — reusable callout box.
11. **IndependenceLine** — footer statement.
12. **Timeline** — for phases and monthly cycle.
13. **QuoteRotator** — core messages (CSS-only or tiny script; respects `prefers-reduced-motion`).

---

## 9. Forms and data (v1 vs later)

| Need | v1 | Later option |
|---|---|---|
| Submissions | WhatsApp + email links with templates | Form to a team-controlled inbox with consent checkboxes; must meet the Data Privacy policy |
| Host a club/circle | mailto | Short form |
| Newsletter | None; point to WhatsApp channel/social `[TBD]` | Privacy-friendly email tool |
| Donations | None | Only after registration/fiscal hosting is formally decided |
| Comments on site | None (moderation risk) | Keep discussion on moderated social channels |

---

## 10. Safeguarding rules the website itself must enforce

- No photo of a child's face without `guardianConsent: true`; default to illustrations.
- No school names or uniforms shown for club members during the pilot unless the school and guardians agree in writing.
- Locations shown at country or state level at most — never villages, camps or live locations.
- No unconsented tagging; social share text never tags contributors.
- Content warnings before any piece touching grief or loss (January theme especially): *"This piece talks about loss. Take care while reading or listening."*
- Every published item shows the correction/withdrawal link.
- Image EXIF metadata (including GPS) stripped on build (use `sharp` in the image pipeline).

---

## 11. SEO, sharing and metadata

- Title pattern: `[Page] · Peace Across Generations`
- Default meta description: *"An independent, youth-led, non-partisan peacebuilding initiative connecting South Sudanese across communities, generations and borders. Every Voice. Every Generation. One Peace."*
- Open Graph image: generated per page (title + tagline on brand background), ≤ 100 KB. WhatsApp link previews are the main sharing channel — test them.
- `schema.org`: `Organization` (without claiming legal status), `PodcastEpisode`/`AudioObject` for episodes, `Event` for Peace Talks.
- Sitemap.xml, robots.txt, RSS feed for stories and a podcast RSS feed for Generations in Conversation (lets people subscribe in podcast apps later).
- Canonical URLs; `lang="en"` and per-item `lang` where content is in another language.

---

## 12. Build phases

**Phase A — Launch MVP (target: by 18 October 2026, alongside the first episode)**
Home, About, 3,000 Days, Programmes overview + 4 programme pages, This Month (October), Take Part, Submit, Standards (guidelines, safeguarding, corrections), Report a concern, Contact, Privacy, 404. Stories library with empty-state. Day counter. Low-data mode.

**Phase B — Content live (late October – November)**
Stories library populated; Peace Talks schedule and first recording; Generations in Conversation episodes with podcast RSS; Pause Before You Share hub; Schools & Communities; Running threads; November theme page.

**Phase C — Showcase (February 2027)**
Online showcase gallery, Creator of the Month archive, Founding Creators wall, pilot progress updated, "Coming next" page refreshed after the pilot review.

**Phase D — After pilot**
Translations (Arabic with RTL, then South Sudanese languages), Decap CMS for non-technical publishing, submission form, radio partner page, fellowship application page.

---

## 13. Placeholders the team must supply before launch

| Item | Needed for |
|---|---|
| ~~Final logo and brand colours~~ Done: horizontal logo supplied, colours in Section 4 | — |
| Reversed (white) logo for dark backgrounds, and a square symbol/SVG for the favicon | Dark mode, footer, favicon |
| WhatsApp submission number | Submit, Contact, footer |
| Social media handles | Footer, Contact |
| Domain name | Deployment |
| Founder bio (60–80 words) and photo | About |
| Names of other team members (or leave roles "open") | About |
| Safeguarding contact route (must not be the founder) | Report a concern |
| Verified emergency / child helpline numbers for South Sudan | Report a concern |
| Verified links for #defyhatenow and 211Check | Pause Before You Share |
| Guardian consent form, adult consent form (PDF) | Submit |
| Interview guide, circle conversation guide, school letter (PDF) | Programme pages |
| First published contributions (with consent) | Stories, Home |
| Peace Talks speakers as confirmed | Peace Talks |
| Privacy notice review | Privacy |

---

## 14. Prompt to paste into Claude Code

```
You are building the website for Peace Across Generations, an independent,
youth-led, non-partisan peacebuilding initiative for South Sudan.

The full specification is in PAG_Website_Brief_for_Claude_Code.md in this
repository. Read it completely before writing any code, and follow it exactly.

Build Phase A (Section 12) first:
1. Scaffold an Astro project with static output, content collections
   (Section 7) and the brand tokens, logo rules and contrast rules in
   Section 4. The logo is in public/brand/pag-logo.png.
2. Build the shared layout: header with navigation and Low-data mode toggle,
   footer with the independence line and Day counter.
3. Build every Phase A page using the copy in Section 6 word for word.
4. Create the October 2026 theme entry and the September launch entry from
   the table in Section 6.11, plus the remaining months as draft entries.
5. Add the build guards in Section 7.2 and the safeguarding rules in Section 10.
6. Leave every [TBD] visible as a clearly styled placeholder. Never invent
   names, numbers, partners, links, phone numbers or photos.
7. Meet the performance budget in Section 3.2 and WCAG 2.2 AA. Run Lighthouse
   on mobile with Slow 4G throttling and report the scores.
8. Write a short README explaining how a non-technical team member adds a new
   story, a new monthly theme and updates pilot progress.

When Phase A is done, stop and summarise what was built, what placeholders
remain, and any decisions you need from the team before Phase B.
```
