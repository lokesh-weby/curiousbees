'use client';

import React from 'react';
import { Database } from 'lucide-react';

interface DataConsumptionCardProps {
  used?: number; // e.g. 1.2
  total?: number; // e.g. 1.5
  unit?: string; // e.g. PB
}

export default function DataConsumptionCard({
  used = 1.2,
  total = 1.5,
  unit = 'PB'
}: DataConsumptionCardProps) {
  const percentage = Math.round((used / total) * 100);

  return (
    <div className="cb-card p-6 flex flex-col relative select-none text-left min-h-[180px] bg-white/90 backdrop-blur-md">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-primary/5 text-primary border border-primary/10 rounded-lg shrink-0">
          <Database className="w-4 h-4" />
        </div>
      </div>
      
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans">
        Data Consumption
      </h3>
      <div className="text-2xl font-extrabold text-[#0d3c61] font-display flex items-baseline gap-1">
        {used}{' '}
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider ml-1">{unit}</span>
      </div>
      
      {/* Capacity Progress Slider Bar */}
      <div className="mt-auto pt-6">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/30">
          <div 
            className="bg-primary h-full rounded-full transition-all duration-300" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400 tracking-wider uppercase">
          <span>
            {percentage}% CAPACITY
          </span>
          <span>
            {total} {unit} MAX
          </span>
        </div>
      </div>
    </div>
  );
}
