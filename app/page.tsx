'use client';

import React, { useRef, useState, MouseEvent } from 'react';
import Link from 'next/link';
import { Brain, Zap, RotateCcw, BarChart3, Upload, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';

const features = [
  {
    icon: Upload,
    title: 'PDF Upload & Parsing',
    desc: 'Drag and drop any PDF — textbooks, notes, papers. We extract and clean the content automatically.',
  },
  {
    icon: Sparkles,
    title: 'AI Flashcard Generation',
    desc: 'Advanced AI analyzes your content and creates targeted questions with precise, concise answers.',
  },
  {
    icon: RotateCcw,
    title: 'Active Recall Practice',
    desc: 'Animated 3D flip cards test your knowledge with one question at a time for focused learning.',
  },
  {
    icon: Zap,
    title: 'Spaced Repetition (SM-2)',
    desc: 'The proven SM-2 algorithm schedules reviews at optimal intervals — never review too early or too late.',
  },
  {
    icon: BarChart3,
    title: 'Progress Dashboard',
    desc: 'Track mastered cards, weak spots, and cards due today with a beautiful analytics dashboard.',
  },
  {
    icon: BookOpen,
    title: '"Explain Better" AI',
    desc: 'Confused by an answer? Ask AI to simplify it with plain language and real-world examples.',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

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
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent blur-2xl -z-10 pointer-events-none" />
        <motion.div 
          className="hero-inner perspective-container"
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <motion.div 
            className="hero-badge float-animation shadow-[0_0_20px_rgba(108,99,255,0.4)]"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Brain size={14} className="animate-pulse" />
            AI-Powered Learning
          </motion.div>
          <h1 className="hero-title drop-shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            Transform PDFs into
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg inline-block hover:scale-[1.02] transition-transform">Mastery-Level Knowledge</span>
          </h1>
          <p className="hero-subtitle text-gray-300 drop-shadow-md">
            RecallAI turns your study materials into intelligent flashcard decks.
            Practice with spaced repetition, track your progress, and never forget what you learned.
          </p>
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/upload" className="btn-primary hero-btn-primary hover:-translate-y-1 hover:shadow-cyan-500/30 shadow-lg transition-all duration-300" id="hero-upload-btn">
              <Upload size={20} />
              Upload a PDF
              <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="btn-secondary glass hover:-translate-y-1 hover:shadow-purple-500/20 shadow-sm transition-all duration-300" id="hero-dashboard-btn">
              <BarChart3 size={18} />
              View Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="features-section relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Everything you need to <span className="gradient-text">learn faster</span>
          </h2>
          <p className="section-subtitle">
            RecallAI combines proven cognitive science with modern AI to supercharge your learning.
          </p>
        </motion.div>
        
        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={itemVariants} className="feature-card-3d">
              <Tilt3DCard className="feature-card-inner h-full" intensity={4}>
                <div className="feature-icon-3d bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/5">
                  <Icon size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                </div>
                <h3 className="feature-title text-white">{title}</h3>
                <p className="feature-desc text-gray-400">{desc}</p>
              </Tilt3DCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <motion.div
          className="cta-card glass shadow-[0_10px_50px_rgba(236,72,153,0.15)] relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-30" />
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-cyan-500/20 via-transparent to-transparent blur-3xl opacity-40" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-500/20 via-transparent to-transparent blur-3xl opacity-30" />
          <div className="relative z-10">
            <h2 className="cta-title drop-shadow-lg">Ready to study smarter?</h2>
            <p className="cta-subtitle text-gray-300">
              Upload your first PDF and have AI-generated flashcards ready in under a minute.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link href="/upload" className="btn-primary shadow-[0_0_20px_rgba(108,99,255,0.5)] border border-white/20" id="cta-upload-btn">
                <Upload size={18} />
                Get Started — It&apos;s Free
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
