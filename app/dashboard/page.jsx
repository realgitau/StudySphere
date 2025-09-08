// app/dashboard/page.jsx
'use client'; // This remains a client component because it fetches data dynamically

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; // USE THIS for authentication
import { useRouter } from 'next/navigation';
import FocusTimer from '@/components/FocusTimer'; // The component we created earlier

export default function Dashboard() {
  const { data: session, status } = useSession(); // Get session data and status
  const router = useRouter();
  
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, totalNotes: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch data if the user is authenticated
    if (status === 'authenticated') {
      const fetchData = async () => {
        try {
          // No need to pass userId, our secure API knows who the user is from the session
          const [tasksRes, notesRes] = await Promise.all([
            fetch('/api/tasks'),
            fetch('/api/notes')
          ]);

          if (!tasksRes.ok || !notesRes.ok) {
            throw new Error('Failed to fetch data');
          }

          const tasks = await tasksRes.json();
          const notes = await notesRes.json();
          
          const totalTasks = tasks.length;
          // IMPORTANT: Our model uses `isCompleted`, not `completed`
          const completedTasks = tasks.filter(t => t.isCompleted).length; 
          setStats({ totalTasks, completedTasks, totalNotes: notes.length });

          // Sort tasks by creation date to get the most recent ones
          const sortedTasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRecentTasks(sortedTasks.slice(0, 5));
          
          // Sort notes by updated date to get the most recently edited ones
          const sortedNotes = notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setRecentNotes(sortedNotes.slice(0, 3));

        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [status]); // Re-run the effect when authentication status changes

  // Handle loading and unauthenticated states
  if (status === 'loading' || loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading Dashboard...</div>;
  }
  
  if (status === 'unauthenticated') {
      router.replace('/login');
      return null; // Render nothing while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Re-adding the Header from our previous steps for consistency */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">StudySphere</h1>
            <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-gray-900 font-semibold">Dashboard</Link>
                <Link href="/courses" className="text-gray-600 hover:text-blue-600">Courses</Link>
                <Link href="/calendar" className="text-gray-600 hover:text-blue-600">Calendar</Link>
                <Link href="/summarizer" className="text-gray-600 hover:text-blue-600">Summarizer</Link>
            </div>
            {/* The SignOutButton would go here if you extract it to its own component */}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Your new UI layout starts here */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome back, {session.user.name}!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Total Tasks</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalTasks}</p>
            <p className="text-sm text-gray-500">
              {stats.completedTasks} completed
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Total Notes</h2>
            <p className="text-3xl font-bold text-green-600">{stats.totalNotes}</p>
            <p className="text-sm text-gray-500">notes created</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Productivity</h2>
            <p className="text-3xl font-bold text-purple-600">
              {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-500">completion rate</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Tasks</h2>
              {/* You'll need to create a /tasks page if you want this link to work */}
              <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
                View all on dashboard
              </Link>
            </div>
            
            {recentTasks.length > 0 ? (
              <ul className="space-y-3">
                {recentTasks.map(task => (
                  <li key={task._id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h3 className={`font-medium ${task.isCompleted ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
                      {task.dueDate && (
                        <p className="text-sm text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${task.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {task.isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No tasks yet. Create one in the Task Manager!</p>
            )}
          </div>

          <div className="space-y-8 lg:row-start-1 lg:col-start-3">
            <FocusTimer />
          </div>
          
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Notes</h2>
               {/* You'll need to create a /notes page if you want this link to work */}
              <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
                View all on dashboard
              </Link>
            </div>
            
            {recentNotes.length > 0 ? (
              <ul className="space-y-4">
                {recentNotes.map(note => (
                  <li key={note._id} className="p-3 border rounded-md">
                    <h3 className="font-medium mb-1">{note.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{note.content || "No additional content."}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No notes yet. Create one in the Note Manager!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}