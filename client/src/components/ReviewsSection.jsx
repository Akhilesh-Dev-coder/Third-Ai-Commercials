import React from 'react';

const testimonialsList = [
  {
    quote: "Our Diwali ad looked better than anything we'd ever put out. Delivered fast and nailed it first try.",
    author: "Muhammed Shebeer",
    role: "Co-Founder, Feloc Peanut Butter",
    link: "https://www.feloc.in/"
  },
  {
    quote: "Everyone loves it. Great job. Can't wait to see the other videos.",
    author: "Imraan Assim",
    role: "Eternal Virtue Marketing",
    link: "https://eternalvirtue.org/"
  },
  {
    quote: "It looks terrific — great job!",
    author: "Riyas",
    role: "Bombae Social",
    link: "https://www.bombaesocial.ca/"
  },
  {
    quote: "The roof looked so real I couldn't tell it was AI. That's exactly what we wanted.",
    author: "Ansif",
    role: "Creative Head, Luxume Roofing",
    link: "https://www.luxume.in/"
  }
];

export default function ReviewsSection() {
  return (
    <section className="section" id="reviews">
      <div className="eyebrow">Client Words</div>
      <h2 className="big-title text-[clamp(28px,5vw,56px)] mb-8 sm:mb-12">
        Trusted by ambitious brands.
      </h2>

      {/* Snap-scroll horizontal carousel */}
      <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 -mx-4 px-4 sm:-mx-0 sm:px-0">
        {testimonialsList.map((t, idx) => (
          <div
            key={idx}
            className="glass flex-none w-[85vw] sm:w-[min(82vw,620px)] p-7 sm:p-10 snap-center rounded-2xl sm:rounded-[24px] border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="text-brand-red font-display text-3xl sm:text-4xl mb-3 sm:mb-4 font-bold">"</div>
              <p className="font-display font-light text-[clamp(17px,2.6vw,28px)] leading-snug text-white">
                "{t.quote}"
              </p>
            </div>
            <div className="testi-author mt-6 text-gray-400 text-sm font-mono">
              <b className="text-white font-semibold">{t.author}</b> —{' '}
              <a href={t.link} target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">
                {t.role}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
