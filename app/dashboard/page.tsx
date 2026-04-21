'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardStats } from '@/types';
import StatsCard from '@/components/StatsCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Layers, Star, AlertTriangle, Clock, BookOpen, Upload, ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

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

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div className="page-content">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">
          Your <span className="gradient-text">Learning Dashboard</span>
        </h1>
        <p className="page-subtitle text-gray-400">
          Track your progress, identify weak areas, and plan your next review session.
        </p>
      </motion.div>

      {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-banner mb-6">{error}</motion.div>}

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
                label="Weak Cards"
                value={stats.weakCards}
                icon={AlertTriangle}
                color="red"
                description="Needs more practice"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                label="Due Today"
                value={stats.dueToday}
                icon={Clock}
                color="orange"
                description="Ready to review"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                label="Total Decks"
                value={stats.totalDecks}
                icon={BookOpen}
                color="blue"
                description="PDF decks created"
              />
            </motion.div>
          </motion.div>

          {/* Mastery Ring */}
          {stats.totalCards > 0 && (
            <motion.div 
              className="glass-card mb-10 p-8 flex items-center gap-8 flex-wrap border-cyan-500/20 shadow-[0_4px_30px_rgba(0,212,255,0.05)] relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
              <div className="flex-1 min-w-[200px] z-10 relative">
                <h2 className="font-display text-xl font-bold mb-1.5 text-white">Overall Mastery</h2>
                <p className="text-gray-400 text-sm mb-4">
                  {stats.masteredCards} of {stats.totalCards} cards mastered
                </p>
                <div className="progress-bar h-2.5 bg-black/40 border border-white/10 relative overflow-hidden">
                  <motion.div
                    className="progress-fill absolute top-0 left-0 bottom-0 bg-gradient-to-r from-cyan-400 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((stats.masteredCards / stats.totalCards) * 100)}%` }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
                <p className="mt-2 text-xs text-cyan-400/80 font-medium">
                  {Math.round((stats.masteredCards / stats.totalCards) * 100)}% mastery rate
                </p>
              </div>
              <div className="flex gap-3 flex-wrap relative z-10">
                {stats.dueToday > 0 && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/decks" className="btn-primary shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                      <Clock size={16} /> Review {stats.dueToday} Due Cards
                    </Link>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/upload" className="btn-secondary glass border border-white/20 hover:bg-white/10">
                    <Upload size={16} /> Add New Deck
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {stats.totalCards === 0 && (
            <motion.div 
              className="empty-state glass mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="empty-icon bg-gradient-to-br from-purple-500/20 to-cyan-500/20"><BookOpen size={36} className="text-cyan-400" /></div>
              <p className="empty-title text-white">No flashcards yet</p>
              <p className="empty-subtitle text-gray-400">Upload a PDF to get started with your first flashcard deck.</p>
              <Link href="/upload" className="btn-primary shadow-lg shadow-cyan-500/20" id="dash-upload-btn">
                <Upload size={18} /> Upload PDF <ArrowRight size={16} />
              </Link>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
