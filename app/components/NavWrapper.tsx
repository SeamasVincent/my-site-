'use client';

import { useEffect, useState } from 'react';

export default function NavWrapper() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FCFBF8]/90 backdrop-blur-md border-b border-[#0A1931]/5 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Seamas Vincent"
            className="h-8 w-auto"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          
        </div>

        <div className="hidden md:flex gap-8 font-jakarta text-sm font-medium">
          <a href="#ecosystem" className="hover:text-[#FFBF00] transition-colors">
            The Ecosystem
          </a>
          <a href="#book" className="hover:text-[#FFBF00] transition-colors">
            The Book
          </a>
          <a href="#consulting" className="hover:text-[#FFBF00] transition-colors">
            Consulting
          </a>
        </div>

        
          <a href="#consulting"
          className="hidden md:inline-block border border-[#0A1931] text-[#0A1931] px-5 py-2 rounded-full font-jakarta text-sm font-semibold hover:bg-[#E8F1F8] transition-colors"
        >
          Book a Session
        </a>
      </div>
    </nav>
  );
}