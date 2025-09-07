// components/Navbar.jsx
'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          StudySphere
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4 flex-wrap justify-end">
          <Link href="/dashboard" className="hover:underline text-sm md:text-base">
            Dashboard
          </Link>
          <Link href="/tasks" className="hover:underline text-sm md:text-base">
            Tasks
          </Link>
          <Link href="/calendar" className="hover:underline text-sm md:text-base">
            Calendar
          </Link>
          <Link href="/notes" className="hover:underline text-sm md:text-base">
            Notes
          </Link>
          <Link href="/summarizer" className="hover:underline text-sm md:text-base">
            Summarizer
          </Link>
          <Link href="/chatbot" className="hover:underline text-sm md:text-base">
            AI Chatbot
          </Link>
        </div>
      </div>
    </nav>
  )
}