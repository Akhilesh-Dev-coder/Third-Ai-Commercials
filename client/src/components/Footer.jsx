import React from 'react';
import { Mail, Phone, MapPin, Instagram, ArrowUpRight, ChevronUp, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Approach', href: '#value' },
    { name: 'Portfolio', href: '#work' },
    { name: 'Services', href: '#services' },
    { name: 'Process', href: '#process' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const servicesList = [
    { name: 'Broadcast TV Commercials', href: '#services' },
    { name: 'Cinematic AI Brand Films', href: '#services' },
    { name: 'AI UGC Creator Content', href: '#services' },
    { name: 'Product 3D Showcases', href: '#services' },
    { name: 'Social Performance Ads', href: '#services' }
  ];

  return (
    <footer className="relative bg-[#050507] text-white font-sans overflow-hidden border-t border-white/10 select-none z-10">
      {/* ── Top Ambient Glow & Gradient Line ── */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff2751]/60 to-transparent" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#ff2751]/15 via-[#e722ff]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10 relative z-10">
        
        {/* ── TOP BAR: Brand & Action Controls ── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-12 sm:pb-16 border-b border-white/10">
          
          {/* Brand Identity */}
          <div className="space-y-3 max-w-xl">
            <a href="#home" className="inline-flex items-center gap-3.5 group">
              <img
                src="/images/logo_cropped.png"
                alt="Third AI Commercials"
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-display font-black text-xl sm:text-2xl tracking-wider text-white">
                  THIRD<span className="text-[#ff2751]">AI</span>
                </span>
                <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">
                  Commercials LLP
                </span>
              </div>
            </a>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light">
              Kerala’s pioneer AI ad studio — producing cinematic, broadcast-ready commercial films for television and digital platforms in days.
            </p>
          </div>

          {/* Action CTAs & Scroll Up */}
          <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
            <a
              href="https://wa.me/919539101061?text=Hi%20Third%20AI%20Commercials,%20I'd%20like%20to%20get%20a%20quote."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#ff2751]/10 border border-[#ff2751]/40 text-[#ff3b61] font-mono text-xs font-semibold tracking-wider hover:bg-[#ff2751]/20 hover:border-[#ff2751] transition-all duration-300 shadow-[0_0_20px_rgba(255,39,81,0.2)]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Direct</span>
            </a>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="p-3 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all duration-300 group ml-auto sm:ml-0"
            >
              <ChevronUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* ── MIDDLE GRID: 4 Main Columns ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 py-12 sm:py-16 border-b border-white/10">

          {/* Col 1: Studio Navigation */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#ff2751]">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group py-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff2751]/0 group-hover:bg-[#ff2751] transition-all duration-200" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Services / Capabilities */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#ff2751]">
              Production
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {servicesList.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 block py-0.5 font-light"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Contact Desk */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#ff2751]">
              Contact Studio
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-gray-300">
              
              <a
                href="mailto:Thirdaicommercials@gmail.com"
                className="flex items-center gap-3 text-gray-300 hover:text-[#ff2751] transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#ff2751] group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs break-all">Thirdaicommercials@gmail.com</span>
              </a>

              <a
                href="tel:+919539101061"
                className="flex items-center gap-3 text-gray-300 hover:text-[#ff2751] transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#ff2751] group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs">+91 95391 01061</span>
              </a>

              <div className="flex items-start gap-3 pt-1">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#ff2751] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs text-gray-400 leading-snug">
                  Haripad, Alappuzha,<br />
                  Kerala, India
                </div>
              </div>

            </div>
          </div>

          {/* Col 4: Social & Broadcast Trust */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#ff2751]">
              Social & Broadcast
            </h4>
            <div className="space-y-4">
              
              {/* Instagram Card */}
              <a
                href="https://www.instagram.com/third_ai_official?igsh=MXFubmd6am9oanV0aQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#ff2751]/50 flex items-center justify-between transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-[#ff2751] to-[#e722ff] p-[1px]">
                    <div className="w-full h-full bg-[#050507] rounded-[7px] flex items-center justify-center text-white">
                      <Instagram className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-white group-hover:text-[#ff2751] transition">
                      @third_ai_official
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">Instagram Official</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* TV Airing Notice */}
              <div className="p-3.5 rounded-xl bg-[#ff2751]/[0.04] border border-[#ff2751]/20 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#ff2751] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Airing Statewide</span>
                </div>
                <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                  Commercials broadcast across Asianet News, Manorama News, Mathrubhumi & 24 News.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* ── BOTTOM BAR: Copyright & Compliance ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] font-mono text-gray-500 tracking-wider text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>© {new Date().getFullYear()} THIRD AI COMMERCIALS LLP.</span>
            <span className="hidden sm:inline">·</span>
            <span>Haripad, Kerala, India</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <span>All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
