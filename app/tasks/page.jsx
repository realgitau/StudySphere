// app/tasks/page.jsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import AddTaskForm from '@/components/AddTaskForm'
import TaskList from '@/components/TaskList'
import { getAnonymousId } from '@/lib/anonymousId'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    setUserId(getAnonymousId())
  }, [])

  const fetchTasks = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const response = await fetch(`/api/tasks?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchTasks()
  }, [userId, fetchTasks])

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
    setShowForm(false)
  }

  const handleToggleComplete = async (taskId, completed) => {
    if (!userId) return
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed, userId }),
      })
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, completed: !completed } : task
      ))
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!userId) return
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        })
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId))
      } catch (error) {
        console.error('An error occurred while deleting the task:', error)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add New Task'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <AddTaskForm onTaskAdded={handleTaskAdded} userId={userId} />
        </div>
      )}

      <TaskList 
        tasks={tasks} 
        loading={loading || !userId}
        onToggleComplete={handleToggleComplete} 
        onDeleteTask={handleDeleteTask}
      />
    </div>
  )
}