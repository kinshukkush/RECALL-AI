'use client';

import React, { useRef, useState, MouseEvent } from 'react';
import Link from 'next/link';
import { 
  Code2, 
  Globe, 
  Mail, 
  MessageCircle, 
  Palette, 
  Rocket, 
  Sparkles, 
  Star, 
  Zap,
  Heart,
  Coffee,
  Lightbulb,
  Target
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';

// Custom Icons
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// 3D Tilt Card Component
function Tilt3DCard({ 
  children, 
  className = '',
  intensity = 6 
}: { 
  children: React.ReactNode; 
  className?: string;
  intensity?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

export default function AboutPage() {
  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/kinshuk._.saxena', icon: <InstagramIcon size={18} />, className: 'instagram' },
    { name: 'GitHub', url: 'https://github.com/kinshukkush', icon: <GithubIcon size={18} />, className: 'github' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/kinshuk-saxena-/', icon: <LinkedinIcon size={18} />, className: 'linkedin' },
    { name: 'WhatsApp', url: 'http://wa.me/+919057538521', icon: <MessageCircle size={18} />, className: 'whatsapp' },
    { name: 'Email', url: 'mailto:kinshuksaxena3@gmail.com', icon: <Mail size={18} />, className: 'email' },
    { name: 'Portfolio', url: 'https://kinshuk.unaux.com/', icon: <Globe size={18} />, className: 'website' },
  ];

  const highlights = [
    { 
      icon: Sparkles, 
      title: 'Immersive Learning UX', 
      desc: 'Designing interfaces that make studying feel cinematic, tactile, and genuinely rewarding.',
      color: 'text-cyan-400'
    },
    { 
      icon: Code2, 
      title: 'Full-Stack Architecture', 
      desc: 'Building clean, scalable systems from pixel-perfect UI to optimized data pipelines.',
      color: 'text-purple-400'
    },
    { 
      icon: Zap, 
      title: 'Rapid Iteration', 
      desc: 'Fast feedback loops, smart experimentation, and obsessive attention to detail.',
      color: 'text-yellow-400'
    },
  ];

  const signature = [
    { icon: Star, label: 'Product Focus', value: 'AI + EdTech' },
    { icon: Palette, label: 'Design System', value: '3D + Glass' },
    { icon: Code2, label: 'Tech Stack', value: 'TS / React' },
    { icon: Rocket, label: 'Philosophy', value: 'Ship Fast' },
  ];

  const stack = [
    'Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 
    'Three.js', 'Framer Motion', 'Node.js', 'PostgreSQL', 'Vercel'
  ];

  const values = [
    { icon: Lightbulb, label: 'Innovation First', desc: 'Always exploring new ways to solve problems' },
    { icon: Heart, label: 'User Empathy', desc: 'Building for real people with real needs' },
    { icon: Target, label: 'Impact Driven', desc: 'Measuring success by outcomes, not outputs' },
    { icon: Coffee, label: 'Craft Obsessed', desc: 'Sweating the details that others overlook' },
  ];

  return (
    <div className="page-content min-h-screen">
      <div className="mx-auto max-w-6xl">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Tilt3DCard className="about-hero relative mb-12">
            {/* Animated background orbs */}
            <motion.div 
              className="absolute -top-32 -right-20 w-80 h-80 bg-primary/15 rounded-full blur-[100px] pointer-events-none"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.15, 0.2, 0.15]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-32 -left-20 w-72 h-72 bg-accent/12 rounded-full blur-[100px] pointer-events-none"
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.12, 0.18, 0.12]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/8 rounded-full blur-[120px] pointer-events-none"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full pointer-events-none"
                style={{
                  top: `${20 + i * 15}%`,
                  right: `${10 + i * 8}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}

            <div className="about-content relative z-10">
              <div className="space-y-6">
                <motion.div
                  className="about-badge"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles size={14} />
                  RecallAI Creator
                </motion.div>

                <motion.h1 
                  className="about-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Hi, I&apos;m{' '}
                  <span className="gradient-text">Kinshuk Saxena</span>
                </motion.h1>

                <motion.p 
                  className="about-description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  A full-stack developer passionate about crafting intelligent, beautiful applications. 
                  RecallAI combines cutting-edge web technology with AI-powered active recall and 
                  spaced repetition to transform how we learn and retain knowledge.
                </motion.p>

                <motion.div 
                  className="about-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <a
                    href="mailto:kinshuksaxena3@gmail.com"
                    className="btn-primary group"
                  >
                    <Mail size={18} />
                    <span>Say Hello</span>
                  </a>
                  <a
                    href="https://github.com/kinshukkush"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary group"
                  >
                    <GithubIcon size={18} />
                    <span>View GitHub</span>
                  </a>
                </motion.div>
              </div>

              {/* Signature Card */}
              <motion.div
                className="signature-card"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <div className="signature-header">
                  <span className="signature-label">Signature</span>
                  <Sparkles size={16} className="text-accent" />
                </div>
                <div className="signature-items">
                  {signature.map(({ icon: Icon, label, value }, index) => (
                    <motion.div
                      key={label}
                      className="signature-item"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="signature-item-label">
                        <Icon size={12} />
                        {label}
                      </div>
                      <div className="signature-item-value">{value}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Decorative lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] opacity-30">
              <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </Tilt3DCard>
        </motion.div>

        {/* Focus Areas, Mission, Tech Stack Grid */}
        <motion.div
          className="about-section-grid mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Focus Areas */}
          <motion.div variants={itemVariants}>
            <Tilt3DCard className="about-card h-full" intensity={4}>
              <h3 className="about-card-title">
                <Rocket className="text-purple-400" size={22} />
                Focus Areas
              </h3>
              <div className="space-y-3">
                {highlights.map(({ icon: Icon, title, desc, color }) => (
                  <motion.div
                    key={title}
                    className="about-highlight-item"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="about-highlight-title">
                      <Icon size={16} className={color} />
                      {title}
                    </div>
                    <p className="about-highlight-desc">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </Tilt3DCard>
          </motion.div>

          {/* Mission */}
          <motion.div variants={itemVariants}>
            <Tilt3DCard className="about-card h-full" intensity={4}>
              <h3 className="about-card-title">
                <Target className="text-cyan-400" size={22} />
                Mission
              </h3>
              <div className="space-y-4">
                <div className="about-highlight-item">
                  <div className="mastery-focus-label">North Star</div>
                  <div className="text-lg font-semibold text-white mt-2">
                    Make learning feel cinematic and focused.
                  </div>
                </div>
                <div className="about-highlight-item">
                  <div className="mastery-focus-label">Approach</div>
                  <div className="text-lg font-semibold text-white mt-2">
                    Blend AI, motion design, and cognitive science.
                  </div>
                </div>
              </div>
            </Tilt3DCard>
          </motion.div>

          {/* Tech Stack */}
          <motion.div variants={itemVariants}>
            <Tilt3DCard className="about-card h-full" intensity={4}>
              <h3 className="about-card-title">
                <Code2 className="text-pink-400" size={22} />
                Tech Stack
              </h3>
              <div className="tech-stack">
                {stack.map((item, index) => (
                  <motion.span
                    key={item}
                    className="tech-pill"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </Tilt3DCard>
          </motion.div>
        </motion.div>

        {/* Values + Connect Grid */}
        <motion.div
          className="grid gap-6 lg:grid-cols-2 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Values */}
          <motion.div variants={itemVariants}>
            <Tilt3DCard className="about-card h-full" intensity={4}>
              <h3 className="about-card-title">
                <Heart className="text-red-400" size={22} />
                Core Values
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {values.map(({ icon: Icon, label, desc }, index) => (
                  <motion.div
                    key={label}
                    className="about-highlight-item text-center p-4"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Icon size={24} className="text-accent mx-auto mb-2" />
                    <div className="font-semibold text-sm mb-1">{label}</div>
                    <div className="text-xs text-text-muted">{desc}</div>
                  </motion.div>
                ))}
              </div>
            </Tilt3DCard>
          </motion.div>

          {/* Connect */}
          <motion.div variants={itemVariants}>
            <Tilt3DCard className="about-card h-full" intensity={4}>
              <h3 className="about-card-title">
                <Globe className="text-cyan-400" size={22} />
                Connect With Me
              </h3>
              <div className="social-grid">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`social-link ${link.className}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ x: 4 }}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </Tilt3DCard>
          </motion.div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Tilt3DCard className="cta-banner" intensity={3}>
            <div className="cta-banner-content">
              <motion.h3 
                className="cta-banner-title"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Ready to transform how you learn?
              </motion.h3>
              <motion.p 
                className="cta-banner-subtitle"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Experience the future of learning with AI-powered flashcards and spaced repetition.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/upload" className="btn-primary group">
                  <Rocket size={18} />
                  <span>Start Learning Now</span>
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          </Tilt3DCard>
        </motion.div>

      </div>
    </div>
  );
}