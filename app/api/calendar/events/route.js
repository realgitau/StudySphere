// app/api/calendar/events/route.js
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

    // Find tasks that have a dueDate for the logged-in user
    const tasks = await Task.find({
      userId: session.user.id,
      dueDate: { $ne: null }, // Only fetch tasks that have a due date
    })

    // Format tasks into the structure required by react-big-calendar
    const events = tasks.map((task) => ({
      _id: task._id,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true, // Treat tasks as all-day events on their due date
      resource: task, // Include the original task object if needed for onClick handlers
    }))

    return new Response(JSON.stringify(events), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Failed to fetch calendar events' }), { status: 500 })
  }
}