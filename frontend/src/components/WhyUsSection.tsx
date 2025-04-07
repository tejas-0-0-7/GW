
import React from "react";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "./ScrollAnimation";
import { Monitor, Zap, Shield } from "lucide-react";

const WhyUsSection: React.FC = () => {
  return (
    <section id="why-us" className="py-24 relative">
      <div className="absolute bottom-40 left-0 w-72 h-72 bg-najm-purple/20 rounded-full filter blur-[100px] -z-10" />
      
      <div className="container mx-auto px-6">
        <ScrollAnimation>
          <div className="flex flex-col items-center mb-16">
            <Button variant="outline" className="rounded-full px-6 border-najm-purple/30 text-najm-purple hover:bg-najm-purple/10 mb-8">
              Why Us..
            </Button>
            
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
              Effortless Detection<br />
              <span className="text-gradient">Uncompromised Integrity</span>
            </h2>
            
            <p className="text-lg text-white/70 text-center max-w-2xl">
              Analyze, verify, and trust the content you read—powered by TrueScan AI.
            </p>
          </div>
        </ScrollAnimation>
        
        <div className="grid md:grid-cols-3 gap-8">
          <ScrollAnimation delay={200}>
            <div className="glass-card p-8 rounded-xl text-center">
              <div className="w-16 h-16 rounded-full bg-najm-purple/20 flex items-center justify-center mx-auto mb-6">
                <Monitor className="h-6 w-6 text-najm-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3">User-Friendly Interface</h3>
              <p className="text-white/70">Simple and intuitive design makes content verification accessible to everyone.</p>
              
              {/* Added vector illustration */}
              <div className="mt-6">
                <svg viewBox="0 0 120 80" className="w-full h-auto">
                  <rect x="10" y="10" width="100" height="60" rx="3" fill="none" stroke="#6E59A5" strokeWidth="2" />
                  <rect x="20" y="20" width="80" height="10" rx="2" fill="#6E59A5" fillOpacity="0.2" />
                  <rect x="20" y="35" width="30" height="25" rx="2" fill="#6E59A5" fillOpacity="0.2" />
                  <rect x="55" y="35" width="45" height="25" rx="2" fill="#6E59A5" fillOpacity="0.2" />
                  <circle cx="35" cy="50" r="5" fill="#6E59A5" fillOpacity="0.4" />
                </svg>
              </div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={300}>
            <div className="glass-card p-8 rounded-xl text-center">
              <div className="w-16 h-16 rounded-full bg-najm-purple/20 flex items-center justify-center mx-auto mb-6">
                <Zap className="h-6 w-6 text-najm-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3">Swift & Accurate Reports</h3>
              <p className="text-white/70">Get comprehensive credibility analyses within seconds of submitting content.</p>
              
              {/* Added vector illustration */}
              <div className="mt-6">
                <svg viewBox="0 0 120 80" className="w-full h-auto">
                  <defs>
                    <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6E59A5" />
                      <stop offset="100%" stopColor="#567FEA" />
                    </linearGradient>
                  </defs>
                  <path d="M10,60 L110,60" stroke="#6E59A5" strokeWidth="2" />
                  <circle cx="60" cy="60" r="40" fill="none" stroke="#6E59A5" strokeWidth="2" strokeDasharray="3,3" />
                  <path d="M60,60 L90,35" stroke="url(#speedGradient)" strokeWidth="2" />
                  <circle cx="60" cy="60" r="5" fill="#6E59A5" />
                  <circle cx="20" cy="60" r="3" fill="#6E59A5" fillOpacity="0.5" />
                  <circle cx="100" cy="60" r="3" fill="#567FEA" fillOpacity="0.5" />
                  <path d="M20,40 L100,40" stroke="#6E59A5" strokeWidth="1" strokeDasharray="2,2" />
                  <path d="M20,20 L100,20" stroke="#6E59A5" strokeWidth="1" strokeDasharray="2,2" />
                </svg>
              </div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={400}>
            <div className="glass-card p-8 rounded-xl text-center">
              <div className="w-16 h-16 rounded-full bg-najm-purple/20 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-6 w-6 text-najm-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fair Play, Every Time</h3>
              <p className="text-white/70">Our AI evaluates content objectively without political or commercial bias.</p>
              
              {/* Added vector illustration */}
              <div className="mt-6">
                <svg viewBox="0 0 120 80" className="w-full h-auto">
                  <defs>
                    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6E59A5" />
                      <stop offset="100%" stopColor="#567FEA" />
                    </linearGradient>
                  </defs>
                  <path d="M60,10 L100,25 V50 C100,70 80,80 60,85 C40,80 20,70 20,50 V25 L60,10z" 
                    fill="none" 
                    stroke="url(#shieldGrad)" 
                    strokeWidth="2" />
                  <path d="M45,50 L55,60 L75,40" 
                    fill="none" 
                    stroke="#567FEA" 
                    strokeWidth="2" />
                  <circle cx="30" cy="35" r="3" fill="#6E59A5" fillOpacity="0.5" />
                  <circle cx="90" cy="35" r="3" fill="#567FEA" fillOpacity="0.5" />
                </svg>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
