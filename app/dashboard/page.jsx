// app/dashboard/page.jsx
'use client' // CONVERT TO CLIENT COMPONENT

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PomodoroTimer from '@/components/PomodoroTimer'
import { getAnonymousId } from '@/lib/anonymousId'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, totalNotes: 0 })
  const [recentTasks, setRecentTasks] = useState([])
  const [recentNotes, setRecentNotes] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const userId = getAnonymousId()
    if (!userId) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const [tasksRes, notesRes] = await Promise.all([
          fetch(`/api/tasks?userId=${userId}`),
          fetch(`/api/notes?userId=${userId}`)
        ])

        const tasks = await tasksRes.json()
        const notes = await notesRes.json()
        
        const totalTasks = tasks.length
        const completedTasks = tasks.filter(t => t.completed).length
        setStats({ totalTasks, completedTasks, totalNotes: notes.length })

        setRecentTasks(tasks.slice(0, 5))
        setRecentNotes(notes.slice(0, 3))

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading Dashboard...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalTasks}</p>
          <p className="text-sm text-gray-500">
            {stats.completedTasks} completed of {stats.totalTasks} total
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <p className="text-3xl font-bold text-green-600">{stats.totalNotes}</p>
          <p className="text-sm text-gray-500">Total notes</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Productivity</h2>
          <p className="text-3xl font-bold text-purple-600">
            {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
          </p>
          <p className="text-sm text-gray-500">Completion rate</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <Link href="/tasks" className="text-blue-600 hover:underline text-sm">
              View all
            </Link>
          </div>
          
          {recentTasks.length > 0 ? (
            <ul className="space-y-3">
              {recentTasks.map(task => (
                <li key={task._id.toString()} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    {task.dueDate && (
                      <p className="text-sm text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No tasks yet. <Link href="/tasks" className="text-blue-600 hover:underline">Create your first task</Link></p>
          )}
        </div>

        <div className="lg:row-start-1 lg:col-start-3">
          <PomodoroTimer />
        </div>
        
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Notes</h2>
            <Link href="/notes" className="text-blue-600 hover:underline text-sm">
              View all
            </Link>
          </div>
          
          {recentNotes.length > 0 ? (
            <ul className="space-y-4">
              {recentNotes.map(note => (
                <li key={note._id.toString()} className="p-3 border rounded-md">
                  <h3 className="font-medium mb-1">{note.title}</h3>
                  <p className="text-sm text-gray-600 truncate">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No notes yet. <Link href="/notes" className="text-blue-600 hover:underline">Create your first note</Link></p>
          )}
        </div>
      </div>
    </div>
  )
}