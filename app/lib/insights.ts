import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export type PlaybackLink = { platform: string; url: string; format: 'Watch' | 'Listen' };
export type Insight = { title: string; slug: string; previousSlugs?: string[]; type: 'article'|'video'|'podcast'; status?: 'draft'|'published'; summary: string; image?: string; imageAlt?: string; focalX?: number; focalY?: number; publishedAt?: string; body?: string; platformUrl?: string; platformName?: string; playbackLinks?: PlaybackLink[]; notes?: string; relatedLinks?: {label:string;url:string}[] };
const contentDir = path.join(process.cwd(), 'content', 'insights');

export function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try { const url = new URL(value); return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password; } catch { return false; }
}

export function getPlaybackLinks(item: Insight): PlaybackLink[] {
  if (item.type === 'article') return [];
  const links = (Array.isArray(item.playbackLinks) ? item.playbackLinks : []).filter(link =>
    link && typeof link.platform === 'string' && link.platform.trim() && isHttpsUrl(link.url) && (link.format === 'Watch' || link.format === 'Listen')
  ).map(link => ({ ...link, platform: link.platform.trim(), url: link.url.trim() }));
  if (links.length || !isHttpsUrl(item.platformUrl)) return links;
  const hostname = new URL(item.platformUrl).hostname.replace(/^www\./, '');
  const platform = item.platformName?.trim() || (['youtube.com', 'youtu.be'].includes(hostname) ? 'YouTube' : hostname === 'open.spotify.com' ? 'Spotify' : hostname);
  return [{ platform, url: item.platformUrl.trim(), format: item.type === 'video' ? 'Watch' : 'Listen' }];
}

export function normalizeSlug(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function prepareInsights(items: Insight[]): Insight[] {
  // Reserve draft URLs too. Never silently move an existing URL or choose a collision winner.
  const owners = new Map<string, Insight>();
  const normalized = items.map(item => {
    const slug = normalizeSlug(item.slug || item.title || '');
    if (!slug) throw new Error(`Insight "${item.title}" needs a lowercase, hyphenated slug.`);
    const previousSlugs = [...new Set([...(item.previousSlugs || []), ...(item.slug && item.slug !== slug ? [item.slug] : [])])].filter(value => value !== slug);
    const result = { ...item, slug, previousSlugs, playbackLinks: getPlaybackLinks(item), relatedLinks: (item.relatedLinks || []).filter(link => link && isHttpsUrl(link.url)) };
    for (const url of [slug, ...previousSlugs]) {
      if (owners.has(url)) throw new Error(`Insight URL collision: "${url}" belongs to both "${owners.get(url)!.title}" and "${item.title}". Choose a unique slug (for example, append -2) and keep previous slugs unique.`);
      owners.set(url, item);
    }
    return result;
  });
  return normalized.filter(item => item.status !== 'draft' && item.title?.trim() && item.summary?.trim() &&
    (item.type === 'article' ? item.body?.trim() : ['video', 'podcast'].includes(item.type) && item.playbackLinks.length > 0)
  ).sort((a,b) => (b.publishedAt || '').localeCompare(a.publishedAt || '') || a.slug.localeCompare(b.slug));
}

export async function getInsights(): Promise<Insight[]> {
  const files = (await readdir(contentDir)).filter(file => file.endsWith('.json')).sort();
  const items = await Promise.all(files.map(async file => JSON.parse(await readFile(path.join(contentDir, file), 'utf8')) as Insight));
  return prepareInsights(items);
}

export function decodeInsightSlug(slug: string) {
  try { return decodeURIComponent(slug); } catch { return slug; }
}

export async function getInsight(slug: string) { return (await getInsights()).find(item => item.slug === decodeInsightSlug(slug)); }
export async function getPreviousSlug(slug: string) { return (await getInsights()).find(item => item.previousSlugs?.includes(decodeInsightSlug(slug))); }
