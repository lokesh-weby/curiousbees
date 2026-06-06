'use client';

import React from 'react';
import Link from 'next/link';
import { Thread } from '@/shared/types';
import { MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThreadCardProps {
  thread: Thread;
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getInitials = (name?: string) => {
    if (!name) return 'RC';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full text-left"
    >
      <div className="cb-card-hover p-5 md:p-6 relative group flex flex-col justify-between bg-white/95 backdrop-blur-md">
        {/* Thread Author Profile & Title */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 select-none">
            <div className="flex items-center space-x-3">
              {/* Profile Avatar */}
              {thread.author?.image ? (
                <img src={thread.author.image} className="w-[34px] h-[34px] rounded-full object-cover border border-slate-200" alt="" />
              ) : (
                <div className="w-[34px] h-[34px] rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center font-display font-bold text-primary text-[12px] shrink-0">
                  {getInitials(thread.author?.name || undefined)}
                </div>
              )}
              
              <div className="text-left font-sans">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900 leading-none">
                    {thread.author?.name || 'Academic Scholar'}
                  </span>
                  <span className="bg-slate-50 border border-slate-200/60 text-slate-500 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full leading-none">
                    {thread.author?.role === 'RESEARCH_SUPERVISOR' ? 'Faculty' : 'Scholar'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 leading-none">
                  {thread.author?.department?.split('(')[0].trim() || 'SRMIST'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase space-x-1.5 shrink-0 self-start sm:self-center">
              <Calendar className="w-3.5 h-3.5 text-slate-450 shrink-0" />
              <span>{formatDate(thread.createdAt)}</span>
            </div>
          </div>
 
          {/* Thread Title & Preview */}
          <Link href={`/threads/${thread.id}`} className="block focus:outline-none mb-4 space-y-1">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">
              {thread.title}
            </h3>
            <p className="text-slate-500 font-sans font-medium text-xs leading-relaxed line-clamp-2">
              {thread.content}
            </p>
          </Link>
        </div>

        {/* Tags and Comments Bottom Row */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 mt-2 gap-3">
          
          {/* Thread tags */}
          <div className="flex flex-wrap gap-1.5">
            {thread.tags.map((tag) => (
              <span key={tag} className="bg-[#004495]/2 border border-[#004495]/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>

          {/* Comment Count & Link */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-[11px] text-slate-400 font-bold space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{thread.comments?.length || thread._count?.comments || 0} Comments</span>
            </div>

            <Link 
              href={`/threads/${thread.id}`} 
              className="flex items-center text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:text-primary group-hover:translate-x-0.5 transition-all"
            >
              <span>View Thread</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-slate-400 group-hover:text-primary transition-colors" />
            </Link>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
