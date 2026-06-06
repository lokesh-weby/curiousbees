'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, CheckCircle, X, Calendar, MapPin, Loader2 } from 'lucide-react';
import { Event } from '@/shared/types';

type PrismaEvent = Event & {
  status: 'DRAFT' | 'PUBLISHED' | 'REVIEW_REQUIRED' | 'FAILED';
  confidence: number;
  aiModel: string;
};

const fetchReviewQueue = async () => {
  const res = await apiFetch('/api/events/review');
  if (!res.ok) throw new Error('Failed to fetch review queue');
  return res.json() as Promise<PrismaEvent[]>;
};

const updateStatus = async ({ id, status }: { id: string, status: string }) => {
  const res = await apiFetch(`/api/events/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
};

export default function ReviewQueue({ onEventClick }: { onEventClick: (event: PrismaEvent) => void }) {
  const queryClient = useQueryClient();

  const { data: queue = [], isLoading } = useQuery({
    queryKey: ['events-review-queue'],
    queryFn: fetchReviewQueue,
    refetchInterval: 10000,
  });

  const mutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      // Refresh all related queries
      queryClient.invalidateQueries({ queryKey: ['events-review-queue'] });
      queryClient.invalidateQueries({ queryKey: ['events-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['events-feed'] });
      queryClient.invalidateQueries({ queryKey: ['event-pipeline-stats'] });
    }
  });

  if (isLoading) {
    return (
      <div className="cb-card p-6 min-h-[300px] flex items-center justify-center bg-white/90 backdrop-blur-md">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="cb-card p-6 overflow-hidden bg-white/90 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#0d3c61] flex items-center gap-2 font-display">
            <AlertCircle className="w-4 h-4 text-secondary shrink-0" />
            <span>AI Moderation Queue</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">Events with confidence score between 70% - 89% require campus approval.</p>
        </div>
        <div className="bg-[#775a00]/5 text-[#775a00] border border-[#775a00]/15 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          {queue.length} Pending Approval
        </div>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence>
          {queue.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-12 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50 font-semibold"
            >
              <CheckCircle className="w-8 h-8 mx-auto mb-3 text-emerald-600/30" />
              <span className="font-bold text-slate-800 text-sm">Moderation Queue Clear!</span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">All processed events are approved and published.</p>
            </motion.div>
          ) : (
            queue.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-slate-50/50 border border-slate-100 hover:border-primary/20 rounded-xl p-4 transition-all duration-200 flex flex-col md:flex-row md:items-center gap-4"
              >
                {/* Event Info */}
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors leading-snug">{event.title}</h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[#775a00]/5 text-[#775a00] px-2 py-0.5 rounded border border-[#775a00]/15">{Math.round(event.confidence * 100)}% Confidence</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-semibold mt-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
                  <button 
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate({ id: event.id, status: 'PUBLISHED' })}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-white transition-all text-xs font-bold shadow-sm disabled:opacity-50 cursor-pointer active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button 
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate({ id: event.id, status: 'FAILED' })}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all text-xs font-bold disabled:opacity-50 cursor-pointer active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
