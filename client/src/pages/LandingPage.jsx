import React from 'react';
import CustomCursor from '../components/CustomCursor';
import BackgroundCanvas from '../components/BackgroundCanvas';
import CanvasErrorBoundary from '../components/CanvasErrorBoundary';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ApproachSection from '../components/ApproachSection';
import WorkCategoriesSection from '../components/WorkCategoriesSection';
import ServicesSection from '../components/ServicesSection';
import ProcessSection from '../components/ProcessSection';
import ReviewsSection from '../components/ReviewsSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#ff2751] selection:text-white font-sans relative overflow-x-hidden">
      {/* Custom Cursor & Background Starfield Canvas */}
      <CustomCursor />
      <CanvasErrorBoundary fallback={null}>
        <BackgroundCanvas />
      </CanvasErrorBoundary>

      {/* Navigation */}
      <Navbar />

      {/* Main Sections matching root index.html structure */}
      <main className="relative z-10">
        <HeroSection />
        <ApproachSection />
        <WorkCategoriesSection />
        <ServicesSection />
        <ProcessSection />
        <ReviewsSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
