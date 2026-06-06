'use client';

import React from 'react';
import { Rocket, TrendingUp } from 'lucide-react';

interface ResearchVelocityCardProps {
  velocity?: number;
  trend?: string;
  chartHeights?: string[]; // e.g. ['25%', '50%', '33%', '75%', '66%', '100%']
}

export default function ResearchVelocityCard({
  velocity = 842,
  trend = '+14%',
  chartHeights = ['25%', '50%', '33%', '75%', '66%', '100%']
}: ResearchVelocityCardProps) {
  return (
    <div className="cb-card p-6 flex flex-col relative overflow-hidden group select-none text-left min-h-[180px] bg-white/90 backdrop-blur-md">
      {/* Decorative blurred background circle */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-300 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2 bg-primary/5 text-primary rounded-lg border border-primary/10 shrink-0">
          <Rocket className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-[#775a00]/5 border border-[#775a00]/15 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
          <TrendingUp className="w-3 h-3" />
          <span>{trend}</span>
        </span>
      </div>
      
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 relative z-10 font-sans">
        Research Velocity
      </h3>
      <div className="text-2xl font-extrabold text-[#0d3c61] relative z-10 font-display flex items-baseline gap-1">
        {velocity}
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider ml-1">pts/mo</span>
      </div>
      
      {/* Micro Sparkline Columns Chart */}
      <div className="mt-auto pt-4 relative z-10">
        <div className="h-8 w-full flex items-end gap-1 opacity-70">
          {chartHeights.map((height, idx) => {
            const isLast = idx === chartHeights.length - 1;
            const barBg = isLast ? 'bg-[#775a00]' : 'bg-primary/40 group-hover:bg-primary/60 transition-colors';
            return (
              <div 
                key={idx} 
                className={`w-full rounded-t ${barBg}`} 
                style={{ height }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
