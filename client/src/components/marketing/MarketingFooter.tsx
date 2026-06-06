'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '../Logo';

export default function MarketingFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <Logo showText={true} size={28} />
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">
              Elevating academic research through structured collaboration, transparent supervision, and institutional intelligence.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-4 text-sm">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/research" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Research</Link></li>
              <li><Link href="/education" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Education</Link></li>
              <li><Link href="/institution" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Institution</Link></li>
              <li><Link href="/about" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-4 text-sm">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/ethics-framework" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Ethics Framework</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Contact Support</Link></li>
              <li><Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Sign In</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-4 text-sm">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy-policy" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CuriousBees. Designed for academic excellence.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-slate-600">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
