// app/api/summarize/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { text } = await req.json();

    if (!text || text.trim().length < 100) { // Basic validation
      return NextResponse.json({ message: 'Please provide at least 100 characters of text to summarize.' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to summarize academic texts for students. Summarize the following text by extracting the key points, main arguments, and conclusions. Present the summary in clear, concise bullet points."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.5,
      max_tokens: 256,
    });
    
    const summary = response.choices[0].message.content;
    return NextResponse.json({ summary });

  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return NextResponse.json({ message: 'Failed to generate summary.', error: error.message }, { status: 500 });
  }
}