'use client';

import { useEffect, useState, useRef, MouseEvent } from 'react';
import Link from 'next/link';
import { DashboardStats } from '@/types';
import StatsCard from '@/components/StatsCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Layers, 
  Star, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  Upload, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const heroVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeInOut" }
  }
};

// 3D Tilt Card Component
function Tilt3DCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

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
      
      {/* Dynamic light reflection */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0"
        style={{
          background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const masteryRate = stats && stats.totalCards > 0
    ? Math.round((stats.masteredCards / stats.totalCards) * 100)
    : 0;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;

  return (
    <div className="page-content">
      {/* Hero Section with 3D Tilt */}
      <motion.div
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <Tilt3DCard className="dashboard-hero relative">
          {/* Animated gradient orbs */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-8 right-12 w-2 h-2 bg-accent rounded-full"
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-12 right-24 w-1.5 h-1.5 bg-primary-light rounded-full"
            animate={{ 
              y: [0, -8, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute top-1/2 right-8 w-1 h-1 bg-pink-400 rounded-full"
            animate={{ 
              y: [0, -6, 0],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          <div className="dashboard-hero-content relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <Sparkles size={14} className="text-accent" />
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Learning Dashboard
                </span>
              </div>
              {stats && stats.dueToday > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.5 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-full"
                >
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-warning">{stats.dueToday} due today</span>
                </motion.div>
              )}
            </motion.div>

            <motion.h1
              className="dashboard-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome back to{' '}
              <span className="gradient-text">RecallAI</span>
            </motion.h1>

            <motion.p
              className="dashboard-hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Track your learning progress, identify knowledge gaps, and optimize your study sessions with AI-powered insights.
            </motion.p>

            <motion.div
              className="dashboard-hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {stats && stats.dueToday > 0 && (
                <Link href="/decks" className="btn-primary group">
                  <Clock size={18} />
                  <span>Review {stats.dueToday} Cards</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              <Link href="/upload" className="btn-secondary group">
                <Upload size={18} />
                <span>Add New Deck</span>
              </Link>
            </motion.div>
          </div>

          {/* Decorative grid lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
            <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/3 to-transparent" />
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        </Tilt3DCard>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="error-banner mb-8"
        >
          <AlertTriangle size={18} />
          {error}
        </motion.div>
      )}

      {stats && (
        <>
          {/* Stats Grid */}
          <motion.div 
            className="stats-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <StatsCard
                label="Total Cards"
                value={stats.totalCards}
                icon={Layers}
                color="purple"
                description="Across all decks"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                label="Mastered"
                value={stats.masteredCards}
                icon={Star}
                color="green"
                description="Interval ≥ 21 days"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                label="Need Practice"
                value={stats.weakCards}
                icon={AlertTriangle}
                color="red"
                description="Review recommended"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                label="Due Today"
                value={stats.dueToday}
                icon={Clock}
                color="orange"
                description="Ready for review"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                label="Total Decks"
                value={stats.totalDecks}
                icon={BookOpen}
                color="blue"
                description="Study collections"
              />
            </motion.div>
          </motion.div>

          {/* Mastery Overview Panel */}
          {stats.totalCards > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            >
              <Tilt3DCard className="mastery-panel relative">
                {/* Background effects */}
                <div className="absolute -top-20 right-0 w-60 h-60 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-20 left-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="mastery-content relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <TrendingUp size={20} className="text-accent" />
                      </div>
                      <h2 className="text-xl font-display font-semibold">Overall Mastery</h2>
                    </div>
                    
                    <p className="text-text-secondary mb-6">
                      You&apos;ve mastered <span className="text-white font-semibold">{stats.masteredCards}</span> of{' '}
                      <span className="text-white font-semibold">{stats.totalCards}</span> cards in your collection.
                    </p>

                    {/* Premium Progress Bar */}
                    <div className="relative mb-6">
                      <div className="progress-bar h-3">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${masteryRate}%` }}
                          transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                        />
                      </div>
                      <motion.div
                        className="absolute -top-1 text-xs font-bold text-white bg-primary px-2 py-0.5 rounded"
                        initial={{ left: '0%', opacity: 0 }}
                        animate={{ left: `${Math.min(masteryRate, 95)}%`, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                      >
                        {masteryRate}%
                      </motion.div>
                    </div>

                    <div className="mastery-stats">
                      <span className="mastery-stat-badge cyan">
                        <Target size={12} className="inline mr-1" />
                        {masteryRate}% mastery rate
                      </span>
                      <span className="mastery-stat-badge purple">
                        <Zap size={12} className="inline mr-1" />
                        {stats.dueToday} cards due
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="mastery-focus-card">
                      <div className="mastery-focus-label">Focus Area</div>
                      <div className="mastery-focus-value text-warning">
                        {stats.weakCards} weak cards
                      </div>
                      <div className="mastery-focus-hint">
                        Strengthen these to boost your mastery
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {stats.dueToday > 0 && (
                        <Link href="/decks" className="btn-primary flex-1 justify-center">
                          <Clock size={16} />
                          Start Review
                        </Link>
                      )}
                      <Link href="/upload" className="btn-secondary flex-1 justify-center">
                        <Upload size={16} />
                        Add Cards
                      </Link>
                    </div>
                  </div>
                </div>
              </Tilt3DCard>
            </motion.div>
          )}

          {/* Empty State */}
          {stats.totalCards === 0 && (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <motion.div 
                className="empty-icon"
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(99, 102, 241, 0.2)',
                    '0 0 0 20px rgba(99, 102, 241, 0)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen size={40} />
              </motion.div>
              <h2 className="empty-title">Your learning journey starts here</h2>
              <p className="empty-subtitle">
                Upload a PDF document and let AI create intelligent flashcards for efficient, personalized learning.
              </p>
              <Link href="/upload" className="btn-primary mt-4 group">
                <Upload size={18} />
                <span>Upload Your First PDF</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}