import React, { useState, useEffect, useRef } from 'react';
import { Film, Play, Volume2, VolumeX, X, ChevronUp, Sparkles } from 'lucide-react';

import aurumWatchesImg from '../assets/aurum_watches.png';
import noirAtelierImg from '../assets/noir_atelier.png';
import nyxProtocolImg from '../assets/nyx_protocol.png';
import echoesOfMarsImg from '../assets/echoes_of_mars.png';

// TODO: Set your Cloudinary cloud name here when videos are ready to upload
const CLOUDINARY_CLOUD_NAME = '';

export function getVideoUrl(categoryDir, fileName) {
  if (CLOUDINARY_CLOUD_NAME) {
    const cleanFileName = fileName.replace(/\.[^/.]+$/, "");
    if (fileName.startsWith('/')) {
      const encodedFileName = encodeURIComponent(cleanFileName.slice(1));
      return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,q_auto/${encodedFileName}.mp4`;
    }
    const encodedCategory = encodeURIComponent(categoryDir);
    const encodedFileName = encodeURIComponent(cleanFileName);
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,q_auto/portfolio/${encodedCategory}/${encodedFileName}.mp4`;
  }
  return `/videos/${categoryDir}/${fileName.startsWith('/') ? fileName.slice(1) : fileName}`;
}

export function getVideoPoster(categoryDir, fileName) {
  if (CLOUDINARY_CLOUD_NAME) {
    const cleanFileName = fileName.replace(/\.[^/.]+$/, "");
    if (fileName.startsWith('/')) {
      const encodedFileName = encodeURIComponent(cleanFileName.slice(1));
      return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,q_auto/${encodedFileName}.jpg`;
    }
    const encodedCategory = encodeURIComponent(categoryDir);
    const encodedFileName = encodeURIComponent(cleanFileName);
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,q_auto/portfolio/${encodedCategory}/${encodedFileName}.jpg`;
  }
  return '';
}

const categoriesData = [
  {
    key: 'AI ADS',
    name: 'AI Commercials',
    file: 'IMG_0930.MOV',
    count: 14,
    tags: ['Runway Gen-3', 'Kling AI', 'Ad Copy'],
    desc: 'Ads that make your audience stop, watch, and buy.',
    poster: aurumWatchesImg
  },
  {
    key: 'AI UGC',
    name: 'AI UGC Creator',
    file: 'Video-172.mp4',
    count: 8,
    tags: ['Synthesia', 'HeyGen', 'Realistic Avatar'],
    desc: 'Content that builds trust and turns viewers into customers.',
    poster: noirAtelierImg
  },
  {
    key: 'ANIMATION AI',
    name: 'AI Animations',
    file: 'Video-346.mp4',
    count: 4,
    tags: ['Luma Machine', 'Morphs', 'Surreal Loops'],
    desc: "Visuals that keep your brand stuck in people's heads.",
    poster: nyxProtocolImg
  },
  {
    key: 'cinematic_ai',
    name: 'Cinematic AI',
    file: 'Video-685.mp4',
    count: 4,
    tags: ['Sora AI', 'Epic Sci-Fi', 'World-Gen'],
    desc: 'Films that make your audience feel connected to your brand.',
    poster: echoesOfMarsImg
  }
];

const videosData = [
  // AI ADS
  { id: 'ad-1', categoryDir: 'AI ADS', file: 'IMG_0930.MOV', title: 'Luxury Timepiece Mechanics', tags: ['Watches', 'Macro', 'Luxury'], desc: 'Ultra-close macro cinematography revealing the intricate gold gears and jewelled movements inside a precision luxury watch.' },
  { id: 'ad-2', categoryDir: 'AI ADS', file: 'IMG_1348.MOV', title: 'Rimless Titanium Eyewear', tags: ['Fashion', 'Eyewear', 'Editorial'], desc: 'Dark editorial-style campaign for a premium rimless sunglasses brand with blue tinted lenses and a moody monochrome aesthetic.' },
  { id: 'ad-3', categoryDir: 'AI ADS', file: 'IMG_1351.MOV', title: "Lay's — Every Moment", tags: ['Food', 'FMCG', 'Lifestyle'], desc: "Vibrant fish-eye commercial for Lay's chips capturing a joyful street moment with floating chips and energy-packed visuals." },
  { id: 'ad-4', categoryDir: 'AI ADS', file: 'Video-131.mp4', title: 'Wild Stone Ultra Sensual', tags: ['Fragrance', 'Luxury', 'Beauty'], desc: 'Bold product reveal ad for Wild Stone Eau de Parfum featuring a striking red glass bottle against flowing crimson satin fabric.' },
  { id: 'ad-5', categoryDir: 'AI ADS', file: 'Video-176.mp4', title: 'Diamond Elegance Jewels', tags: ['Jewelry', 'Ethereal', 'Beauty'], desc: 'Soft dreamy jewellery commercial featuring a woman adorning a delicate diamond earring against a soft blue sky backdrop.' },
  { id: 'ad-6', categoryDir: 'AI ADS', file: 'Video-256.mp4', title: 'Maggi Midnight Craving', tags: ['Food', 'FMCG', 'Relatable'], desc: 'Intimate and craveable instant noodle ad showing a girl twirling hot noodles under warm bokeh lights in a cosy night setting.' },
  { id: 'ad-7', categoryDir: 'AI ADS', file: 'Video-344.mp4', title: 'Luxume Roofing — Desert', tags: ['Construction', 'Brand', 'Cinematic'], desc: 'Cinematic brand film for Luxume Roofing set in sweeping Saharan dunes with a camel and a desert-hardy corrugated rooftop.' },
  { id: 'ad-8', categoryDir: 'AI ADS', file: 'Video-403.mp4', title: 'Velvet Caramel Pour', tags: ['Food', 'Macro', 'Confectionery'], desc: 'Sensual slow-motion macro of molten caramel chocolate spiralling into a perfect swirl under warm golden studio lighting.' },
  { id: 'ad-9', categoryDir: 'AI ADS', file: 'Video-611.mp4', title: 'Oakley Prizm Lens Story', tags: ['Eyewear', 'Sport', 'Outdoor'], desc: "Extreme close-up of an Oakley sport shield lens reflecting a dramatic sunset landscape, capturing the brand's raw performance edge." },
  { id: 'ad-10', categoryDir: 'AI ADS', file: 'Video-612.mp4', title: 'Rouge Lips — Power Shade', tags: ['Beauty', 'Cosmetics', 'Editorial'], desc: 'Cinematic beauty ad showing a bold red lipstick being applied in a glamorous close-up with dramatic lens flare.' },
  { id: 'ad-11', categoryDir: 'AI ADS', file: 'Video-76.mp4', title: 'Vivo Y — Own Your Moment', tags: ['Mobile', 'Lifestyle', 'Youth'], desc: 'Dynamic youth-targeted ad for Vivo smartphone featuring a woman striking a bold boxing pose at a lit poolside venue.' },
  { id: 'ad-12', categoryDir: 'AI ADS', file: 'Video-856.mp4', title: 'Noir Light Pillars', tags: ['Abstract', 'Brand', 'Premium'], desc: 'Minimalist dark-tone brand art featuring glowing vertical light pillars in red and blue against a black void — pure atmosphere.' },
  { id: 'ad-13', categoryDir: 'AI ADS', file: 'Video-893.mp4', title: 'Shanthi Cafe — Baby Adventure', tags: ['Food', 'Animation', 'Cute'], desc: 'Charming 3D animated commercial for Shanthi Cafe featuring an adorable big-eyed baby discovering the warm restaurant world.' },
  { id: 'ad-14', categoryDir: 'AI ADS', file: 'Video-899.mp4', title: 'Luxume Roofing — Kerala Home', tags: ['Construction', 'Brand', 'Tropical'], desc: 'Warm and lush brand film for Luxume Roofing showing a beautiful Kerala traditional home under a mango tree at golden hour.' },

  // AI UGC
  { id: 'ugc-1', categoryDir: 'AI UGC', file: '/IMG_1365.mov', title: 'Wildplay Chocolate Fragrance', tags: ['UGC', 'Fragrance', 'Creator'], desc: 'Natural UGC-style creator review of Wildplay Chocolate Body Perfume — authentic hold-to-camera presentation with warm tones.' },
  { id: 'ugc-2', categoryDir: 'AI UGC', file: 'Video-172.mp4', title: 'Home Renovation Reveal', tags: ['UGC', 'Interior', 'Real Estate'], desc: 'Interior walkthrough UGC showing a freshly renovated room with a wooden glass door, pendant lights, and soft natural daylight.' },
  { id: 'ugc-3', categoryDir: 'AI UGC', file: 'Video-32.mp4', title: 'Red Saree Rooftop Moment', tags: ['UGC', 'Fashion', 'Ethnic'], desc: 'Lifestyle UGC featuring a woman in a radiant red silk saree on a breezy rooftop at dusk — graceful and culturally rich.' },
  { id: 'ugc-4', categoryDir: 'AI UGC', file: 'Video-359.mp4', title: 'Ethnic Jewellery Try-On', tags: ['UGC', 'Jewellery', 'Fashion'], desc: 'Vibrant creator content showcasing statement earrings and ethnic accessories in a lush outdoor setting — festive and real.' },
  { id: 'ugc-5', categoryDir: 'AI UGC', file: 'Video-434.mp4', title: 'Hill Resort Morning View', tags: ['UGC', 'Travel', 'Stay'], desc: 'Breathtaking resort UGC shot from an arch-window looking out over a misty hilltop deck with tall eucalyptus trees.' },
  { id: 'ugc-6', categoryDir: 'AI UGC', file: 'Video-830.mp4', title: 'HORIZON Biker Jacket Drop', tags: ['UGC', 'Streetwear', 'Fashion'], desc: 'Hype fashion UGC for the HORIZON moto jacket — extreme close-up of the embroidered logo, neon green stripes, and leather texture.' },
  { id: 'ugc-7', categoryDir: 'AI UGC', file: 'Video-834.mp4', title: 'Casual Plaid Lookbook', tags: ['UGC', 'Fashion', 'Minimal'], desc: 'Softly overexposed aesthetic lookbook clip showcasing a casual plaid shirt silhouette — warm, dreamy, and effortlessly organic.' },
  { id: 'ugc-8', categoryDir: 'AI UGC', file: 'Video-950.mp4', title: 'Olive Knit Texture Close-Up', tags: ['UGC', 'Apparel', 'Cosy'], desc: 'Textural product UGC revealing the intricate stitch details of an olive-toned knit cardigan — made for slow fashion lovers.' },

  // ANIMATION AI
  { id: 'ani-1', categoryDir: 'ANIMATION AI', file: 'Video-346.mp4', title: 'Shadow Warrior Awakening', tags: ['Animation', 'Dark Fantasy', 'Action'], desc: 'Cinematic dark-fantasy animation of a hooded warrior gripping a blade, wreathed in smoke and ember light in a hauntingly atmospheric scene.' },
  { id: 'ani-2', categoryDir: 'ANIMATION AI', file: 'Video-455.mp4', title: 'NEXUS Mech Surge', tags: ['Animation', 'Sci-Fi', 'Mecha'], desc: 'High-octane 3D animation featuring a red-black mecha suit crackling with electric bolts, mid-combat in a futuristic station corridor.' },
  { id: 'ani-3', categoryDir: 'ANIMATION AI', file: 'Video-563.mp4', title: 'Stealth Drone Over Cliffs', tags: ['Animation', 'Action', 'Sci-Fi'], desc: 'Sweeping aerial animation of a dark stealth drone launching over dramatic fiery cliff-sides with atmospheric light bloom.' },
  { id: 'ani-4', categoryDir: 'ANIMATION AI', file: 'Video-936.mp4', title: 'AI Creator Workflow', tags: ['Animation', 'EdTech', 'Tech'], desc: 'Stylised animated explainer featuring an AI video creator at work with Sony headphones, showcasing InVideo and next-gen AI tools.' },

  // CINEMATIC AI
  { id: 'cine-1', categoryDir: 'cinematic_ai', file: 'Video-685.mp4', title: 'Frost Titan Chronicles', tags: ['Cinematic', 'Epic Fantasy', 'Creature'], desc: 'Epic fantasy cinematic featuring a towering armoured beast-warrior wielding a glowing rune staff in a snowswept mountain realm.' },
  { id: 'cine-2', categoryDir: 'cinematic_ai', file: 'Video-943.mp4', title: 'Macaw Jungle Serenade', tags: ['Cinematic', 'Nature', 'Wildlife'], desc: 'Breathtaking wildlife cinematic of two scarlet macaws in an intimate jungle moment, bathed in cathedral rays of tropical sunlight.' },
  { id: 'cine-3', categoryDir: 'cinematic_ai', file: 'openart-02178156919048000000000000000000000ffffc0a8a22a4844ab_1781569393835_f48e7a7c.mp4', title: 'BMW M3 — Rain & Power', tags: ['Cinematic', 'Automotive', 'Moody'], desc: 'Atmospheric automotive cinematic of a classic red BMW M3 hood-up on a misty rain-soaked road — raw power meets poetic grading.' }
];

function CategoryCard({ category, onOpenReels }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const posterUrl = category.poster || getVideoPoster(category.key, category.file);
  const videoUrl = getVideoUrl(category.key, category.file);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenReels(category.key)}
      className="group relative h-[380px] rounded-[24px] overflow-hidden border border-white/10 glass-panel cursor-pointer transition-all duration-500 hover:border-brand-red/60 hover:-translate-y-1 shadow-2xl"
    >
      {/* Poster Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: posterUrl ? `url(${posterUrl})` : 'none' }}
      />

      {/* Video Preview */}
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        loop
        playsInline
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Scrim Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-black/40 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

      {/* Content */}
      <div className="absolute left-0 right-0 bottom-0 p-7 z-10 flex flex-col justify-end">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-red text-white text-[10px] font-mono font-bold tracking-wider uppercase mb-3 shadow-red-glow self-start">
          {category.count} Videos
        </span>
        <h3 className="font-display text-2xl font-bold text-white mb-1">{category.name}</h3>
        <p className="text-xs text-gray-400 font-light mb-4 line-clamp-2 leading-relaxed">{category.desc}</p>

        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white group-hover:text-brand-red transition">
          <span>Watch in Reels Feed</span>
          <Play className="w-3.5 h-3.5 fill-current" />
        </div>
      </div>
    </div>
  );
}

