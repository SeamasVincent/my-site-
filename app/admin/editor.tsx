'use client';
import Script from 'next/script';

export default function Editor() {
  return <Script src="https://unpkg.com/decap-cms@3.8.0/dist/decap-cms.js" strategy="afterInteractive" onReady={() => {
    if (document.getElementById('project-editor-extensions')) return;
    const script = document.createElement('script');
    script.id = 'project-editor-extensions'; script.src = '/admin/editor.js'; document.body.appendChild(script);
  }}/>;
}
