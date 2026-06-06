'use client';

import React from 'react';
import Link from 'next/link';
import { Contact, MessageSquare } from 'lucide-react';
import { User } from '@/shared/types';
import { motion } from 'framer-motion';

interface ScholarOverviewProps {
  activeScholars: User[];
  onMessageScholar: (name: string) => void;
}

export default function ScholarOverview({
  activeScholars,
  onMessageScholar
}: ScholarOverviewProps) {
  
  const mockActivities = [
    'Uploaded dataset for Chapter 4 validation.',
    'Completed literature review submission.',
    'Submitted draft of Federated learning edge performance analysis.',
    'Compiled benchmark comparisons for neural optimizer models.'
  ];

  if (activeScholars.length === 0) {
    return (
      <section className="space-y-4 select-none text-left w-full">
        <h3 className="text-sm font-bold text-[#0d3c61] flex items-center gap-2 font-display">
          <Contact className="w-4.5 h-4.5 text-primary shrink-0" />
          <span>Assigned Scholars Overview</span>
        </h3>
        <div className="bg-white border border-borderStroke p-8 rounded-xl text-center shadow-sm">
          <p className="text-xs text-textSecondary font-semibold">
            No scholars are currently assigned to you. Once scholars map themselves under your supervision, they will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 select-none text-left w-full">
      <h3 className="text-sm font-bold text-[#0d3c61] flex items-center gap-2 font-display">
        <Contact className="w-4.5 h-4.5 text-primary shrink-0" />
        <span>Assigned Scholars Overview</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeScholars.map((scholar, idx) => {
          const isOnTrack = idx % 2 === 1;
          const statusLabel = isOnTrack ? 'On Track' : 'In Progress';
          
          const badgeClass = isOnTrack
            ? 'bg-primary/5 text-primary border-primary/10'
            : 'bg-amber-50 text-amber-700 border-amber-250/20';
             
          const activity = mockActivities[idx % mockActivities.length];

          const scholarImage = scholar.image || (isOnTrack 
            ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBfo-dEDdI9h_zmFYadOWfm0uj976cR7F8cYtDbAH3ifiPLZNJ-T5ej0iQAzOGlotpNQF9l-cEiBVEvB5xKAmwHKcipJXjM8Zql86Qbxr-DGC9tsJZlO0yZqYlHwQI-bCQIIVtZ4Vt5BpzHei4Ycpou4USdBaGHzhZI_ExAeDWTQc0h654yc1xLq3a9Y2QZGL2UfYViZYxReZQRgGUPyXLLv_Mi0o7C4VowsfoTjG58KpKygJULZwsNHY4UYWxVkPgP0MLn2JRqSUtT"
            : "https://lh3.googleusercontent.com/aida-public/AB6AXuDDiuJKvZzuvrjYgaL67mgaHd_OTAcCCTiItez_EsXmgA-imJMlRsc3ptrSmTT3heZeUcNYdYV2Rpzq3kkjjayvF9WYObS3hFaA3xWqz-cOb5fa9XedWWOhSb06jvMtaooNbDXRW1f1wSkLVpNXjVgeJjUQTk0_sXOotDMTbjzvcAQQ3YxuxVEdT9jPRj2eP88OTWVEIejzcx1DXBhKdHOlXOLRRN6QTSqzKdUSjvMn0WNBdbWkNv-pvtBoXmAdIZ8jTCVfl3-WIvrN"
          );

          return (
            <motion.div
              key={scholar.id || scholar.email}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.35 }}
              className="bg-white border border-borderStroke p-5 rounded-xl hover:shadow-md hover:border-borderStroke/90 transition-all flex flex-col justify-between min-h-[190px]"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      alt="Scholar Profile"
                      className="w-10 h-10 rounded-full border border-borderStroke object-cover shrink-0"
                      src={scholarImage}
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-black truncate max-w-[130px] leading-tight">
                        {scholar.name || 'Research Scholar'}
                      </h4>
                      <p className="text-[10px] text-textSecondary font-semibold mt-1">
                        Year {idx % 3 + 1} • {scholar.department || 'Data Science'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 ${badgeClass}`}>
                    {statusLabel}
                  </span>
                </div>
                
                <div className="mb-4 text-left">
                  <p className="text-xs text-textSecondary font-medium leading-relaxed">
                    <span className="font-bold text-black">Recent Activity:</span> {activity}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 select-none">
                <Link href={`/researchers?search=${encodeURIComponent(scholar.name || '')}`} className="flex-1">
                  <button className="w-full bg-slate-50 hover:bg-slate-100 border border-borderStroke/70 text-black font-bold text-[11px] uppercase tracking-wider py-2 rounded-lg transition-colors cursor-pointer active:scale-98">
                    View Profile
                  </button>
                </Link>
                <button
                  onClick={() => onMessageScholar(scholar.name || 'Scholar')}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 border border-borderStroke/70 text-black font-bold text-[11px] uppercase tracking-wider py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-textSecondary" />
                  <span>Message</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
