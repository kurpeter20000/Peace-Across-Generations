import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import site from '../data/site.json';
import { publishedStories, typeLabels } from '../lib/content';

export async function GET(context: APIContext) {
  const stories = await publishedStories();
  return rss({
    title: `Stories · ${site.name}`,
    description: site.description,
    site: context.site!,
    items: stories.map((s) => ({
      title: s.data.title,
      pubDate: s.data.date,
      description: s.data.englishSummary ?? typeLabels[s.data.type],
      link: `/stories/${s.id}/`,
      categories: [typeLabels[s.data.type]],
    })),
  });
}
