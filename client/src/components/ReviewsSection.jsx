import React from 'react';

const testimonialsList = [
  {
    quote: "Our Diwali ad looked better than anything we'd ever put out. Delivered fast and nailed it first try.",
    author: "Muhammed Shebeer",
    role: "Co-Founder, Feloc Peanut Butter",
    link: "https://www.feloc.in/"
  },
  {
    quote: "Working on our TVC campaign with Third AI was seamless. Broadcast-ready visuals and top production standards.",
    author: "MCR Director",
    role: "MCR Easy Fit Dhoti",
    link: "#"
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
    <section className="py-24 bg-[#0e0e0e] text-white" id="reviews">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 text-base sm:text-xl font-light">
            Real words from the brands we've grown.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsList.slice(0, 3).map((t, idx) => (
            <div
              key={idx}
              className="bg-[#131313] border border-[#222] rounded-xl p-7 flex flex-col justify-between relative hover:border-[#ff2751]/50 transition duration-300"
            >
              <div>
                <div className="text-[#ff2751] text-lg tracking-widest mb-4">★★★★★</div>
                <p className="text-gray-300 text-base italic leading-relaxed mb-6 font-light">
                  "{t.quote}"
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#141414] border border-[#ff2751] flex items-center justify-center font-bold text-xs text-white">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">{t.author}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
