// app/api/tasks/[taskId]/route.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongoose'
import Task from '@/models/Task'

// This function handles PATCH requests to update a task (e.g., mark as complete)
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    await dbConnect()
    const { taskId } = params
    const body = await request.json()

    // Find the task and update it
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: session.user.id }, // Ensure user owns the task
      { $set: { completed: body.completed } },
      { new: true } // Return the updated document
    )

    if (!updatedTask) {
      return new Response(JSON.stringify({ error: 'Task not found or user not authorized' }), { status: 404 })
    }

    // A 200 OK with the updated object is also a valid response for PATCH
    return new Response(JSON.stringify(updatedTask), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Failed to update task' }), { status: 500 })
  }
}

// This new function handles DELETE requests
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    await dbConnect()
    const { taskId } = params

    // Find the task and delete it
    const result = await Task.deleteOne({
      _id: taskId,
      userId: session.user.id, // Ensure user owns the task
    })

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Task not found or user not authorized' }), { status: 404 })
    }

    return new Response(null, { status: 204 }) // 204 No Content is a standard success response for DELETE
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Failed to delete task' }), { status: 500 })
  }
}