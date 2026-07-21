import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [faqs] = useState([
    {
      question: 'How fast is the turnaround for an AI commercial?',
      answer: 'Our standard neural production turnaround is 72 hours from brief approval. Rush 24-48 hour delivery is available for urgent product launches.'
    },
    {
      question: 'Do we own the full commercial rights & raw renders?',
      answer: 'Yes, 100%. Upon completion, you receive full worldwide perpetual broadcast, TV, digital, and social media distribution rights with zero royalty fees.'
    },
    {
      question: 'How does AI video quality compare to traditional live shoots?',
      answer: 'Our neural models (Sora v3, Runway Gen-3, ComfyUI) render 4K HDR video with photorealistic lighting, fluid physics, and sub-surface scattering that rival multi-hundred-thousand-dollar live camera shoots.'
    },
    {
      question: 'Can we include real human actors or our physical product?',
      answer: 'Absolutely. We can train custom LoRA models on your exact physical product, bottle, or brand spokesperson to ensure 100% brand accuracy across all generated scenes.'
    },
    {
      question: 'What video aspect ratios and formats are included?',
      answer: 'Every commercial package includes native 16:9 Landscape (TV/Desktop), 9:16 Vertical (TikTok/Reels/Shorts), and 1:1 Square exports in ProRes and MP4 4K formats.'
    }
  ]);
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-16 sm:py-24 relative overflow-hidden bg-brand-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-brand-red/30 text-xs font-mono font-bold text-brand-red uppercase tracking-wider shadow-red-glow">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-5xl tracking-tight text-white">
            Frequently Asked <span className="text-gradient-red">Questions</span>
          </h2>
          <p className="text-gray-400 text-sm font-light px-2">
            Everything you need to know about our neural commercial studio pipeline.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq._id || idx}
                className={`glass-panel rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                  isOpen ? 'border-brand-red/60 shadow-red-glow' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-6 text-left flex items-start sm:items-center justify-between gap-3 sm:gap-4"
                >
                  <span className="font-display font-bold text-base sm:text-lg text-white leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-red flex-shrink-0 mt-0.5 sm:mt-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 text-sm text-gray-300 leading-relaxed font-light border-t border-white/5 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
