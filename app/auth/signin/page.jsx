// app/auth/signin/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { getProviders, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Simple Google Icon component for the button
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.92C34.553 6.184 29.654 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691c-1.321 2.356-2.094 5.12-2.094 8.132c0 3.012.773 5.776 2.094 8.132l-5.654 4.418C.982 31.39 0 27.844 0 24c0-3.844.982-7.39 2.652-10.727l5.654 1.418z"></path>
    <path fill="#4CAF50" d="M24 48c5.655 0 10.554-1.845 14.198-4.995l-5.655-4.418c-2.356 1.566-5.226 2.413-8.543 2.413c-6.627 0-12-5.373-12-12c0-1.422.289-2.771.792-4.042l-5.654-1.418C2.932 12.592 0 17.923 0 24c0 6.077 2.932 11.408 7.425 15.158l5.654-4.418C15.408 39.995 19.345 44 24 44c1.936 0 3.746-.345 5.382-.956l5.655 4.418A19.937 19.937 0 0 1 24 48z"></path>
    <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.082 5.581l5.655 4.418C39.818 35.152 44 29.837 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

export default function SignInPage() {
  const [providers, setProviders] = useState(null)
  const { data: session } = useSession()
  const router = useRouter()

  // If user is already logged in, redirect them to the dashboard
  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  // Fetch the list of available authentication providers
  useEffect(() => {
    const setupProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    setupProviders()
  }, [])

  if (!providers) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-blue-600">
                StudySphere
            </Link>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
                to continue your learning journey
            </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <div className="space-y-4">
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button
                  onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}
                  className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <GoogleIcon />
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}