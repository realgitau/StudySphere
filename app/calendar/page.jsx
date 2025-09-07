// app/calendar/page.jsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getAnonymousId } from '@/lib/anonymousId'

const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

export default function CalendarPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  
  useEffect(() => {
    setUserId(getAnonymousId())
  }, [])

  const fetchEvents = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const response = await fetch(`/api/calendar/events?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        const formattedEvents = data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))
        setEvents(formattedEvents)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchEvents()
  }, [userId, fetchEvents])

  if (loading || !userId) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading Calendar...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md rbc-calendar" style={{ height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month', 'week', 'day']}
        />
      </div>
    </div>
  )
}