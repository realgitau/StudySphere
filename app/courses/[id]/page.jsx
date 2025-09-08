// app/courses/[id]/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// UI Component for the Plan Generator Form
function GeneratePlanForm({ courseId }) {
    const [goal, setGoal] = useState('');
    const [weeks, setWeeks] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('Generating your study plan... This may take a moment.');

        const res = await fetch(`/api/courses/${courseId}/generate-plan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goal, weeks }),
        });

        const data = await res.json();
        setIsLoading(false);
        
        if (res.ok) {
            setMessage(`Success! ${data.taskCount} tasks have been added to your dashboard.`);
            setTimeout(() => router.push('/dashboard'), 2000); // Redirect after success
        } else {
            setMessage(`Error: ${data.message}`);
        }
    };
    
    return (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Generate AI Study Plan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Study Goal</label>
                    <input type="text" id="goal" value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g., Prepare for Midterm Exam" required className="w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label htmlFor="weeks" className="block text-sm font-medium text-gray-700">Timeframe (in weeks)</label>
                    <input type="number" id="weeks" value={weeks} onChange={e => setWeeks(e.target.value)} min="1" max="12" required className="w-full p-2 border rounded-md"/>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                    {isLoading ? 'Generating...' : 'Generate Plan'}
                </button>
                {message && <p className="text-sm text-center mt-2">{message}</p>}
            </form>
        </div>
    );
}

// Main Page Component
export default function CourseDetailPage() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [file, setFile] = useState(null);
    const params = useParams();
    const courseId = params.id;

    const fetchData = async () => {
        if (!courseId) return;
        setIsLoading(true);
        const res = await fetch(`/api/courses/${courseId}`);
        const courseData = await res.json();
        setData(courseData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        await fetch(`/api/upload?courseId=${courseId}`, {
            method: 'POST',
            body: formData,
        });
        setFile(null);
        fetchData(); // Refresh data after upload
    };

    if (isLoading) return <div className="p-8">Loading course details...</div>;
    if (!data) return <div className="p-8">Course not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">{data.course.name}</h1>
                    <Link href="/courses" className="text-blue-600 hover:underline">&larr; All Courses</Link>
                </div>
            </header>
            <main className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Course Materials</h2>
                        <form onSubmit={handleFileUpload} className="mb-6 flex gap-2">
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf" className="flex-grow p-2 border rounded-md" />
                            <button type="submit" disabled={!file} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400">Upload</button>
                        </form>
                        <ul>
                            {data.materials.map(material => (
                                <li key={material._id} className="border-b py-2 flex justify-between items-center">
                                    <span>{material.fileName}</span>
                                    <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">View</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <GeneratePlanForm courseId={courseId} />
                </div>
            </main>
        </div>
    );
}