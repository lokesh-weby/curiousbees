'use client';

import React from 'react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-primary/5 pattern-dots pattern-slate-300 pattern-bg-transparent pattern-size-4 pattern-opacity-100" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-3xl p-12 md:p-16">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Ready to shape the future of research?
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the leading minds at SRMIST. Establish your workspace, connect with peers, and elevate your research impact on a platform built for academic excellence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <button className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 px-8 py-4 rounded-full text-sm font-bold transition-all shadow-lg active:scale-95">
                Register Your Project
              </button>
            </Link>
            <Link href="/contact">
              <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-full text-sm font-bold transition-all active:scale-95">
                Contact Administration
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
