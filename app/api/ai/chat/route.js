// app/api/ai/chat/route.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const dynamic = 'force-dynamic'

// The `ai` library's VercelStream streamData parameter is not yet supported by Google's SDK, so we'll omit it for now.
// We will also have to manually convert the chat history to Google's format.
const buildGoogleGenAIPrompt = (messages) => ({
  contents: messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
})

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const { messages } = await req.json()

    // Prepend a system message to guide the AI's behavior
    const systemMessage = {
      role: 'user', // We use 'user' role for the system prompt in Gemini's format
      content: `You are StudySphere AI, a friendly and knowledgeable academic assistant. Your purpose is to help students understand complex topics.
      - Explain concepts clearly and concisely.
      - Use examples, analogies, or bullet points to break down information.
      - If a question is ambiguous, ask for clarification.
      - Do not answer questions outside of academic or educational contexts. If the user asks about something non-educational, politely decline and steer the conversation back to learning.
      - Format your responses using Markdown for better readability (e.g., use **bold** for key terms, lists for steps, etc.).`
    };
    
    // Combine the system message with the rest of the chat history
    const combinedMessages = [systemMessage, ...messages];

    const geminiStream = await genAI
      .getGenerativeModel({ model: 'gemini-pro' })
      .generateContentStream(buildGoogleGenAIPrompt(combinedMessages))

    // Convert the response into a friendly text-stream
    const stream = GoogleGenerativeAIStream(geminiStream)

    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('AI Chat Error:', error)
    return new Response(JSON.stringify({ error: 'An error occurred with the AI service.' }), {
      status: 500,
    })
  }
}