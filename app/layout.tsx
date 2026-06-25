import './globals.css';
import type { Metadata } from 'next';
import NavWrapper from './components/NavWrapper';

export const metadata: Metadata = {
  title: 'Seamas Vincent | Build Intelligently',
  description: 'Structurally sound business models for African founders.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FYPK6GSGGF"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FYPK6GSGGF');
          `
        }} />
      </head>
      <body className="bg-[#FCFBF8] text-[#0A1931] font-newsreader antialiased relative">
        <NavWrapper />
        {children}

        {/* Global Footer */}
        <footer className="bg-[#0A1931] text-[#FCFBF8] py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="font-jakarta text-sm opacity-60">© 2026 Seamas Vincent. All rights reserved.</p>
            <div className="flex gap-6 font-jakarta text-sm opacity-60">
              <a href="https://www.instagram.com/consultseamas/" className="hover:text-[#FFBF00] hover:opacity-100 transition-colors">Instagram</a>
              <a href="mailto:consultseamas@gmail.com" className="hover:text-[#FFBF00] hover:opacity-100 transition-colors">Email</a>
              <a href="#" className="hover:text-[#FFBF00] hover:opacity-100 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#FFBF00] hover:opacity-100 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}