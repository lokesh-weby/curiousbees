'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { signInWithGoogle, auth } from '@/lib/firebase';

import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { getDashboardRoute } from '@/lib/auth/route-protection';
import { 
  ArrowLeft, 
  AlertTriangle,
  GraduationCap,
  User,
  Shield,
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Logo from '@/components/Logo';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { syncUserSession, currentUser, dashboardRoute } = useStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Show access denied if redirected with error param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const err = params.get('error');
      if (err === 'access_denied') {
        setErrorMsg('Your account could not be synced with CuriousBees. Please try again or contact the administrator.');
      }
    }
  }, []);

  // Sync session on mount
  useEffect(() => {
    syncUserSession();
  }, [syncUserSession]);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push(dashboardRoute || '/dashboard');
    }
  }, [currentUser, dashboardRoute, router]);

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setAuthLoading(true);

    try {
      const { user, token } = await signInWithGoogle();
      console.info('[AUTH] Google sign-in completed, starting backend sync:', {
        uid: user.uid,
        email: user.email,
        tokenLength: token.length,
      });

      const syncedUser = await syncUserSession({ throwOnError: true });
      if (syncedUser) {


        const route = getDashboardRoute(syncedUser);

        console.info('[AUTH] Email:', syncedUser.email);
        console.info('[AUTH] Detected Role:', syncedUser.role);
        console.info('[AUTH] Approved Status:', syncedUser.approved);
        console.info('[AUTH] Redirect Route:', route);

        router.push(route);
      } else {
        await signOut(auth);
        setErrorMsg('CuriousBees could not sync your Google session with the backend.');
      }
    } catch (e: any) {
      console.error('[AUTH] Login failed:', e);
      await signOut(auth).catch(() => {});
      if (e.message?.includes('auth/api-key-not-valid') || e.code?.includes('api-key-not-valid')) {
        setErrorMsg('Security Alert: The Firebase API key configured is invalid. Please contact the administrator.');
      } else {
        setErrorMsg(e.message || 'Authentication aborted or failed.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col md:flex-row relative overflow-hidden font-sans">
      
      {/* Decorative background grid pattern for top-level depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* Back to Home Link */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center space-x-2 text-xs font-bold text-textSecondary hover:text-primary transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return home</span>
      </Link>

      {/* Left Pane: Brand & Visual Telemetry */}
      <section className="relative hidden md:flex w-[42%] bg-[#0d3c61] text-white p-12 flex-col justify-between overflow-hidden shrink-0 border-r border-slate-900/10">
        
        {/* Soft floating glow particles background mesh */}
        <div className="absolute -top-16 -left-16 w-96 h-96 bg-primary/20 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-secondary/15 rounded-full filter blur-[100px] pointer-events-none" />

        {/* Logo and Brand */}
        <div className="relative z-10">
          <Logo theme="dark" size={40} showText={true} />
        </div>

        {/* Narrative Feature presentation */}
        <div className="relative z-10 space-y-6 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-3 text-left"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest text-[#fec727]">
              <Sparkles className="w-3 h-3" />
              Academic Portal V2
            </span>
            <h2 className="text-3xl font-bold font-display leading-tight tracking-tight text-white">
              Redefining Scholar Collaboration.
            </h2>
            <p className="text-sm text-slate-350 leading-relaxed font-medium">
              A high-performance intranet space for SRMIST research coordinators, mentors, and doctoral candidates to share insights, track opportunities, and monitor milestones.
            </p>
          </motion.div>

          <div className="h-px bg-white/10 w-full" />

          {/* Quick Metrics highlights */}
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Researchers</p>
              <h4 className="text-2xl font-bold font-display mt-1">450+</h4>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Department Labs</p>
              <h4 className="text-2xl font-bold font-display mt-1">32</h4>
            </div>
          </div>
        </div>

        {/* Brand Signoff */}
        <div className="relative z-10 text-left">
          <p className="text-xs text-slate-450 font-medium">
            Powered by SRMIST Intranet Auth Infrastructure.
          </p>
        </div>
      </section>

      {/* Right Pane: Login Card Form Container */}
      <section className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[390px] space-y-8">
          
          {/* Header */}
          <div className="text-left space-y-2">
            {/* Show logo on mobile only */}
            <div className="md:hidden mb-6 flex justify-start">
              <Logo size={42} showText={true} />
            </div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-black">
              Sign In
            </h1>
            <p className="text-sm text-textSecondary font-semibold">
              Enter your credentials to access the researcher node.
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                className="overflow-hidden text-left"
              >
                <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3.5 flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed font-semibold">{errorMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Sign-in button */}
          <div className="space-y-4 text-left">
            <button 
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-borderStroke hover:border-[#004495] hover:bg-[#004495]/5 transition-all duration-300 py-3 px-4 rounded-lg text-black font-semibold text-[13.5px] shadow-sm disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {authLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />
              ) : (
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
              )}
              <span>Continue with Google Workspace</span>
            </button>

          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-borderStroke/60 w-full text-center">
            <p className="text-[11px] text-textSecondary/50 flex items-center justify-center gap-1.5 font-bold uppercase select-none">
              <Shield className="w-3.5 h-3.5 text-textSecondary/40 shrink-0" />
              <span>SRMIST Institutional Security Standard</span>
            </p>
          </div>

        </div>
      </section>
      
    </div>
  );
}

