import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { findProject, getProjects } from '../../lib/projects';
import { publicationDate } from '../../lib/dates';
import { RichText } from '../../components/rich-text';
import { PhotoGallery } from '../../components/site';

export const dynamicParams = false;
export async function generateStaticParams() { return (await getProjects()).flatMap(project => [project.slug, ...(project.previousSlugs || [])].map(slug => ({ slug }))); }
export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { item } = await findProject((await params).slug);
  if (!item) return { title: 'Project not found' };
  const title = item.seo?.title || item.title, description = item.seo?.description || item.basics.description;
  return { title, description, alternates: { canonical: `/work/${item.slug}` }, openGraph: { title, description, images: [item.seo?.image || item.visuals.cover] } };
}
export default async function ProjectPage({ params }: PageProps<'/work/[slug]'>) {
  const { item, previous, projects } = await findProject((await params).slug);
  if (!item) { if (previous) permanentRedirect(`/work/${previous.slug}`); notFound(); }
  const index = projects.findIndex(project => project.slug === item.slug);
  const start = publicationDate(item.basics.startDate), end = publicationDate(item.basics.endDate);
  const sections = [['overview', 'Overview'], ['challenge', 'The challenge'], ['contribution', 'My contribution'], ['approach', 'Approach and execution'], ['results', 'Results'], ['lessons', 'Lessons']] as const;
  return <main>
    <header className="work-header container"><Link className="outline-link" href="/work">← Back to Selected Work</Link><span className="eyebrow">{item.basics.categories.join(' · ')}</span><h1>{item.title}</h1><p className="work-deck">{item.basics.description}</p><dl className="work-facts"><div><dt>My role</dt><dd>{item.basics.role}</dd></div>{item.basics.organisation && <div><dt>Organisation</dt><dd>{item.basics.organisation}</dd></div>}{item.basics.year && <div><dt>Year</dt><dd>{item.basics.year}</dd></div>}{item.basics.location && <div><dt>Location</dt><dd>{item.basics.location}</dd></div>}{(start || end) && <div><dt>Engagement</dt><dd>{start?.label}{start && end ? ' – ' : ''}{end?.label}</dd></div>}</dl></header>
    <div className="container work-hero"><Image src={item.visuals.cover} alt={item.visuals.coverAlt} fill sizes="90vw" priority style={{ objectFit: 'cover' }}/></div>
    <article className="detail-article work-story">{sections.map(([key, label]) => item.story[key]?.trim() ? <section className="prose article-body" key={key}><h2>{label}</h2><RichText text={item.story[key]!}/></section> : null)}
      {!!item.metrics?.length && <section aria-label="Project metrics" className="work-metrics">{item.metrics.map((metric, i) => <div key={i}><strong>{metric.value}</strong><h3>{metric.label}</h3><p>{metric.context}</p></div>)}</section>}
      <PhotoGallery photos={item.visuals.gallery} label={`${item.title} gallery`}/>
      {item.testimonial?.quote && item.testimonial.name && <figure className="work-testimonial"><blockquote>{item.testimonial.quote}</blockquote><figcaption>{item.testimonial.name}{item.testimonial.attribution ? ` — ${item.testimonial.attribution}` : ''}</figcaption></figure>}
      {!!item.externalLinks?.length && <section className="prose"><h2>Explore the work</h2><ul>{item.externalLinks.map((link, i) => <li key={i}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a></li>)}</ul></section>}
      <nav className="work-adjacent" aria-label="Adjacent projects">{projects[index - 1] && <Link href={`/work/${projects[index - 1].slug}`}>← Previous: {projects[index - 1].title}</Link>}{projects[index + 1] && <Link href={`/work/${projects[index + 1].slug}`}>Next: {projects[index + 1].title} →</Link>}</nav>
      <div className="work-contact"><Link href="/work">Back to Selected Work</Link><Link href="/contact">Let’s discuss your project ↗</Link></div>
    </article>
  </main>;
}
