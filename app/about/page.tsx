import React from 'react';
import { MessageCircle, Mail, Globe } from 'lucide-react';
import DotCard from '@/components/ui/moving-dot-card';

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/>
  </svg>
);

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function AboutPage() {
  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/kinshuk._.saxena', icon: <InstagramIcon size={20} />, color: 'hover:text-pink-500 hover:border-pink-500' },
    { name: 'GitHub', url: 'https://github.com/kinshukkush', icon: <GithubIcon size={20} />, color: 'hover:text-gray-400 hover:border-gray-400' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/kinshuk-saxena-/', icon: <LinkedinIcon size={20} />, color: 'hover:text-blue-500 hover:border-blue-500' },
    { name: 'WhatsApp', url: 'http://wa.me/+919057538521', icon: <MessageCircle size={20} />, color: 'hover:text-green-500 hover:border-green-500' },
    { name: 'Email', url: 'mailto:kinshuksaxena3@gmail.com', icon: <Mail size={20} />, color: 'hover:text-red-400 hover:border-red-400' },
    { name: 'Website', url: 'https://kinshuk.unaux.com/', icon: <Globe size={20} />, color: 'hover:text-cyan-400 hover:border-cyan-400' },
  ];

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <div className="max-w-4xl mx-auto glass rounded-2xl p-8 md:p-12 relative overflow-hidden backdrop-blur-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,212,255,0.1)]">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight flex flex-col md:flex-row md:items-end gap-2 md:gap-4">
            <span className="text-white">About</span>
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Kinshuk Saxena</span>
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl">
            I'm a full-stack developer passionate about building immersive, intelligent applications. 
            RecallAI is built to revolutionize how we learn, combining the power of modern web technologies 
            (Next.js, Tailwind, Three.js) with AI-assisted active recall and spaced repetition.
          </p>

          <div className="flex flex-col md:flex-row gap-12 items-start justify-between">
            
            {/* Social Links */}
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Globe className="text-cyan-400" size={24} /> Connect With Me
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 transition-all duration-300 hover:-translate-y-1 ${link.color}`}
                  >
                    {link.icon}
                    <span className="font-medium">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Stats / DotCards */}
            <div className="w-full md:w-1/2 flex flex-col gap-6 items-center md:items-end justify-center">
              <div className="transform hover:scale-105 transition-transform duration-500 hover:rotate-3 perspective-container">
                 <DotCard target={1337} duration={2500} label="Commits" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
