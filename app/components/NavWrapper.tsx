'use client';

import { useEffect, useState } from 'react';

export default function NavWrapper() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#FCFBF8]/90 backdrop-blur-md border-b border-[#0A1931]/5 shadow-sm' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center flex-shrink-0">
          <img src="/logo.svg" alt="Seamas Vincent" className="h-8 w-auto max-w-[160px] object-contain block" onError={(e) => (e.currentTarget.style.display = 'none')} />
        </div>
        <div className="hidden md:flex gap-8 font-jakarta text-sm font-medium">
          <a href="#ecosystem" className="hover:text-[#FFBF00] transition-colors">The Ecosystem</a>
          <a href="#book" className="hover:text-[#FFBF00] transition-colors">The Book</a>
          <a href="#consulting" className="hover:text-[#FFBF00] transition-colors">Consulting</a>
        </div>
        <a href="#consulting" className="hidden md:inline-block border border-[#0A1931] text-[#0A1931] px-5 py-2 rounded-full font-jakarta text-sm font-semibold hover:bg-[#E8F1F8] transition-colors">Book a Session</a>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-[5px] p-2" aria-label="Toggle menu">
          <span className={`block w-6 h-[2px] bg-[#0A1931] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-[#0A1931] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-[#0A1931] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64 bg-[#FCFBF8]/95 backdrop-blur-md border-b border-[#0A1931]/5' : 'max-h-0'}`}>
        <div className="flex flex-col px-6 py-4 gap-5">
          <a href="#ecosystem" onClick={() => setMenuOpen(false)} className="font-jakarta text-sm font-medium text-[#0A1931] hover:text-[#FFBF00] transition-colors">The Ecosystem</a>
          <a href="#book" onClick={() => setMenuOpen(false)} className="font-jakarta text-sm font-medium text-[#0A1931] hover:text-[#FFBF00] transition-colors">The Book</a>
          <a href="#consulting" onClick={() => setMenuOpen(false)} className="font-jakarta text-sm font-medium text-[#0A1931] hover:text-[#FFBF00] transition-colors">Consulting</a>
          <a href="#consulting" onClick={() => setMenuOpen(false)} className="border border-[#0A1931] text-[#0A1931] px-5 py-2 rounded-full font-jakarta text-sm font-semibold text-center hover:bg-[#E8F1F8] transition-colors">Book a Session</a>
        </div>
      </div>
    </nav>
  );
}
