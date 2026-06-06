'use client';

import React, { useState, useMemo, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  MapPin, 
  Clock, 
  Calendar as CalendarIcon, 
  X, 
  Search, 
  BookOpen,
  Layers,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Event } from '@/shared/types';
import { format } from 'date-fns';
import GlassCard from './GlassCard';
import { TagPill } from '@/shared/ui';
import AIBadge from './AIBadge';
import GlowButton from './GlowButton';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  events: Event[];
  onEventDeleted?: (event: Event) => void;
}

export default function CalendarView({ 
  events, 
  onEventDeleted 
}: CalendarViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const calendarRef = useRef<any>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Custom header title tracking
  const [calendarTitle, setCalendarTitle] = useState('');
  const [currentView, setCurrentView] = useState('dayGridMonth');

  // Dynamic Extractors for filters
  const departments = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => {
      if (e.department) set.add(e.department);
    });
    return ['ALL', ...Array.from(set)];
  }, [events]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => {
      if (e.category) set.add(e.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [events]);

  // Filter events reactively
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const titleMatches = e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           e.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           e.venue?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const deptMatches = selectedDepartment === 'ALL' || e.department === selectedDepartment;
      const catMatches = selectedCategory === 'ALL' || e.category === selectedCategory;

      return titleMatches && deptMatches && catMatches;
    });
  }, [events, searchQuery, selectedDepartment, selectedCategory]);

  // Upcoming Event calculation (next 3)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [events]);

  // Map events to FullCalendar shape
  const calendarEvents = useMemo(() => {
    return filteredEvents.map((ev) => {
      const categoryLower = (ev.category || '').toLowerCase();
      
      // Sophisticated academic color schemes matching ElevenLabs tones
      let gradientClass = 'from-tealGlow/10 to-tealGlow/[0.02] dark:from-tealGlow/20 dark:to-transparent';
      let borderClass = 'border-tealGlow';
      let textClass = 'text-tealGlow';
      
      if (categoryLower.includes('viva') || categoryLower.includes('defense') || categoryLower.includes('phd')) {
        gradientClass = 'from-violetRoyal/10 to-violetRoyal/[0.02] dark:from-violetRoyal/20 dark:to-transparent';
        borderClass = 'border-violetRoyal';
        textClass = 'text-violetRoyal';
      } else if (categoryLower.includes('workshop') || categoryLower.includes('bootcamp')) {
        gradientClass = 'from-indigoElectric/10 to-indigoElectric/[0.02] dark:from-indigoElectric/20 dark:to-transparent';
        borderClass = 'border-indigoElectric';
        textClass = 'text-black';
      } else if (categoryLower.includes('seminar') || categoryLower.includes('talk') || categoryLower.includes('colloquium')) {
        gradientClass = 'from-amber-500/10 to-amber-500/[0.02] dark:from-amber-500/20 dark:to-transparent';
        borderClass = 'border-amber-500';
        textClass = 'text-amber-500';
      } else if (categoryLower.includes('conference') || categoryLower.includes('symposium')) {
        gradientClass = 'from-[#9B59B6]/10 to-[#9B59B6]/[0.02]';
        borderClass = 'border-[#9B59B6]';
        textClass = 'text-[#9B59B6]';
      }

      return {
        id: ev.id,
        title: ev.title,
        start: ev.date,
        extendedProps: {
          time: ev.time,
          venue: ev.venue,
          category: ev.category || 'Academic',
          department: ev.department || 'SRMIST',
          description: ev.description || '',
          gradientClass,
          borderClass,
          textClass
        },
      };
    });
  }, [filteredEvents]);

  // FullCalendar event custom rendering
  const renderEventContent = (eventInfo: any) => {
    const { time } = eventInfo.event.extendedProps;
    return (
      <div 
        className="w-full bg-[#1e1916] text-white px-2 py-1 rounded text-[12px] font-sans transition-colors duration-150 hover:bg-[#333333] cursor-pointer flex items-center justify-between min-w-0"
        title={eventInfo.event.title}
      >
        <span className="truncate pr-1.5 leading-none">
          {time} {eventInfo.event.title}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#61b5db] shrink-0" />
      </div>
    );
  };

  const handleEventClick = (clickInfo: any) => {
    const { id, title, start } = clickInfo.event;
    const { time, venue, category, department, description } = clickInfo.event.extendedProps;
    
    // Find the original event object
    const originalEvent = events.find(e => e.id === id) || {
      id,
      title,
      date: start,
      time,
      venue,
      category,
      department,
      description,
      tags: []
    };
    
    setSelectedEvent(originalEvent as any);
  };

  // FullCalendar Toolbar Actions
  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.prev();
      setCalendarTitle(api.view.title);
    }
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.next();
      setCalendarTitle(api.view.title);
    }
  };

  const handleToday = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.today();
      setCalendarTitle(api.view.title);
    }
  };

  const changeView = (viewName: string) => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.changeView(viewName);
      setCurrentView(viewName);
      setCalendarTitle(api.view.title);
    }
  };

  // Initialize Title
  React.useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (api) {
      setCalendarTitle(api.view.title);
    }
  }, [calendarEvents]);

  return (
    <div className="space-y-6 flex flex-col h-full select-none text-left">
      {/* 🚀 Interactive Filter Dashboard */}
      <GlassCard hoverable={false} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
        
        {/* Search bar */}
        <div className="md:col-span-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, venues, topics..."
            className="w-full pl-9 pr-4 py-2 bg-darkBg border border-borderStroke rounded-lg text-[13px] font-sans font-medium focus:outline-none focus:border-black transition-colors text-textPrimary placeholder-textMuted"
          />
          <Search className="w-3.5 h-3.5 text-textMuted absolute left-3 top-2.5" />
        </div>

        {/* Department Filter */}
        <div className="md:col-span-4 flex items-center space-x-2">
          <span className="text-[9px] font-mono font-bold text-textMuted uppercase tracking-wider shrink-0 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dept:</span>
          </span>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-3 py-2 bg-darkBg border border-borderStroke rounded-lg text-xs font-semibold cursor-pointer focus:outline-none text-textPrimary"
          >
            {departments.map(dept => (
              <option key={dept} value={dept} className="bg-darkSurfaceMuted">{dept === 'ALL' ? 'All Departments' : dept.split('(')[0]}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-4 flex items-center space-x-2">
          <span className="text-[9px] font-mono font-bold text-textMuted uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Type:</span>
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-darkBg border border-borderStroke rounded-lg text-xs font-semibold cursor-pointer focus:outline-none text-textPrimary"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-darkSurfaceMuted">{cat === 'ALL' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* 📅 Main Calendar Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Calendar Body */}
        <div className="xl:col-span-9 bg-white border border-borderStroke p-5 rounded-2xl flex flex-col relative overflow-hidden min-h-[580px]">
          
          {/* Custom FullCalendar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-borderStroke pb-4 mb-4">
            
            {/* Title & Chevron Nav */}
            <div className="flex items-center space-x-3">
              <h2 className="font-display font-extrabold text-sm sm:text-base text-textPrimary min-w-[120px]">
                {calendarTitle || 'University Calendar'}
              </h2>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg border border-borderStroke hover:bg-darkSurfaceMuted text-textMuted hover:text-textPrimary transition duration-200 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleToday}
                  className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold rounded-lg border border-borderStroke hover:bg-darkSurfaceMuted text-textMuted hover:text-textPrimary transition duration-200 cursor-pointer font-mono"
                >
                  Today
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg border border-borderStroke hover:bg-darkSurfaceMuted text-textMuted hover:text-textPrimary transition duration-200 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* View Selector Tabs */}
            <div className="flex items-center bg-darkSurfaceMuted border border-borderStroke p-1 rounded-lg w-fit select-none">
              <button
                onClick={() => changeView('dayGridMonth')}
                className={`px-3 py-1.5 rounded-md text-[13px] font-sans font-medium cursor-pointer transition-colors duration-200 ${
                  currentView === 'dayGridMonth' 
                    ? 'bg-black text-white' 
                    : 'text-textSecondary hover:text-black'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => changeView('timeGridWeek')}
                className={`px-3 py-1.5 rounded-md text-[13px] font-sans font-medium cursor-pointer transition-colors duration-200 ${
                  currentView === 'timeGridWeek' 
                    ? 'bg-black text-white' 
                    : 'text-textSecondary hover:text-black'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => changeView('listWeek')}
                className={`px-3 py-1.5 rounded-md text-[13px] font-sans font-medium cursor-pointer transition-colors duration-200 ${
                  currentView === 'listWeek' 
                    ? 'bg-black text-white' 
                    : 'text-textSecondary hover:text-black'
                }`}
              >
                Agenda
              </button>
            </div>
          </div>

          {/* Calendar Instance */}
          <div className="flex-1 text-xs text-textPrimary font-sans">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false} // Disable default header to use our custom one
              events={calendarEvents}
              eventContent={renderEventContent}
              eventClick={handleEventClick}
              editable={false} 
              height="auto"
              selectable={false}
              dayMaxEvents={3}
            />
          </div>
        </div>

        {/* 📋 Upcoming Events Side Panel */}
        <div className="xl:col-span-3 bg-darkSurfaceMuted border border-borderStroke p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden min-h-[580px] text-left">
          
          
          <div>
            <span className="text-[9px] font-mono font-bold text-black uppercase tracking-widest block mb-4 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-black" />
              <span>Upcoming Vivas</span>
            </span>

            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center text-textMuted space-y-2">
                  <CalendarIcon className="w-6 h-6 opacity-30" />
                  <p className="text-[10px] uppercase font-bold tracking-wider">No Upcoming Vivas</p>
                </div>
              ) : (
                upcomingEvents.map(evt => (
                  <div 
                    key={evt.id} 
                    onClick={() => setSelectedEvent(evt)}
                    className="group border border-borderStroke bg-white hover:border-black p-3.5 rounded-xl transition duration-200 cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[8px] bg-darkSurfaceMuted text-textSecondary border border-borderStroke px-2 py-0.5 rounded font-bold uppercase tracking-wider leading-none">
                        {evt.category || 'VIVA'}
                      </span>
                      <span className="text-[8px] text-textMuted font-bold">
                        {format(new Date(evt.date), 'MMM dd')}
                      </span>
                    </div>

                    <h4 className="text-[11px] font-black text-textPrimary leading-snug line-clamp-2 group-hover:text-black transition">
                      {evt.title}
                    </h4>

                    <div className="mt-3 flex items-center gap-3 text-[8px] text-textMuted font-bold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-textMuted/60" />
                        {evt.time}
                      </span>
                      <span className="truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-textMuted/60" />
                        {evt.venue}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-borderStroke pt-4 mt-6">
            <span className="text-[8px] font-mono font-bold text-textMuted uppercase tracking-widest block text-center">
              CuriousBees Event Directory
            </span>
          </div>
        </div>
      </div>

      {/* 🔍 Details Modal Overlay */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-darkBg/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
            {/* Backdrop close click */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedEvent(null)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white border border-borderStroke rounded-xl text-left p-6"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-textMuted hover:text-textPrimary bg-white border border-borderStroke p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header tags */}
              <div className="flex items-center space-x-3.5 mb-5">
                <div className="bg-darkSurfaceMuted p-2.5 rounded-lg text-black shrink-0 border border-borderStroke">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <TagPill label={selectedEvent.category || 'Academic'} variant="gray" />
                  <TagPill label={selectedEvent.department || 'SRMIST'} variant="gray" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-black text-textPrimary tracking-tight leading-snug mb-4">
                {selectedEvent.title}
              </h3>

              {/* Grid of coordinates */}
              <div className="space-y-3.5 border-t border-b border-borderStroke py-4 mb-4 font-mono text-[10px]">
                <div className="flex items-center space-x-3 text-textMuted">
                  <CalendarIcon className="w-4.5 h-4.5 text-textMuted/60" />
                  <div>
                    <p className="text-[8px] font-bold text-textMuted uppercase tracking-widest leading-none mb-1">Date</p>
                    <p className="font-bold text-textPrimary">
                      {format(new Date(selectedEvent.date), 'PPPP')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-textMuted">
                  <Clock className="w-4.5 h-4.5 text-textMuted/60" />
                  <div>
                    <p className="text-[8px] font-bold text-textMuted uppercase tracking-widest leading-none mb-1">Time</p>
                    <p className="font-bold text-textPrimary">{selectedEvent.time}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-textMuted">
                  <MapPin className="w-4.5 h-4.5 text-textMuted/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[8px] font-bold text-textMuted uppercase tracking-widest leading-none mb-1">Venue</p>
                    <p className="font-bold text-textPrimary truncate">{selectedEvent.venue}</p>
                  </div>
                </div>

                {selectedEvent.organizerEmail && (
                  <div className="flex items-center space-x-3 text-textMuted">
                    <span className="text-sm shrink-0">📧</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] font-bold text-textMuted uppercase tracking-widest leading-none mb-1">Organizer Email</p>
                      <p className="font-bold text-textPrimary truncate">{selectedEvent.organizerEmail}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description summary */}
              {selectedEvent.description && (
                <div className="mb-6">
                  <p className="text-[8px] font-mono font-bold text-textMuted uppercase tracking-widest leading-none mb-2">Description</p>
                  <p className="text-xs text-textMuted leading-relaxed font-semibold">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end pt-2">
                <GlowButton
                  onClick={() => setSelectedEvent(null)}
                  variant="secondary"
                  size="sm"
                >
                  Dismiss Details
                </GlowButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
