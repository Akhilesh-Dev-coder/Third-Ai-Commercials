import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Approach', href: '#value' },
    { name: 'Work', href: '#work' },
    { name: 'Services', href: '#services' },
    { name: 'Process', href: '#process' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'About', href: '#about' }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-6 sm:px-[5vw] transition-all duration-500 border-b ${
        scrolled
          ? 'bg-[#080808]/85 backdrop-blur-xl border-white/10 py-3.5 shadow-2xl'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      {/* Brand Logo */}
      <a href="#home" className="flex items-center gap-3">
        <img
          src="/images/logo_cropped.png"
          alt="Third AI Commercials"
          className="h-9 w-auto object-contain"
        />
        <span className="font-display font-black text-lg tracking-wider text-white">
          THIRD<span className="text-[#ff2751]">AI</span>
        </span>
      </a>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center space-x-8 text-xs sm:text-sm tracking-wide text-gray-300">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="relative transition-colors duration-300 hover:text-white group py-1 font-medium"
          >
            <span>{link.name}</span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-[#ff2751] to-[#e722ff] transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </div>

      {/* CTAs */}
      <div className="hidden sm:flex items-center space-x-4">
        {isAuthenticated ? (
          <Link
            to="/admin"
            className="text-xs font-mono font-semibold uppercase tracking-wider px-3.5 py-2 rounded-full border border-brand-red/40 text-brand-red hover:bg-brand-red/10 transition"
          >
            Admin CMS
          </Link>
        ) : (
          <Link
            to="/admin/login"
            className="text-xs font-mono font-medium text-gray-400 hover:text-white transition px-2"
          >
            Admin
          </Link>
        )}

        <a
          href="#contact"
          className="px-6 py-2.5 rounded-md text-xs font-bold tracking-wider bg-gradient-to-r from-[#ff2751] to-[#e722ff] text-white hover:shadow-[0_0_25px_rgba(255,39,81,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap"
        >
          Get a Quote
        </a>
      </div>

      {/* Mobile Hamburger Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden text-2xl text-gray-300 hover:text-white focus:outline-none"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-[#080808]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col space-y-4 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-display font-medium text-gray-300 hover:text-[#ff2751]"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="w-full text-center py-3 rounded-md border border-[#ff2751] text-white bg-gradient-to-r from-[#ff2751] to-[#e722ff] font-bold text-xs shadow-red-glow"
          >
            Get a Quote
          </a>
        </div>
      )}
    </nav>
  );
}
