import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export type Project = {
  title: string; slug: string; previousSlugs?: string[]; savedSlug?: string;
  basics: { organisation?: string; description: string; role: string; categories: string[]; year?: string; startDate?: string; endDate?: string; location?: string };
  visuals: { cover: string; coverAlt: string; gallery?: { image: string; alt: string; caption?: string }[] };
  story: { overview: string; challenge: string; contribution: string; approach: string; results: string; lessons?: string };
  metrics?: { value: string; label: string; context: string }[];
  testimonial?: { quote?: string; name?: string; attribution?: string };
  externalLinks?: { label: string; url: string }[];
  publication: { status: 'draft' | 'published' | 'hidden' | 'archived'; featured?: boolean; order?: number };
  seo?: { title?: string; description?: string; image?: string };
};

export function prepareProjects(entries: Project[]) {
  const owners = new Map<string, string>();
  for (const item of entries) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug || '')) throw new Error(`Project "${item.title}" needs a lowercase, hyphenated slug.`);
    for (const slug of new Set([item.slug, ...(item.previousSlugs || [])])) {
      if (!slug || /[/\\?#]/.test(slug)) throw new Error(`Project "${item.title}" has an invalid previous slug.`);
      if (owners.has(slug)) throw new Error(`Project URL collision: "${slug}" belongs to "${owners.get(slug)}" and "${item.title}". Choose a unique slug, such as ${item.slug}-2.`);
      owners.set(slug, item.title);
    }
    if (item.publication?.status === 'published') {
      const required = [item.title, item.basics?.description, item.basics?.role, item.visuals?.cover, item.visuals?.coverAlt, ...['overview', 'challenge', 'contribution', 'approach', 'results'].map(key => item.story?.[key as keyof Project['story']])];
      if (required.some(value => !value?.trim()) || !item.basics?.categories?.some(value => value.trim())) throw new Error(`Published project "${item.title}" needs basics, categories, cover with alt text, and all five case-study sections. Save it as draft while preparing it.`);
    }
  }
  return entries.filter(item => item.publication?.status === 'published').map(item => ({
    ...item,
    previousSlugs: [...new Set(item.previousSlugs || [])].filter(slug => slug !== item.slug),
    basics: { ...item.basics, categories: [...new Set(item.basics.categories.map(value => value.trim()).filter(Boolean))] },
    externalLinks: (item.externalLinks || []).filter(link => { try { const url = new URL(link.url); return link.label?.trim() && url.protocol === 'https:' && !url.username && !url.password; } catch { return false; } }),
  })).sort((a, b) => Number(Boolean(b.publication.featured)) - Number(Boolean(a.publication.featured)) || (a.publication.order ?? 100) - (b.publication.order ?? 100) || a.title.localeCompare(b.title));
}

export async function getProjects(): Promise<Project[]> {
  const directory = path.join(process.cwd(), 'content/projects');
  // An empty collection may not be included in a serverless deployment bundle.
  const files = (await readdir(directory).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return [];
    throw error;
  })).filter(file => file.endsWith('.json')).sort();
  return prepareProjects(await Promise.all(files.map(async file => JSON.parse(await readFile(path.join(directory, file), 'utf8')))));
}

export async function findProject(value: string) {
  let slug = value; try { slug = decodeURIComponent(value); } catch {}
  const projects = await getProjects();
  return { projects, item: projects.find(project => project.slug === slug), previous: projects.find(project => project.previousSlugs?.includes(slug)) };
}
