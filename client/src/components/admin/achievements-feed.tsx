'use client';

import React from 'react';
import { Trophy, UserPlus, Clock } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  type: 'project' | 'collab' | 'system';
}

interface AchievementsFeedProps {
  achievements?: Achievement[];
}

export default function AchievementsFeed({
  achievements = [
    {
      id: 'ac-1',
      title: 'Quantum Mapping Project Completed',
      description: 'EU Campus node successfully processed final dataset.',
      timeAgo: '2 HOURS AGO',
      type: 'project'
    },
    {
      id: 'ac-2',
      title: 'New Cross-Institutional Collaboration',
      description: "Stanford AI Lab joined the 'Bio-Mimicry' network.",
      timeAgo: 'YESTERDAY',
      type: 'collab'
    },
    {
      id: 'ac-3',
      title: 'System Architecture Upgraded',
      description: 'Core processing units updated to v4.2.',
      timeAgo: '3 DAYS AGO',
      type: 'system'
    }
  ]
}: AchievementsFeedProps) {
  return (
    <div className="cb-card md:col-span-2 lg:col-span-2 flex flex-col select-none text-left bg-white/90 backdrop-blur-md">
      <div className="p-5 border-b border-slate-100">
        <h3 className="text-sm font-bold text-[#0d3c61] font-display">Recent Achievements</h3>
      </div>
      
      <div className="flex-1 p-5 space-y-4">
        {achievements.map((item, idx) => {
          const isLast = idx === achievements.length - 1;
          
          let icon = <Trophy className="w-3.5 h-3.5 text-secondary" />;
          let iconBg = 'bg-[#775a00]/5 text-[#775a00] border-[#775a00]/15';
          
          if (item.type === 'collab') {
            icon = <UserPlus className="w-3.5 h-3.5 text-primary" />;
            iconBg = 'bg-primary/5 text-primary border border-primary/15';
          } else if (item.type === 'system') {
            icon = <Clock className="w-3.5 h-3.5 text-slate-500" />;
            iconBg = 'bg-slate-50 text-slate-500 border border-slate-200';
          }

          return (
            <div key={item.id} className="flex gap-4 relative text-left">
              {/* Timeline Line */}
              {!isLast && (
                <div 
                  className="absolute left-[11px] top-6 bottom-[-16px] w-0.5 bg-slate-100 pointer-events-none" 
                />
              )}
              
              {/* Timeline Node */}
              <div className={`w-6 h-6 rounded-full border ${iconBg} flex flex-shrink-0 items-center justify-center relative z-10 bg-white`}>
                {icon}
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                  {item.description}
                </p>
                <span className="text-[9px] font-bold text-slate-400 mt-1.5 block tracking-wider uppercase">
                  {item.timeAgo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
