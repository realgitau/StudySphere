// app/api/courses/[id]/generate-plan/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Material from '@/models/Material';
import Task from '@/models/Task';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id: courseId } = params;
    const { goal, weeks } = await req.json();

    try {
        await dbConnect();
        // 1. Fetch all materials for the course and combine their text content.
        const materials = await Material.find({ courseId, userId: session.user.id });
        if (materials.length === 0) {
            return NextResponse.json({ message: 'No materials found for this course. Please upload a syllabus or notes first.' }, { status: 400 });
        }
        const combinedText = materials.map(m => m.textContent).join('\n\n---\n\n');

        // 2. Craft the prompt for the OpenAI API.
        const prompt = `
            You are an expert academic planner. Based on the following course material, create a detailed, actionable study plan for a student.

            Student's Goal: "${goal}"
            Timeframe: ${weeks} weeks

            Course Material:
            """
            ${combinedText.substring(0, 12000)} 
            """

            Your Task:
            Generate a list of study tasks. For each task, provide a clear, concise title and a suggested priority (Low, Medium, or High).
            The tasks should logically break down the material to help the student achieve their goal within the timeframe.
            
            IMPORTANT: Respond ONLY with a valid JSON array of objects. Do not include any other text, explanation, or markdown formatting.
            Each object in the array should have exactly two keys: "title" (string) and "priority" (string: "Low", "Medium", or "High").
            
            Example JSON response format:
            [
                {"title": "Review Chapter 1: Introduction to Cellular Biology", "priority": "High"},
                {"title": "Create flashcards for key terms from the syllabus", "priority": "Medium"},
                {"title": "Complete practice problems for Module 2", "priority": "High"}
            ]
        `;

        // 3. Call the OpenAI API.
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106", // Use a model that's good with JSON
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }, // Enforce JSON output
        });

        const resultText = response.choices[0].message.content;
        // The model is instructed to return a JSON array, but the `json_object` format wraps it in an object. We need to find the array.
        const generatedTasks = JSON.parse(resultText)[Object.keys(JSON.parse(resultText))[0]];

        if (!Array.isArray(generatedTasks)) {
          throw new Error("AI did not return a valid array of tasks.");
        }

        // 4. Create the tasks in the database.
        const tasksToInsert = generatedTasks.map(task => ({
            title: task.title,
            priority: task.priority || 'Medium',
            userId: session.user.id,
            // We can add more logic here to distribute due dates over the 'weeks' timeframe
        }));

        await Task.insertMany(tasksToInsert);

        return NextResponse.json({ message: 'Study plan generated successfully!', taskCount: tasksToInsert.length });

    } catch (error) {
        console.error("Error generating study plan:", error);
        return NextResponse.json({ message: 'Failed to generate study plan.', error: error.message }, { status: 500 });
    }
}