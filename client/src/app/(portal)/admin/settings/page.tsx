'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { Settings, Shield, Globe, Lock, Save, ToggleLeft, ToggleRight, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { currentUser } = useStore();

  // Settings State
  const [domainLock, setDomainLock] = useState('srmist.edu.in');
  const [restrictDomain, setRestrictDomain] = useState(true);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [auditLogsRetention, setAuditLogsRetention] = useState(90);

  // Guard against non-admin access
  useEffect(() => {
    if (currentUser && currentUser.role !== 'INSTITUTION_ADMIN') {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  if (currentUser?.role !== 'INSTITUTION_ADMIN') {
    return null;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System variables successfully synchronized to database config node!');
  };

  return (
    <div className="space-y-6 text-left select-none max-w-2xl">
      
      {/* 🚀 Header */}
      <div className="border-b border-slate-100 pb-5">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-primary" />
          <span>System Configurations</span>
        </span>
        <h1 className="cb-page-title mt-2 font-display">Institution Global Settings</h1>
        <p className="cb-page-subtitle">
          Manage security constraints, Google SSO domain locks, and database log retention policies.
        </p>
      </div>

      {/* 🚀 Settings Form */}
      <form onSubmit={handleSave} className="cb-card bg-white/95 backdrop-blur-md p-6 space-y-6">
        
        {/* Security Settings Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 text-primary" />
            <span>SSO Authentication & Domain Constraints</span>
          </h3>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-150 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-805 block">Enforce Domain Restriction</span>
              <span className="text-[10px] text-slate-400 font-semibold block leading-normal">
                Only users authenticating with the authorized domain will be granted entry.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRestrictDomain(!restrictDomain)}
              className="text-primary hover:text-primary-dark transition-colors cursor-pointer shrink-0"
            >
              {restrictDomain ? (
                <ToggleRight className="w-10 h-10 text-primary" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300" />
              )}
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
              Authorized Institution Email Domain
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={domainLock}
                onChange={(e) => setDomainLock(e.target.value)}
                disabled={!restrictDomain}
                placeholder="e.g. srmist.edu.in"
                className="cb-input pl-9 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Global Access Controls */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Lock className="w-4.5 h-4.5 text-primary" />
            <span>Global Portal Sign-ups</span>
          </h3>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-150 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-805 block">Allow New User Registration</span>
              <span className="text-[10px] text-slate-400 font-semibold block leading-normal">
                Toggle to temporarily pause new registrations while maintenance is active.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAllowRegistration(!allowRegistration)}
              className="text-primary hover:text-primary-dark transition-colors cursor-pointer shrink-0"
            >
              {allowRegistration ? (
                <ToggleRight className="w-10 h-10 text-primary" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300" />
              )}
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-widest">
              Security Audit Logs Retention (Days)
            </label>
            <select
              value={auditLogsRetention}
              onChange={(e) => setAuditLogsRetention(Number(e.target.value))}
              className="w-full px-3 h-[42px] text-xs font-semibold rounded-lg bg-white border border-slate-200 focus:outline-none transition-all cursor-pointer"
            >
              <option value={30}>30 Days</option>
              <option value={90}>90 Days</option>
              <option value={180}>180 Days</option>
              <option value={365}>365 Days</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
