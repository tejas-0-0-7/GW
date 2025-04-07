
import React from "react";

interface VectorBackgroundProps {
  className?: string;
}

const VectorBackground: React.FC<VectorBackgroundProps> = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="grid-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(150, 150, 255, 0.1)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
      
      {/* Abstract vector shapes */}
      <svg
        className="absolute top-0 right-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMaxYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6E59A5" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#567FEA" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="bgGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6E59A5" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#567FEA" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Large ring */}
        <circle cx="900" cy="100" r="350" fill="url(#bgGradient1)" />
        
        {/* Blob shape */}
        <path 
          d="M100,300 C250,250 300,100 450,150 C600,200 650,350 750,300 C850,250 900,400 850,500 C800,600 650,650 550,600 C450,550 350,600 250,550 C150,500 -50,350 100,300 Z" 
          fill="url(#bgGradient2)" 
        />
        
        {/* Tech lines */}
        <g opacity="0.4" stroke="#567FEA" strokeWidth="1">
          <path d="M100,100 L900,900" strokeDasharray="5,10" />
          <path d="M200,100 L800,900" strokeDasharray="5,10" />
          <path d="M300,100 L700,900" strokeDasharray="5,10" />
        </g>
        
        {/* Decorative dots */}
        <g fill="#6E59A5" fillOpacity="0.3">
          <circle cx="100" cy="100" r="5" />
          <circle cx="200" cy="150" r="3" />
          <circle cx="150" cy="300" r="4" />
          <circle cx="300" cy="200" r="3" />
          <circle cx="400" cy="100" r="5" />
          <circle cx="500" cy="150" r="3" />
          <circle cx="600" cy="100" r="4" />
          <circle cx="700" cy="200" r="3" />
          <circle cx="800" cy="100" r="5" />
        </g>
      </svg>
    </div>
  );
};

export default VectorBackground;
