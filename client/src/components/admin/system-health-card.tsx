'use client';

import React from 'react';
import { HeartPulse } from 'lucide-react';

interface SystemHealthCardProps {
  health?: number; // e.g. 99.9
  apiStatus?: 'OK' | 'DEGRADED' | 'DOWN';
  storageStatus?: 'OK' | 'DEGRADED' | 'DOWN';
}

export default function SystemHealthCard({
  health = 99.9,
  apiStatus = 'OK',
  storageStatus = 'OK'
}: SystemHealthCardProps) {
  const isHealthy = apiStatus === 'OK' && storageStatus === 'OK';

  return (
    <div className="cb-card p-6 flex flex-col relative select-none text-left min-h-[180px] bg-white/90 backdrop-blur-md">
      {/* Pulse Green Glow */}
      {isHealthy && (
        <div className="absolute right-4 top-4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)] shrink-0" />
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-primary/5 text-primary border border-primary/10 rounded-lg shrink-0">
          <HeartPulse className="w-4 h-4" />
        </div>
      </div>
      
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans">
        System Health
      </h3>
      <div className="text-2xl font-extrabold text-[#0d3c61] font-display flex items-baseline gap-1">
        {health}
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">%</span>
      </div>
      
      <div className="mt-auto pt-4 flex gap-2">
        <span className="px-2 py-1 bg-slate-50 border border-slate-200/50 rounded text-[9px] font-bold text-slate-600 uppercase tracking-wider shrink-0">
          API: {apiStatus}
        </span>
        <span className="px-2 py-1 bg-slate-50 border border-slate-200/50 rounded text-[9px] font-bold text-slate-600 uppercase tracking-wider shrink-0">
          Storage: {storageStatus}
        </span>
      </div>
    </div>
  );
}
