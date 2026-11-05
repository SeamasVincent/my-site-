import './globals.css';
import type { Metadata } from 'next';
import { Footer } from './components/site';
import { Header } from './components/site-client';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seamas.sokeafrica.com';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Seamas Vincent | Building businesses. Shaping how we build.', template: '%s | Seamas Vincent' },
  description: 'Seamas Vincent is a builder, business educator, speaker and creative based in Abuja, Nigeria. Explore his work, ideas and resources.',
  openGraph: { type: 'website', locale: 'en_NG', url: '/', siteName: 'Seamas Vincent', title: 'Seamas Vincent', description: 'Building businesses. Shaping how we build.' },
  twitter: { card: 'summary_large_image', title: 'Seamas Vincent', description: 'Building businesses. Shaping how we build.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: 'Seamas Vincent', url: siteUrl, jobTitle: ['Builder', 'Business educator', 'Speaker', 'Creative'], address: { '@type': 'PostalAddress', addressLocality: 'Abuja', addressCountry: 'NG' }, worksFor: { '@type': 'Organization', name: 'SỌKẸ Africa', url: 'https://sokeafrica.com/' } };
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }} /><Header />{children}<Footer /></body></html>;
}
