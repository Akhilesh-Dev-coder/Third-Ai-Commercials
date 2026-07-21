import React from 'react';
import CustomCursor from '../components/CustomCursor';
import BackgroundCanvas from '../components/BackgroundCanvas';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import VideoVault from '../components/VideoVault';
import ServicesSection from '../components/ServicesSection';
import ProcessSection from '../components/ProcessSection';
import ReviewsSection from '../components/ReviewsSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-[#FF2A3B] selection:text-white font-sans relative overflow-x-hidden">
      {/* Custom Cursor & Background Starfield Canvas */}
      <CustomCursor />
      <BackgroundCanvas />

      {/* Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <VideoVault />
        <ServicesSection />
        <ProcessSection />
        <ReviewsSection />
        <FAQSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
