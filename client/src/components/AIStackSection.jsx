import React from 'react';

const tools = [
  'Sora',
  'OpenAI',
  'Runway Gen-3',
  'Kling AI',
  'Veo',
  'Midjourney v6',
  'Flux',
  'Luma Dream Machine',
  'ElevenLabs',
  'ComfyUI'
];

export default function AIStackSection() {
  return (
    <section className="section">
      <div className="eyebrow self-center">The Stack</div>
      <h2 className="big-title text-[clamp(28px,4vw,48px)] text-center mb-12">
        Best-in-class generative models,<br />orchestrated by our team.
      </h2>

      <div className="tools-wall glass p-10 flex flex-wrap gap-4 justify-center max-w-4xl mx-auto rounded-[24px]">
        {tools.map((t, idx) => (
          <div
            key={idx}
            className="tool-chip glass px-8 py-4 rounded-full font-display text-sm tracking-wide text-gray-200 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,42,59,0.45)] hover:border-brand-red hover:text-white hover:-translate-y-1 cursor-pointer border border-white/10"
          >
            {t}
          </div>
        ))}
      </div>
    </section>
  );
}
