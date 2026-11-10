import type { MetadataRoute } from 'next';
import { getInsights } from './lib/insights';
import { getProjects } from './lib/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://seamas.sokeafrica.com';
  const pages = ['', '/about', '/mission', '/speaking', '/insights', '/work', '/books', '/contact'];
  const entries = await getInsights();
  const projects = await getProjects();
  return [
    ...pages.map(route => ({ url: `${base}${route}`, changeFrequency: route === '/insights' ? 'weekly' as const : 'monthly' as const, priority: route === '' ? 1 : .7 })),
    ...projects.map(project => ({ url: `${base}/work/${project.slug}`, changeFrequency: 'monthly' as const, priority: .7 })),
    ...entries.map(entry => ({ url: `${base}/insights/${entry.slug}`, lastModified: entry.publishedAt ? new Date(entry.publishedAt) : undefined, changeFrequency: 'yearly' as const, priority: .6 })),
  ];
}
