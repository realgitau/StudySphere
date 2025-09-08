// app/api/tasks/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Helper function to check ownership
async function checkTaskOwnership(taskId, userId) {
    const task = await Task.findById(taskId);
    if (!task) return null;
    if (task.userId.toString() !== userId) return false;
    return task;
}

// PUT: Update a specific task (including toggling completion)
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id } = params;
    const task = await checkTaskOwnership(id, session.user.id);

    if (task === null) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    if (task === false) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating task', error }, { status: 500 });
  }
}

// DELETE: Delete a specific task
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await dbConnect();
    const { id } = params;
    const task = await checkTaskOwnership(id, session.user.id);
    
    if (task === null) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    if (task === false) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    
    await Task.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting task', error }, { status: 500 });
  }
}