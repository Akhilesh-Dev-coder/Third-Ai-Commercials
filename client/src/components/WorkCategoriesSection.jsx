import React, { useState, useEffect } from 'react';
import { Tv, Film, Box, ArrowUpRight } from 'lucide-react';
import { fetchProjects } from '../services/api';
import CategoryVideoPlayerModal from './CategoryVideoPlayerModal';

export default function WorkCategoriesSection() {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await fetchProjects();
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load projects for categories:', error);
      }
    };
    getProjects();
  }, []);

  const categories = [
    {
      badge: 'AI Cinematic',
      title: 'Cinematic AI Commercials',
      desc: 'Story-driven, visually spectacular campaigns generated using state-of-the-art neural video models.',
      fallbackBg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      icon: <Film className="w-5 h-5 sm:w-6 sm:h-6 text-[#e722ff]" />,
      accent: 'from-[#e722ff]/40 to-[#080808]'
    },
    {
      badge: 'TV & Cinema',
      title: 'TV Commercials',
      desc: 'Television-standard commercials that give your brand the authority of prime-time broadcast media.',
      fallbackBg: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop',
      icon: <Tv className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff2751]" />,
      accent: 'from-[#ff2751]/40 to-[#080808]'
    },
    {
      badge: '3D & AI Animation',
      title: 'Product Animations',
      desc: 'High-end product renderings and simulations that highlight product mechanics with stunning realism.',
      fallbackBg: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop',
      icon: <Box className="w-5 h-5 sm:w-6 sm:h-6 text-[#e722ff]" />,
      accent: 'from-[#e722ff]/40 to-[#080808]'
    }
  ];

  const getCategoryMedia = (catTitle) => {
    const catProjects = projects.filter(
      (p) => (p.category || p.cat || '').toLowerCase() === catTitle.toLowerCase()
    );
    const firstProj = catProjects[0];
    return {
      thumbnail: firstProj?.thumbnailUrl || '',
      count: catProjects.length
    };
  };

  return (
    <section className="py-16 sm:py-24 bg-[#050507] text-white relative select-none" id="work">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ff2751]/30 bg-[#ff2751]/[0.06] text-[#ff3b61] font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em]">
            Production Tiers
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
            Our Work Tiers
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Click on any tier below to browse and stream our portfolio of commercials.
          </p>
        </div>

        {/* Grid Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, idx) => {
            const media = getCategoryMedia(cat.title);
            const bgImage = media.thumbnail || cat.fallbackBg;

            return (
              <div
                key={idx}
                onClick={() => setSelectedCategory(cat.title)}
                className="relative aspect-[1.4] sm:aspect-[1.3] md:aspect-[16/11.5] rounded-[24px] sm:rounded-[32px] border border-white/10 bg-[#0f0f13] overflow-hidden group cursor-pointer transition-all duration-500 hover:border-brand-red/60 hover:shadow-[0_20px_50px_rgba(255,39,81,0.25)] hover:scale-[1.015] active:scale-[0.985] flex flex-col justify-between p-6 sm:p-8"
              >
                {/* Background Image with Zoom on Hover */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />

                {/* Dark Gradient Overlay for Typography Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 opacity-90 group-hover:opacity-75 transition-opacity duration-500" />

                {/* Colored Glow Effects */}
                <div className={`absolute -top-20 -right-20 w-44 h-44 rounded-full blur-[80px] bg-gradient-to-br ${cat.accent} opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none`} />

                {/* Top Content Row */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md group-hover:border-brand-red/40 transition duration-300">
                    {cat.icon}
                  </div>
                  
                  {/* Dynamic Video Count Pill */}
                  <span className="font-mono text-[10px] font-bold text-gray-300 uppercase tracking-widest bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                    {media.count > 0 ? `${media.count} Videos` : 'Watch Reel'}
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 space-y-2 text-left">
                  <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#ff3b61]">
                    {cat.badge}
                  </div>
                  
                  <h3 className="font-display font-black text-xl sm:text-3xl text-white tracking-tight leading-tight group-hover:text-white transition duration-300">
                    {cat.title}
                  </h3>
                  
                  <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Category Video reels/scrollable view modal */}
      {selectedCategory && (
        <CategoryVideoPlayerModal
          category={selectedCategory}
          projects={projects}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </section>
  );
}
