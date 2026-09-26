import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Files starting with "_" (templates, examples) are never loaded.
const md = (base: string) => glob({ pattern: '**/[^_]*.{md,mdx}', base: `./src/content/${base}` });

const themes = defineCollection({
  loader: md('themes'),
  schema: z.object({
    title: z.string(),
    month: z.string().regex(/^\d{4}-\d{2}$/),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    intro: z.string(),
    creativePrompt: z.string(),
    exampleLink: z.string().optional(),
    peaceTalk: z.string().optional(),
    conversationQuestion: z.string().optional(),
    clubsAndCircles: z.string().optional(),
    pauseFocus: z.string().optional(),
    weeklyActions: z.array(z.object({ weekOf: z.coerce.date(), action: z.string() })).default([]),
    coreMessage: z.string().optional(),
    contentWarning: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const storyTypes = [
  'letter', 'poem', 'song', 'art', 'photo', 'drama', 'solidarity', 'episode',
  'ask-an-elder', 'younger-self', 'talk', 'explainer', 'action-report',
] as const;

export const programmes = ['creative', 'clubs', 'talks', 'conversations', 'threads'] as const;

const stories = defineCollection({
  loader: md('stories'),
  schema: z.object({
    title: z.string(),
    type: z.enum(storyTypes),
    programme: z.enum(programmes),
    theme: z.string().optional(),
    date: z.coerce.date(),
    contributorDisplayName: z.string().default('Anonymous'),
    anonymous: z.boolean().default(false),
    ageGroup: z.enum(['under-18', '18-24', '25-35', 'over-35']).optional(),
    location: z.string().optional(),
    language: z.string().default('English'),
    langCode: z.string().optional(),
    englishSummary: z.string().optional(),
    translatedBy: z.string().optional(),
    audio: z.object({ src: z.string(), sizeMB: z.number(), durationMin: z.number() }).optional(),
    video: z.object({ platform: z.enum(['facebook', 'youtube']), url: z.string().url(), thumbnail: z.string().optional() }).optional(),
    image: z.object({ src: z.string(), alt: z.string() }).optional(),
    transcript: z.boolean().default(false),
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    reflectionQuestion: z.string(),
    action: z.string(),
    contentWarning: z.boolean().default(false),
    featured: z.boolean().default(false),
    creatorOfTheMonth: z.boolean().default(false),
    foundingCreator: z.boolean().default(false),
    // Internal check only. Never rendered. Consent records live offline.
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
  schema: z.object({
    order: z.number(),
    role: z.string(),
    name: z.string().nullable().default(null),
    bio: z.string().nullable().default(null),
    photo: z.string().nullable().default(null),
    open: z.boolean().default(true),
  }),
});

export const collections = { themes, stories, talks, team };
