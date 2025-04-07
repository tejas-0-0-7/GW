
import React from "react";
import ScrollAnimation from "./ScrollAnimation";
import { ArrowUpRight, RefreshCcw, CheckCircle, Search, FileCheck } from "lucide-react";

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute top-40 right-0 w-80 h-80 bg-najm-blue/20 rounded-full filter blur-[100px] -z-10" />
      
      <div className="container mx-auto px-6">
        <ScrollAnimation>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            How <span className="text-gradient">TrueScan</span> Works
          </h2>
        </ScrollAnimation>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollAnimation delay={200}>
            <div className="glass-card p-6 h-full">
              <div className="mb-4 p-3 inline-block rounded-md bg-gradient-to-br from-najm-purple to-najm-blue">
                <RefreshCcw className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Deep Text Analysis</h3>
              <p className="text-white/70 mb-4">Our AI scans for linguistic patterns that indicate misinformation and propaganda tactics.</p>
              
              {/* Added vector illustration */}
              <div className="mt-4">
                <svg viewBox="0 0 120 60" className="w-full h-auto">
                  <rect x="10" y="10" width="100" height="20" rx="2" fill="none" stroke="#6E59A5" strokeWidth="1" />
                  <rect x="10" y="35" width="70" height="5" rx="1" fill="#6E59A5" fillOpacity="0.3" />
                  <rect x="10" y="45" width="50" height="5" rx="1" fill="#6E59A5" fillOpacity="0.3" />
                  
                  <circle cx="105" cy="15" r="3" fill="#567FEA" />
                  <circle cx="95" cy="15" r="3" fill="#567FEA" />
                  <circle cx="85" cy="15" r="3" fill="#567FEA" />
                  
                  <line x1="15" y1="20" x2="15" y2="35" stroke="#567FEA" strokeWidth="1" strokeDasharray="2,1" />
                  <line x1="35" y1="20" x2="35" y2="45" stroke="#567FEA" strokeWidth="1" strokeDasharray="2,1" />
                </svg>
              </div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={300}>
            <div className="glass-card p-6 h-full">
              <div className="mb-4 p-3 inline-block rounded-md bg-gradient-to-br from-najm-purple to-najm-blue">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Source Verification</h3>
              <p className="text-white/70 mb-4">We verify content against trusted fact-checking sources for comprehensive analysis.</p>
              
              {/* Added vector illustration */}
              <div className="mt-4">
                <svg viewBox="0 0 120 60" className="w-full h-auto">
                  <defs>
                    <linearGradient id="verifyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6E59A5" />
                      <stop offset="100%" stopColor="#567FEA" />
                    </linearGradient>
                  </defs>
                  
                  <rect x="20" y="10" width="30" height="40" rx="2" fill="none" stroke="#6E59A5" strokeWidth="1" />
                  <line x1="25" y1="20" x2="45" y2="20" stroke="#6E59A5" strokeWidth="1" />
                  <line x1="25" y1="30" x2="45" y2="30" stroke="#6E59A5" strokeWidth="1" />
                  <line x1="25" y1="40" x2="35" y2="40" stroke="#6E59A5" strokeWidth="1" />
                  
                  <rect x="70" y="10" width="30" height="40" rx="2" fill="none" stroke="#567FEA" strokeWidth="1" />
                  <line x1="75" y1="20" x2="95" y2="20" stroke="#567FEA" strokeWidth="1" />
                  <line x1="75" y1="30" x2="95" y2="30" stroke="#567FEA" strokeWidth="1" />
                  <line x1="75" y1="40" x2="85" y2="40" stroke="#567FEA" strokeWidth="1" />
                  
                  <path d="M50,30 L70,30" stroke="url(#verifyGradient)" strokeWidth="1" strokeDasharray="3,2" />
                  <circle cx="60" cy="30" r="5" fill="none" stroke="url(#verifyGradient)" strokeWidth="1" />
                  <path d="M55,30 L60,35 L65,25" fill="none" stroke="url(#verifyGradient)" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={400}>
            <div className="glass-card p-6 h-full">
              <div className="mb-4 p-3 inline-block rounded-md bg-gradient-to-br from-najm-purple to-najm-blue">
                <FileCheck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Credibility Reports</h3>
              <p className="text-white/70 mb-4">Get detailed reports with credibility scores to help you make informed decisions.</p>
              
              {/* Added vector illustration */}
              <div className="mt-4">
                <svg viewBox="0 0 120 60" className="w-full h-auto">
                  <rect x="20" y="10" width="80" height="40" rx="3" fill="none" stroke="#6E59A5" strokeWidth="1" />
                  
                  <circle cx="40" cy="25" r="15" fill="none" stroke="#567FEA" strokeWidth="1" />
                  <path d="M40,25 L50,25" stroke="#567FEA" strokeWidth="2" transform="rotate(45 40 25)" />
                  <text x="40" y="45" textAnchor="middle" fontSize="10" fill="#6E59A5">72%</text>
                  
                  <line x1="65" y1="20" x2="90" y2="20" stroke="#6E59A5" strokeWidth="1" />
                  <line x1="65" y1="30" x2="85" y2="30" stroke="#6E59A5" strokeWidth="1" />
                  <line x1="65" y1="40" x2="80" y2="40" stroke="#6E59A5" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={500}>
            <div className="glass-card p-6 h-full">
              <div className="mb-4 p-3 inline-block rounded-md bg-gradient-to-br from-najm-purple to-najm-blue">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Scanning</h3>
              <p className="text-white/70 mb-4">Instant content analysis as you browse, with browser extension support for seamless experience.</p>
              
              {/* Added vector illustration */}
              <div className="mt-4">
                <svg viewBox="0 0 120 60" className="w-full h-auto">
                  <rect x="10" y="10" width="100" height="30" rx="3" fill="none" stroke="#6E59A5" strokeWidth="1" />
                  <rect x="10" y="10" width="100" height="10" rx="3 3 0 0" fill="#6E59A5" fillOpacity="0.2" />
                  
                  <circle cx="15" cy="15" r="2" fill="#567FEA" />
                  <circle cx="25" cy="15" r="2" fill="#567FEA" />
                  <circle cx="35" cy="15" r="2" fill="#567FEA" />
                  
                  <rect x="70" y="23" width="30" height="12" rx="6" fill="none" stroke="#567FEA" strokeWidth="1" />
                  <circle cx="82" cy="29" r="3" fill="#567FEA" fillOpacity="0.3" />
                  <path d="M86,29 L93,29" stroke="#567FEA" strokeWidth="1" />
                  
                  <path d="M20,45 C30,55 90,55 100,45" stroke="#6E59A5" strokeWidth="1" strokeDasharray="3,2" fill="none" />
                  <circle cx="60" cy="50" r="4" fill="#567FEA" fillOpacity="0.3" />
                </svg>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
