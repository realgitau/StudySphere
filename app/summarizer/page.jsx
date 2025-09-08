// app/summarizer/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SummarizerPage() {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSummary('');

        try {
            const res = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setSummary(data.summary);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">AI Text Summarizer</h1>
                    <Link href="/dashboard" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
                </div>
            </header>
            <main className="container mx-auto px-6 py-8">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <p className="text-gray-600 mb-4">Paste your text below (e.g., an article, lecture notes) and get a concise summary.</p>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter text to summarize (at least 100 characters)..."
                            className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || text.length < 100}
                            className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Summarizing...' : 'Generate Summary'}
                        </button>
                    </form>
                    {error && <p className="mt-4 text-red-500">{error}</p>}
                    
                    {summary && (
                        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3">Summary:</h2>
                            <p className="text-gray-800 whitespace-pre-wrap">{summary}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}