'use client';

import React from 'react';
import { CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeadlineItem {
  id: string;
  title: string;
  subtitle: string;
  isActive?: boolean;
}

interface UpcomingDeadlinesProps {
  deadlines?: DeadlineItem[];
}

export default function UpcomingDeadlines({
  deadlines = [
    {
      id: 'dl-1',
      title: 'Oct 15 - ICML Paper Submission',
      subtitle: 'Conference on Machine Learning',
      isActive: true
    },
    {
      id: 'dl-2',
      title: 'Nov 02 - DARPA Grant Pre-proposal',
      subtitle: 'Advanced Materials Division',
      isActive: false
    },
    {
      id: 'dl-3',
      title: 'Dec 10 - Ethics Committee Review',
      subtitle: "Project 'Neural Sync' phase 2",
      isActive: false
    }
  ]
}: UpcomingDeadlinesProps) {
  return (
    <section className="bg-white border border-borderStroke rounded-xl p-5 shadow-sm text-left">
      <h3 className="text-sm font-bold text-[#0d3c61] mb-5 flex items-center gap-2 font-display select-none">
        <CalendarDays className="w-4.5 h-4.5 text-primary shrink-0" />
        <span>Upcoming Deadlines</span>
      </h3>

      <div className="relative border-l border-borderStroke/60 ml-2.5 space-y-5 select-none">
        {deadlines.map((item, idx) => {
          const dotColor = item.isActive
            ? 'bg-primary border-primary/20'
            : 'bg-slate-200 border-slate-300/40';

          return (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className="pl-5 relative text-left"
            >
              {/* Absoluted Timeline Circle */}
              <div 
                className={`absolute w-2.5 h-2.5 ${dotColor} rounded-full -left-[5.5px] top-1 border-2 border-white shrink-0`}
              />
              <h4 className={cn(
                "text-[12.5px] font-bold leading-tight",
                item.isActive ? "text-primary" : "text-black"
              )}>
                {item.title}
              </h4>
              <p className="text-[11px] text-textSecondary font-medium mt-0.5">
                {item.subtitle}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// Inline helper for conditional classnames without breaking imports
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
