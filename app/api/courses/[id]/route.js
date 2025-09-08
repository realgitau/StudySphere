// app/api/courses/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Material from '@/models/Material';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET a single course and its materials
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const course = await Course.findOne({ _id: params.id, userId: session.user.id });
  if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });

  const materials = await Material.find({ courseId: params.id, userId: session.user.id });

  return NextResponse.json({ course, materials });
}