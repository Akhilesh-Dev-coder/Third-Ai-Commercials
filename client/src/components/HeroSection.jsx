import React, { useEffect, useState } from 'react';
import FloatingCore from '../three/FloatingCore';
import CanvasErrorBoundary from './CanvasErrorBoundary';
import { ArrowRight, Radio, Sparkles, Tv, Award, TrendingUp, Star, Video } from 'lucide-react';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const airedChannels = [
    { name: 'Asianet News', tag: 'Malayalam News' },
    { name: 'Manorama News', tag: 'Prime Broadcast' },
    { name: 'Mathrubhumi', tag: '24/7 Network' },
    { name: '24 News', tag: 'Breakthrough' },
    { name: 'MediaOne', tag: 'Statewide' },
    { name: 'Reporter TV', tag: 'Prime Time' }
  ];

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#060608] pt-28 sm:pt-32 pb-20 select-none"
      style={{ minHeight: '100svh' }}
    >
      {/* ── 3D Canvas Background (Desktop Full Bleed) ── */}
      <div className="absolute inset-x-0 top-0 h-[100svh] sm:h-full z-0 pointer-events-none overflow-hidden">
        <CanvasErrorBoundary>
          <FloatingCore className="w-full h-full pointer-events-none" />
        </CanvasErrorBoundary>
      </div>

      {/* ── Dynamic Ambient Light Gradients ── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[850px] h-[340px] sm:h-[550px] bg-gradient-to-tr from-[#ff2751]/20 via-[#e722ff]/12 to-transparent rounded-full blur-[100px] sm:blur-[170px] pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#ff2751]/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      {/* ── Vignette Overlays ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 95% 85% at 50% 35%, transparent 20%, rgba(6,6,8,0.4) 65%, rgba(6,6,8,0.95) 100%)'
        }}
      />

      {/* ── Main Content Container ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">

        {/* Live Broadcast Kicker Badge */}
        <div
          className={`inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full border border-[#ff2751]/40 bg-[#ff2751]/[0.08] backdrop-blur-xl text-[#ff3b61] font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.28em] mb-6 sm:mb-8 shadow-[0_0_30px_rgba(255,39,81,0.2)] transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2751] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff2751]" />
          </span>
          <span>Kerala's AI Ad Studio · On Air Across the State</span>
        </div>

        {/* Main Headline */}
        <h1
          className={`font-display font-black text-white leading-[1.08] sm:leading-[1.02] tracking-tight max-w-5xl transition-all duration-700 delay-100 text-3xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 sm:mb-8 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          We don't just make ads.<br className="hidden sm:block" />{' '}
          We make brands{' '}
          <span className="bg-gradient-to-r from-[#ff2751] via-[#ff5475] to-[#e722ff] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,39,81,0.45)]">
            impossible to ignore.
          </span>
        </h1>



        {/* Subtitle */}
        <p
          className={`text-gray-300 font-light max-w-3xl leading-relaxed text-sm sm:text-2xl mb-6 sm:mb-12 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          Cinematic, AI-native brand films that sell —{' '}
          <strong className="text-white font-semibold">
            produced in days, at a fraction of traditional cost, and now airing on Kerala television.
          </strong>
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 transition-all duration-700 delay-300 mb-14 sm:mb-20 w-full sm:w-auto ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#ff2751] via-[#ff4268] to-[#e722ff] text-white font-bold text-base sm:text-lg px-8 sm:px-9 py-3.5 sm:py-4 rounded-full shadow-[0_0_35px_rgba(255,39,81,0.45)] hover:shadow-[0_0_55px_rgba(255,39,81,0.7)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Start Your Project</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>

          <a
            href="#work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 text-white font-semibold text-base sm:text-lg px-7 sm:px-8 py-3.5 sm:py-4 rounded-full backdrop-blur-md transition-all duration-300 active:scale-95"
          >
            <Video className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff2751]" />
            <span>See Our Portfolio</span>
          </a>
        </div>

        {/* ── AIRED ON BROADCAST NETWORK STRIP ── */}
        <div className="w-full border-t border-white/10 pt-10 sm:pt-14 pb-8 relative">
          <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
            <Radio className="w-4 h-4 text-[#ff2751] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono text-gray-400 uppercase tracking-[0.35em]">
              Aired On TV Networks
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {airedChannels.map((channel, i) => {
              const isHovered = activeChannel === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveChannel(i)}
                  onMouseLeave={() => setActiveChannel(null)}
                  className={`relative h-16 sm:h-20 rounded-xl sm:rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center p-2.5 sm:p-3 cursor-pointer overflow-hidden ${isHovered
                      ? 'border-[#ff2751] bg-gradient-to-b from-[#ff2751]/20 to-[#0d0d12] shadow-[0_0_25px_rgba(255,39,81,0.35)] -translate-y-1'
                      : 'border-dashed border-[#ff2751]/40 bg-[#ff2751]/[0.03] hover:bg-[#ff2751]/[0.08]'
                    }`}
                >
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-[#ff2751] shadow-[0_0_8px_#ff2751]' : 'bg-gray-600'}`} />
                  </div>

                  <div className="font-display font-bold text-gray-200 text-xs sm:text-sm tracking-wide group-hover:text-white">
                    {channel.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── ACHIEVEMENTS BAR ── */}
      <div className="w-full bg-gradient-to-r from-[#0c0c0e] via-[#09090b] to-[#0c0c0e] border-y border-white/10 mt-8 sm:mt-12 py-10 sm:py-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center relative z-10">

          <div className="space-y-1 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#ff2751]/40 transition duration-300 group">
            <div className="flex justify-center mb-1 text-[#ff2751] opacity-80 group-hover:opacity-100 transition">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="font-display font-black text-3xl sm:text-6xl text-[#ff2751] tracking-tight">
              357<span className="text-xl sm:text-3xl font-light text-white">+</span>
            </div>
            <div className="text-[11px] sm:text-sm text-gray-300 font-medium">Projects Delivered</div>
          </div>

          <div className="space-y-1 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#ff2751]/40 transition duration-300 group">
            <div className="flex justify-center mb-1 text-[#ff2751] opacity-80 group-hover:opacity-100 transition">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="font-display font-black text-3xl sm:text-6xl text-[#ff2751] tracking-tight">
              28<span className="text-xl sm:text-3xl font-light text-white">+</span>
            </div>
            <div className="text-[11px] sm:text-sm text-gray-300 font-medium">Brands Served</div>
          </div>

          <div className="space-y-1 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#ff2751]/40 transition duration-300 group">
            <div className="flex justify-center mb-1 text-[#ff2751] opacity-80 group-hover:opacity-100 transition">
              <Tv className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="font-display font-black text-3xl sm:text-6xl text-[#ff2751] tracking-tight">
              1
            </div>
            <div className="text-[11px] sm:text-sm text-gray-300 font-medium">TVC On National Broadcast</div>
          </div>

          <div className="space-y-1 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#ff2751]/40 transition duration-300 group">
            <div className="flex justify-center mb-1 text-[#ff2751] opacity-80 group-hover:opacity-100 transition">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div className="font-display font-black text-3xl sm:text-6xl text-[#ff2751] tracking-tight">
              5.0<span className="text-xl sm:text-3xl text-amber-400">★</span>
            </div>
            <div className="text-[11px] sm:text-sm text-gray-300 font-medium">Average Client Rating</div>
          </div>

        </div>
      </div>
    </section>
  );
}
