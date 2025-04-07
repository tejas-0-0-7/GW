import React from "react";
import ScrollAnimation from "./ScrollAnimation";
import { Shield, Zap, PieChart } from "lucide-react";
import UrlChecker from "./UrlChecker";

const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="min-h-[80vh] relative flex items-center justify-center pt-16 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-najm-purple/30 rounded-full filter blur-[100px] -z-10" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-najm-blue/20 rounded-full filter blur-[80px] -z-10" />
      
      <div className="container mx-auto px-6 py-12 z-10">
        <ScrollAnimation>
          <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm mb-6">
            Cut through the noise with TrueScan
          </span>
        </ScrollAnimation>
        
        {/* Top row with heading and URL checker */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          {/* Left column (40%) - Heading */}
          <div className="w-full lg:w-[40%] flex flex-col justify-center">
            <ScrollAnimation delay={200}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-left">
                TRUE<br /><span className="text-gradient">SCAN</span>
              </h1>
            </ScrollAnimation>
          </div>
          
          {/* Right column (60%) - UrlChecker Component */}
          <div className="w-full lg:w-[60%]">
            <ScrollAnimation delay={300}>
              <UrlChecker isHeroSection={true} />
            </ScrollAnimation>
          </div>
        </div>
        
        {/* Bottom row with description and features */}
        <ScrollAnimation delay={400}>
          <div className="max-w-3xl">
            
            
          </div>
        </ScrollAnimation>
            <div className="flex flex-wrap justify-start gap-8 mb-10">
              {/* Vector-based feature highlights */}
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-najm-purple/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-najm-purple" />
                </div>
                <span className="text-white/80">Protection</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-najm-purple/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-najm-blue" />
                </div>
                <span className="text-white/80">Fast Analysis</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-najm-purple/20 flex items-center justify-center">
                  <PieChart className="h-5 w-5 text-najm-purple" />
                </div>
                <span className="text-white/80">Accuracy</span>
              </div>
            </div>
      </div>
    </section>
  );
};

export default HeroSection;
