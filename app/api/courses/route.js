// app/api/courses/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET all courses for the user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const courses = await Course.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json(courses);
}

// POST a new course
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const { name, description } = await req.json();
  const newCourse = await Course.create({ name, description, userId: session.user.id });
  return NextResponse.json(newCourse, { status: 201 });
}