// app/api/notes/route.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongoose'
import Note from '@/models/Note'

export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    await dbConnect()

    const notes = await Note.find({ userId: session.user.id }).sort({ updatedAt: -1 })

    return new Response(JSON.stringify(notes), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Failed to fetch notes' }), { status: 500 })
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    await dbConnect()
    const body = await request.json()

    const newNote = new Note({
      ...body,
      userId: session.user.id,
    })

    await newNote.save()

    return new Response(JSON.stringify(newNote), { status: 201 })
  } catch (error) {
    console.error(error)
    if (error.name === 'ValidationError') {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }
    return new Response(JSON.stringify({ error: 'Failed to create note' }), { status: 500 })
  }
}