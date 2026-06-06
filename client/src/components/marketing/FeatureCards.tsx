'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Network, Activity, Calendar, Users, Briefcase, BookOpen, Fingerprint } from 'lucide-react';

export default function FeatureCards() {
  return (
    <section className="py-16 md:py-24 z-10 text-left">
      <div className="max-w-4xl mb-16 mx-auto text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
          <Fingerprint className="w-4 h-4" />
          Core Platform Capabilities
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Everything you need for academic excellence.
        </h2>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
          A unified suite of tools designed specifically for faculty guides, supervisors, and doctoral scholars to advance university research.
        </p>
      </div>

      {/* Premium Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
        
        {/* Bento 1: Research Collaboration (Col span 2) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all md:col-span-2 relative overflow-hidden group min-h-[300px] flex flex-col justify-between"
        >
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
              <Network className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
                Seamless Research Collaboration
              </h3>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-lg">
                Host protected project workspaces. Share database artifacts, maintain active check-offs, and co-author publications within secure institutional networks. Break down departmental silos.
              </p>
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-4 text-xs font-bold text-primary uppercase tracking-widest relative z-10 select-none">
            <span>Secure Synergy Hubs</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>Shared Storage</span>
          </div>
        </motion.div>

        {/* Bento 2: Supervisor Management */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group min-h-[300px] flex flex-col justify-between"
        >
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-xl font-bold text-slate-900">Supervisor Management</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Streamline approvals, track scholar progress, and maintain clear oversight pipelines for institutional compliance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bento 3: Research Opportunities */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group min-h-[300px] flex flex-col justify-between"
        >
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-gradient-to-tl from-amber-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-xl font-bold text-slate-900">Research Opportunities</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Discover funding, grants, and co-authorship openings. Connect with semantic queries tailored to your focus area.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bento 4: Academic Events (Col span 2) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all md:col-span-2 relative overflow-hidden group min-h-[300px] flex flex-col justify-between"
        >
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-slate-900">Academic Events & Conferences</h3>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-lg">
                Stay updated with AI-curated event feeds. Never miss a symposium, workshop, or call for papers relevant to your specific research domain.
              </p>
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-4 text-xs font-bold text-purple-600 uppercase tracking-widest relative z-10 select-none">
            <span>Automated Extraction</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>Smart Calendars</span>
          </div>
        </motion.div>

        {/* Bento 5: Research Analytics */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group min-h-[300px] flex flex-col justify-between md:col-span-3 lg:col-span-3"
        >
          <div className="absolute right-0 bottom-0 w-full h-48 bg-gradient-to-t from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
           <div className="space-y-6 relative z-10 h-full flex flex-col md:flex-row md:items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Activity className="w-8 h-8" />
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="font-display text-2xl font-bold text-slate-900">Research Analytics</h3>
              <p className="text-slate-500 text-base leading-relaxed max-w-3xl">
                Monitor institutional output, visualize citation growth, and track performance metrics across departments with real-time dashboards designed for administrators and research directors.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
