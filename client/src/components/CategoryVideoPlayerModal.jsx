import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Play, Pause, Film, Tv, Box } from 'lucide-react';

export default function CategoryVideoPlayerModal({ category, projects = [], onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // Start muted by default to support iOS Safari autoplay guidelines
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const mobileVideoRefs = useRef([]);
  const laptopVideoRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Filter projects by category
  const filteredProjects = projects.filter(
    (p) => (p.category || p.cat || '').toLowerCase() === category.toLowerCase()
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll and hide navigation bar when modal is active
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.display = 'none';
    }

    return () => {
      document.body.style.overflow = originalStyle;
      if (navbar) {
        navbar.style.display = '';
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Handle active video change and playback
  useEffect(() => {
    if (isMobile) {
      // Mobile snaps multiple video elements
      mobileVideoRefs.current.forEach((ref, idx) => {
        if (ref) {
          if (idx === activeIdx) {
            ref.muted = isMuted;
            if (isPlaying) {
              // Reset only active video when it begins playing (avoid resetting others)
              if (ref.readyState >= 1) {
                ref.currentTime = 0;
              }
              ref.play()
                .then(() => {
                  ref.muted = isMuted;
                })
                .catch(() => {});
            } else {
              if (!ref.paused) ref.pause();
            }
          } else {
            if (!ref.paused) ref.pause();
          }
        }
      });
    } else {
      // Laptop: only one video element exists in DOM
      const ref = laptopVideoRef.current;
      if (ref) {
        ref.muted = isMuted;
        if (isPlaying) {
          ref.play()
            .then(() => {
              ref.muted = isMuted;
            })
            .catch(() => {});
        } else {
          if (!ref.paused) ref.pause();
        }
      }
    }
  }, [activeIdx, isPlaying, isMobile]);

  // Handle dynamic volume changes (fixes React's video muted attribute bug in Chrome/Safari)
  useEffect(() => {
    if (isMobile) {
      const activeRef = mobileVideoRefs.current[activeIdx];
      if (activeRef) {
        activeRef.muted = isMuted;
      }
    } else {
      const ref = laptopVideoRef.current;
      if (ref) {
        ref.muted = isMuted;
      }
    }
  }, [isMuted, activeIdx, isMobile]);

  if (filteredProjects.length === 0) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center max-w-sm">
          <h3 className="text-xl font-bold text-white mb-2">No videos yet</h3>
          <p className="text-gray-400 text-sm mb-6">No projects uploaded under "{category}" yet.</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-brand-red text-white text-xs font-mono font-bold uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const activeProject = filteredProjects[activeIdx];

  const handleMobileScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    const clientHeight = e.currentTarget.clientHeight;
    const index = Math.round(scrollTop / clientHeight);
    
    if (index !== activeIdx && index >= 0 && index < filteredProjects.length) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setActiveIdx(index);
        setIsPlaying(true);
      }, 150); // Debounce to allow scroll animations to settle smoothly
    }
  };

  const togglePlay = () => {
    const activeVideo = isMobile ? mobileVideoRefs.current[activeIdx] : laptopVideoRef.current;
    if (activeVideo) {
      if (isPlaying) {
        activeVideo.pause();
        setIsPlaying(false);
      } else {
        activeVideo.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#050507]/98 flex flex-col items-center justify-center p-0 md:p-6 select-none animate-fadeIn">
      {/* Category Tag Badge - Top Left */}
      <div className="absolute top-4 left-4 z-[1001] bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 flex items-center gap-2 shadow-2xl">
        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
        <span className="text-[11px] font-mono font-black uppercase text-white tracking-widest">
          {category}
        </span>
      </div>

      {/* Close Button - Top Right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[1001] p-3 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 hover:bg-brand-red hover:border-brand-red/40 transition shadow-2xl active:scale-95 cursor-pointer"
        aria-label="Close modal"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {isMobile ? (
        /* ==================== MOBILE REELS VIEW ==================== */
        <div
          onScroll={handleMobileScroll}
          className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-none flex flex-col bg-black"
        >
          {filteredProjects.map((proj, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div
                key={proj._id || idx}
                className="w-full h-[100dvh] flex-none snap-start relative flex items-center justify-center overflow-hidden bg-black"
              >
                {/* Blurred Video Backdrop for Premium Look */}
                <div
                  className="absolute inset-0 bg-cover bg-center blur-3xl opacity-35 scale-105 pointer-events-none"
                  style={{ backgroundImage: `url(${proj.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop'})` }}
                />

                {/* Background Video */}
                {Math.abs(idx - activeIdx) <= 1 ? (
                  <video
                    ref={(el) => (mobileVideoRefs.current[idx] = el)}
                    src={proj.videoUrl}
                    poster={proj.thumbnailUrl}
                    loop
                    playsInline
                    muted={isMuted}
                    preload={idx === activeIdx ? "auto" : "metadata"}
                    onClick={togglePlay}
                    className="w-full h-full object-contain relative z-10"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                    {proj.thumbnailUrl && (
                      <img
                        src={proj.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-contain opacity-40 blur-[2px]"
                      />
                    )}
                  </div>
                )}

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 pointer-events-none" />

                {/* Reels Controls Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
                  {!isPlaying && (
                    <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 animate-ping">
                      <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
                    </div>
                  )}
                </div>

                {/* Audio Mute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-32 right-6 z-30 p-3.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15 hover:bg-brand-red transition active:scale-95"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                {/* Video Info Card */}
                <div className="absolute left-0 right-0 bottom-0 p-6 pb-20 z-20 text-white space-y-3 pointer-events-none">
                  <div className="flex flex-wrap gap-1.5 pointer-events-auto">
                    {(Array.isArray(proj.technology) ? proj.technology : []).map((t, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-brand-red/80 text-white border border-brand-red/40"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-brand-red font-bold uppercase tracking-wider block mb-0.5">
                      {proj.client}
                    </span>
                    <h4 className="font-display font-black text-xl leading-tight">{proj.title}</h4>
                    <p className="text-xs text-gray-300 font-light mt-1.5 line-clamp-3 leading-relaxed pointer-events-auto">
                      {proj.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ==================== LAPTOP THEATER VIEW ==================== */
        <div className="w-full max-w-6xl aspect-[16/9.5] bg-black/40 border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
          {/* Left Side: Active Video Player & HUD */}
          <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden group/player">
            <video
              ref={laptopVideoRef}
              src={activeProject.videoUrl}
              poster={activeProject.thumbnailUrl}
              loop
              playsInline
              preload="auto"
              muted={isMuted}
              className="w-full h-full object-contain relative z-10"
            />

            {/* Custom Control Buttons (Overlay on Hover) */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center gap-6">
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand-red hover:border-brand-red/40 transition duration-300 shadow-2xl"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-0.5" />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand-red hover:border-brand-red/40 transition duration-300 shadow-2xl"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>

            {/* Dark bottom scrim for information HUD */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent z-15 pointer-events-none" />

            {/* Project info overlay overlay */}
            <div className="absolute left-6 right-6 bottom-6 z-20 text-white space-y-1">
              <span className="text-[10px] font-mono font-bold text-brand-red uppercase tracking-wider block">
                {activeProject.client}
              </span>
              <h3 className="font-display font-extrabold text-2xl tracking-tight leading-tight">
                {activeProject.title}
              </h3>
            </div>
          </div>

          {/* Right Side: Scrollable Play List */}
          <div className="w-full md:w-80 bg-brand-surface border-l border-white/10 flex flex-col">
            {/* Sidebar Title */}
            <div className="p-4 border-b border-white/10 flex items-center gap-2 shrink-0">
              <Film className="w-4 h-4 text-brand-red" />
              <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest">
                Playlist ({filteredProjects.length})
              </span>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[50vh] md:max-h-none scrollbar-thin">
              {filteredProjects.map((proj, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <div
                    key={proj._id || idx}
                    onClick={() => {
                      setActiveIdx(idx);
                      setIsPlaying(true);
                    }}
                    className={`relative p-2.5 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-3 ${
                      isActive
                        ? 'border-brand-red bg-brand-red/10 shadow-[0_0_15px_rgba(255,39,81,0.15)]'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <img
                        src={proj.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop'}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red" />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="overflow-hidden flex flex-col justify-center">
                      <h4 className="text-[13px] font-bold text-white truncate leading-snug">
                        {proj.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-mono truncate mt-0.5">
                        {proj.client}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar Bottom Details Panel */}
            <div className="p-5 border-t border-white/10 bg-black/30 shrink-0 text-xs text-gray-400 space-y-3 max-h-44 overflow-y-auto">
              <p className="line-clamp-3 leading-relaxed text-gray-300">
                {activeProject.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {(Array.isArray(activeProject.technology) ? activeProject.technology : []).map((t, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
