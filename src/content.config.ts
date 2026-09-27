import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Files starting with "_" (templates, examples) are never loaded.
const md = (base: string) => glob({ pattern: '**/[^_]*.{md,mdx}', base: `./src/content/${base}` });

const video = z.object({
  platform: z.enum(['youtube', 'facebook']),
  url: z.string().url(),
  title: z.string(),
});

/**
 * Campaigns (one per month). The collection keeps its original name,
 * "themes"; the site shows them at /campaigns/<file-name>.
 */
const themes = defineCollection({
  loader: md('themes'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      month: z.string().regex(/^\d{4}-\d{2}$/),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      /** Stage of "Our approach" this campaign belongs to (Understand … Build). */
      stage: z.enum(['understand', 'unlearn', 'choose', 'lead', 'heal', 'build']).optional(),
      intro: z.string(),
      /** The campaign message people respond to. */
      message: z.string().optional(),
      creativePrompt: z.string(),
      objectives: z.array(z.string()).default([]),
      keyQuestions: z.array(z.string()).default([]),
      contributionTypes: z.array(z.string()).default([]),
      participation: z.string().optional(),
      exampleLink: z.string().optional(),
      peaceTalk: z.string().optional(),
      conversationQuestion: z.string().optional(),
      clubsAndCircles: z.string().optional(),
      pauseFocus: z.string().optional(),
      weeklyActions: z.array(z.object({ weekOf: z.coerce.date(), action: z.string() })).default([]),
      videos: z.array(video).default([]),
      photos: z.array(z.object({ src: image(), alt: z.string(), credit: z.string().optional() })).default([]),
      /** Honest results, added after the month ends. */
      impact: z.string().optional(),
      coreMessage: z.string().optional(),
      contentWarning: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const storyTypes = [
  'video', 'story', 'reflection', 'letter', 'poem', 'song', 'art', 'photo', 'drama', 'solidarity', 'episode',
  'ask-an-elder', 'younger-self', 'talk', 'explainer', 'action-report',
] as const;

export const programmes = ['creative', 'clubs', 'talks', 'conversations', 'threads'] as const;

export const contributorCategories = [
  'youth', 'elders', 'women', 'artists', 'educators', 'community-leaders', 'peacebuilders', 'diaspora',
] as const;

const stories = defineCollection({
  loader: md('stories'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      type: z.enum(storyTypes),
      programme: z.enum(programmes),
      theme: z.string().optional(),
      date: z.coerce.date(),
      contributorDisplayName: z.string().default('Anonymous'),
      anonymous: z.boolean().default(false),
      contributorCategories: z.array(z.enum(contributorCategories)).default([]),
      ageGroup: z.enum(['under-18', '18-24', '25-35', '36-59', '60-plus', 'over-35']).optional(),
      location: z.string().optional(),
      language: z.string().default('English'),
      langCode: z.string().optional(),
      englishSummary: z.string().optional(),
      /** A short line from the piece, shown in "Featured voices". */
      quote: z.string().optional(),
      translatedBy: z.string().optional(),
      audio: z.object({ src: z.string(), sizeMB: z.number(), durationMin: z.number() }).optional(),
      video: z.object({ platform: z.enum(['facebook', 'youtube']), url: z.string().url(), thumbnail: z.string().optional() }).optional(),
      image: z.object({ src: image(), alt: z.string() }).optional(),
      transcript: z.boolean().default(false),
      sources: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
      reflectionQuestion: z.string(),
      action: z.string(),
      contentWarning: z.boolean().default(false),
      featured: z.boolean().default(false),
      creatorOfTheMonth: z.boolean().default(false),
      foundingCreator: z.boolean().default(false),
      /** Reference of the moderated submission this story came from (PAG-XXXX-XXXX). */
      submissionRef: z.string().optional(),
      // Internal check only. Never rendered. Consent records live offline / in the moderation queue.
      consent: z.object({
        recorded: z.boolean(),
        guardianConsent: z.union([z.boolean(), z.literal('n/a')]),
        reviewedBy2: z.boolean().default(false),
      }),
      draft: z.boolean().default(false),
    }),
});

const talks = defineCollection({
  loader: md('talks'),
  schema: z.object({
    title: z.string(),
    month: z.string().regex(/^\d{4}-\d{2}$/),
    date: z.coerce.date().optional(),
    time: z.string().optional(),
    timezone: z.string().default('Africa/Juba'),
    topic: z.string(),
    skill: z.string().optional(),
    speaker: z.string().default('TBD'),
    coHost: z.string().default('TBD'),
    facebookLiveUrl: z.string().url().optional(),
    status: z.enum(['upcoming', 'live', 'recorded']).default('upcoming'),
    recording: z.string().optional(),
  }),
});

const team = defineCollection({
  loader: md('team'),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      role: z.string(),
      name: z.string().nullable().default(null),
      bio: z.string().nullable().default(null),
      photo: image().nullable().default(null),
      open: z.boolean().default(true),
    }),
});

export const postCategories = ['peace', 'development', 'youth', 'education', 'community', 'culture'] as const;

// Blog: sourced reports on peace and development progress in South Sudan.
const posts = defineCollection({
  loader: md('posts'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string(),
      category: z.enum(postCategories),
      author: z.string().default('Peace Across Generations'),
      location: z.string().optional(),
      image: z.object({ src: image(), alt: z.string(), credit: z.string().optional() }).optional(),
      // Every post must cite at least one source (enforced in publishedPosts()).
      sources: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
      contentWarning: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const resourceTypes = ['article', 'research', 'guide', 'book', 'video', 'toolkit', 'podcast'] as const;

const resources = defineCollection({
  loader: md('resources'),
  schema: z.object({
    title: z.string(),
    type: z.enum(resourceTypes),
    summary: z.string(),
    /** External link, or an internal path such as /pause-before-you-share/. */
    url: z.string(),
    publisher: z.string().optional(),
    year: z.number().optional(),
    language: z.string().default('English'),
    /** Approximate size for downloads, e.g. "PDF · 2 MB". */
    size: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const events = defineCollection({
  loader: md('events'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    time: z.string().optional(),
    timezone: z.string().default('Africa/Juba'),
    online: z.boolean().default(true),
    /** City or state level only. */
    location: z.string().optional(),
    summary: z.string(),
    campaign: z.string().optional(),
    registrationUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

/** Public contributor profiles — only with the person's written consent. */
const contributors = defineCollection({
  loader: md('contributors'),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      categories: z.array(z.enum(contributorCategories)).default([]),
      location: z.string().optional(),
      bio: z.string(),
      photo: z.object({ src: image(), alt: z.string() }).optional(),
      links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
      profileConsent: z.literal(true),
      draft: z.boolean().default(false),
    }),
});

export const collections = { themes, stories, talks, team, posts, resources, events, contributors };
