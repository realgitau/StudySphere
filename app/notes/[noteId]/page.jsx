// app/notes/[noteId]/page.jsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'

export default function NoteDetailPage() {
  const [note, setNote] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedContent, setEditedContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const router = useRouter()
  const params = useParams()
  const { noteId } = params

  const fetchNote = useCallback(async () => {
    if (!noteId) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/notes/${noteId}`)
      if (response.ok) {
        const data = await response.json()
        setNote(data)
        setEditedTitle(data.title)
        setEditedContent(data.content)
      } else {
        // Handle not found or other errors
        setNote(null)
      }
    } catch (error) {
      console.error('Failed to fetch note:', error)
    } finally {
      setIsLoading(false)
    }
  }, [noteId])

  useEffect(() => {
    fetchNote()
  }, [fetchNote])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editedTitle, content: editedContent }),
      })
      if (response.ok) {
        const updatedNote = await response.json()
        setNote(updatedNote)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to update note:', error)
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note permanently?')) {
      try {
        const response = await fetch(`/api/notes/${noteId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          router.push('/notes')
          router.refresh()
        }
      } catch (error) {
        console.error('Failed to delete note:', error)
      }
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading note...</div>
  }

  if (!note) {
    return <div className="container mx-auto px-4 py-8 text-center">Note not found.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/notes" className="flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back to all notes
        </Link>

        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-3xl font-bold p-2 border border-gray-300 rounded-md mb-4"
              required
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={15}
              className="w-full text-lg p-2 border border-gray-300 rounded-md"
            />
            <div className="flex items-center mt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="ml-4 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{note.title}</h1>
              <div className="flex space-x-3">
                <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-600">
                  <Edit size={20} />
                </button>
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-600">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Last updated: {new Date(note.updatedAt).toLocaleString()}
            </p>
            <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
              {note.content}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}