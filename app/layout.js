// app/layout.js
import { Jost } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const jost = Jost({ subsets: ['latin'] })

export const metadata = {
  title: 'StudySphere - Student Productivity Hub',
  description: 'Your all-in-one student productivity and learning hub',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jost.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow bg-gray-50">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; {new Date().getFullYear()} StudySphere. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}