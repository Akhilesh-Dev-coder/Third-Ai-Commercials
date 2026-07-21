import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, DollarSign, Clock, Sparkles, Check, TrendingUp, ShieldAlert } from 'lucide-react';

export default function ROICalculatorSection() {
  const [commercialCount, setCommercialCount] = useState(4);
  const [tier, setTier] = useState('premium'); // 'standard' | 'premium' | 'cinema'

  const costPerTradMap = { standard: 35000, premium: 85000, cinema: 180000 };
  const costPerAIMap = { standard: 3500, premium: 8500, cinema: 18000 };
  const tradDaysMap = { standard: 30, premium: 45, cinema: 90 };
  const aiDaysMap = { standard: 2, premium: 3, cinema: 5 };

  const traditionalCost = commercialCount * costPerTradMap[tier];
  const aiCost = commercialCount * costPerAIMap[tier];
  const savings = traditionalCost - aiCost;
  const savingsPercentage = Math.round((savings / traditionalCost) * 100);

  const traditionalTime = tradDaysMap[tier];
  const aiTime = aiDaysMap[tier];

  return (
    <section id="calculator" className="py-24 relative overflow-hidden bg-brand-dark">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-brand-red/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-brand-red/40 text-xs font-mono font-bold text-brand-red uppercase tracking-wider shadow-red-glow">
            <Calculator className="w-3.5 h-3.5" />
            <span>Legacy vs AI Production Matrix</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-white">
            Calculate Your <span className="text-gradient-red">10x Production Savings</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg font-light">
            Compare traditional film crew logistics vs. Third AI Commercials generative neural workflow.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Column */}
          <div className="lg:col-span-6 glass-panel-heavy rounded-3xl p-8 space-y-8 border border-white/15 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Slider 1: Spot Count */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-gray-200">Commercial Assets Required:</span>
                  <span className="font-mono font-extrabold text-lg text-brand-red">{commercialCount} Spots</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={commercialCount}
                  onChange={(e) => setCommercialCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-red"
                />
                <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                  <span>1 Commercial</span>
                  <span>6 Commercials</span>
                  <span>12 Commercials</span>
                </div>
              </div>

              {/* Selector 2: Quality Tier */}
              <div className="space-y-3">
                <span className="font-bold text-sm text-gray-200 block">Production Tier:</span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'standard', label: 'Social Short', desc: '9:16 Viral Spot' },
                    { id: 'premium', label: 'Broadcast 4K', desc: 'TV & Digital Ad' },
                    { id: 'cinema', label: 'Hollywood VFX', desc: 'Heavy Cinema' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTier(t.id)}
                      className={`p-4 rounded-2xl text-left border transition-all duration-300 ${
                        tier === t.id
                          ? 'bg-brand-red/20 border-brand-red text-white shadow-red-glow'
                          : 'glass-panel text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-bold text-xs uppercase tracking-wider">{t.label}</div>
                      <div className="text-[10px] text-gray-400 mt-1 font-mono">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guarantees List */}
              <div className="space-y-2.5 pt-4 border-t border-white/10">
                {[
                  'Unlimited Neural Iteration & Re-rendering Rounds',
                  'Full Broadcast Commercial License Rights',
                  'Multi-Ratio Master Exports (16:9, 9:16, 1:1)',
                  'Custom Neural AI Voiceover & Mastered Audio'
                ].map((perk, i) => (
                  <div key={i} className="flex items-center space-x-2.5 text-xs text-gray-300 font-light">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#contact"
              className="w-full py-4.5 rounded-2xl font-extrabold text-xs uppercase tracking-widest text-white shimmer-btn shadow-red-glow text-center flex items-center justify-center space-x-2.5 mt-6"
            >
              <span>Lock In Savings & Initiate Project</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Results Comparison Column */}
          <div className="lg:col-span-6 grid grid-cols-1 gap-6">
            {/* Traditional Shoot Card */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-500" /> Legacy Film Production
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900/30">
                  Legacy Pipeline
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-400 block font-mono">Est. Production Budget</span>
                  <span className="font-display font-black text-2xl sm:text-3xl text-gray-400 line-through">
                    ${traditionalCost.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-mono">Turnaround Schedule</span>
                  <span className="font-display font-bold text-xl text-gray-400 flex items-center gap-1.5 mt-1">
                    <Clock className="w-4 h-4" /> {traditionalTime} Days
                  </span>
                </div>
              </div>
            </div>

            {/* Third AI Neural Pipeline Card */}
            <div className="glass-panel-heavy rounded-3xl p-8 border border-brand-red/60 shadow-red-glow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-red/20 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-red" /> Third AI Neural Pipeline
                  </span>
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-brand-red text-white font-extrabold shadow-red-glow">
                    Next-Gen Studio
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <span className="text-xs text-gray-300 block font-mono mb-1">Your Investment</span>
                    <span className="font-display font-black text-3xl sm:text-4xl text-white">
                      ${aiCost.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-300 block font-mono mb-1">Delivery Time</span>
                    <span className="font-display font-black text-2xl sm:text-3xl text-emerald-400 flex items-center gap-1.5">
                      <Clock className="w-5 h-5" /> {aiTime} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Savings Meter */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Capital Saved:
                </span>
                <span className="font-display font-black text-2xl text-emerald-400">
                  +${savings.toLocaleString()} ({savingsPercentage}% Saved)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
