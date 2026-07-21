import React from 'react';
import { Tv, Film, Smartphone, Box, ArrowUpRight } from 'lucide-react';

export default function WorkCategoriesSection() {
  const categories = [
    {
      badge: 'TV & Theatre Commercial',
      title: 'Broadcast Commercials',
      desc: 'Television-standard ads that give your brand the authority of the big players.',
      ph: '[ TVC reel ]',
      icon: <Tv className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff2751]" />,
      accent: 'from-[#ff2751]/20 to-[#080808]'
    },
    {
      badge: 'AI Commercial',
      title: 'Cinematic Brand Films',
      desc: 'Story-driven films for brands that intend to stand apart from the crowd.',
      ph: '[ commercial reel ]',
      icon: <Film className="w-5 h-5 sm:w-6 sm:h-6 text-[#e722ff]" />,
      accent: 'from-[#e722ff]/20 to-[#080808]'
    },
    {
      badge: 'AI UGC',
      title: 'Performance Ad Content',
      desc: 'Scroll-stopping, conversion-focused creative built for Meta & Instagram.',
      ph: '[ UGC reel ]',
      icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff2751]" />,
      accent: 'from-[#ff2751]/20 to-[#080808]'
    },
    {
      badge: 'Product Animation',
      title: 'Product Showcases',
      desc: 'Premium animations that make any product look established and trusted.',
      ph: '[ product reel ]',
      icon: <Box className="w-5 h-5 sm:w-6 sm:h-6 text-[#e722ff]" />,
      accent: 'from-[#e722ff]/20 to-[#080808]'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#080808] text-white relative select-none" id="work">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-brand-red/30 bg-brand-red/10 text-brand-red font-mono text-xs uppercase tracking-[0.3em]">
            Production Tiers
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
            What We Create
          </h2>
          <p className="text-gray-400 text-sm sm:text-xl font-light">
            Four tiers of production — every one built to sell.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="relative min-h-[220px] sm:min-h-0 sm:aspect-[16/10] rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-[#16161c] via-[#0f0f13] to-[#09090c] p-6 sm:p-8 flex flex-col justify-between overflow-hidden group hover:border-[#ff2751]/60 transition-all duration-500 shadow-2xl hover:shadow-[0_15px_40px_rgba(255,39,81,0.2)]"
            >
              {/* Corner Ambient Glow */}
              <div className={`absolute top-0 right-0 w-40 h-40 sm:w-52 sm:h-52 bg-gradient-to-br ${cat.accent} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* Top Header Row */}
              <div className="flex items-center justify-between relative z-10 mb-6 sm:mb-0">
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur group-hover:border-[#ff2751]/40 transition duration-300">
                  {cat.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest bg-black/40 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10">
                    {cat.ph}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#ff2751] text-white transition-colors duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 space-y-1.5 sm:space-y-2">
                <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-[#ff2751]">
                  {cat.badge}
                </div>
                <h3 className="font-display font-bold text-xl sm:text-3xl text-white group-hover:text-white transition">
                  {cat.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-base font-light leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