function ReelFeedSlide({ video, index, activeIndex, isMuted, onMuteToggle }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const posterUrl = getVideoPoster(video.categoryDir, video.file);
  const videoUrl = getVideoUrl(video.categoryDir, video.file);

  const isLoaded = Math.abs(activeIndex - index) <= 1;

  useEffect(() => {
    if (!videoRef.current) return;
    if (activeIndex === index) {
      // Seek only active video to 0 on focus
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      if (!videoRef.current.paused) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, [activeIndex, index]);

  return (
    <div className="relative w-full h-full flex-none snap-start overflow-hidden bg-black flex items-center justify-center">
      {/* Poster Cover */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
        style={{
          backgroundImage: posterUrl ? `url(${posterUrl})` : 'none',
          opacity: isPlaying ? 0 : 1
        }}
      />

      <video
        ref={videoRef}
        src={Math.abs(activeIndex - index) <= 1 ? videoUrl : ''}
        muted={isMuted}
        loop
        playsInline
        preload={activeIndex === index ? "auto" : "metadata"}
        className="w-full h-full object-cover relative z-10"
      />

      {/* Info Hud */}
      <div className="absolute left-0 right-0 bottom-0 p-6 z-20 bg-gradient-to-t from-black via-black/50 to-transparent">
        <div className="flex items-center space-x-2 mb-2">
          {video.tags.map((t, idx) => (
            <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-red/80 text-white font-bold">
              #{t}
            </span>
          ))}
        </div>
        <h4 className="font-display font-bold text-white text-lg">{video.title}</h4>
        <p className="text-xs text-gray-300 font-light mt-1 line-clamp-2 leading-relaxed">{video.desc}</p>
      </div>

      {/* Mute Button */}
      <button
        onClick={onMuteToggle}
        className="absolute top-6 right-6 z-30 p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-brand-red transition"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
}

export default function VideoVault() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleOpenReels = (key) => {
    setActiveCategory(key);
    setActiveReelIndex(0);
  };

  const handleCloseReels = () => {
    setActiveCategory(null);
    setActiveReelIndex(0);
  };

  const reelsList = activeCategory
    ? videosData.filter((v) => v.categoryDir === activeCategory)
    : [];

  const handleFeedScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    const clientHeight = e.currentTarget.clientHeight;
    const index = Math.round(scrollTop / clientHeight);
    
    if (index !== activeReelIndex && index >= 0 && index < reelsList.length) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setActiveReelIndex(index);
      }, 150); // Debounce to allow scroll animations to settle smoothly
    }
  };

  return (
    <section className="section" id="vault">
      {/* Header */}
      <div className="mb-12">
        <div className="eyebrow">Visual Portfolio Vault</div>
        <h2 className="big-title text-[clamp(32px,5vw,56px)] mb-4">
          See What We've Built.<br />Imagine What We'll Build for You.
        </h2>
        <p className="sub">
          Real commercial work — zero stock footage, zero live shoots. Just neural AI models, direct storytelling, and 4K broadcast delivery.
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoriesData.map((cat) => (
          <CategoryCard key={cat.key} category={cat} onOpenReels={handleOpenReels} />
        ))}
      </div>

      {/* Fullscreen Smartphone Emulator Reels Modal */}
      {activeCategory && (
        <div className="fixed inset-0 z-[999] bg-[#050507]/98 flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-[400px] h-[85vh] rounded-[40px] border-4 border-white/20 bg-black overflow-hidden shadow-2xl flex flex-col">
            {/* Top Counter & Close */}
            <div className="absolute top-4 left-4 z-30 font-mono text-xs text-white bg-black/60 px-3 py-1 rounded-full border border-white/10">
              {activeReelIndex + 1} / {reelsList.length}
            </div>

            <button
              onClick={handleCloseReels}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-brand-red transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Feed */}
            <div
              onScroll={handleFeedScroll}
              className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-none flex flex-col"
            >
              {reelsList.map((v, idx) => (
                <ReelFeedSlide
                  key={v.id}
                  video={v}
                  index={idx}
                  activeIndex={activeReelIndex}
                  isMuted={isMuted}
                  onMuteToggle={() => setIsMuted(!isMuted)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
