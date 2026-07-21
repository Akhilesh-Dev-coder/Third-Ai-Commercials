import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, Zap, RefreshCw, Cpu, CheckCircle2, Sliders, Film, Monitor, Smartphone, Square } from 'lucide-react';

const PRESET_PROMPTS = [
  {
    id: 'hypercar',
    label: 'Apex Tokyo Hypercar',
    prompt: 'Autonomous electric supercar accelerating through rainy Tokyo cyberpunk night, volumetric neon reflections, Sora 8k camera tracking, wet asphalt physics.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    model: 'Sora Neural v3',
    fps: '60 FPS',
    resolution: '3840x2160'
  },
  {
    id: 'skincare',
    label: 'Micro Botanical Essence',
    prompt: 'Ultra luxury skincare commercial, microscopic gold droplets fusing with botanical rose petals, subsurface light scattering, 240fps slow-motion fluid physics.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    model: 'Runway Gen-3 Alpha',
    fps: '60 FPS',
    resolution: '3840x2160'
  },
  {
    id: 'audio',
    label: 'Spatial Audio Headphones',
    prompt: 'Wireless spatial headphones levitating in deep space, glowing audio waveforms sculpting neon light architecture around the listener.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    model: 'Luma Dream Machine v2',
    fps: '60 FPS',
    resolution: '3840x2160'
  }
];

export default function AIGeneratorDemo() {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_PROMPTS[0]);
  const [customPrompt, setCustomPrompt] = useState(PRESET_PROMPTS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState('16:9'); // '16:9' | '9:16' | '1:1'
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [renderComplete, setRenderComplete] = useState(true);

  const steps = [
    'Parsing prompt semantic tokens & lighting vectors...',
    'Initializing Neural Sora & Gen-3 diffusion pipeline...',
    'Simulating volumetric lighting & fluid dynamics...',
    'Upscaling to 4K Broadcast Master...'
  ];

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setCustomPrompt(preset.prompt);
    triggerGeneration(preset);
  };

  const triggerGeneration = () => {
    setIsGenerating(true);
    setRenderComplete(false);
    setProgressStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setProgressStep(step);
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setRenderComplete(true);
      }
    }, 600);
  };

  return (
    <div className="w-full max-w-5xl mx-auto glass-panel-heavy rounded-3xl p-6 sm:p-8 border border-white/15 shadow-red-glow-lg relative overflow-hidden my-16">
      {/* Glow Ambient Blur */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-red/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-red/20 border border-brand-red/50 flex items-center justify-center text-brand-red">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              Neural Commercial Studio
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-red/20 border border-brand-red/40 text-brand-red font-bold">
                Interactive Studio Console
              </span>
            </h3>
            <p className="text-xs text-gray-400">Synthesize photorealistic video concepts using our neural pipeline</p>
          </div>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center space-x-2 bg-black/50 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setAspectRatio('16:9')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1 transition-all ${
              aspectRatio === '16:9' ? 'bg-brand-red text-white shadow-red-glow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>16:9 TV</span>
          </button>
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1 transition-all ${
              aspectRatio === '9:16' ? 'bg-brand-red text-white shadow-red-glow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16 Reels</span>
          </button>
        </div>
      </div>

      {/* Preset Selector & Input Box */}
      <div className="space-y-4 mb-6">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-brand-red" />
          Select AI Concept Preset:
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_PROMPTS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetSelect(p)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                selectedPreset.id === p.id
                  ? 'bg-brand-red text-white border-brand-red shadow-red-glow'
                  : 'glass-panel text-gray-300 hover:text-white hover:border-white/30'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Text Area Prompt Input */}
        <div className="relative">
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={2}
            className="w-full glass-input rounded-2xl p-4 text-sm font-sans leading-relaxed resize-none pr-36 focus:ring-1 focus:ring-brand-red"
            placeholder="Type your AI commercial prompt concept..."
          />
          <button
            onClick={triggerGeneration}
            disabled={isGenerating}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shimmer-btn shadow-red-glow transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Screen */}
      <div
        className={`relative rounded-2xl overflow-hidden bg-black/90 border border-white/15 flex items-center justify-center transition-all duration-500 mx-auto ${
          aspectRatio === '16:9' ? 'aspect-video w-full' : 'aspect-[9/16] max-w-sm h-[480px]'
        }`}
      >
        {/* Generating Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-brand-dark/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-brand-red/30 border-t-brand-red animate-spin" />
                <Film className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <p className="font-mono text-xs text-brand-red font-semibold">{steps[progressStep]}</p>
                <div className="w-64 h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-brand-red transition-all duration-500"
                    style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Player */}
        {renderComplete && (
          <div className="w-full h-full relative group">
            <video
              src={selectedPreset.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Live Specs Badge */}
            <div className="absolute top-4 left-4 glass-panel px-3 py-1.5 rounded-lg border border-white/20 text-[10px] font-mono text-white flex items-center space-x-3 bg-black/70 backdrop-blur-md">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Render Ready
              </span>
              <span className="text-gray-500">|</span>
              <span>Model: {selectedPreset.model}</span>
              <span className="text-gray-500">|</span>
              <span>{selectedPreset.resolution} @ {selectedPreset.fps}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
