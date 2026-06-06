'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { FolderOpen, ArrowRight, Calendar, Users, Loader2 } from 'lucide-react';

export default function WorkspacesListPage() {
  const { workspaces, fetchWorkspaces, isLoading } = useStore();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return (
    <div className="space-y-6 text-left select-none max-w-7xl mx-auto">
      
      {/* 🚀 HEADER SECTION */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <div>
          <h1 className="cb-page-title">
            Research Workspaces
          </h1>
          <p className="cb-page-subtitle">
            Active workspaces generated from supervisor-approved research collaboration opportunities.
          </p>
        </div>
        <div className="w-10 h-10 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
          <FolderOpen className="w-5 h-5" />
        </div>
      </div>

      {/* ⚡ ACTIVE WORKSPACES */}
      {isLoading && workspaces.length === 0 ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Loading research workspaces...</p>
        </div>
      ) : workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workspaces.map((workspace) => (
            <Link 
              key={workspace.id}
              href={`/workspace/${workspace.id}`}
              className="cb-card-hover p-5 flex flex-col justify-between group bg-white/90 backdrop-blur-md cursor-pointer"
            >
              <div className="space-y-4 text-left">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 bg-primary/5 text-primary border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-[#004495]/5 text-[#004495] border border-[#004495]/15 uppercase tracking-wider">
                    Active Node
                  </span>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                    {workspace.title}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-medium">
                    {workspace.description || 'Dedicated workspace for research documents, milestone checklists, and group announcements.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <div className="flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    <span>{workspace.members?.length || 0} Members</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    <span>Joined {new Date(workspace.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200 shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="cb-card p-12 text-center bg-white/90 backdrop-blur-md">
          <FolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-4" />
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-sm font-bold text-slate-800">No Active Workspaces</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Workspaces are automatically provisioned as soon as a faculty supervisor accepts a collaboration synergy request on an opportunity post.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
