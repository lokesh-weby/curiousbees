'use client';

import React, { useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';
import EventCalendar from '@/components/events/EventCalendar';
import LiveEventFeed from '@/components/events/LiveEventFeed';
import EventDetailModal from '@/components/events/EventDetailModal';
import CreateEventModal from '@/components/events/CreateEventModal';
import { Event } from '@/shared/types';
import { useStore } from '@/store/useStore';

// Extend local type
type PrismaEvent = Event & {
  status: 'DRAFT' | 'PUBLISHED' | 'REVIEW_REQUIRED' | 'FAILED';
  confidence: number;
  aiModel: string;
  aiProvider: string;
};

export default function EventsPage() {
  const { currentUser } = useStore();
  const [selectedEvent, setSelectedEvent] = useState<PrismaEvent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const isSupervisorOrAdmin = currentUser?.role === 'RESEARCH_SUPERVISOR' || currentUser?.role === 'INSTITUTION_ADMIN';

  return (
    <div className="space-y-6 relative select-none text-left flex flex-col pb-12">

      {/* 🚀 Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Academic Events Registry</span>
          </span>
          <h2 className="cb-page-title mt-2 flex items-center gap-3">
            <span>University Events Feed</span>
          </h2>
          <p className="cb-page-subtitle">
            Real-time visualization of academic events, scheduled lectures, department workshops, and research milestones.
          </p>
        </div>

        {isSupervisorOrAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0 border border-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Event</span>
          </button>
        )}
      </div>

      {/* 🗓️ Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: FullCalendar (Span 2) */}
        <div className="lg:col-span-2">
          <EventCalendar onEventClick={setSelectedEvent as any} />
        </div>

        {/* Right Column: Event Feed (Span 1) */}
        <div className="lg:col-span-1">
          <LiveEventFeed onEventClick={setSelectedEvent as any} />
        </div>
      </div>

      {/* 🔎 Event Detail Modal */}
      <EventDetailModal 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        event={selectedEvent} 
      />

      {/* 🆕 Schedule Event Modal */}
      <CreateEventModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

    </div>
  );
}
