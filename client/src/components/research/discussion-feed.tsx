'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Eye, Filter } from 'lucide-react';
import { Thread } from '@/shared/types';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface DiscussionFeedProps {
  threads: Thread[];
}

export default function DiscussionFeed({ threads }: DiscussionFeedProps) {
  
  // Custom mock threads matching high-fidelity Stitch mockup when DB has no threads
  const mockThreads = [
    {
      id: 'stitch-feed-1',
      title: 'Integrating LLMs into qualitative data analysis frameworks',
      content: 'We are looking for insights from the sociology department regarding the ethical boundaries of automated sentiment analysis on sensitive interview transcripts...',
      tag: 'Cross-Departmental',
      tagType: 'secondary',
      timeAgo: '2 hours ago',
      replies: 14,
      views: 120
    },
    {
      id: 'stitch-feed-2',
      title: 'NSF Horizon 2025: Collaborative Hubs for Quantum Materials',
      content: 'A new call has been released. Seeking PIs with expertise in topological insulators to form a consortium for the upcoming pre-proposal deadline.',
      tag: 'Grant Opportunity',
      tagType: 'primary',
      timeAgo: 'Yesterday',
      replies: 5,
      views: 89
    }
  ];

  // Map database threads to Stitch dashboard list
  const displayThreads = threads.length > 0
    ? threads.slice(0, 3).map((t, idx) => {
        let tagType = 'primary';
        if (idx % 2 === 0) {
          tagType = 'secondary';
        }
        
        let relativeTime = 'Recently';
        try {
          if (t.createdAt) {
            relativeTime = formatDistanceToNow(new Date(t.createdAt)) + ' ago';
          }
        } catch (e) {}

        return {
          id: t.id,
          title: t.title,
          content: t.content,
          tag: t.tags?.[0] || 'Research',
          tagType,
          timeAgo: relativeTime,
          replies: t.comments?.length || 0,
          views: 120 - (idx * 24)
        };
      })
    : mockThreads;

  return (
    <section className="bg-white border border-borderStroke rounded-xl p-5 shadow-sm text-left select-none w-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-bold text-[#0d3c61] flex items-center gap-2 font-display">
          <MessageSquare className="w-4.5 h-4.5 text-primary shrink-0" />
          <span>Discussion Feed</span>
        </h3>
        <button className="text-textSecondary hover:text-primary transition-colors cursor-pointer p-1.5 hover:bg-slate-50 border border-borderStroke/50 hover:border-primary/20 rounded-lg">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {displayThreads.map((thread, idx) => {
          const badgeClass = thread.tagType === 'secondary'
            ? 'bg-amber-50 text-amber-700 border-amber-250/20'
            : 'bg-primary/5 text-primary border-primary/10';

          return (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              className="pb-4 border-b border-borderStroke/40 last:border-0 last:pb-0 text-left flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold uppercase tracking-wider ${badgeClass}`}>
                  {thread.tag}
                </span>
                <span className="text-[10px] text-textSecondary font-semibold">
                  {thread.timeAgo}
                </span>
              </div>
              
              <Link href={`/threads/${thread.id}`}>
                <h4 className="text-[13.5px] font-bold text-black hover:text-primary cursor-pointer transition-colors leading-snug">
                  {thread.title}
                </h4>
              </Link>
              
              <p className="text-[12.5px] text-textSecondary font-medium leading-relaxed line-clamp-2">
                {thread.content}
              </p>
              
              <div className="flex items-center gap-4 text-textSecondary/70 font-semibold text-[11px] pt-1">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-textSecondary/50" /> {thread.replies} Replies
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-textSecondary/50" /> {thread.views} Views
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
