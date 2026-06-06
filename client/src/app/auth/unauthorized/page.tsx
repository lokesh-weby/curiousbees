'use client';

import { ShieldAlert, ArrowLeft, ShieldX, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { ROLE_LABELS } from '@/lib/auth/role-mapping';
import { getDashboardRoute } from '@/lib/auth/route-protection';
import type { UserRole } from '@/shared/types';

export default function UnauthorizedPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [attemptedPath, setAttemptedPath] = useState<string | null>(null);
  const { currentUser, dashboardRoute } = useStore();

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

      // Read attempted path from URL params
      const params = new URLSearchParams(window.location.search);
      const from = params.get('from');
      if (from) setAttemptedPath(from);
    }
  }, []);

  const userRoleLabel = currentUser?.role ? ROLE_LABELS[currentUser.role as UserRole] : null;
  const correctDashboard = currentUser
    ? getDashboardRoute(currentUser)
    : '/login';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center px-6 relative overflow-hidden transition-colors duration-300">

      {/* Decorative blur orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-950/[0.04] rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/50 rounded-3xl p-8 shadow-2xl text-center"
      >
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-6">
          <ShieldX className="w-7 h-7" />
        </div>

        {/* Heading */}
        <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
          Access Restricted
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed font-semibold">
          You don't have permission to view this page.
        </p>

        {/* Context block */}
        <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 text-left space-y-2">
          {userRoleLabel && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Your role</span>
              <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 rounded-full font-black uppercase tracking-wider">
                {userRoleLabel}
              </span>
            </div>
          )}
          {attemptedPath && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Attempted route</span>
              <code className="text-rose-600 dark:text-rose-400 font-mono font-bold bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/40">
                {attemptedPath}
              </code>
            </div>
          )}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1">
            This area requires a higher privilege level. If you believe this is an error, contact your institutional administrator.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href={correctDashboard}
            className="block w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 transition-all text-center cursor-pointer shadow-sm"
          >
            Go to My Dashboard
          </Link>
          <Link
            href="/login"
            className="block w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all text-center flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Switch Account</span>
          </Link>
        </div>

        {/* Footer note */}
        <div className="mt-8 flex items-center justify-center space-x-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-indigo-500" />
          <span>CuriousBees RBAC Active</span>
        </div>
      </motion.div>
    </div>
  );
}
