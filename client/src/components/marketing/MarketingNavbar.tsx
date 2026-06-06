'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '../Logo';

export default function MarketingNavbar() {
  return (
    <header className="bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 fixed top-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo showText={true} size={32} />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/research" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Research
          </Link>
          <Link href="/education" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Education
          </Link>
          <Link href="/institution" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Institution
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link href="/login">
            <button className="bg-slate-900 text-white hover:bg-slate-800 px-5 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md active:scale-95">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
