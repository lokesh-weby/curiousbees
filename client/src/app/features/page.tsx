'use client';

import React from 'react';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-darkBg text-textPrimary flex flex-col justify-between selection:bg-black selection:text-white font-sans">
      
      {/* STICKY TOP NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-borderStroke px-10 h-[60px] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* RC square monogram */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-7 h-7 bg-black flex items-center justify-center font-display font-bold text-white text-[13px] tracking-tight rounded-sm">
                RC
              </div>
              <span className="font-sans font-semibold text-[15px] tracking-tight text-black">
                CuriousBees
              </span>
            </div>
          </Link>
          <span className="bg-darkSurfaceMuted border border-borderStroke text-textSecondary text-[11px] font-sans px-2 py-0.5 rounded-full">
            SRM IST
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/about" className="hidden sm:block text-textSecondary font-sans font-medium text-[14px] hover:text-black transition-colors">
            About
          </Link>
          <Link href="/features" className="hidden sm:block text-black font-sans font-medium text-[14px] transition-colors">
            Features
          </Link>
          <Link href="/login">
            <button className="h-[40px] px-5 bg-black hover:bg-[#222222] text-white font-sans font-semibold text-[14px] rounded-lg transition-colors cursor-pointer">
              Sign In
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center py-20 px-10 text-center">
        <h1 className="font-display font-light text-[48px] text-black tracking-tighter leading-[1.1] max-w-3xl mb-6">
          Platform Features
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1000px] w-full mt-10">
          <div className="bg-white p-8 rounded-xl border border-borderStroke text-left">
            <div className="w-10 h-10 bg-darkSurfaceMuted rounded-lg flex items-center justify-center mb-6">
              <span className="text-xl">🤖</span>
            </div>
            <h3 className="font-sans font-semibold text-[18px] text-black mb-3">AI Ingestion</h3>
            <p className="text-textSecondary text-[14px] leading-relaxed">
              Automatically parse campus emails, documents, and notices into structured research data using Gemini and Supabase Vector.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl border border-borderStroke text-left">
            <div className="w-10 h-10 bg-darkSurfaceMuted rounded-lg flex items-center justify-center mb-6">
              <span className="text-xl">📅</span>
            </div>
            <h3 className="font-sans font-semibold text-[18px] text-black mb-3">Smart Calendar</h3>
            <p className="text-textSecondary text-[14px] leading-relaxed">
              Never miss a viva or seminar. All academic events are extracted and synced automatically to a central portal feed.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl border border-borderStroke text-left">
            <div className="w-10 h-10 bg-darkSurfaceMuted rounded-lg flex items-center justify-center mb-6">
              <span className="text-xl">🤝</span>
            </div>
            <h3 className="font-sans font-semibold text-[18px] text-black mb-3">Unified Directory</h3>
            <p className="text-textSecondary text-[14px] leading-relaxed">
              Find exactly the right expert or PhD vacancy. We use embeddings to match your research interests with active projects.
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-black text-white py-[60px] px-10 border-t border-[#222222]">
        <div className="max-w-[1280px] w-full mx-auto flex flex-col items-center justify-center">
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="w-7 h-7 bg-white text-black flex items-center justify-center font-display font-bold text-[13px] rounded-sm">
              RC
            </div>
            <span className="font-sans font-semibold text-[15px] tracking-tight">CuriousBees</span>
          </div>
          <p className="text-[14px] text-[#888888] font-sans leading-relaxed text-center mb-8">
            Automated SRM Intranet.
          </p>
          <div className="w-full border-t border-[#222222] pt-[24px] text-[13px] text-[#555555] font-sans text-center">
            <p>© {new Date().getFullYear()} CuriousBees · SRM Institute of Science & Technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
