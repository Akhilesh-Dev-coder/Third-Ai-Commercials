import React from 'react';

const stats = [
  { value: '357+', label: 'Projects Delivered' },
  { value: '12M+', label: 'Views Generated' },
  { value: '28+', label: 'Global Clients' },
  { value: '100%', label: 'Client Satisfaction' }
];

export default function StatsSection() {
  return (
    <section className="py-10 sm:py-14 px-4 sm:px-[6vw] border-y border-white/10 bg-[#0B0B11]">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
        {stats.map((s, idx) => (
          <div key={idx} className="text-center space-y-1.5">
            <div className="font-display font-light text-3xl sm:text-5xl text-white">{s.value}</div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
