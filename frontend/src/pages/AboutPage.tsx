
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThreeScene from '@/components/ThreeScene';
import ScrollAnimation from '@/components/ScrollAnimation';
import TeamSection from '@/components/TeamSection';

const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About Us - TrueScan';
  }, []);
  
  return (
    <div className="min-h-screen bg-najm-dark">
      <ThreeScene />
      <Navbar />
      
      <main className="pt-24">
        <section className="relative py-24">
          <div className="absolute top-0 right-0 w-80 h-80 bg-najm-purple/30 rounded-full filter blur-[100px] -z-10" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-najm-blue/20 rounded-full filter blur-[80px] -z-10" />
          
          <div className="container mx-auto px-6">
            <ScrollAnimation>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
                About <span className="text-gradient">Us</span>
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <div className="glass-card p-8 rounded-xl max-w-4xl mx-auto mb-12">
                <p className="text-lg text-white/80 mb-6">
                  TrueScan is an AI-powered platform designed to help you evaluate the credibility of online content. By analyzing 
                  source information, linguistic patterns, factual consistency, and cross-referencing with trusted fact-checking sources, 
                  TrueScan provides a clear credibility score and helpful insights. TrueScan empowers users to make informed decisions 
                  and navigate the digital world with confidence.
                </p>
                
                <p className="text-lg text-white/80">
                  Our mission is to combat misinformation and help create a more informed online community. With TrueScan, 
                  you can quickly distinguish between reliable content and potential misinformation.
                </p>
              </div>
            </ScrollAnimation>
            
            <TeamSection />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
