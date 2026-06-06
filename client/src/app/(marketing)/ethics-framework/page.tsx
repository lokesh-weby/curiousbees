'use client';

import React from 'react';
import MarketingNavbar from '@/components/marketing/MarketingNavbar';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import { Scale, BookCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function EthicsFrameworkPage() {
  return (
    <div className="bg-white text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-primary/20">
      <MarketingNavbar />
      
      <main className="flex-grow w-full pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900">
              Ethics Framework
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              The foundation of impactful research is integrity. CuriousBees enforces a strict ethical framework aligned with global academic standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Academic Integrity</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We strictly prohibit data falsification, fabrication, and misrepresentation. All data uploaded to the platform must represent genuine experimental or analytical results. Researchers are expected to maintain meticulous records of their methodologies.
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Anti-Plagiarism</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Originality is the core of academic contribution. CuriousBees workflows integrate with institutional plagiarism detection tools. Submitting another researcher's work, ideas, or language without proper citation is a severe violation.
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Responsible AI Usage</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                While AI tools (including LLMs) can assist in drafting and data analysis, they must not replace the critical thinking of the researcher. All AI-generated content must be explicitly disclosed, and researchers remain solely responsible for the accuracy of their output.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                <BookCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Transparent Collaboration</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Authorship must accurately reflect individual contributions. All collaborators who meaningfully contribute to a project must be credited, and ghost authorship or honorary authorship is prohibited.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 text-center">
             <h3 className="text-lg font-bold text-slate-900 mb-2">Reporting Violations</h3>
             <p className="text-slate-600 text-sm max-w-2xl mx-auto">
               If you suspect a violation of this Ethics Framework, it is your responsibility as a member of the academic community to report it to your Institutional Administrator or Research Supervisor immediately.
             </p>
          </div>
          
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
