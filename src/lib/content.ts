import { getCollection, type CollectionEntry } from 'astro:content';
import { jubaToday } from './day';

export type Theme = CollectionEntry<'themes'>;
export type Story = CollectionEntry<'stories'>;

const day = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

export async function publishedThemes(): Promise<Theme[]> {
  const all = await getCollection('themes', ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.startDate.valueOf() - b.data.startDate.valueOf());
}

/** The theme whose date range contains today; else the next upcoming; else the latest. */
export async function currentTheme(now = new Date()): Promise<Theme | undefined> {
  const themes = await publishedThemes();
  const today = jubaToday(now);
  return (
    themes.find((t) => day(t.data.startDate) <= today && today <= day(t.data.endDate)) ??
    themes.find((t) => day(t.data.startDate) > today) ??
    themes.at(-1)
  );
}

/** This week's Peace Where We Live action: the latest one on or before today. */
export function weeklyAction(theme: Theme | undefined, now = new Date()) {
  if (!theme) return undefined;
  const today = jubaToday(now);
  const past = theme.data.weeklyActions.filter((a) => day(a.weekOf) <= today);
  return past.at(-1) ?? theme.data.weeklyActions[0];
}

/**
 * Safeguarding build guard (brief §7.2). A story is excluded, with a
 * warning in the build log, unless its consent check was recorded, a
 * guardian consented for under-18s, and explainers/talks cite sources.
 */
const warned = new Set<string>();
function passesGuard(s: Story): boolean {
  const d = s.data;
  const problems: string[] = [];
  if (d.consent.recorded !== true) problems.push('consent.recorded is not true');
  if (d.ageGroup === 'under-18' && d.consent.guardianConsent !== true)
    problems.push('under-18 without guardianConsent: true');
  if ((d.type === 'explainer' || d.type === 'talk') && d.sources.length === 0)
    problems.push(`type "${d.type}" has no sources`);
  if (problems.length) {
    if (!warned.has(s.id)) console.warn(`\n[PAG safeguarding] EXCLUDED story "${s.id}": ${problems.join('; ')}\n`);
    warned.add(s.id);
    return false;
  }
  return true;
}

export async function publishedStories(): Promise<Story[]> {
  const all = await getCollection('stories', ({ data }) => !data.draft);
  return all.filter(passesGuard).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const typeLabels: Record<Story['data']['type'], string> = {
  letter: 'Letter for Peace',
  poem: 'Poem',
  song: 'Song',
  art: 'Art',
  photo: 'Photo',
  drama: 'Drama',
  solidarity: 'Solidarity message',
  episode: 'Conversation',
  'ask-an-elder': 'Ask an Elder',
  'younger-self': 'What I’d Tell My Younger Self',
  talk: 'Peace Talk',
  explainer: 'Peace in 90 Seconds',
  'action-report': 'Peace action',
};

/** Library sections (/stories/[section]) and the story types each one lists. */
export const storySections = {
  letters: { title: 'Letters for Peace', types: ['letter'] },
  creative: { title: 'Poems, songs, art, photos and skits', types: ['poem', 'song', 'art', 'photo', 'drama', 'solidarity'] },
  conversations: { title: 'Generations in Conversation', types: ['episode', 'ask-an-elder', 'younger-self'] },
  talks: { title: 'Peace Talks recordings', types: ['talk'] },
  '90-seconds': { title: 'Peace in 90 Seconds', types: ['explainer'] },
} as const satisfies Record<string, { title: string; types: readonly Story['data']['type'][] }>;

export function readingMinutes(body: string | undefined) {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const monthName = (month: string) =>
  new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
