'use client';

import React, { useState, useEffect } from 'react';
import { Users, FolderGit2, Share2, Building2 } from 'lucide-react';

export default function ResearchStats() {
  const [stats, setStats] = useState({ departments: 0, researchers: 0, collaborations: 0, projects: 0 });

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setStats({
        departments: Math.min(Math.floor((42 / steps) * currentStep), 42),
        researchers: Math.min(Math.floor((5000 / steps) * currentStep), 5000),
        collaborations: Math.min(Math.floor((850 / steps) * currentStep), 850),
        projects: Math.min(Math.floor((12400 / steps) * currentStep), 12400),
      });

      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 relative z-10 select-none bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Trusted by SRM University Research Scholars</h2>
          <p className="text-slate-500">CuriousBees powers interdisciplinary research across all major campuses, facilitating thousands of collaborations daily.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          
          {/* Stat Card 1: Researchers */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-40 hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Researchers</span>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
                {stats.researchers.toLocaleString()}+
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">Across SRM Campuses</p>
            </div>
          </div>

          {/* Stat Card 2: Projects */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-40 hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Research Projects</span>
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                <FolderGit2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
                {stats.projects.toLocaleString()}+
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">Active Workspaces</p>
            </div>
          </div>

          {/* Stat Card 3: Collaborations */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-40 hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Collaborations</span>
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                <Share2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
                {stats.collaborations.toLocaleString()}+
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">Interdepartmental</p>
            </div>
          </div>

          {/* Stat Card 4: Departments */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-40 hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Departments</span>
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
                {stats.departments}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">Academic Faculties</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
