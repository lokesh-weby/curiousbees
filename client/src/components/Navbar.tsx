'use client';

/**
 * Navbar.tsx — Top navigation bar with mobile hamburger, role badge, and dev banner.
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Search, Bell, Sparkles, MessageSquare, Settings, AlertTriangle, X, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SpotlightSearch from './SpotlightSearch';
import { cn } from '@/lib/utils';
import { ROLE_LABELS } from '@/lib/auth/role-mapping';
import { RoleBadge } from './shared/role-badge';
import type { UserRole } from '@/shared/types';

const IS_DEV = process.env.NODE_ENV === 'development';

// Role badge accent colors for the Navbar inline badge
const ROLE_BADGE_STYLES: Record<UserRole, string> = {
  INSTITUTION_ADMIN:       'bg-rose-50 text-rose-700 border-rose-200',
  RESEARCH_SUPERVISOR:     'bg-indigo-50 text-indigo-700 border-indigo-200',
  RESEARCH_SCHOLAR: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, showMobileSidebar, setMobileSidebar } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [devBannerVisible, setDevBannerVisible] = useState(IS_DEV);

  // Listen for global keyboard shortcut (CMD+K or CTRL+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const role = currentUser?.role;

  return (
    <>
      {/* ─── DEV-ONLY WARNING BANNER ─────────────────────────────────── */}
      {IS_DEV && devBannerVisible && currentUser && (
        <div className="relative z-40 w-full bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-700 text-[11px] font-semibold min-w-0">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 animate-pulse" />
            <span className="truncate">
              <span className="font-black uppercase tracking-wider">DEV MODE</span>
              {' '}— Signed in as <span className="font-black">{currentUser.email}</span>
              {' '}→ <span className="font-black">{currentUser.role}</span>
            </span>
          </div>
          <button
            onClick={() => setDevBannerVisible(false)}
            className="text-amber-500 hover:text-amber-700 transition-colors shrink-0 cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── MAIN NAVBAR ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 h-16 w-full bg-surface/90 backdrop-blur-md border-b border-outline-variant/25 flex items-center justify-between px-4 md:px-margin-desktop gap-3">

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileSidebar(!showMobileSidebar)}
          className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0 cursor-pointer"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div
            onClick={() => setIsSearchOpen(true)}
            className="relative flex items-center group cursor-pointer"
          >
            <Search className="absolute left-3 w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0" />
            <div className="w-full bg-transparent border-0 border-b border-outline-variant/50 group-hover:border-primary pl-9 pr-8 py-1.5 text-[13px] text-on-surface-variant/70 select-none transition-all text-left">
              <span className="hidden sm:inline">Search research, papers, or colleagues...</span>
              <span className="sm:hidden">Search...</span>
            </div>
            <Sparkles className="absolute right-2 w-4 h-4 text-primary opacity-60 shrink-0" />
          </div>
        </div>

        {/* Trailing actions */}
        <div className="flex items-center gap-1 md:gap-3 text-on-surface-variant shrink-0">

          {/* Role Badge — visible on all sizes */}
          {role && (
            <RoleBadge role={role} size="sm" className="hidden sm:inline-flex" />
          )}

          {/* Discussions */}
          <Link
            href="/threads"
            className="p-2 rounded-full hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-center"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>

          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-center cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>

          {/* Settings */}
          <Link
            href="/profile"
            className="p-2 rounded-full hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-center"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* Avatar */}
          <div className="ml-1 h-8 w-8 rounded-full bg-surface-variant border border-outline-variant overflow-hidden shadow-sm shrink-0">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src={
                currentUser?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=004495&color=fff&size=64`
              }
            />
          </div>
        </div>
      </header>

      {/* Spotlight Search overlay */}
      <SpotlightSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
