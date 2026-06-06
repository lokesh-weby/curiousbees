'use client';

import React from 'react';
import MarketingNavbar from '@/components/marketing/MarketingNavbar';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import CTASection from '@/components/marketing/CTASection';
import { Building2, Activity, ShieldCheck, PieChart } from 'lucide-react';

export default function InstitutionPage() {
  return (
    <div className="bg-white text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-primary/20">
      <MarketingNavbar />
      
      <main className="flex-grow w-full pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-widest mb-4">
              <Building2 className="w-4 h-4" />
              Institutional Administration
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
              Governance and visibility, <br /> unified.
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              Equip your university administration with the tools to oversee research progress, manage faculty workload, and extract powerful analytics on institutional output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Analytics</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Track citation growth, publication volume, and interdepartmental collaboration metrics. Export data directly for accreditation and funding reports.
              </p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Governance Framework</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Enforce structured approval workflows for PhD scholars. Ensure all research passes through necessary ethical and academic checkpoints before publication.
              </p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Faculty Workload</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Gain visibility into supervisor bandwidth. Balance research supervision assignments equitably across departments to maintain high academic standards.
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
