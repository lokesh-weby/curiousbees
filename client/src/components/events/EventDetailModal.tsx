'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, User, Tag, Mail, AlignLeft } from 'lucide-react';
import { Event } from '@/shared/types';

type PrismaEvent = Event & {
  status?: 'DRAFT' | 'PUBLISHED' | 'REVIEW_REQUIRED' | 'FAILED';
  topic?: string;
  speaker?: string;
  eventType?: string;
};

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: PrismaEvent | null;
}

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return dateStr;
  }
};

export default function EventDetailModal({ isOpen, onClose, event }: EventDetailModalProps) {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="pr-8 text-left">
                  {event.category && (
                    <span className="text-[9px] text-primary bg-primary/5 px-2.5 py-0.5 rounded border border-primary/15 font-bold uppercase tracking-wider mb-2.5 inline-block">
                      {event.category}
                    </span>
                  )}
                  <h2 className="font-display text-lg font-bold text-slate-900 leading-tight">{event.title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                {/* Description */}
                {event.description && (
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
                      <span>Description</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                  </div>
                )}

                {/* Event Information */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
                    Event Details
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex gap-3 items-start">
                      <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{formatDate(event.date)}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{event.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-start">
                      <MapPin className="w-4 h-4 text-[#ba1a1a] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{event.venue}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Location / Venue</p>
                      </div>
                    </div>

                    {event.speaker && (
                      <div className="flex gap-3 items-start">
                        <User className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{event.speaker}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Speaker / Keynote Guest</p>
                        </div>
                      </div>
                    )}

                    {event.organizerEmail && (
                      <div className="flex gap-3 items-start">
                        <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{event.organizerEmail}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Organizer Contact</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
