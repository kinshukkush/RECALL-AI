import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateSM2 } from '@/lib/sm2';
import { ReviewCardRequest } from '@/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body: ReviewCardRequest = await request.json();
    const { cardId, rating } = body;

    if (!cardId || !rating) {
      return NextResponse.json({ error: 'cardId and rating are required' }, { status: 400 });
    }

    const validRatings = ['again', 'hard', 'good', 'easy'];
    if (!validRatings.includes(rating)) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    // Get current card state
    const { data: card, error: fetchError } = await supabase
      .from('cards')
      .select('id, interval, ease_factor')
      .eq('id', cardId)
      .single();

    if (fetchError || !card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Calculate new SM-2 values
    const sm2Result = calculateSM2({
      interval: card.interval,
      ease_factor: card.ease_factor,
      rating,
    });

    // Update card with SM-2 values
    const { error: updateError } = await supabase
      .from('cards')
      .update({
        interval: sm2Result.interval,
        ease_factor: sm2Result.ease_factor,
        next_review: sm2Result.next_review,
      })
      .eq('id', cardId);

    if (updateError) {
      console.error('Card update error:', updateError);
      return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
    }

    // Log the review
    await supabase.from('reviews').insert({
      card_id: cardId,
      rating,
    });

    return NextResponse.json({
      success: true,
      nextReview: sm2Result.next_review,
      interval: sm2Result.interval,
    });

  } catch (error) {
    console.error('Review card error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
