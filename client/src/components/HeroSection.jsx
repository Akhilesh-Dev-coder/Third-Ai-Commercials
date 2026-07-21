import React, { useEffect, useState } from 'react';
import FloatingCore from '../three/FloatingCore';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 180);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* ── 3D Canvas — fills entire section ── */}
      <FloatingCore />

      {/* ── Radial vignette — edges fade to dark, keeps centre clear ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, rgba(5,5,7,0.45) 65%, rgba(5,5,7,0.90) 100%)'
        }}
      />

      {/* ── Bottom gradient — melts into next section ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 sm:h-40 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #050507)' }}
      />

      {/* ─────────────────────────────────────────────────────────
          MOBILE LAYOUT  (< sm)
          Text above  →  3D model centre  →  CTAs below
      ───────────────────────────────────────────────────────── */}
      <div className="sm:hidden absolute inset-0 z-10 flex flex-col items-center justify-between pt-[72px] pb-10 px-5">

        {/* Top: Badge + Heading */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur text-[10px] font-mono uppercase tracking-[0.26em] text-gray-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red shadow-[0_0_8px_#FF2A3B] animate-pulse" />
            AI Studio · Haripad, Kerala
          </div>

          {/* Heading */}
          <h1 className="font-display font-light tracking-tight leading-[0.88] text-white text-[clamp(38px,12vw,60px)]">
            THIRD
            <span className="bg-gradient-to-b from-white via-red-200 to-brand-red bg-clip-text text-transparent">AI</span>
            <span className="block text-[clamp(22px,7.5vw,38px)] text-white/90 mt-1">.COMMERCIALS</span>
          </h1>

          <p className="text-gray-400 text-xs font-light mt-3 max-w-[280px] leading-relaxed">
            Impossible visuals. Real AI. Zero production hassle.
          </p>
        </div>

        {/* Middle spacer — this is where the 3D model shows through */}
        <div className="flex-1" />

        {/* Bottom: Stats + CTAs */}
        <div
          className={`flex flex-col items-center gap-4 w-full transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
        >
          {/* Stat pills — 2×2 grid */}
          <div className="grid grid-cols-4 gap-2 w-full">
            {[
              { val: '357+', label: 'Projects' },
              { val: '12M+', label: 'Views' },
              { val: '28+', label: 'Clients' },
              { val: '100%', label: 'Rating' }
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center px-1 py-2.5 rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur"
              >
                <span className="font-display font-semibold text-white text-sm leading-none">{s.val}</span>
                <span className="font-mono text-[8px] text-gray-400 uppercase tracking-wider mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <a
            href="#contact"
            className="w-full font-display font-medium text-sm tracking-wide py-4 rounded-full bg-gradient-to-r from-brand-red to-red-500 text-white shadow-[0_0_28px_rgba(255,42,59,0.5)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Start Your Project →
          </a>
          <a
            href="#vault"
            className="w-full font-display font-medium text-sm tracking-wide py-3.5 rounded-full border border-white/15 text-white bg-white/[0.04] backdrop-blur active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            ▶ Watch Showreel
          </a>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          DESKTOP LAYOUT  (>= sm)
          Classic centred overlay layout
      ───────────────────────────────────────────────────────── */}
      <div className="hidden sm:flex absolute inset-0 z-10 flex-col items-center justify-center px-8">
        <div
          className={`flex flex-col items-center text-center max-w-5xl w-full transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur text-xs font-mono uppercase tracking-[0.28em] text-gray-300 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red shadow-[0_0_8px_#FF2A3B] animate-pulse" />
            AI Video Generation Studio
          </div>

          {/* Heading */}
          <h1
            className="font-display font-light tracking-tight leading-[0.9] text-white"
            style={{ fontSize: 'clamp(52px, 11.5vw, 148px)' }}
          >
            THIRD
            <span className="bg-gradient-to-b from-white via-red-200 to-brand-red bg-clip-text text-transparent">AI</span>
            .COMMERCIALS
          </h1>

          <p
            className="font-display font-light mt-7 leading-snug text-[#d8d4e0] max-w-2xl"
            style={{ fontSize: 'clamp(17px, 2.8vw, 28px)' }}
          >
            We create impossible visuals<br />using artificial intelligence.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            {[
              { val: '357+', label: 'Projects' },
              { val: '12M+', label: 'Views' },
              { val: '28+', label: 'Clients' },
              { val: '100%', label: 'Satisfaction' }
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur"
              >
                <span className="font-display font-semibold text-white text-lg leading-none">{s.val}</span>
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex gap-4 mt-10">
            <a
              href="#contact"
              className="font-display font-medium text-sm tracking-wide px-8 py-4 rounded-full bg-gradient-to-r from-brand-red to-red-500 text-white shadow-[0_0_28px_rgba(255,42,59,0.5)] hover:shadow-[0_0_48px_rgba(255,42,59,0.75)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center gap-2"
            >
              Start Your Project →
            </a>
            <a
              href="#vault"
              className="font-display font-medium text-sm tracking-wide px-8 py-4 rounded-full border border-white/15 text-white bg-white/[0.04] backdrop-blur hover:border-white/30 hover:bg-white/[0.08] active:scale-95 transition-all duration-300 flex items-center gap-2"
            >
              ▶ Watch Showreel
            </a>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-5 sm:bottom-9 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2">
        <span className="text-gray-500 font-mono text-[11px] tracking-[0.22em] uppercase">Scroll</span>
        <span className="w-[1px] h-9 bg-gradient-to-b from-gray-400 to-transparent relative overflow-hidden">
          <span className="absolute top-[-40%] left-0 w-full h-[40%] bg-brand-red animate-[scrollmove_1.8s_ease-in-out_infinite]" />
        </span>
      </div>
    </section>
  );
}
