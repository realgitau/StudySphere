// components/TaskManager.jsx
'use client';
import { useState, useEffect } from 'react';

// A single Task Item component
function TaskItem({ task, onToggleComplete, onDelete }) {
    const priorityColor = {
        'Low': 'bg-green-100 text-green-800',
        'Medium': 'bg-yellow-100 text-yellow-800',
        'High': 'bg-red-100 text-red-800',
    };
    
    return (
        <div className={`flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 mb-2`}>
            <div className="flex items-center gap-3">
                <input 
                    type="checkbox" 
                    checked={task.isCompleted} 
                    onChange={() => onToggleComplete(task._id, !task.isCompleted)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                    <p className={`font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                    </p>
                    {task.dueDate && (
                        <p className="text-sm text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColor[task.priority]}`}>
                    {task.priority}
                </span>
                <button 
                    onClick={() => onDelete(task._id)}
                    className="text-gray-400 hover:text-red-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}


// The main Task Manager component
export default function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/tasks');
            if (!res.ok) throw new Error("Failed to fetch tasks");
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) {
            setError('Title is required');
            return;
        }
        setError('');

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, priority }),
            });
            if (!res.ok) throw new Error("Failed to create task");
            setTitle('');
            setPriority('Medium');
            fetchTasks(); // Refetch tasks to show the new one
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleComplete = async (id, isCompleted) => {
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isCompleted }),
            });
            if (!res.ok) throw new Error("Failed to update task");
            fetchTasks(); // Refetch
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error("Failed to delete task");
            fetchTasks(); // Refetch
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-blue-500"
                />
                 <select value={priority} onChange={(e) => setPriority(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add</button>
            </form>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            
            <div className="space-y-2">
                {isLoading ? (
                    <p>Loading tasks...</p>
                ) : tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskItem key={task._id} task={task} onToggleComplete={handleToggleComplete} onDelete={handleDelete} />
                    ))
                ) : (
                    <p className="text-gray-500">You have no tasks yet. Add one above!</p>
                )}
            </div>
        </div>
    );
}