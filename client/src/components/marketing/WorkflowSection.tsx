'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, ShieldCheck, Building2, ArrowRight } from 'lucide-react';

export default function WorkflowSection() {
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            A seamless workflow from <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">proposal to publication.</span>
          </h2>
          <p className="text-slate-500 text-lg">
            CuriousBees orchestrates the entire research lifecycle, ensuring compliance and collaboration at every step.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-slate-100 via-primary/20 to-slate-100 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 group-hover:border-blue-100">
                <UserCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Scholar Node</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                PhD candidates and researchers initiate projects, connect with peers, and draft initial proposals in private sandboxes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 group-hover:border-primary/20">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Supervisor Review</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Faculty guides review, annotate, and approve research drafts. Track scholar milestones and provide structured mentorship.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 group-hover:border-emerald-100">
                <Building2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Institutional Approval</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Research departments gain final oversight. Export compliance reports, citation analytics, and funding requirements seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
