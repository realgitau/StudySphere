// app/api/tasks/route.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongoose'
import Task from '@/models/Task'

export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    await dbConnect()

    const tasks = await Task.find({ userId: session.user.id }).sort({ dueDate: 1 })

    return new Response(JSON.stringify(tasks), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), { status: 500 })
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

    // Create a new task using the Mongoose model
    const newTask = new Task({
      ...body,
      userId: session.user.id, // Ensure the task is associated with the logged-in user
    })

    await newTask.save() // This validates and saves the document

    return new Response(JSON.stringify(newTask), { status: 201 })
  } catch (error) {
    console.error(error)
    // Mongoose validation errors can be caught here
    if (error.name === 'ValidationError') {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }
    return new Response(JSON.stringify({ error: 'Failed to create task' }), { status: 500 })
  }
}