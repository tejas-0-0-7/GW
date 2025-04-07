
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThreeScene from '@/components/ThreeScene';
import ScrollAnimation from '@/components/ScrollAnimation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

const ContentFlagPage: React.FC = () => {
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: "",
    name: "",
    email: ""
  });
  
  useEffect(() => {
    document.title = 'Content Flag - TrueScan';
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.url || !formData.title || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Submit form (simulation)
    toast.success("Content flagged successfully!");
    
    // Reset form
    setFormData({
      url: "",
      title: "",
      description: "",
      name: "",
      email: ""
    });
  };
  
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
                Content <span className="text-gradient">Flag</span>
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <p className="text-lg text-white/80 max-w-3xl mx-auto text-center mb-12">
                Found something suspicious online? Flag content that you think may contain misinformation or needs 
                verification. Our team will review it and add it to our database.
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation delay={300}>
              <div className="glass-card p-8 rounded-xl max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="url" className="block text-white mb-2">Content URL (required)</label>
                    <Input
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      placeholder="https://example.com/article"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-najm-purple/50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="title" className="block text-white mb-2">Content Title (required)</label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Title of the content"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-najm-purple/50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-white mb-2">Why do you think this content needs verification? (required)</label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe why you think this content is suspicious or might contain misinformation..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-najm-purple/50 min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-white mb-2">Your Name (optional)</label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-najm-purple/50"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-white mb-2">Your Email (optional)</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-najm-purple/50"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-najm-purple hover:bg-najm-purple/90 text-white py-6"
                  >
                    Submit Flag
                  </Button>
                </form>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentFlagPage;
