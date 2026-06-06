'use client';

import React from 'react';
import MarketingNavbar from '@/components/marketing/MarketingNavbar';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import CTASection from '@/components/marketing/CTASection';
import { BookOpen, GraduationCap, PenTool, Lightbulb } from 'lucide-react';

export default function EducationPage() {
  return (
    <div className="bg-white text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-primary/20">
      <MarketingNavbar />
      
      <main className="flex-grow w-full pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
              <GraduationCap className="w-4 h-4" />
              Academic Growth
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
              Master the methodology of research.
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              Gain access to structured learning pathways, methodology templates, and continuous mentorship to elevate the quality of your academic output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Structured Methodology</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Access a library of university-approved templates for literature reviews, quantitative analyses, and qualitative studies. Ensure your methodology is rigorous from day one.
              </p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Knowledge Sharing</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Learn from the successes and challenges of your peers. Participate in interdepartmental forums and read open drafts to understand successful proposal patterns.
              </p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center mb-6">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Collaborative Drafting</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Utilize integrated collaboration tools to co-author papers. Receive inline feedback from supervisors and ensure academic integrity before external submission.
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
