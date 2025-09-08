// app/api/notes/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Helper for ownership check
async function checkNoteOwnership(noteId, userId) {
    const note = await Note.findById(noteId);
    if (!note) return null;
    if (note.userId.toString() !== userId) return false;
    return note;
}

// GET: Fetch a single note
export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const note = await checkNoteOwnership(params.id, session.user.id);
    if (note === null) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    if (note === false) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    
    return NextResponse.json(note);
}


// PUT: Update a specific note
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const note = await checkNoteOwnership(params.id, session.user.id);
  if (note === null) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  if (note === false) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const updatedNote = await Note.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updatedNote);
}

// DELETE: Delete a specific note
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const note = await checkNoteOwnership(params.id, session.user.id);
  if (note === null) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  if (note === false) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  await Note.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Note deleted successfully' });
}