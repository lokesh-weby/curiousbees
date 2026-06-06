'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { GraduationCap, Mail, MessageSquare, BookOpen, FileText, CheckCircle } from 'lucide-react';
import AvatarRing from '@/components/AvatarRing';

export default function MyScholarsPage() {
  const { myScholars, fetchMyScholars, isLoading } = useStore();

  useEffect(() => {
    fetchMyScholars();
  }, [fetchMyScholars]);

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* 🚀 Header */}
      <div className="border-b border-slate-100 pb-5">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-primary" />
          <span>Faculty Advisory Panel</span>
        </span>
        <h1 className="cb-page-title mt-2">My Supervised Scholars</h1>
        <p className="cb-page-subtitle">
          Oversee and monitor the academic status, publications list, and progress logs of your research candidates.
        </p>
      </div>

      {/* 🚀 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myScholars.length === 0 ? (
          <div className="cb-card p-12 text-center bg-white/95 backdrop-blur-md md:col-span-2 lg:col-span-3">
            <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-900 font-bold text-sm">No Scholars Assigned</h3>
            <p className="text-slate-400 text-xs mt-1">
              Scholars must request your supervision and receive your approval before they appear here.
            </p>
          </div>
        ) : (
          myScholars.map((scholar) => (
            <div key={scholar.id} className="cb-card bg-white/95 backdrop-blur-md p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-4">
                
                {/* Scholar Profile */}
                <div className="flex items-center space-x-3.5">
                  <AvatarRing
                    src={scholar.image || undefined}
                    name={scholar.name || undefined}
                    role="RESEARCH_SCHOLAR"
                    size="md"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-primary transition-colors">
                      {scholar.name || 'Scholar Candidate'}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold">{scholar.email}</p>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
                      {scholar.department || 'General Research'}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                {scholar.bio && (
                  <p className="text-xs text-slate-500 font-semibold italic line-clamp-2 border-l-2 border-slate-100 pl-2.5">
                    "{scholar.bio}"
                  </p>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wide">Publications</span>
                      <span className="text-xs font-extrabold text-[#0d3c61]">
                        {scholar.publications?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wide">Reports</span>
                      <span className="text-xs font-extrabold text-[#0d3c61]">
                        {scholar.submittedReports?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-end gap-2 pt-5 mt-5 border-t border-slate-100/50">
                <a
                  href={`mailto:${scholar.email}`}
                  className="p-2 border border-slate-200 hover:border-slate-350 text-slate-650 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <button
                  onClick={() => alert(`Initiating direct advising thread with ${scholar.name}...`)}
                  className="px-3.5 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Advise</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
