// app/api/summarize/route.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const { text } = await request.json()
    if (!text || text.trim().length < 50) { // Basic validation
      return new Response(JSON.stringify({ error: 'Please provide at least 50 characters of text to summarize.' }), { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Summarize the following text for a student. Focus on the key points, definitions, and main arguments. Present the summary in clear, easy-to-understand bullet points:\n\n---\n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return new Response(JSON.stringify({ summary }), { status: 200 })

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to generate summary. Please try again later.' }), { status: 500 })
  }
}