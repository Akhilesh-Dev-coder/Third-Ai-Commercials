import React from 'react';
import { Sparkles, Award, Target, Compass } from 'lucide-react';

const founders = [
  {
    name: 'Nazimudheen N',
    role: 'Co-Founder & Chief Executive Officer',
    title: 'Creative Director & AI Visionary',
    bio: 'Pioneered generative AI workflows for global commercial campaigns. Combines deep neural model prompt architecture with broadcast-grade cinematic direction.',
    image: '/images/nazimudheen.jpg'
  },
  {
    name: 'Irfana P A',
    role: 'Co-Founder & Chief Operating Officer',
    title: 'Managing Director & Strategic Lead',
    bio: 'Spearheads studio strategy, brand client operations, and omnichannel production pipelines across India, Qatar, and global markets.',
    image: '/images/Irfana.jpg'
  }
];

export default function AboutSection() {
  return (
    <section className="section py-20 sm:py-24 relative overflow-hidden bg-[#050507]" id="about">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 space-y-12 sm:space-y-16">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 px-2">
          <div className="eyebrow justify-center mb-2">ABOUT THIRD AI COMMERCIALS</div>
          <h2 className="big-title text-[clamp(28px,6vw,60px)] leading-[1.05]">
            We exist because great brands<br className="hidden sm:block" />
            deserve <span className="bg-gradient-to-r from-white via-red-200 to-brand-red bg-clip-text text-transparent">better than average</span> content.
          </h2>
          <p className="sub mx-auto text-sm sm:text-base">
            Built from frustration with slow legacy film shoots. Driven by an obsession to unleash unlimited creative scale.
          </p>
        </div>

        {/* Company Pillars — stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 space-y-3 hover:border-brand-red/40 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center text-brand-red mb-3">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-white">Our Mission</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              To give ambitious brands worldwide access to hyper-real, broadcast-grade commercial visuals once reserved for eight-figure production budgets — delivered at the speed of neural AI.
            </p>
          </div>

          <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 space-y-3 hover:border-brand-red/40 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center text-brand-red mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-white">Neural Workflow</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              We orchestrate Sora v3, Runway Gen-3, and custom LoRA model training with ACES color science to render photorealistic optics without a single physical shoot day constraint.
            </p>
          </div>

          <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 space-y-3 hover:border-brand-red/40 transition duration-300 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center text-brand-red mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-white">Studio Ethos</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              "We think like marketers, direct like filmmakers, and execute like AI engineers." Every frame is crafted to capture attention, build trust, and drive measurable conversions.
            </p>
          </div>
        </div>

        {/* Founders Header */}
        <div className="pt-4 text-center max-w-2xl mx-auto space-y-2 px-2">
          <div className="font-mono text-xs uppercase tracking-widest text-brand-red font-bold">Executive Board</div>
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">Meet Our Founders</h3>
          <p className="text-xs text-gray-400 font-mono">Visionary leadership bridging machine learning innovation with commercial direction</p>
        </div>

        {/* Founders Cards — single column on mobile, two col on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-w-5xl mx-auto">
          {founders.map((f, idx) => (
            <div
              key={idx}
              className="glass p-6 sm:p-8 rounded-2xl sm:rounded-[28px] border border-white/10 hover:border-brand-red/50 transition-all duration-500 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 shadow-2xl group"
            >
              {/* Founder Image */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-xl overflow-hidden border-2 border-brand-red/40 shadow-[0_0_20px_rgba(255,42,59,0.25)] group-hover:scale-105 transition-transform duration-500">
                <img
                  src={f.image}
                  alt={f.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Founder Info */}
              <div className="space-y-2 text-center sm:text-left">
                <span className="px-3 py-1 rounded-full bg-brand-red/15 border border-brand-red/30 text-brand-red text-[10px] font-mono font-bold uppercase tracking-wider inline-block">
                  {f.role}
                </span>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-white">{f.name}</h4>
                <p className="text-xs font-mono text-gray-300 font-medium">{f.title}</p>
                <p className="text-xs text-gray-400 font-light leading-relaxed pt-1">{f.bio}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
