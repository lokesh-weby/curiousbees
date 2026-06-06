'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { Event } from '@/shared/types';

type PrismaEvent = Event & {
  status: 'DRAFT' | 'PUBLISHED' | 'REVIEW_REQUIRED' | 'FAILED';
};

const fetchEvents = async () => {
  // Fetch only published and review required events for the main calendar
  const res = await apiFetch('/api/events');
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json() as Promise<PrismaEvent[]>;
};

export default function EventCalendar({ onEventClick }: { onEventClick: (event: PrismaEvent) => void }) {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events-calendar'],
    queryFn: fetchEvents,
    refetchInterval: 10000, 
  });

  // Map backend events to FullCalendar event objects
  const calendarEvents = events.map(e => {
    let backgroundColor = '#f3f4f6'; // DRAFT (gray-100)
    let borderColor = '#e5e7eb';
    let textColor = '#374151';
    
    if (e.status === 'PUBLISHED') {
      backgroundColor = 'rgba(0, 68, 149, 0.05)';
      borderColor = 'rgba(0, 68, 149, 0.15)';
      textColor = '#004495';
    } else if (e.status === 'REVIEW_REQUIRED') {
      backgroundColor = 'rgba(138, 89, 0, 0.05)';
      borderColor = 'rgba(138, 89, 0, 0.15)';
      textColor = '#8a5900';
    } else if (e.status === 'FAILED') {
      backgroundColor = 'rgba(186, 26, 26, 0.05)';
      borderColor = 'rgba(186, 26, 26, 0.15)';
      textColor = '#ba1a1a';
    }

    let startDateTime = e.date;
    if (e.time && e.date) {
      try {
        const d = new Date(e.date);
        startDateTime = d.toISOString();
      } catch (err) {}
    }

    return {
      id: e.id,
      title: e.title,
      start: startDateTime,
      extendedProps: { ...e },
      backgroundColor,
      borderColor,
      textColor
    };
  });

  if (isLoading) {
    return (
      <div className="h-[650px] cb-card animate-pulse flex flex-col p-6 bg-white/90 backdrop-blur-md">
        <div className="h-10 w-1/3 bg-slate-100 rounded-lg mb-6"></div>
        <div className="flex-1 bg-slate-50/50 rounded-xl border border-slate-100"></div>
      </div>
    );
  }

  return (
    <div className="cb-card p-4 lg:p-6 overflow-hidden bg-white/90 backdrop-blur-md">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek'
        }}
        events={calendarEvents}
        eventClick={(info) => {
          onEventClick(info.event.extendedProps as PrismaEvent);
        }}
        height={600}
        dayMaxEvents={3}
        nowIndicator={true}
      />
    </div>
  );
}
