
import React from "react";
import { Card } from "@/components/ui/card";
import ScrollAnimation from "./ScrollAnimation";
import { ArrowUpRight, Layers, Zap, Shield, Globe } from "lucide-react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay }) => {
  return (
    <ScrollAnimation delay={delay}>
      <Card className="glass-card p-6 h-full">
        <div className="mb-4 p-3 inline-block rounded-md bg-gradient-to-br from-najm-purple to-najm-blue">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/70">{description}</p>
        <div className="mt-4 flex items-center text-najm-purple hover:text-najm-blue transition-colors cursor-pointer">
          <span className="text-sm font-medium">Learn more</span>
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </div>
      </Card>
    </ScrollAnimation>
  );
};

const ContentSection: React.FC = () => {
  const features = [
    {
      title: "Modern Design",
      description: "Clean interfaces with stunning visual elements and intuitive navigation.",
      icon: <Layers className="h-6 w-6 text-white" />,
      delay: 0
    },
    {
      title: "Lightning Fast",
      description: "Optimized performance ensures your website loads quickly on all devices.",
      icon: <Zap className="h-6 w-6 text-white" />,
      delay: 100
    },
    {
      title: "Secure & Reliable",
      description: "Built with security in mind to keep your data and users protected.",
      icon: <Shield className="h-6 w-6 text-white" />,
      delay: 200
    },
    {
      title: "Global Reach",
      description: "Localized content and multi-language support to reach audiences worldwide.",
      icon: <Globe className="h-6 w-6 text-white" />,
      delay: 300
    }
  ];

  return (
    <>
      <section id="about" className="py-24 relative">
        <div className="absolute top-40 left-0 w-72 h-72 bg-najm-blue/20 rounded-full filter blur-[100px] -z-10" />
        
        <div className="container mx-auto px-6">
          <ScrollAnimation>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Experience the <span className="text-gradient">Next Level</span> of Web Design
            </h2>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation delay={200}>
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-najm-purple/60 to-najm-blue/60 blur-md -z-10 transform -rotate-2" />
                <div className="glass-card rounded-2xl overflow-hidden">
                  <img
                    src="https://framerusercontent.com/images/4fQVxeZSC9hhffxLxGgvQAbYdY.jpg"
                    alt="Design Preview"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation delay={400}>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Transforming Ideas Into Reality</h3>
                <p className="text-white/70">
                  Our platform makes it easy to design and develop stunning websites without 
                  compromising on performance or functionality. With advanced 3D animations 
                  and intuitive design tools, your vision comes to life effortlessly.
                </p>
                <ul className="space-y-3">
                  {[
                    "Interactive 3D elements",
                    "Responsive design for all devices",
                    "Stunning visual effects",
                    "Seamless animations",
                    "Developer-friendly code"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-najm-purple mr-2" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 relative">
        <div className="absolute bottom-40 right-0 w-80 h-80 bg-najm-purple/20 rounded-full filter blur-[100px] -z-10" />
        
        <div className="container mx-auto px-6">
          <ScrollAnimation>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Powerful <span className="text-gradient">Features</span>
            </h2>
          </ScrollAnimation>
          
          <ScrollAnimation delay={100}>
            <p className="text-white/70 text-center max-w-2xl mx-auto mb-16">
              Everything you need to create stunning websites and digital experiences,
              all in one powerful platform.
            </p>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                delay={feature.delay}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-najm-dark to-najm-purple/20 -z-10" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollAnimation>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to <span className="text-gradient">Get Started</span>?
              </h2>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <p className="text-white/70 mb-8">
                Join thousands of designers and developers creating amazing digital experiences with our platform.
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation delay={400}>
              <div className="glass-card p-8 rounded-xl">
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Name"
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-najm-purple/50"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-najm-purple/50"
                      />
                    </div>
                  </div>
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-najm-purple/50"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-najm-purple to-najm-blue text-white font-medium py-3 px-6 rounded-md hover:opacity-90 transition-opacity"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContentSection;
