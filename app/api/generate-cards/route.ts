import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, truncateText } from '@/lib/pdfParser';
import { generateFlashcards } from '@/lib/nvidia';
import { supabase } from '@/lib/supabase';
import { Card } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const deckTitle = (formData.get('deckTitle') as string) || 'Untitled Deck';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    let rawText: string;
    try {
      rawText = await extractTextFromPDF(buffer);
    } catch (err) {
      console.error('PDF Parse Error:', err);
      return NextResponse.json({ error: 'Failed to read PDF. Ensure it is not encrypted or corrupted.' }, { status: 422 });
    }

    if (!rawText || rawText.length < 20) {
      return NextResponse.json({ error: 'PDF appears to be empty or contains no extractable text.' }, { status: 422 });
    }

    // Truncate to safe token limit
    const text = truncateText(rawText);

    // Generate flashcards with NVIDIA AI
    let aiResponse: string;
    try {
      aiResponse = await generateFlashcards(text);
    } catch (err) {
      console.error('NVIDIA API error:', err);
      return NextResponse.json({ error: 'AI service failed to generate flashcards. Please try again.' }, { status: 503 });
    }

    // Parse the JSON response from AI
    let flashcards: Omit<Card, 'id' | 'deck_id' | 'created_at' | 'interval' | 'ease_factor' | 'next_review'>[];
    try {
      // Strip markdown code blocks if present
      const cleaned = aiResponse
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/gi, '')
        .trim();

      // Find JSON array in the response
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found in AI response');
      
      flashcards = JSON.parse(jsonMatch[0]);
      
      if (!Array.isArray(flashcards) || flashcards.length === 0) {
        throw new Error('Invalid flashcard format');
      }
    } catch (err) {
      console.error('JSON parse error:', err, '\nAI Response:', aiResponse);
      return NextResponse.json({ error: 'Failed to parse AI response. Please try again.' }, { status: 500 });
    }

    // Create deck in Supabase
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .insert({
        title: deckTitle,
        source_filename: file.name,
        card_count: flashcards.length,
      })
      .select()
      .single();

    if (deckError || !deck) {
      console.error('Deck creation error:', deckError);
      return NextResponse.json({ error: 'Failed to save deck to database.' }, { status: 500 });
    }

    // Insert all cards
    const today = new Date().toISOString().split('T')[0];
    const cardsToInsert = flashcards.map(card => {
      let difficulty = String(card.difficulty || 'medium').toLowerCase();
      if (!['easy', 'medium', 'hard'].includes(difficulty)) difficulty = 'medium';

      let type = String(card.type || 'concept').toLowerCase();
      if (!['definition', 'concept', 'application', 'reasoning'].includes(type)) type = 'concept';

      return {
        deck_id: deck.id,
        question: card.question || 'Missing question',
        answer: card.answer || 'Missing answer',
        difficulty,
        type,
        interval: 1,
        ease_factor: 2.5,
        next_review: today,
      };
    });

    const { error: cardsError } = await supabase
      .from('cards')
      .insert(cardsToInsert);

    if (cardsError) {
      console.error('Cards insertion error:', cardsError);
      // Clean up deck if cards failed
      await supabase.from('decks').delete().eq('id', deck.id);
      return NextResponse.json({ error: 'Failed to save flashcards to database.' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      deck,
      cardCount: flashcards.length,
    });

  } catch (error) {
    console.error('Unexpected error in generate-cards:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
