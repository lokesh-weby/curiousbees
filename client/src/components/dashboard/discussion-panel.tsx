'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, MoreVertical, ArrowRight, MessageCircle, Clock } from 'lucide-react';
import { Thread } from '@/shared/types';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface DiscussionPanelProps {
  threads: Thread[];
}

export default function DiscussionPanel({ threads }: DiscussionPanelProps) {
  
  // Custom mock fallbacks for when database has few threads or to keep fidelity to Stitch mockup
  const mockThreads = [
    {
      id: 'stitch-thread-1',
      title: 'Quantum Computing Applications in Biotech',
      content: "Dr. Verma's team is looking for ML specialists to assist with analyzing folding patterns generated from the new quantum sim...",
      tag: 'Cross-Department',
      replies: 4,
      activity: 'Active 2h ago',
      borderClass: 'border-l-[#004495]',
      tagBgClass: 'bg-[#004495]/5 text-[#004495] border-[#004495]/15'
    },
    {
      id: 'stitch-thread-2',
      title: 'DST SERB - Core Research Grant 2024',
      content: 'The institutional office has opened preliminary review slots for the upcoming SERB grant cycle. Submit draft abstracts by Friday.',
      tag: 'Grant Opportunity',
      replies: 12,
      activity: 'Active 1d ago',
      borderClass: 'border-l-[#775a00]',
      tagBgClass: 'bg-[#775a00]/5 text-[#775a00] border-[#775a00]/15'
    },
    {
      id: 'stitch-thread-3',
      title: 'Ethics in Autonomous Systems',
      content: 'Join the virtual roundtable discussing the recent IEEE guidelines on autonomous vehicle ethics protocols.',
      tag: 'Seminar Series',
      replies: 0,
      activity: 'No replies yet',
      borderClass: 'border-l-slate-300',
      tagBgClass: 'bg-slate-100 text-slate-600 border-slate-200'
    }
  ];

  // Map database threads to Stitch panel. If DB threads are available, use them and enrich with Stitch styling.
  const displayThreads = threads.length > 0 
    ? threads.slice(0, 3).map((t, idx) => {
        let borderClass = 'border-l-slate-300';
        let tagBgClass = 'bg-slate-100 text-slate-600 border-slate-200';
        if (idx === 0) {
          borderClass = 'border-l-[#004495]';
          tagBgClass = 'bg-[#004495]/5 text-[#004495] border-[#004495]/15';
        } else if (idx === 1) {
          borderClass = 'border-l-[#775a00]';
          tagBgClass = 'bg-[#775a00]/5 text-[#775a00] border-[#775a00]/15';
        }
        
        let relativeTime = 'Active recently';
        try {
          if (t.createdAt) {
            relativeTime = `Active ${formatDistanceToNow(new Date(t.createdAt))} ago`;
          }
        } catch (e) {}

        return {
          id: t.id,
          title: t.title,
          content: t.content,
          tag: t.tags?.[0] || 'Research',
          replies: t.comments?.length || 0,
          activity: t.comments && t.comments.length > 0 ? relativeTime : 'No replies yet',
          borderClass,
          tagBgClass
        };
      })
    : mockThreads;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="cb-card p-5 h-full flex flex-col select-none text-left bg-white/90 backdrop-blur-md">
      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-[#0d3c61] flex items-center gap-2 font-display">
          <MessageSquare className="w-4 h-4 text-primary shrink-0" />
          <span>Ecosystem Discussions</span>
        </h3>
        <button className="p-1 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 flex-grow overflow-y-auto pr-1"
      >
        {displayThreads.map((thread) => (
          <motion.div 
            key={thread.id} 
            variants={itemVariants}
            className={`group border-l-2 ${thread.borderClass} pl-3.5 py-1 text-left hover:bg-slate-50/40 rounded-r-lg transition-all duration-200`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${thread.tagBgClass}`}>
                {thread.tag}
              </span>
            </div>
            
            <Link href={`/threads/${thread.id}`}>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-primary mt-1.5 cursor-pointer line-clamp-1 leading-snug transition-colors">
                {thread.title}
              </h4>
            </Link>
            
            <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
              {thread.content}
            </p>
            
            <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3 text-slate-400" />
                {thread.replies > 0 ? `${thread.replies} Replies` : 'No replies'}
              </span>
              {thread.replies > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {thread.activity}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Link href="/threads" className="mt-4 block">
        <button className="group w-full py-2.5 border border-slate-200 hover:border-primary/30 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:text-primary hover:bg-[#004495]/2 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]">
          <span>Explore All Discussions</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </button>
      </Link>
    </section>
  );
}

