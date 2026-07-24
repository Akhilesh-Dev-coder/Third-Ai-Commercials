import React, { useState, useEffect, useRef } from 'react';
import ProjectModal from './ProjectModal';
import { fetchProjects } from '../services/api';

import aurumWatchesImg from '../assets/aurum_watches.png';
import voltaEvImg from '../assets/volta_ev.png';
import noirAtelierImg from '../assets/noir_atelier.png';
import haloAudioImg from '../assets/halo_audio.png';
import echoesOfMarsImg from '../assets/echoes_of_mars.png';
import nyxProtocolImg from '../assets/nyx_protocol.png';

const projects = [
  {
    _id: '1',
    cat: 'Luxury Brand',
    category: 'Luxury Brand',
    title: 'Aurum Watches — Timeless',
    tools: 'Runway · Kling · ElevenLabs',
    technology: ['Runway Gen-3', 'Kling AI', 'ElevenLabs Audio'],
    description: 'Ultra-close macro cinematography revealing intricate gold gears, jeweled movements, and liquid lighting physics.',
    img: aurumWatchesImg,
    thumbnailUrl: aurumWatchesImg,
    videoUrl: 'https://res.cloudinary.com/dawby8dui/video/upload/f_auto,q_auto/portfolio/AI%20ADS/IMG_0930.mp4',
    c1: '#331015',
    c2: '#0b0507'
  },
  {
    _id: '2',
    cat: 'Automotive',
    category: 'Automotive',
    title: 'Volta EV — Silent Velocity',
    tools: 'Veo · Luma · Flux',
    technology: ['Veo AI', 'Luma Dream Machine', 'Flux.1'],
    description: 'A revolutionary electric hypercar commercial featuring Sora rain optics and high-speed volumetric night visuals.',
    img: voltaEvImg,
    thumbnailUrl: voltaEvImg,
    videoUrl: 'https://res.cloudinary.com/dawby8dui/video/upload/f_auto,q_auto/portfolio/cinematic_ai/openart-02178156919048000000000000000000000ffffc0a8a22a4844ab_1781569393835_f48e7a7c.mp4',
    c1: '#2b0f14',
    c2: '#080406'
  },
  {
    _id: '3',
    cat: 'Fashion',
    category: 'Fashion',
    title: 'Noir Atelier — SS26',
    tools: 'Midjourney · Runway',
    technology: ['Midjourney v6', 'Runway Gen-3', 'ACES Color'],
    description: 'Dark editorial-style haute couture campaign with glowing crimson satin physics and high-fashion aesthetics.',
    img: noirAtelierImg,
    thumbnailUrl: noirAtelierImg,
    videoUrl: 'https://res.cloudinary.com/dawby8dui/video/upload/f_auto,q_auto/portfolio/AI%20ADS/IMG_1348.mp4',
    c1: '#381218',
    c2: '#090406'
  },
  {
    _id: '4',
    cat: 'Product Launch',
    category: 'Product Launch',
    title: 'Halo Audio — First Listen',
    tools: 'Kling · ElevenLabs',
    technology: ['Kling AI 1.5', 'ElevenLabs Audio', 'ComfyUI'],
    description: 'Futuristic audio commercial depicting acoustic waves forming neon light architectures around the listener.',
    img: haloAudioImg,
    thumbnailUrl: haloAudioImg,
    videoUrl: 'https://res.cloudinary.com/dawby8dui/video/upload/f_auto,q_auto/portfolio/AI%20ADS/Video-131.mp4',
    c1: '#2b0c10',
    c2: '#080305'
  },
  {
    _id: '5',
    cat: 'Cinematic AI',
    category: 'Cinematic AI',
    title: 'Echoes of Mars',
    tools: 'Veo · OpenAI · Flux',
    technology: ['Google Veo', 'OpenAI Sora', 'Flux.1 Pro'],
    description: 'Sci-fi short film featuring volumetric Martian dust storms, synthetic biomechanical rovers, and atmospheric synth grading.',
    img: echoesOfMarsImg,
    thumbnailUrl: echoesOfMarsImg,
    videoUrl: 'https://res.cloudinary.com/dawby8dui/video/upload/f_auto,q_auto/portfolio/cinematic_ai/Video-685.mp4',
    c1: '#3d1218',
    c2: '#0b0406'
  },
  {
    _id: '6',
    cat: 'Gaming',
    category: 'Gaming',
    title: 'Nyx Protocol — Reveal Trailer',
    tools: 'Runway · Luma',
    technology: ['Runway Gen-3', 'Luma Machine'],
    description: 'High-octane trailer showcasing cybernetic warriors, particle energy shields, and futuristic neon corridors.',
    img: nyxProtocolImg,
    thumbnailUrl: nyxProtocolImg,
    videoUrl: 'https://res.cloudinary.com/dawby8dui/video/upload/f_auto,q_auto/portfolio/ANIMATION%20AI/Video-455.mp4',
    c1: '#240a0e',
    c2: '#070204'
  }
];

