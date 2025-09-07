// components/TaskList.jsx
'use client'

import { format } from 'date-fns'

// The component now receives tasks and a handler function as props
export default function TaskList({ tasks, onToggleComplete, loading }) {
  if (loading) return <div className="text-center py-8">Loading tasks...</div>

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No tasks yet. Add one to get started!</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className={`p-4 border rounded-lg shadow-sm ${task.completed ? 'bg-gray-50' : 'bg-white'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                )}
                {task.dueDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>
              <div className="ml-4 flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  // The toggle logic is now handled by the parent page
                  onChange={() => onToggleComplete(task._id, task.completed)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}