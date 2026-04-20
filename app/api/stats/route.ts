import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Total cards
    const { count: totalCards } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true });

    // Cards due today
    const { count: dueToday } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .lte('next_review', today);

    // Mastered cards (interval >= 21 days = roughly 3 weeks)
    const { count: masteredCards } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .gte('interval', 21);

    // Weak cards (interval <= 2 days or ease_factor < 1.8)
    const { count: weakCards } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .lte('interval', 2);

    // Total decks
    const { count: totalDecks } = await supabase
      .from('decks')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      totalCards: totalCards ?? 0,
      masteredCards: masteredCards ?? 0,
      weakCards: weakCards ?? 0,
      dueToday: dueToday ?? 0,
      totalDecks: totalDecks ?? 0,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats.' }, { status: 500 });
  }
}
