// app/calendar/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CalendarView from "@/components/CalendarView"; // We will create this next
import Link from "next/link";

export default async function CalendarPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-blue-600">My Calendar</h1>
                        <Link href="/dashboard" className="text-blue-600 hover:underline">
                            &larr; Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-6 py-8">
                {/* The height here is important for the calendar to display correctly */}
                <div className="bg-white p-4 rounded-lg shadow" style={{ height: '75vh' }}>
                    <CalendarView />
                </div>
            </main>
        </div>
    );
}