'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { Bot, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

const fetchStats = async () => {
  const res = await apiFetch('/api/events/stats');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

export default function PipelineStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['event-pipeline-stats'],
    queryFn: fetchStats,
    refetchInterval: 5000, // Poll every 5s for live dashboard feel
  });

  if (isLoading || isError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl cb-card bg-white/90 backdrop-blur-md" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Ingested',
      value: data?.totalEvents || 0,
      icon: <Bot className="w-4 h-4 text-primary" />,
      color: 'bg-primary/5 border-primary/10',
      label: 'All-time AI parsed',
    },
    {
      title: 'Review Queue',
      value: data?.reviewQueue || 0,
      icon: <Clock className="w-4 h-4 text-secondary" />,
      color: 'bg-[#775a00]/5 border-[#775a00]/10',
      label: 'Pending moderation',
    },
    {
      title: 'Extraction Confidence',
      value: `${data?.avgConfidence || 0}%`,
      icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-100',
      label: 'AI extraction precision',
    },
    {
      title: 'Spam Blocked',
      value: data?.duplicatesRejected || 0,
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      color: 'bg-rose-50 border-rose-100',
      label: 'Duplicates filtered',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="relative overflow-hidden group cb-card p-5 bg-white/90 backdrop-blur-md flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</h3>
            <div className={`p-1.5 rounded-lg ${stat.color} border flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
          </div>
          <div className="flex items-baseline mt-2">
            <span className="text-2xl font-extrabold text-[#0d3c61] font-display">{stat.value}</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
