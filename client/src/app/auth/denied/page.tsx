'use client';

import { ShieldAlert, ArrowLeft, ShieldX } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AccessDeniedPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Sync theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = (localStorage.getItem('curiousbees-theme') as 'dark' | 'light') || 'light';
      setTheme(savedTheme);
      const root = window.document.documentElement;
      if (savedTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center px-6 relative overflow-hidden transition-colors duration-300">
      
      {/* Blurred decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-500/5 dark:bg-red-950/[0.03] rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-slate-900/30 border border-red-200 dark:border-red-950/40 rounded-3xl p-8 shadow-2xl text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 flex items-center justify-center text-srm-crimson mx-auto mb-6">
          <ShieldX className="w-6 h-6" />
        </div>

        <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
          Institutional Firewall Alert
        </h2>
        
        <p className="text-xs text-slate-550 dark:text-slate-400 mt-3 leading-relaxed font-semibold">
          The email supplied is not authorized to access the SRM Recollab Intranet portal. 
        </p>

        <div className="my-5 p-4 rounded-xl bg-red-50/50 dark:bg-red-950/15 border border-red-150 dark:border-red-900/30 text-left">
          <p className="text-[11px] text-red-700 dark:text-red-400 font-bold leading-relaxed">
            Only accounts ending with <strong className="underline text-slate-900 dark:text-white">@srmist.edu.in</strong> are permitted. Guest profiles, personal Gmail accounts, or external domains are automatically rejected by our NextAuth firewall.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-slate-900 hover:bg-srm-crimson transition-all text-center cursor-pointer shadow-sm"
          >
            Authenticate with Another Account
          </Link>
          <Link
            href="/"
            className="block w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all text-center flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Return to Landing Portal</span>
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-red-700" />
          <span>Firewall Core Active</span>
        </div>
      </motion.div>
    </div>
  );
}
