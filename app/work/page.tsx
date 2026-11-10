import Image from 'next/image';
import Link from 'next/link';
import { PageIntro } from '../components/site';
import { getProjects } from '../lib/projects';

export const metadata = { title: 'Selected Work', description: 'Projects, partnerships and practical contributions to building better businesses.', alternates: { canonical: '/work' } };

export default async function Work({ searchParams }: PageProps<'/work'>) {
  const projects = await getProjects();
  const categories = [...new Set(projects.flatMap(project => project.basics.categories))].sort();
  const params = await searchParams;
  const selected = typeof params.category === 'string' && categories.includes(params.category) ? params.category : '';
  const visible = selected ? projects.filter(project => project.basics.categories.includes(selected)) : projects;
  return <main>
    <PageIntro kicker="Selected Work" title="The work, and what it made possible."><p>A closer look at projects and partnerships: the challenge, my contribution, and the outcomes we built together.</p></PageIntro>
    <section className="section container">
      <nav className="filter-tabs" aria-label="Filter selected work"><Link href="/work" aria-current={!selected ? 'page' : undefined}>All Work</Link>{categories.map(category => <Link key={category} href={`/work?category=${encodeURIComponent(category)}`} aria-current={selected === category ? 'page' : undefined}>{category}</Link>)}</nav>
      {visible.length ? <div className="work-grid">{visible.map(project => <article className="work-card" key={project.slug}>
        <div className="work-cover"><Image src={project.visuals.cover} alt={project.visuals.coverAlt} fill sizes="(max-width:760px) 90vw, 45vw" style={{ objectFit: 'cover' }}/></div>
        <div className="work-card-copy"><span className="eyebrow">{project.basics.categories.join(' · ')}{project.publication.featured ? ' · Featured' : ''}</span><h2>{project.title}</h2>{project.basics.organisation && <p className="work-organisation">{project.basics.organisation}</p>}<p>{project.basics.description}</p><p className="work-role"><strong>My role:</strong> {project.basics.role}{project.basics.year ? ` · ${project.basics.year}` : ''}</p><Link className="outline-link" href={`/work/${project.slug}`} aria-label={`View case study: ${project.title}`}>View case study <span aria-hidden="true">↗</span></Link></div>
      </article>)}</div> : <div className="empty-insights"><h2>Case studies are being prepared.</h2><p>For a conversation about my experience and how I can contribute, <Link href="/contact">get in touch</Link>.</p></div>}
    </section>
  </main>;
}
