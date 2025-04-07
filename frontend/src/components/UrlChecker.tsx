import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Search, Link, FileText, Info } from "lucide-react";
import { toast } from "sonner";
import ScrollAnimation from "./ScrollAnimation";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

interface UrlCheckerProps {
  isHeroSection?: boolean;
  reducedWidth?: boolean;
}

interface AnalysisResponse {
  credibilityScore: number;
  verdict: string;
  explanation: string[];
  factCheckResults: Array<{
    claim: string;
    rating: string;
    source: string;
    url: string;
    explanation: string;
  }>;
  contentType: string;
  sentiment: string;
  sentimentConfidence: number;
}

const ResultsCard = ({ analysis }: { analysis: AnalysisResponse | null }) => {
  if (!analysis) return null;

  const getScoreColor = (score: number) => {
    if (score > 0.7) return "text-green-500";
    if (score > 0.4) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="mt-6 p-6 bg-gradient-to-br from-najm-dark to-najm-dark/90 border border-najm-purple/20">
      <div className="space-y-6">
        {/* Header with Score */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Analysis Results</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Credibility Score:</span>
            <span className={`text-xl font-bold ${getScoreColor(analysis.credibilityScore)}`}>
              {(analysis.credibilityScore * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Verdict Section */}
        <div className="p-4 bg-najm-purple/10 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-najm-purple" />
            <h4 className="font-medium text-najm-purple">{analysis.verdict}</h4>
          </div>
        </div>

        {/* Key Findings */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">Key Findings</h4>
          <ul className="space-y-2">
            {analysis.explanation.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-najm-purple mt-1" />
                <span className="text-sm text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-najm-purple/20">
          <div>
            <h4 className="text-sm text-gray-400">Content Type</h4>
            <p className="text-white font-medium">{analysis.contentType}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-400">Sentiment</h4>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{analysis.sentiment}</span>
              <span className="text-sm text-najm-purple">
                ({(analysis.sentimentConfidence * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const UrlChecker: React.FC<UrlCheckerProps> = ({ isHeroSection = false, reducedWidth = false }) => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"url" | "text">("url");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((mode === "url" && !url) || (mode === "text" && !text)) {
      toast.error("Please enter a valid input.");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/analyze/sentiment/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: mode === "url" ? url : text,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data: AnalysisResponse = await response.json();
      setAnalysis(data);
      toast.success("Analysis completed successfully!");
    } catch (error) {
      toast.error("Failed to analyze content. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  if (isHeroSection) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">
          <span className="text-gradient">Verify</span> Content
        </h2>
        
        <div className="flex items-center space-x-3 mb-5">
          <Button
            variant={mode === "url" ? "default" : "outline"}
            size="sm"
            className={`flex items-center ${mode === "url" ? "bg-gradient-to-r from-najm-purple to-najm-blue" : ""}`}
            onClick={() => setMode("url")}
          >
            <Link className="mr-1.5 h-3.5 w-3.5" />
            URL
          </Button>
          <Button
            variant={mode === "text" ? "default" : "outline"}
            size="sm"
            className={`flex items-center ${mode === "text" ? "bg-gradient-to-r from-najm-purple to-najm-blue" : ""}`}
            onClick={() => setMode("text")}
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Text
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "url" ? (
            <div className="relative">
              <Input
                type="url"
                placeholder="Enter URL to verify content..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-8 bg-white/5 border-white/10 text-sm"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
            </div>
          ) : (
            <Textarea
              placeholder="Paste text content to verify..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="bg-white/5 border-white/10 text-sm"
            />
          )}
          
          <Button
            type="submit"
            size="sm"
            className="w-full bg-gradient-to-r from-najm-purple to-najm-blue hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Content"}
          </Button>
        </form>

        {loading ? (
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-najm-purple"></div>
          </div>
        ) : (
          <ResultsCard analysis={analysis} />
        )}
      </div>
    );
  }
  
  return (
    <section id="url-checker" className="py-16 relative">
      <div className="absolute top-20 left-0 w-96 h-96 bg-najm-blue/10 rounded-full filter blur-[120px] -z-10" />
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Vector Graphics Side */}
            <ScrollAnimation delay={200} className="hidden md:block">
              <div className="relative">
                <div className="vector-container">
                  {/* Main shield vector */}
                  <svg viewBox="0 0 200 200" className="w-full h-auto">
                    <defs>
                      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6E59A5" />
                        <stop offset="100%" stopColor="#567FEA" />
                      </linearGradient>
                    </defs>
                    <path d="M100,15 L180,55 V110 C180,150 145,185 100,190 C55,185 20,150 20,110 V55 L100,15z" 
                      fill="url(#shieldGradient)" 
                      fillOpacity="0.1" 
                      stroke="url(#shieldGradient)" 
                      strokeWidth="2" />
                    
                    {/* Document verification icon */}
                    <g transform="translate(70, 70)">
                      <rect x="5" y="0" width="50" height="60" rx="3" 
                        fill="none" 
                        stroke="#6E59A5" 
                        strokeWidth="2" />
                      <line x1="15" y1="15" x2="45" y2="15" 
                        stroke="#6E59A5" 
                        strokeWidth="2" />
                      <line x1="15" y1="25" x2="45" y2="25" 
                        stroke="#6E59A5" 
                        strokeWidth="2" />
                      <line x1="15" y1="35" x2="35" y2="35" 
                        stroke="#6E59A5" 
                        strokeWidth="2" />
                      <circle cx="45" cy="45" r="15" 
                        fill="none" 
                        stroke="#567FEA" 
                        strokeWidth="2" />
                      <path d="M40,45 L43,48 L50,41" 
                        fill="none" 
                        stroke="#567FEA" 
                        strokeWidth="2" />
                    </g>
                    
                    {/* Circular connection nodes */}
                    <circle cx="40" cy="50" r="5" fill="#6E59A5" fillOpacity="0.5" />
                    <circle cx="160" cy="50" r="5" fill="#567FEA" fillOpacity="0.5" />
                    <circle cx="40" cy="150" r="5" fill="#6E59A5" fillOpacity="0.5" />
                    <circle cx="160" cy="150" r="5" fill="#567FEA" fillOpacity="0.5" />
                    
                    {/* Connection lines */}
                    <path d="M40,50 C60,80 140,80 160,50" 
                      fill="none" 
                      stroke="#6E59A5" 
                      strokeWidth="1.5" 
                      strokeDasharray="4,2" />
                    <path d="M40,150 C60,120 140,120 160,150" 
                      fill="none" 
                      stroke="#567FEA" 
                      strokeWidth="1.5" 
                      strokeDasharray="4,2" />
                  </svg>
                  
                  {/* Decorative circles with pulse animation */}
                  <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-najm-purple/50 animate-pulse" />
                  <div className="absolute top-3/4 right-1/4 w-3 h-3 rounded-full bg-najm-blue/50 animate-pulse" />
                </div>
              </div>
            </ScrollAnimation>
            
            {/* Form Side */}
            <ScrollAnimation delay={400}>
              <p className="text-lg text-white/70 mb-10">
                TrueScan employs cutting-edge AI to scan articles, headlines, and social media updates—checking for misinformation, identifying bias, 
                and providing you with an easy-to-understand credibility score. Stay up to date with content you can trust.
              </p>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UrlChecker;
