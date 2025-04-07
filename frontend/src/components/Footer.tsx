
import React from "react";
import { Github, Twitter, Instagram, Mail, Phone, Linkedin, ArrowUp } from "lucide-react";

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 border-t border-white/10 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <a href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-gradient font-display">TrueScan</span>
            </a>
            <p className="text-white/70 mb-6">
              TrueScan helps you navigate through misinformation with AI-powered content verification.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="h-10 w-10 rounded-full flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:border-white transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:border-white transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:border-white transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-white/70 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/explore" className="text-white/70 hover:text-white transition-colors">
                  Explore
                </a>
              </li>
              <li>
                <a href="/content-flag" className="text-white/70 hover:text-white transition-colors">
                  Content Flag
                </a>
              </li>
              <li>
                <a href="/about" className="text-white/70 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-white/70">
                <Mail className="mr-2 h-4 w-4" />
                truescan.support@gmail.com
              </li>
              <li className="flex items-center text-white/70">
                <Phone className="mr-2 h-4 w-4" />
                +91-9876552067
              </li>
              <li className="flex items-center text-white/70">
                <Linkedin className="mr-2 h-4 w-4" />
                www.linkedin.com/in/true_scan
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 mt-12 pt-8">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} TrueScan. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center text-white/70 hover:text-white transition-colors"
          >
            Back to top
            <ArrowUp
              size={16}
              className="ml-1 transform group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
