import Image from 'next/image';
import { RichText } from '../../components/rich-text';
import { publicationDate } from '../../lib/dates';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getInsight, getPreviousSlug, getInsights, getPlaybackLinks } from '../../lib/insights';
import { OutlineLink } from '../../components/site';
import { HeroBackground } from '../../components/site-client';
import settings from '../../../content/site-settings.json';

export async function generateStaticParams() {
  return (await getInsights()).flatMap(item => [item.slug, ...(item.previousSlugs || [])].map(slug => ({ slug })));
}

export const dynamicParams = false;

type Props = PageProps<'/insights/[slug]'>;
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {slug}=await params; const item=await getInsight(slug);
  if(!item){const previous=await getPreviousSlug(slug);if(previous)return{title:previous.title};}
  if(!item)return{title:'Insight not found'};
  return{title:item.title,description:item.summary,openGraph:{type:'article',title:item.title,description:item.summary,...(item.image?{images:[item.image]}:{})},alternates:{canonical:`/insights/${item.slug}`}};
}
export default async function InsightPage({params}:Props) {
  const {slug}=await params;const item=await getInsight(slug);if(!item){const previous=await getPreviousSlug(slug);if(previous)permanentRedirect(`/insights/${previous.slug}`);notFound();}
  const date=publicationDate(item.publishedAt);const paragraphs=item.body?.split(/\n\s*\n/).map(text=>text.trim()).filter(Boolean)||[];
  const schema=item.type==='article'?{'@context':'https://schema.org','@type':'Article',headline:item.title,description:item.summary,datePublished:item.publishedAt,author:{'@type':'Person',name:'Seamas Vincent'}}:{'@context':'https://schema.org','@type':'CreativeWork',name:item.title,description:item.summary,author:{'@type':'Person',name:'Seamas Vincent'}};
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><section className="detail-header"><HeroBackground image={settings.insightsHeroPhoto.image} alt={settings.insightsHeroPhoto.alt||'Seamas Vincent'} focalX={settings.insightsHeroPhoto.focalX} focalY={settings.insightsHeroPhoto.focalY}/><div className="hero-shade hero-shade-interior" aria-hidden="true"/><div className="container detail-header-content"><span className="eyebrow">{item.type}{date?` · ${date.label}`:''}</span><h1>{item.title}</h1><p>{item.summary}</p></div></section><article className="detail-article">{item.image?<div className="detail-image"><Image src={item.image} alt={item.imageAlt||item.title} fill sizes="(max-width: 760px) 90vw, 760px" style={{objectFit:'cover',objectPosition:`${item.focalX??50}% ${item.focalY??50}%`}}/></div>:null}
    <div className="prose article-body">{item.type==='article'?paragraphs.map((text,index)=><p key={index}>{text}</p>):item.body?.trim()?<section className="episode-article"><h2>Episode article</h2><RichText text={item.body}/></section>:null}{item.notes&&<section className="insight-additional"><h2>Additional information</h2>{item.notes.split(/\n\s*\n/).map((text,index)=><p key={index}>{text}</p>)}</section>}{item.type!=='article'&&<div className="playback-links" aria-label="Playback links">{getPlaybackLinks(item).map((link,index)=><a key={index} className="button button-amber" href={link.url} target="_blank" rel="noopener noreferrer">{link.format} on {link.platform} ↗</a>)}</div>}</div>
    {item.relatedLinks&&item.relatedLinks.length>0&&<section className="prose related-links"><h2>Related links</h2><ul>{item.relatedLinks.map(link=><li key={`${link.label}-${link.url}`}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a></li>)}</ul></section>}<div className="detail-back"><OutlineLink href="/insights">Back to Insights</OutlineLink></div></article></main>;
}
