
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThreeScene from '@/components/ThreeScene';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ExplorePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Explore - TrueScan';
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
                <span className="text-gradient">Explore</span> Content
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <div className="max-w-xl mx-auto mb-16">
                <form className="flex gap-2">
                  <Input 
                    placeholder="Search for articles or sources..." 
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-najm-purple/50"
                  />
                  <Button type="submit" className="bg-najm-purple hover:bg-najm-purple/90">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation delay={300}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Recently Verified Articles</h3>
                    <Button variant="link" className="text-najm-purple">View All</Button>
                  </div>
                  <ul className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <li key={item} className="border-b border-white/10 pb-4">
                        <a href="#" className="hover:text-najm-purple">
                          <h4 className="font-medium">Article title goes here - {item}</h4>
                          <div className="flex items-center text-sm text-white/60 mt-1">
                            <span className="mr-3">source.com</span>
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                              <span>85% Credible</span>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Trending Topics</h3>
                    <Button variant="link" className="text-najm-purple">View All</Button>
                  </div>
                  <ul className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <li key={item} className="border-b border-white/10 pb-4">
                        <a href="#" className="hover:text-najm-purple">
                          <h4 className="font-medium">Trending Topic - {item}</h4>
                          <p className="text-sm text-white/60 mt-1">
                            Brief description about this trending topic and why it's important to verify.
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExplorePage;
