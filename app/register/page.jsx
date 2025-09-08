// app/register/page.jsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('All fields are necessary.');
      return;
    }

    try {
      const res = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.message || 'User registration failed.');
      }
    } catch (error) {
      console.log('Error during registration: ', error);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-100">
      <div className="shadow-lg p-8 rounded-lg bg-white border-t-4 border-blue-500 w-full max-w-md">
        <h1 className="text-2xl font-bold my-4 text-center">Register for StudySphere</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="p-3 border border-gray-300 rounded-md focus:outline-blue-500"
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            required
          />
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
            Register
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <Link className="text-sm mt-3 text-right" href={'/login'}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}