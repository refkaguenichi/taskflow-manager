import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let originalText = '';
  
  try {
    const { text } = await req.json();
    originalText = text?.trim() || '';
    
    if (!originalText) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured');
      return NextResponse.json({ refinedText: originalText });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Rewrite the user\'s text to be more professional, polite and clear. Keep the original meaning but improve the tone and grammar. Respond only with the rewritten text.'
          },
          {
            role: 'user',
            content: originalText
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API failed:', response.status, errorText);
      throw new Error(`OpenAI API failed: ${response.status}`);
    }

    const data = await response.json();
    const refinedText = data.choices[0]?.message?.content?.trim() || originalText;

    return NextResponse.json({ refinedText });
  } catch (err) {
    console.error('Refine API error:', err);
    // Use the stored originalText instead of reading req.json() again
    return NextResponse.json({ 
      refinedText: originalText || '',
      note: 'Used original text due to processing error'
    });
  }
}