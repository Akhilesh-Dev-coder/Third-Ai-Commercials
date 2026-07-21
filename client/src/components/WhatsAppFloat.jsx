import React, { useState } from 'react';

export default function WhatsAppFloat() {
  const [hovered, setHovered] = useState(false);
  const whatsappUrl = "https://wa.me/919847047264?text=Hi%20THIRD%20AI%2C%20I%20would%20like%20to%20know%20more%20about%20starting%20an%20AI%20video%20commercial%20project!";

  return (
    <div
      className="fixed bottom-7 right-7 z-[1000] flex items-center gap-3 pointer-events-none transition-all duration-400"
    >
      {/* Tooltip Badge */}
      <div
        className={`px-4 py-2 rounded-xl text-xs font-mono font-medium text-white bg-[#050507]/90 border border-emerald-500/40 backdrop-blur-md shadow-2xl transition-all duration-300 whitespace-nowrap pointer-events-none ${
          hovered ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-3 scale-95'
        }`}
      >
        Chat on WhatsApp (+91 98470 47264)
      </div>

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center pointer-events-auto border border-white/20 transition-all duration-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_35px_rgba(34,197,94,0.7)] ${
          hovered ? 'scale-110 rotate-12' : 'scale-100'
        }`}
        aria-label="Contact us on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.025 14.07 1 11.996 1 6.556 1 2.133 5.37 2.13 10.8a9.691 9.691 0 001.488 5.176l-.999 3.652 3.738-.974zm11.305-6.109c-.274-.137-1.62-.8-1.874-.893-.254-.094-.44-.137-.625.137-.186.274-.717.893-.88 1.076-.162.184-.325.205-.6.069-.274-.137-1.157-.426-2.204-1.36-1.135-.893-1.536-1.884-1.758-2.268-.221-.383-.024-.59.172-.782.176-.173.383-.44.575-.66.19-.22.254-.367.38-.61.127-.245.064-.46-.03-.643-.094-.184-.625-1.503-.856-2.057-.225-.538-.49-.463-.672-.473l-.574-.012c-.22-.008-.577.082-.88.411-.303.33-1.158 1.13-1.158 2.756 0 1.626 1.183 3.197 1.347 3.416.164.22 2.328 3.551 5.639 4.978 2.784 1.205 3.35 1.01 3.996.95 1.024-.095 2.146-.617 2.45-1.493.303-.876.303-1.626.213-1.78-.09-.153-.325-.245-.6-.382z" />
        </svg>
      </a>
    </div>
  );
}
