import Link from 'next/link';
import Image from 'next/image';
import { HeroBackground } from './site-client';
import settings from '../../content/site-settings.json';

type PhotoKey = keyof typeof settings;
export const pages = [['About','/about'],['Mission','/mission'],['Speaking','/speaking'],['Insights','/insights'],['Selected Work','/work'],['Resources','/books'],['Contact','/contact']] as const;
function safeHttps(value: string) { try { return new URL(value).protocol === 'https:'; } catch { return false; } }

export function Footer() {
  const additional=settings.additionalSocialLinks as {platform:string;url:string}[];
  const social = ([
    ['Instagram',settings.socialLinks.instagram],['LinkedIn',settings.socialLinks.linkedin],['X / Twitter',settings.socialLinks.x],['YouTube',settings.socialLinks.youtube],
    ...additional.map(item => [item.platform,item.url] as [string,string]),
  ] as [string,string][]).filter(([label,url]) => Boolean(label && url && safeHttps(url)));
  return <footer className="site-footer"><div className="footer-inner"><div><Link className="footer-mark" href="/">Seamas Vincent</Link><p>Building businesses. Shaping how we build.</p>{social.length>0&&<nav className="footer-social" aria-label="Social links">{social.map(([label,url])=><a key={`${label}-${url}`} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}><SocialIcon label={label}/><span className="sr-only">{label}</span></a>)}</nav>}<p>Abuja, Nigeria · © {new Date().getFullYear()} Seamas Vincent</p></div><nav aria-label="Footer navigation">{pages.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</nav></div></footer>;
}
function SocialIcon({label}:{label:string}) {
  const shape=/instagram/i.test(label)?<><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r=".8" fill="currentColor"/></>:/linkedin/i.test(label)?<path d="M5 9v10M5 5v.1M9 19v-6a4 4 0 0 1 8 0v6M9 10v9"/>:/youtube/i.test(label)?<><rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></>:/twitter|\bx\b/i.test(label)?<path d="m5 4 14 16M19 4 5 20M5 4h4l10 16h-4"/>:<><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></>;
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{shape}</svg>;
}

export function PhotoGallery({photos,label}:{photos?:{image?:string;alt?:string;caption?:string;focalX?:number;focalY?:number}[];label:string}) {
  const images=photos?.filter(photo=>photo.image)||[]; if(!images.length)return null;
  return <div className={`editorial-gallery ${images.length>1?'editorial-gallery-grid':''}`} aria-label={label}>{images.map((photo,index)=><figure className="editorial-figure" key={`${photo.image}-${index}`}><div className="editorial-photo"><Image src={photo.image!} alt={photo.alt||photo.caption||label} fill sizes="(max-width: 760px) 90vw, 65vw" style={{objectFit:'cover',objectPosition:`${photo.focalX??50}% ${photo.focalY??50}%`}}/></div>{photo.caption&&<figcaption>{photo.caption}</figcaption>}</figure>)}</div>;
}

export function PhotoSlot({label,ratio='portrait',className='',slot,fallback=false}:{label:string;ratio?:string;className?:string;slot?:PhotoKey;fallback?:boolean}) {
  const photo=slot?settings[slot] as {image?:string;alt?:string;focalX?:number;focalY?:number}:undefined; const image=photo?.image||(fallback?'/portrait.jpg':''); if(!image)return null;
  return <div className={`photo-slot ratio-${ratio} ${slot==='heroPhoto'?'hero-photo':''} has-upload ${className}`}><Image src={image} alt={photo?.image?photo.alt||label:label} fill sizes="(max-width: 760px) 90vw, 45vw" priority={slot==='heroPhoto'} style={{objectFit:slot==='heroPhoto'?'contain':'cover',objectPosition:`${photo?.focalX??50}% ${photo?.focalY??50}%`}}/></div>;
}
export function OutlineLink({href,children}:{href:string;children:React.ReactNode}) { return <Link className="outline-link" href={href}>{children}<span aria-hidden="true"> ↗</span></Link>; }
export function PageIntro({kicker,title,children,photo}:{kicker:string;title:string;children?:React.ReactNode;photo?:PhotoKey}) {
  const image=photo?settings[photo] as {image?:string;alt?:string;focalX?:number;focalY?:number}:undefined;
  return <section className="page-intro"><HeroBackground image={image?.image} alt={image?.alt||`${kicker} portrait`} focalX={image?.focalX} focalY={image?.focalY}/><div className="hero-shade hero-shade-interior" aria-hidden="true"/><div className="container page-intro-content"><div className="page-intro-copy"><span className="eyebrow">{kicker}</span><h1>{title}</h1>{children&&<div className="intro-copy">{children}</div>}</div></div></section>;
}
export function CopyParagraphs({paragraphs}:{paragraphs:string[]}) { return <>{paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</>; }
