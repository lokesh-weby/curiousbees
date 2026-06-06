'use client';

/**
 * Navbar.tsx — Top navigation bar with floating glassmorphic container, dynamic breadcrumbs, and integrated dropdowns.
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Search, Sparkles, MessageSquare, AlertTriangle, X, Menu, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SpotlightSearch from '../SpotlightSearch';
import { cn } from '@/lib/utils';
import { NotificationDropdown } from '../shared/notification-dropdown';
import { ProfileDropdown } from '../shared/profile-dropdown';

const IS_DEV = process.env.NODE_ENV === 'development';

const PATH_MAP: Record<string, string> = {
  'dashboard': 'Dashboard',
  'threads': 'Research Feed',
  'researchers': 'Researchers',
  'opportunities': 'Opportunities',
  'workspace': 'Workspaces',
  'events': 'Events',
  'search': 'AI Search',
  'pipeline': 'AI Pipeline',
  'analytics': 'Analytics',
  'copilot': 'Ask Copilot',
  'profile': 'My Profile',
  'admin': 'Admin Panel',
  'create': 'New Proposal',
  'supervisor': 'Scholar Management',
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

  // Generate dynamic breadcrumbs
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'CuriousBees', href: '/dashboard' }];

    let currentHref = '';
    segments.forEach((segment, index) => {
      currentHref += `/${segment}`;
      
      // Attempt to map segment to display name
      let name = PATH_MAP[segment.toLowerCase()];
      
      if (!name) {
        // Fallback for UUID/dynamic parameters
        if (segments[index - 1]?.toLowerCase() === 'workspace') {
          name = 'Workspace Details';
        } else if (segments[index - 1]?.toLowerCase() === 'threads') {
          name = 'Thread Details';
        } else {
          name = segment.charAt(0).toUpperCase() + segment.slice(1);
        }
      }
      
      breadcrumbs.push({ name, href: currentHref });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      {/* ─── DEV-ONLY WARNING BANNER ─────────────────────────────────── */}
      {IS_DEV && devBannerVisible && currentUser && (
        <div className="relative z-45 w-full bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between gap-3 font-sans">
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
      <header className="sticky top-0 z-30 h-16 w-full bg-white/80 backdrop-blur-md border-b border-borderStroke flex items-center justify-between px-4 md:px-8 gap-3 font-sans">
        
        {/* Leading section: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileSidebar(!showMobileSidebar)}
            className="md:hidden p-2 rounded-lg text-textSecondary hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb Trail */}
          <nav className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-textSecondary min-w-0">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={`${crumb.href}-${idx}`}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-textSecondary/40" />}
                <Link
                  href={crumb.href}
                  className={cn(
                    'truncate transition-colors hover:text-black',
                    idx === breadcrumbs.length - 1 ? 'text-black font-bold' : ''
                  )}
                >
                  {crumb.name}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Trailing actions */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0 text-textSecondary">
          
          {/* Global Search Clickable Zone */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-borderStroke/70 hover:border-borderStroke hover:bg-slate-50 transition-all text-[12.5px] cursor-pointer text-left w-36 md:w-56"
          >
            <Search className="w-3.5 h-3.5 text-textSecondary shrink-0" />
            <span className="truncate text-textSecondary/60 flex-1">Search...</span>
            <kbd className="hidden md:inline-flex h-4 select-none items-center gap-0.5 rounded border border-borderStroke/55 bg-white px-1.5 font-mono text-[9px] font-bold text-textSecondary/60 shadow-sm leading-none">
              ⌘K
            </kbd>
          </button>

          {/* Discussions feed shortcut */}
          <Link
            href="/threads"
            className="p-2 rounded-full hover:bg-slate-50 hover:text-primary transition-colors flex items-center justify-center"
            title="Research Feed"
          >
            <MessageSquare className="w-4.5 h-4.5" />
          </Link>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Profile Menu */}
          <ProfileDropdown />

        </div>
      </header>

      {/* Spotlight Search overlay */}
      <SpotlightSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

