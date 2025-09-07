// app/page.js
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to StudySphere
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Your all-in-one student productivity and learning hub. Manage tasks, take notes, and boost your study efficiency.
          </p>

          <div className="space-y-6">
            <p className="text-lg">
              Get started organizing your academic life now.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-gray-600">
                Organize assignments, exams, and deadlines with our smart task manager.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">✏️</div>
              <h3 className="text-xl font-semibold mb-2">Note Taking</h3>
              <p className="text-gray-600">
                Create, organize, and access your study notes from anywhere.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Focus Tools</h3>
              <p className="text-gray-600">
                Stay focused with the built-in Focus Timer and productivity tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}