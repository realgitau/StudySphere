// app/chatbot/page.jsx
'use client'

import { Send } from 'lucide-react'

export default function ChatbotPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat', // Our new API endpoint
  })

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-150px)]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Study Assistant</h1>
        <p className="text-gray-600">
          Ask any academic question to clarify concepts, get explanations, or dive deeper into a topic.
        </p>
      </div>

      <div className="flex-grow overflow-y-auto mb-4 p-4 bg-white rounded-lg shadow-md border">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xl p-3 rounded-lg shadow ${
                    m.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="prose" dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              Start a conversation by typing a question below.
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={input}
          placeholder="Ask about a historical event, a scientific concept, or a math problem..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  )
}