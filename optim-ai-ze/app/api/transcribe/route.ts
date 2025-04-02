import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { audio } = await req.json();
    
    if (!audio) {
      return NextResponse.json(
        { error: 'No audio data provided' },
        { status: 400 }
      );
    }
    
    // Convert base64 to buffer
    const buffer = Buffer.from(audio, 'base64');
    
    // Create blob for OpenAI API
    const blob = new Blob([buffer]);
    const file = new File([blob], 'audio.webm', { type: 'audio/webm' });
    
    // Call Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
    });
    
    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
} 