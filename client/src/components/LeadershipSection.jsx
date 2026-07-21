import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Linkedin, UserCheck, Award, ShieldCheck } from 'lucide-react';
import { fetchCEOs } from '../services/api';

export default function LeadershipSection() {
  const [ceos, setCeos] = useState([]);

  useEffect(() => {
    const loadCEOs = async () => {
      try {
        const res = await fetchCEOs();
        if (res.data.success && res.data.data.length > 0) {
          setCeos(res.data.data);
        } else {
          setCeos([
            {
              _id: '1',
              name: 'Alexander Vance',
              position: 'Co-Founder & Chief Executive Officer',
              bio: 'Former AI Research Lead at OpenAI & Commercial Film Director. Pioneered generative Sora camera physics for global brand campaigns.',
              linkedin: 'https://linkedin.com',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop'
            },
            {
              _id: '2',
              name: 'Dr. Evelyn Reed',
              position: 'Chief Technology Officer & Neural Lead',
              bio: 'Ph.D. in Computer Vision & Neural Graphics from MIT. Architect of Third AI proprietary diffusion upscaling & ACES color pipelines.',
              linkedin: 'https://linkedin.com',
              image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop'
            }
          ]);
        }
      } catch (err) {
        console.warn('Fallback CEOs loaded');
      }
    };
    loadCEOs();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-brand-dark/95 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-brand-red/30 text-xs font-mono font-bold text-brand-red uppercase tracking-wider shadow-red-glow">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Executive Board & AI Directors</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-white">
            Led By Industry <span className="text-gradient-red">Pioneers</span>
          </h2>
          <p className="text-gray-400 text-base font-light">
            Our leadership team bridges elite machine learning research with world-class commercial directing.
          </p>
        </div>

        {/* CEO Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {ceos.map((c, idx) => (
            <motion.div
              key={c._id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel glass-panel-hover rounded-3xl p-8 border border-white/10 hover:border-brand-red/50 flex flex-col sm:flex-row items-center gap-6 shadow-xl"
            >
              <img
                src={c.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop'}
                alt={c.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-brand-red/40 shadow-red-glow shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-between">
                  <h3 className="font-display font-extrabold text-xl text-white">
                    {c.name}
                  </h3>
                  {c.linkedin && (
                    <a
                      href={c.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-brand-red transition"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-xs font-mono font-bold text-brand-red uppercase tracking-wider">{c.position}</p>
                <p className="text-gray-300 text-xs leading-relaxed font-light line-clamp-3">
                  {c.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
