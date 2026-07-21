import React from 'react';

const founders = [
  {
    name: 'Nazimudheen N',
    role: 'Founder & Creative Lead',
    image: '/images/nazimudheen.jpg',
    ph: '[ Nazim photo ]'
  },
  {
    name: 'Irfana',
    role: 'Co-Founder & Production',
    image: '/images/Irfana.jpg',
    ph: '[ Irfana photo ]'
  }
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-[#080808] text-white" id="about">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
          The Team Behind It
        </h2>

        <p className="text-gray-300 font-light text-base sm:text-xl leading-relaxed max-w-3xl mx-auto">
          Third AI Commercials is a{' '}
          <strong className="text-white font-semibold">two-person studio from Haripad, Kerala</strong> — built
          with no funding and no film background, to broadcast standard, in nine months. We pair AI production
          with real marketing strategy to make brand films that don't just look good — they grow businesses.
        </p>

        {/* Founders Grid */}
        <div className="flex flex-wrap justify-center gap-12 pt-6">
          {founders.map((f, idx) => (
            <div key={idx} className="w-60 flex flex-col items-center space-y-3 group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#141414] border-2 border-[#ff2751] overflow-hidden flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                {f.image ? (
                  <img
                    src={f.image}
                    alt={f.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-xs font-mono text-gray-500">{f.ph}</span>
                )}
              </div>

              <h4 className="font-display font-bold text-xl text-white">{f.name}</h4>
              <div className="text-xs font-mono text-[#ff2751] uppercase tracking-wider font-semibold">
                {f.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
