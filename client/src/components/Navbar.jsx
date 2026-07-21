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
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Vault', href: '#vault' },
    { name: 'Services', href: '#services' },
    { name: 'Process', href: '#process' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-[5vw] transition-all duration-500 border-b ${
        scrolled
          ? 'bg-[#050507]/60 backdrop-blur-xl border-white/10 py-3.5 shadow-2xl'
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      {/* Brand Logo */}
      <a href="#home" className="flex items-center gap-3">
        <img
          src="/images/logo_cropped.png"
          alt="Third AI Commercials"
          className="h-9 w-auto object-contain"
        />
        <span className="font-display font-semibold text-base sm:text-lg tracking-wider text-white hidden sm:block">
          THIRD AI<span className="text-gray-400 font-light">.COMMERCIALS</span>
        </span>
      </a>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center space-x-9 text-xs sm:text-sm tracking-wide text-gray-400">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="relative transition-colors duration-300 hover:text-white group py-1"
          >
            <span>{link.name}</span>
            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-brand-red transition-all duration-300 group-hover:w-full" />
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
          className="px-6 py-2.5 border border-white/10 rounded-full text-xs font-mono tracking-wider bg-white/[0.03] text-white hover:border-brand-red hover:shadow-[0_0_24px_rgba(255,42,59,0.35)] hover:bg-brand-red/10 transition-all duration-350 whitespace-nowrap"
        >
          Book a Call
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
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-[#050507]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col space-y-4 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-display font-light text-gray-300 hover:text-brand-red"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="w-full text-center py-3 rounded-full border border-brand-red text-white bg-brand-red/15 font-mono text-xs shadow-red-glow"
          >
            Book a Call
          </a>
        </div>
      )}
    </nav>
  );
}
