// app/summarizer/page.jsx
'use client'

import { useState } from 'react'

export default function SummarizerPage() {
  const [inputText, setInputText] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSummary('')

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setSummary(data.summary)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Text Summarizer</h1>
        <p className="text-gray-600 mb-8">
          Paste your notes, articles, or textbook chapters below to get a concise summary of the key points.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here (minimum 50 characters)..."
            rows={15}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || inputText.trim().length < 50}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Summarizing...' : 'Generate Summary'}
          </button>
        </form>

        {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {summary && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-2xl font-bold mb-4">Summary</h2>
            <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}