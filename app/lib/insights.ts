import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export type Insight = { title: string; slug: string; previousSlugs?: string[]; type: 'article'|'video'|'podcast'; status?: 'draft'|'published'; summary: string; image?: string; imageAlt?: string; focalX?: number; focalY?: number; publishedAt?: string; body?: string; platformUrl?: string; platformName?: string; notes?: string; relatedLinks?: {label:string;url:string}[] };
const contentDir = path.join(process.cwd(), 'content', 'insights');
function isReadyToPublish(item: Insight) {
  const hasSummary = typeof item.summary === 'string' && item.summary.trim().length > 0;
  const hasArticle = typeof item.body === 'string' && item.body.trim().length > 0;
  let hasPlatformUrl = false;
  try { const url = new URL(item.platformUrl || ''); hasPlatformUrl = url.protocol === 'https:' && Boolean(url.hostname); } catch { /* Incomplete platform links stay private. */ }
  return item.status !== 'draft' && Boolean(item.title?.trim() && item.slug?.trim() && hasSummary) && (item.type === 'article' ? hasArticle : hasPlatformUrl);
}

export async function getInsights(): Promise<Insight[]> {
  try {
    const files = (await readdir(contentDir)).filter(file => file.endsWith('.json'));
    const items = await Promise.all(files.map(async file => JSON.parse(await readFile(path.join(contentDir, file), 'utf8')) as Insight));
    return items.filter(isReadyToPublish).map(item=>({...item,relatedLinks:(item.relatedLinks||[]).filter(link=>{try{return new URL(link.url).protocol==='https:'}catch{return false}})})).sort((a,b) => (b.publishedAt || '').localeCompare(a.publishedAt || '') || a.slug.localeCompare(b.slug));
  } catch { return []; }
}

export async function getInsight(slug: string) { return (await getInsights()).find(item => item.slug === slug); }
export async function getPreviousSlug(slug: string) { return (await getInsights()).find(item => item.previousSlugs?.includes(slug)); }
