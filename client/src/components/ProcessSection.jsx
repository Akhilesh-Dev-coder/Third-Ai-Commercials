import React from 'react';

const steps = [
  ['Strategy', 'One call. Your brand, audience, and goal - mapped and ready.'],
  ['Script', 'Shot-by-shot, written for AI. You approve before we touch anything.'],
  ['Creative Direction', 'Style, mood, color — every visual decision locked before production.'],
  ['AI Production', 'Multiple AI models running at once. Weeks of work, done in days.'],
  ['Editing', 'Graded, sound-designed, and timed until it feels premium.'],
  ['Delivery', 'Every format. Every platform. Launch-ready from day one.']
];

export default function ProcessSection() {
  return (
    <section className="section" id="process">
      <div className="max-w-3xl mx-auto w-full">
        <div className="eyebrow">Process</div>
        <h2 className="big-title text-[clamp(28px,5vw,64px)] mb-4 sm:mb-5">
          From idea to live campaign<br className="hidden sm:block" /> in days, not months.
        </h2>
        <p className="sub mb-8 sm:mb-10 text-sm sm:text-base">
          Six deliberate stages, engineered for speed without sacrificing craft.
        </p>

        {/* Process Timeline */}
        <div className="relative flex flex-col w-full">
          {steps.map((s, idx) => {
            const isLast = idx === steps.length - 1;
            return (
              <div key={idx} className="grid grid-cols-[52px_1fr] sm:grid-cols-[70px_1fr] gap-4 sm:gap-6 py-6 sm:py-8 relative">
                {/* Vertical Connector */}
                {!isLast && (
                  <div
                    className="absolute left-[25px] sm:left-[34px] top-[62px] sm:top-[70px] bottom-[-6px] w-[1px]"
                    style={{ background: 'linear-gradient(180deg, #FF2A3B, rgba(255, 42, 59, 0.08))' }}
                  />
                )}

                {/* Step Circle */}
                <div className="process-num font-display text-xs sm:text-sm text-brand-red w-[52px] h-[52px] sm:w-[68px] sm:h-[68px] rounded-full border border-white/10 flex items-center justify-center bg-white/[0.04] relative z-10 flex-shrink-0">
                  0{idx + 1}
                </div>

                {/* Step Content */}
                <div className="pt-1 sm:pt-2">
                  <h3 className="font-display text-lg sm:text-2xl font-normal text-white mb-1.5">
                    {s[0]}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                    {s[1]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
