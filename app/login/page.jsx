// app/login/page.jsx
'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError('Invalid Credentials. Please try again.');
        return;
      }

      router.replace('dashboard');
    } catch (error) {
      console.log(error);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-100">
      <div className="shadow-lg p-8 rounded-lg bg-white border-t-4 border-blue-500 w-full max-w-md">
        <h1 className="text-2xl font-bold my-4 text-center">Login to StudySphere</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            className="p-3 border border-gray-300 rounded-md focus:outline-blue-500"
            onChange={(e) => setEmail(e.target.value)} 
            type="email" 
            placeholder="Email" 
            required
          />
          <input 
            className="p-3 border border-gray-300 rounded-md focus:outline-blue-500"
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            placeholder="Password" 
            required
          />
          <button className="bg-blue-600 text-white font-bold cursor-pointer px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
            Login
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <Link className="text-sm mt-3 text-right" href={'/register'}>
            Don't have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}