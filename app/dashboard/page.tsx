'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardStats } from '@/types';
import StatsCard from '@/components/StatsCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Layers, Star, AlertTriangle, Clock, BookOpen, Upload, ArrowRight } from 'lucide-react';

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
      <div className="page-header">
        <h1 className="page-title">
          Your <span className="gradient-text">Learning Dashboard</span>
        </h1>
        <p className="page-subtitle">
          Track your progress, identify weak areas, and plan your next review session.
        </p>
      </div>

      {error && <div className="error-banner" style={{ marginBottom: '24px' }}>{error}</div>}

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="stats-grid">
            <StatsCard
              label="Total Cards"
              value={stats.totalCards}
              icon={Layers}
              color="purple"
              description="Across all decks"
            />
            <StatsCard
              label="Mastered"
              value={stats.masteredCards}
              icon={Star}
              color="green"
              description="Interval ≥ 21 days"
            />
            <StatsCard
              label="Weak Cards"
              value={stats.weakCards}
              icon={AlertTriangle}
              color="red"
              description="Needs more practice"
            />
            <StatsCard
              label="Due Today"
              value={stats.dueToday}
              icon={Clock}
              color="orange"
              description="Ready to review"
            />
            <StatsCard
              label="Total Decks"
              value={stats.totalDecks}
              icon={BookOpen}
              color="blue"
              description="PDF decks created"
            />
          </div>

          {/* Mastery Ring */}
          {stats.totalCards > 0 && (
            <div className="glass-card" style={{ padding: '32px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '6px' }}>Overall Mastery</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
                  {stats.masteredCards} of {stats.totalCards} cards mastered
                </p>
                <div className="progress-bar" style={{ height: '10px' }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.round((stats.masteredCards / stats.totalCards) * 100)}%` }}
                  />
                </div>
                <p style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {Math.round((stats.masteredCards / stats.totalCards) * 100)}% mastery rate
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {stats.dueToday > 0 && (
                  <Link href="/decks" className="btn-primary">
                    <Clock size={16} /> Review {stats.dueToday} Due Cards
                  </Link>
                )}
                <Link href="/upload" className="btn-secondary">
                  <Upload size={16} /> Add New Deck
                </Link>
              </div>
            </div>
          )}

          {/* Empty state */}
          {stats.totalCards === 0 && (
            <div className="empty-state">
              <div className="empty-icon"><BookOpen size={36} /></div>
              <p className="empty-title">No flashcards yet</p>
              <p className="empty-subtitle">Upload a PDF to get started with your first flashcard deck.</p>
              <Link href="/upload" className="btn-primary" id="dash-upload-btn">
                <Upload size={18} /> Upload PDF <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
