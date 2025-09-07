// app/notes/page.jsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getAnonymousId } from '@/lib/anonymousId'

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    setUserId(getAnonymousId())
  }, [])

  const fetchNotes = useCallback(async () => {
    if (!userId) return
    try {
      setLoading(true)
      const response = await fetch(`/api/notes?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchNotes()
  }, [userId, fetchNotes])

  if (loading || !userId) return <div className="container mx-auto px-4 py-8">Loading notes...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
        <Link
          href="/notes/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">You haven't created any notes yet.</p>
          <Link
            href="/notes/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Your First Note
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Link
              key={note._id}
              href={`/notes/${note._id}`}
              className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 truncate">{note.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {note.content}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                <span>{note.tags.join(', ')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}