import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Instagram, CheckCircle2, Send } from 'lucide-react';

const PROJECT_TYPES = ['AI Video', 'Product Ads', 'Fashion Campaign', 'Brand Content'];

export default function ContactSection() {
  const fogCanvasRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', projectTypes: [] });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fogCanvas = fogCanvasRef.current;
    if (!fogCanvas) return;
    const fctx = fogCanvas.getContext('2d');
    let animId;

    function resizeFog() {
      fogCanvas.width = fogCanvas.offsetWidth;
      fogCanvas.height = fogCanvas.offsetHeight;
    }
    resizeFog();

    const fogBlobs = Array.from({ length: 5 }, () => ({
      x: Math.random() * fogCanvas.width,
      y: Math.random() * fogCanvas.height,
      r: 150 + Math.random() * 200,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3
    }));

    function drawFog() {
      fctx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
      fogBlobs.forEach((b) => {
        b.x += b.dx; b.y += b.dy;
        if (b.x < -b.r || b.x > fogCanvas.width + b.r) b.dx *= -1;
        if (b.y < -b.r || b.y > fogCanvas.height + b.r) b.dy *= -1;
        const g = fctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, 'rgba(255, 42, 59, 0.16)');
        g.addColorStop(1, 'rgba(255, 42, 59, 0)');
        fctx.fillStyle = g;
        fctx.beginPath();
        fctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        fctx.fill();
      });
      animId = requestAnimationFrame(drawFog);
    }
    drawFog();
    window.addEventListener('resize', resizeFog);
    return () => { window.removeEventListener('resize', resizeFog); cancelAnimationFrame(animId); };
  }, []);

  const handleTypeToggle = (type) => {
    setFormData((prev) => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(type)
        ? prev.projectTypes.filter((t) => t !== type)
        : [...prev.projectTypes, type]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const emailTo = 'Thirdaicommercials@gmail.com';
    const subject = encodeURIComponent(`New Project Inquiry for Third AI Commercials LLP from ${formData.name}`);
    const projectTypesStr = formData.projectTypes.length > 0 ? formData.projectTypes.join(', ') : 'Not Specified';
    const bodyText = `Name: ${formData.name}\nEmail: ${formData.email}\nWhat we are building: ${projectTypesStr}\n\nProject Details:\n${formData.message}`;
    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', projectTypes: [] });
      setTimeout(() => setSubmitted(false), 6000);
    }, 800);
  };

  return (
    <section className="section cta-section relative flex flex-col items-center justify-center py-16 sm:py-24" id="contact">
      <canvas ref={fogCanvasRef} id="fog-canvas" className="absolute inset-0 z-0 pointer-events-none w-full h-full" />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-4">
        <div className="glass p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-[32px] border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 text-left">
            <div>
              <div className="eyebrow">GET IN TOUCH</div>
              <h2 className="font-display font-light text-2xl sm:text-4xl text-white leading-tight mt-2">
                Third AI Commercials LLP
              </h2>
              <p className="text-gray-400 text-sm font-light leading-relaxed mt-3">
                Every day your brand looks average, a customer is choosing someone else. Let's build something unforgettable.
              </p>
            </div>

            <div className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs w-max">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Open for New Projects</span>
            </div>

            <div className="space-y-5 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-red block mb-1">Company Entity</span>
                <span className="text-white text-sm sm:text-base font-sans font-medium">Third AI Commercials LLP</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-red block mb-1">Phone / Call</span>
                <a href="tel:+919539101061" className="text-white text-sm sm:text-base font-sans font-medium hover:text-brand-red transition">
                  +91 95391 01061
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-red block mb-1">Email Inquiry</span>
                <a href="mailto:Thirdaicommercials@gmail.com" className="text-white text-sm sm:text-base font-sans font-medium hover:text-brand-red transition break-all">
                  Thirdaicommercials@gmail.com
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-red block mb-1">Studio Address</span>
                <span className="text-white text-sm font-sans font-medium">Haripad, Alappuzha, Kerala · Available Worldwide</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center space-x-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Follow Us</span>
              <a
                href="https://www.instagram.com/kaelix.ai/reels/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-red hover:border-brand-red transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7 text-left">
            {submitted ? (
              <div className="glass p-8 sm:p-10 rounded-2xl sm:rounded-3xl border border-emerald-500/40 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-emerald-400 mx-auto" />
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">Transmission Received</h3>
                <p className="text-gray-300 text-xs font-mono leading-relaxed max-w-md mx-auto">
                  Your project metrics have been logged in our system. A creative producer will establish contact within 24 standard hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-400 block mb-3">WHAT ARE WE BUILDING?</span>
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_TYPES.map((type) => {
                      const isActive = formData.projectTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleTypeToggle(type)}
                          className={`px-4 py-2 rounded-full text-xs font-mono transition-all duration-300 border ${
                            isActive
                              ? 'bg-brand-red border-brand-red text-white shadow-red-glow'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name + Email — stack on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl glass-input text-sm font-sans"
                    style={{ fontSize: '16px' }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl glass-input text-sm font-sans"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your project or vision..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl glass-input text-sm font-sans resize-none"
                  style={{ fontSize: '16px' }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-brand-red text-white font-display text-xs font-bold uppercase tracking-widest shadow-red-glow flex items-center justify-center space-x-2.5 transition-all hover:bg-red-600 active:scale-95"
                >
                  {loading ? <span>Establishing link...</span> : (
                    <><span>SUBMIT REQUEST</span><Send className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
