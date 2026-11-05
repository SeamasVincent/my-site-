import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Content editor', robots: { index: false, follow: false } };

export default function Admin() {
  const configUrl = process.env.NODE_ENV === 'development' ? '/admin/config.local.yml' : '/admin/config.yml';
  return <main className="admin-page"><link rel="cms-config-url" type="text/yaml" href={configUrl} /><Script src="https://unpkg.com/decap-cms@3.8.0/dist/decap-cms.js" strategy="afterInteractive" /><noscript>The content editor needs JavaScript enabled.</noscript></main>;
}
