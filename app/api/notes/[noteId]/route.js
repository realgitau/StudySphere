// app/api/notes/[noteId]/route.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongoose'
import Note from '@/models/Note'

// GET a single note by its ID
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    await dbConnect()
    const { noteId } = params

    const note = await Note.findOne({
      _id: noteId,
      userId: session.user.id, // Ensure the note belongs to the user
    })

    if (!note) {
      return new Response(JSON.stringify({ error: 'Note not found' }), { status: 404 })
    }

    return new Response(JSON.stringify(note), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Failed to fetch note' }), { status: 500 })
  }
}

// UPDATE a note
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    await dbConnect()
    const { noteId } = params
    const body = await request.json()

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId: session.user.id },
      { $set: { title: body.title, content: body.content } },
      { new: true, runValidators: true }
    )

    if (!updatedNote) {
      return new Response(JSON.stringify({ error: 'Note not found or user not authorized' }), { status: 404 })
    }

    return new Response(JSON.stringify(updatedNote), { status: 200 })
  } catch (error) {
    console.error(error)
    if (error.name === 'ValidationError') {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }
    return new Response(JSON.stringify({ error: 'Failed to update note' }), { status: 500 })
  }
}

// DELETE a note
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    await dbConnect()
    const { noteId } = params

    const result = await Note.deleteOne({
      _id: noteId,
      userId: session.user.id,
    })

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Note not found or user not authorized' }), { status: 404 })
    }

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Failed to delete note' }), { status: 500 })
  }
}