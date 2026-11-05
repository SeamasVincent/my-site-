'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import settings from '../../content/site-settings.json';

const pages = [
  ['Home', '/'], ['About', '/about'], ['Mission', '/mission'], ['Speaking', '/speaking'], ['Insights', '/insights'],
  ['Resources', '/books'], ['Contact', '/contact'],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <header className="site-header"><div className="nav-wrap">
    <Link className="wordmark" href="/" aria-label="Seamas Vincent home"><Image src="/logo.svg" alt="Seamas Vincent" width={570} height={125} priority /></Link>
    <button className="menu-toggle" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
    <nav id="site-navigation" className={open ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">{pages.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}</nav>
  </div></header>;
}

export function HeroBackground({ image, alt = 'Seamas Vincent portrait', focalX = 50, focalY = 50 }: { image?: string; alt?: string; focalX?: number; focalY?: number }) {
  const [failedImage, setFailedImage] = useState<string>();
  const src = image && image !== failedImage ? image : '/portrait.jpg';
  return <Image className="hero-background" src={src} alt={alt} fill priority sizes="100vw" onError={() => { if (image && image !== failedImage) setFailedImage(image); }} style={{ objectPosition: `${focalX}% ${focalY}%` }} />;
}

export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(frame); }, []);
  return <motion.div className={className} initial={!ready || reduce ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: reduce ? 0 : .58, ease: 'easeOut', delay: reduce ? 0 : delay }}>{children}</motion.div>;
}

export function Form({ kind }: { kind: 'contact' | 'speaking' }) {
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');
  const [error, setError] = useState('');
  const [values, setValues] = useState<Record<string,string>>({});
  const speaking = kind === 'speaking';
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus('sending'); setError('');
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch('/api/enquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...payload, kind }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your message could not be sent. Please try again.');
      setStatus('success'); setValues({}); form.reset();
    } catch (err) { setStatus('error'); setError(err instanceof Error ? err.message : 'Your message could not be sent. Please try again.'); }
  }
  if (status === 'success') return <div className="success-panel" role="status"><span className="eyebrow">Message received</span><h3>{speaking ? 'Thank you for considering Seamas Vincent.' : 'Thank you for getting in touch.'}</h3><p>{speaking ? 'Your speaking or workshop enquiry has been received.' : 'Your message has been received.'} Please allow <strong>{settings.responseTimeText}</strong> for a response. {speaking ? "I'll review the details and follow up to discuss the engagement." : 'I’ll read your note and get back to you.'}</p><div className="link-row"><Link className="text-link" href="/insights">Explore Insights</Link><Link className="text-link" href="/">Return to the homepage</Link></div></div>;
  const field = (name: string, label: string, type = 'text', required = false, wide = false, placeholder = '') => <label className={`field ${wide ? 'field-wide' : ''}`} key={name}>{label}{type === 'textarea' ? <textarea name={name} required={required} value={values[name] ?? ''} placeholder={placeholder} onChange={e => setValues({ ...values, [name]: e.target.value })} rows={5} /> : <input name={name} type={type} required={required} value={values[name] ?? ''} placeholder={placeholder} onChange={e => setValues({ ...values, [name]: e.target.value })} />}</label>;
  return <form className="enquiry-form" onSubmit={submit}>
    <div className="form-grid">
      {field('name','Your name','text',true)}{field('email','Your email','email',true)}{field('organisation','Organisation','text',false)}
      {speaking ? <>
        <label className="field">Engagement format<select name="format" required defaultValue=""><option value="" disabled>Select a format</option><option>Practical workshop</option><option>Conference keynote</option><option>Panel conversation</option><option>Company training</option><option>Not sure yet</option></select></label>
        {field('audience','Audience and approximate size','text',true,false,'Who will be in the room?')}
        {field('topic','Proposed topic or desired outcome','text',true,false,'What would you like people to understand or do?')}
        {field('date','Proposed date','text',false,false,'Date, flexible or undecided')}{field('location','Location','text',false,false,'City, country or online')}
        <label className="field">Delivery mode<select name="delivery" defaultValue=""><option value="">Choose if known</option><option>In person</option><option>Online</option><option>Hybrid</option><option>Flexible</option></select></label>
        {field('budget','Indicative budget (optional)','text')}{field('context','Additional context','textarea',false,true,'Share anything else that would help me understand the session.')}
      </> : <>
        <label className="field">What’s this about?<select name="topic" required defaultValue=""><option value="" disabled>Select a topic</option><option>General enquiry</option><option>Collaboration</option><option>Media or interview request</option><option>Something else</option></select></label>
        {field('message','Your message','textarea',true,true,'Tell me what you have in mind.')}
      </>}
    </div>
    <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <button className="button button-amber" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : speaking ? 'Send enquiry' : 'Send message'}</button>
    {status === 'error' && <p className="form-error" role="alert">{error} Your entries are still here; please review and retry.</p>}
    <p className="form-note">Please allow {settings.responseTimeText} for a response. Sending an enquiry does not confirm availability or a booking.</p>
  </form>;
}
