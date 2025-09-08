// app/courses/page.jsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseName, setCourseName] = useState('');

  const fetchCourses = async () => {
    setIsLoading(true);
    const res = await fetch('/api/courses');
    const data = await res.json();
    setCourses(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: courseName }),
    });
    setCourseName('');
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">My Courses</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Add a New Course</h2>
          <form onSubmit={handleAddCourse} className="flex gap-2">
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g., Biology 101"
              className="flex-grow p-2 border rounded-md"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Course</button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? <p>Loading courses...</p> : courses.map(course => (
            <Link key={course._id} href={`/courses/${course._id}`}>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-bold text-lg text-blue-700">{course.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{course.description || 'No description'}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}