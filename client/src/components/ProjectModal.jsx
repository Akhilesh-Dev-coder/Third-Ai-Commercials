import React from 'react';
import { X, ExternalLink, Cpu, Tag, User } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden border border-white/20 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-brand-red transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <video
            src={project.videoUrl}
            poster={project.thumbnailUrl}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video.
          </video>
        </div>

        {/* Modal Info Footer */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-brand-surface/90">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-brand-red px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/30 inline-block mb-2">
                {project.category}
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                {project.title}
              </h2>
            </div>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white font-semibold text-sm shadow-red-glow transition"
              >
                <span>Live Campaign</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
            {project.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center space-x-2 text-gray-400">
              <User className="w-4 h-4 text-brand-red" />
              <span>Client: <strong className="text-white font-medium">{project.client}</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Tag className="w-4 h-4 text-brand-red" />
              <span>Category: <strong className="text-white font-medium">{project.category}</strong></span>
            </div>
          </div>

          {/* Tech Stack */}
          {project.technology && project.technology.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-brand-red" />
                <span>AI Neural Tech Stack</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technology.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
