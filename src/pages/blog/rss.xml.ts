import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import site from '../../data/site.json';
import { publishedPosts, categoryLabels } from '../../lib/content';

export async function GET(context: APIContext) {
  const posts = await publishedPosts();
  return rss({
    title: `Progress for peace · ${site.name}`,
    description: 'Sourced reports on real progress in peace and development in South Sudan.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.summary,
      link: `/blog/${p.id}/`,
      categories: [categoryLabels[p.data.category]],
    })),
  });
}