function ProjectCard({ project, index, onSelect }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const playOverlayRef = useRef(null);
  const bgRef = useRef(null);

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;

    const rotateX = yc * -8;
    const rotateY = xc * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.012, 1.012, 1.012)`;

    if (bgRef.current) {
      const bgX = xc * -10;
      const bgY = yc * -10;
      bgRef.current.style.transform = `scale(1.08) translate3d(${bgX}px, ${bgY}px, 0)`;
    }

    if (glowRef.current) {
      const gx = x - 140;
      const gy = y - 140;
      glowRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
    }

    if (playOverlayRef.current) {
      const px = x - 28;
      const py = y - 28;
      playOverlayRef.current.style.transform = `translate3d(${px}px, ${py}px, 0) scale(1)`;
    }
  };

  const handleMouseLeave = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

    if (bgRef.current) {
      bgRef.current.style.transform = `scale(1) translate3d(0, 0, 0)`;
    }

    if (playOverlayRef.current) {
      playOverlayRef.current.style.transform = `translate3d(50%, 50%, 0) scale(0)`;
    }
  };

  const isWide = index === 0 || index === 3 || index === 5;
  const colSpanClass = isWide ? 'md:col-span-2' : 'md:col-span-1';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
      className={`proj-card ${colSpanClass} relative min-h-[380px] sm:min-h-[440px] rounded-[24px] overflow-hidden border border-white/10 cursor-pointer transition-all duration-500 group shadow-2xl`}
    >
      {/* Background Poster Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
        style={{ backgroundImage: `url(${project.img || project.thumbnailUrl || ''})` }}
      />

      {/* Red Radial Glow */}
      <div
        ref={glowRef}
        className="absolute w-[280px] h-[280px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md z-10 mix-blend-overlay"
        style={{
          background: 'radial-gradient(circle, rgba(255, 42, 59, 0.45), transparent 70%)'
        }}
      />

      {/* Play Cursor Button Badge */}
      <div
        ref={playOverlayRef}
        className="absolute w-14 h-14 rounded-full bg-brand-red text-white flex items-center justify-center pointer-events-none z-30 transition-transform duration-200 shadow-[0_0_24px_#FF2A3B] scale-0"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>

      {/* Scrim Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-black/40 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

      {/* Card Info */}
      <div className="absolute left-0 right-0 bottom-0 p-8 z-20">
        <div className="font-display text-xs tracking-[0.2em] uppercase text-brand-red mb-2 font-semibold">
          {project.cat || project.category}
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-light text-white mb-3 leading-tight">
          {project.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(project.tools || (Array.isArray(project.technology) ? project.technology.join(' · ') : project.technology || '')).split(' · ').map((tool, tIdx) => (
            <span
              key={tIdx}
              className="text-[11px] font-mono text-gray-300 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedWorkSection() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [dynamicProjects, setDynamicProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetchProjects();
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setDynamicProjects(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load projects from backend, using fallbacks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const displayProjects = dynamicProjects.length > 0 ? dynamicProjects : projects;

  return (
    <section className="section" id="work">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between flex-wrap gap-6 mb-12">
        <div>
          <div className="eyebrow">Selected Work</div>
          <h2 className="big-title text-[clamp(32px,5vw,64px)]">
            Every frame,<br />generated from imagination.
          </h2>
        </div>
        <p className="sub">
          A cinematic archive of campaigns built entirely with generative AI — from concept to final grade.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayProjects.map((p, idx) => (
          <ProjectCard key={p._id || idx} index={idx} project={p} onSelect={setSelectedProject} />
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
