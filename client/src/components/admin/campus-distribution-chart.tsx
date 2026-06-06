'use client';

import React from 'react';
import { MoreVertical } from 'lucide-react';

interface NodeData {
  id: string;
  name: string;
  code: string;
  load: number; // percentage value, e.g. 40, 85, 60, 30
  type: 'standard' | 'high' | 'warning';
}

interface CampusDistributionChartProps {
  nodes?: NodeData[];
}

export default function CampusDistributionChart({
  nodes = [
    { id: 'n1', name: 'Node A', code: 'NA', load: 40, type: 'standard' },
    { id: 'n2', name: 'Node B', code: 'EU', load: 85, type: 'high' },
    { id: 'n3', name: 'Node C', code: 'AP', load: 60, type: 'standard' },
    { id: 'n4', name: 'Warning', code: 'SA', load: 30, type: 'warning' }
  ]
}: CampusDistributionChartProps) {
  return (
    <div className="cb-card flex flex-col md:col-span-2 lg:col-span-2 overflow-hidden relative select-none text-left bg-white/90 backdrop-blur-md">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center relative z-10">
        <div>
          <h3 className="text-sm font-bold text-[#0d3c61] font-display">Campus Distribution</h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Compute load across global research nodes</p>
        </div>
        <button className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded-full">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Heatmap/Bar Chart Area */}
      <div className="flex-1 p-6 relative min-h-[220px] flex items-end">
        {/* Grid Lines */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(195, 198, 214, 0.08) 1px, transparent 1px), 
              linear-gradient(to bottom, rgba(195, 198, 214, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Abstraction container */}
        <div className="relative h-40 w-full flex items-end justify-around z-10 px-4">
          {nodes.map((node) => {
            let barColor = 'bg-primary/20 hover:bg-primary/40';
            let labelClass = 'text-slate-400 font-semibold';
            let extraShadow = '';

            if (node.type === 'high') {
              barColor = 'bg-primary hover:bg-primary/95';
              labelClass = 'text-slate-900 font-bold';
              extraShadow = 'shadow-[0_0_15px_rgba(0,68,149,0.15)]';
            } else if (node.type === 'warning') {
              barColor = 'bg-amber-500 hover:bg-amber-400';
              labelClass = 'text-amber-700 font-bold';
            }

            return (
              <div 
                key={node.id} 
                className="flex flex-col items-center gap-2 group w-full max-w-[40px]"
              >
                <div 
                  className={`w-full rounded-t transition-all duration-300 relative ${barColor} ${extraShadow}`} 
                  style={{ height: `${node.load}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20 shadow-md border border-slate-800">
                    {node.name}: {node.load}% Load
                  </div>
                </div>
                <span className={`text-[10px] tracking-wider uppercase ${labelClass}`}>
                  {node.code}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
