import React from 'react';
import { Target, Zap } from 'lucide-react';

export default function ApproachSection() {
  const handleMouseMove = (e) => {
    const card = document.getElementById('approach-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section className="py-24 bg-[#080808] border-y border-white/10 relative overflow-hidden" id="value">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#ff2751]/10 to-[#e722ff]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          id="approach-card"
          onMouseMove={handleMouseMove}
          className="relative bg-gradient-to-b from-[#111116] to-[#09090c] border border-white/15 rounded-3xl p-8 sm:p-14 text-center overflow-hidden shadow-2xl group transition-all duration-500 hover:border-[#ff2751]/50"
        >
          {/* Spotlight Effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(255, 39, 81, 0.15), transparent 70%)'
            }}
          />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ff2751]/40 bg-[#ff2751]/10 text-[#ff2751] font-mono text-xs uppercase tracking-[0.35em] mb-6 shadow-[0_0_20px_rgba(255,39,81,0.2)]">
            <Target className="w-3.5 h-3.5" />
            <span>Our Approach</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-[1.12] text-white mb-8">
            A beautiful ad is worthless<br className="hidden sm:block" />
            if it doesn't <span className="bg-gradient-to-r from-[#ff2751] via-[#ff5475] to-[#e722ff] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,39,81,0.3)]">sell.</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-xl font-light leading-relaxed max-w-3xl mx-auto">
            Anyone can generate a video now. We do something harder — we build ads with{' '}
            <strong className="text-white font-semibold underline decoration-[#ff2751]/60 underline-offset-4">
              strategy, story and cultural understanding
            </strong>, so every frame works toward one goal: growing your brand's value and bringing you customers. We obsess over the content and the selling, not just the visuals.{' '}
            <strong className="text-white font-semibold">
              That's the difference between content that's watched and content that converts.
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
}
