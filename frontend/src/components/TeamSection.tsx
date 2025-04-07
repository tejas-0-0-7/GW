
import React from "react";
import ScrollAnimation from "./ScrollAnimation";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

const TeamSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Kumar Aditya",
      role: "Founder & CEO",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      socialLinks: {
        linkedin: "#",
        github: "#",
        twitter: "#",
      }
    },
    {
      name: "Tejas",
      role: "CTO",
      image: "https://randomuser.me/api/portraits/men/47.jpg",
      socialLinks: {
        linkedin: "#",
        github: "#",
        twitter: "#",
      }
    },
    {
      name: "Disha",
      role: "Head of AI Research",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      socialLinks: {
        linkedin: "#",
        github: "#",
        twitter: "#",
      }
    },
    {
      name: "Nishant",
      role: "Lead Developer",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      socialLinks: {
        linkedin: "#",
        github: "#",
        twitter: "#",
      }
    }
  ];

  return (
    <div>
      <ScrollAnimation>
        <h2 className="text-3xl font-bold mb-12 text-center">
          Meet Our <span className="text-gradient">Team</span>
        </h2>
      </ScrollAnimation>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <ScrollAnimation key={member.name} delay={index * 100}>
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="mb-4">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-najm-purple/30"
                />
              </div>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-white/70 mb-4">{member.role}</p>
              
              <div className="flex justify-center space-x-3">
                {member.socialLinks.linkedin && (
                  <a href={member.socialLinks.linkedin} className="text-white/60 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                )}
                
                {member.socialLinks.github && (
                  <a href={member.socialLinks.github} className="text-white/60 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  </a>
                )}
                
                {member.socialLinks.twitter && (
                  <a href={member.socialLinks.twitter} className="text-white/60 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </a>
                )}
              </div>
            </div>
          </ScrollAnimation>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
