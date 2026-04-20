import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

// GET all decks
export async function GET() {
  try {
    const { data: decks, error } = await supabase
      .from('decks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get decks error:', error);
      return NextResponse.json({ error: 'Failed to fetch decks' }, { status: 500 });
    }

    // For each deck, get cards due today
    const today = new Date().toISOString().split('T')[0];
    const decksWithDue = await Promise.all(
      (decks || []).map(async (deck) => {
        const { count } = await supabase
          .from('cards')
          .select('*', { count: 'exact', head: true })
          .eq('deck_id', deck.id)
          .lte('next_review', today);
        return { ...deck, due_count: count ?? 0 };
      })
    );

    return NextResponse.json({ decks: decksWithDue });
  } catch (error) {
    console.error('Get decks error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

// DELETE a deck by ID (passed as query param)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Deck ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('decks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete deck error:', error);
      return NextResponse.json({ error: 'Failed to delete deck' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete deck error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
