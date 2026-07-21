import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Instagram, CheckCircle2, Send, MessageCircle } from 'lucide-react';

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
    let isVisible = false;

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
      if (!isVisible) return;
      fctx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
      fogBlobs.forEach((b) => {
        b.x += b.dx; b.y += b.dy;
        if (b.x < -b.r || b.x > fogCanvas.width + b.r) b.dx *= -1;
        if (b.y < -b.r || b.y > fogCanvas.height + b.r) b.dy *= -1;
        const g = fctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, 'rgba(255, 39, 81, 0.16)');
        g.addColorStop(1, 'rgba(255, 39, 81, 0)');
        fctx.fillStyle = g;
        fctx.beginPath();
        fctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        fctx.fill();
      });
      animId = requestAnimationFrame(drawFog);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animId) {
            animId = requestAnimationFrame(drawFog);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(fogCanvas);

    window.addEventListener('resize', resizeFog, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeFog);
      if (animId) cancelAnimationFrame(animId);
    };
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
    <section className="section cta-section relative flex flex-col items-center justify-center py-20 sm:py-28 bg-[#080808]" id="contact">
      <canvas ref={fogCanvasRef} id="fog-canvas" className="absolute inset-0 z-0 pointer-events-none w-full h-full" />

      {/* Main Banner Heading matching root index.html CTA */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 mb-14 space-y-4">
        <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white leading-tight">
          Ready to make your brand <span className="bg-gradient-to-r from-[#ff2751] to-[#e722ff] bg-clip-text text-transparent">unforgettable?</span>
        </h2>
        <p className="text-gray-300 text-lg sm:text-2xl font-light">
          Tell us about your brand — we'll show you what's possible.
        </p>

        {/* WhatsApp Direct CTA Button */}
        <div className="pt-4">
          <a
            href="https://wa.me/919539101061?text=Hi%20Third%20AI%20Commercials,%20I'd%20like%20to%20get%20a%20quote%20for%20our%20brand."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#ff2751] to-[#e722ff] text-white font-bold text-lg sm:text-xl px-10 py-5 rounded-xl shadow-[0_10px_40px_rgba(255,39,81,0.35)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
            <span>Get a Quote on WhatsApp →</span>
          </a>
        </div>
      </div>

      {/* Form & Info Card */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4">
        <div className="glass p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-[32px] border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 text-left">
            <div>
              <div className="eyebrow">GET IN TOUCH</div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight mt-2">
                Third AI Commercials LLP
              </h3>
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
                <span className="text-[10px] uppercase tracking-widest text-[#ff2751] block mb-1">Company Entity</span>
                <span className="text-white text-sm sm:text-base font-sans font-medium">Third AI Commercials LLP</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#ff2751] block mb-1">Phone / Call</span>
                <a href="tel:+919539101061" className="text-white text-sm sm:text-base font-sans font-medium hover:text-[#ff2751] transition">
                  +91 95391 01061
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#ff2751] block mb-1">Email Inquiry</span>
                <a href="mailto:Thirdaicommercials@gmail.com" className="text-white text-sm sm:text-base font-sans font-medium hover:text-[#ff2751] transition break-all">
                  Thirdaicommercials@gmail.com
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#ff2751] block mb-1">Studio Address</span>
                <span className="text-white text-sm font-sans font-medium">Haripad, Alappuzha, Kerala · Available Worldwide</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center space-x-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Follow Us</span>
              <a
                href="https://www.instagram.com/third_ai_official?igsh=MXFubmd6am9oanV0aQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#ff2751] hover:border-[#ff2751] transition"
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
                  Your project request has been logged. Our team will contact you within 24 hours.
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
                              ? 'bg-[#ff2751] border-[#ff2751] text-white shadow-red-glow'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

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
                  className="w-full py-4 rounded-full bg-[#ff2751] text-white font-display text-xs font-bold uppercase tracking-widest shadow-red-glow flex items-center justify-center space-x-2.5 transition-all hover:bg-red-600 active:scale-95"
                >
                  {loading ? <span>Sending...</span> : (
                    <><span>SEND INQUIRY</span><Send className="w-4 h-4" /></>
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
