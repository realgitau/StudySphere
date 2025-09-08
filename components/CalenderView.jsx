// components/CalendarView.jsx
'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default function CalendarView() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTasksAndCreateEvents = async () => {
            try {
                const res = await fetch('/api/tasks');
                const tasks = await res.json();

                const calendarEvents = tasks
                    .filter(task => task.dueDate) // Only include tasks that have a due date
                    .map(task => ({
                        title: task.title,
                        start: new Date(task.dueDate),
                        end: new Date(task.dueDate), // For tasks, start and end are the same
                        allDay: true, // Treat tasks as all-day events on their due date
                        resource: task, // Optional: store original task object
                    }));

                setEvents(calendarEvents);
            } catch (error) {
                console.error("Failed to fetch tasks for calendar:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasksAndCreateEvents();
    }, []);

    if (isLoading) {
        return <div>Loading calendar...</div>;
    }

    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={(event) => {
                // Custom style for completed tasks
                const style = {
                    backgroundColor: event.resource.isCompleted ? '#d1fae5' : '#bfdbfe',
                    color: event.resource.isCompleted ? '#065f46' : '#1e40af',
                    borderRadius: '5px',
                    border: 'none',
                };
                return { style };
            }}
        />
    );
}