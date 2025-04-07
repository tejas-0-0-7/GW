
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import WhyUsSection from '@/components/WhyUsSection';
import Footer from '@/components/Footer';
import ThreeScene from '@/components/ThreeScene';
import UrlChecker from '@/components/UrlChecker';
import VectorBackground from '@/components/VectorBackground';

const Index = () => {
  useEffect(() => {
    // Update document title
    document.title = 'TrueScan - AI-Powered Content Verification';
  }, []);

  return (
    <div className="min-h-screen bg-najm-dark">
      <ThreeScene />
      <VectorBackground />
      <Navbar />
      <main>
        <HeroSection />
        <UrlChecker />
        <WhyUsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
