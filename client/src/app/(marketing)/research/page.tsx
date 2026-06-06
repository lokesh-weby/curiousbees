'use client';

import React from 'react';
import MarketingNavbar from '@/components/marketing/MarketingNavbar';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import CTASection from '@/components/marketing/CTASection';
import { motion } from 'framer-motion';
import { Search, FlaskConical, Network, BookOpen, Fingerprint } from 'lucide-react';

export default function ResearchPage() {
  return (
    <div className="bg-white text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-primary/20">
      <MarketingNavbar />
      
      <main className="flex-grow w-full pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
              <FlaskConical className="w-4 h-4" />
              For Research Scholars
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
              Accelerate your academic journey.
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              From ideation to peer-reviewed publication, CuriousBees provides the tools, network, and guidance you need to produce world-class research.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
            <div className="order-2 md:order-1 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Semantic Literature & Peer Discovery</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                Stop relying on exact keyword matches. Our AI-powered search engine understands the context of your research, connecting you with relevant papers, datasets, and interdisciplinary peers across the university who share your specific academic interests.
              </p>
            </div>
            <div className="order-1 md:order-2 bg-slate-50 rounded-3xl p-8 border border-slate-200 h-80 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-multiply" />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm border border-slate-200 z-10"
               >
                 <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
                 <div className="h-10 w-full bg-slate-100 rounded-lg border border-slate-200 flex items-center px-3 mb-4">
                   <Search className="w-4 h-4 text-slate-400 mr-2" />
                   <span className="text-slate-400 text-sm">"Machine learning for nanomaterials..."</span>
                 </div>
                 <div className="space-y-3">
                   <div className="h-12 w-full bg-blue-50 border border-blue-100 rounded-lg" />
                   <div className="h-12 w-full bg-blue-50 border border-blue-100 rounded-lg" />
                 </div>
               </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 h-80 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-multiply" />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm border border-slate-200 z-10 flex flex-col gap-4"
               >
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100" />
                    <div>
                      <div className="h-3 w-24 bg-slate-200 rounded mb-1.5" />
                      <div className="h-2 w-16 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100" />
                    <div>
                      <div className="h-3 w-32 bg-slate-200 rounded mb-1.5" />
                      <div className="h-2 w-20 bg-slate-100 rounded" />
                    </div>
                  </div>
               </motion.div>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Network className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Break Departmental Silos</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                The best research happens at the intersection of disciplines. Find co-authors, request lab equipment from other departments, and build a diverse research team from a verified pool of university scholars.
              </p>
            </div>
          </div>
          
        </div>
        <CTASection />
      </main>
      <MarketingFooter />
    </div>
  );
}
