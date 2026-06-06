'use client';

/**
 * Sidebar.tsx — Premium role-aware navigation with dynamic layouts.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  User,
  LogOut,
  Calendar as CalendarIcon,
  Users,
  FolderOpen,
  Shield,
  UserCog,
  X,
  ChevronRight,
  ChevronDown,
  BookOpen,
  BarChart3,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { RoleBadge } from '../shared/role-badge';
import type { UserRole } from '@/shared/types';

// ─── Sidebar Dynamic Navigation Config ────────────────────────────────────────

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const getSidebarSections = (role: UserRole): SidebarSection[] => {
  if (role === 'INSTITUTION_ADMIN') {
    return [
      {
        label: 'Admin Console',
        items: [
          { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'User Management', href: '/admin/users', icon: UserCog },
          { name: 'Supervisors', href: '/admin/supervisors', icon: Shield },
          { name: 'Departments', href: '/admin/departments', icon: FolderOpen },
          { name: 'Platform Analytics', href: '/admin/analytics', icon: BarChart3 },
          { name: 'System Settings', href: '/admin/settings', icon: Shield },
          { name: 'Researchers Directory', href: '/researchers', icon: Users },
          { name: 'Notifications Log', href: '/notifications', icon: MessageSquare },
        ],
      },
    ];
  }

  const researchPortalSection = {
    label: 'Research Portal',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Researchers', href: '/researchers', icon: Users },
      { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
      { name: 'Workspaces', href: '/workspace', icon: FolderOpen },
      { name: 'Research Feed', href: '/threads', icon: MessageSquare },
      { name: 'Events', href: '/events', icon: CalendarIcon },
    ],
  };

  if (role === 'RESEARCH_SUPERVISOR') {
    return [
      researchPortalSection,
      {
        label: 'Faculty Advisory',
        items: [
          { name: 'My Scholars', href: '/my-scholars', icon: UserCog },
          { name: 'Approval Requests', href: '/approval-requests', icon: Clock },
          { name: 'Publications Audit', href: '/publications', icon: BookOpen },
          { name: 'Advisory Reports', href: '/reports', icon: BarChart3 },
        ],
      },
    ];
  }

  // Scholar
  return [
    researchPortalSection,
    {
      label: 'Scholar Portfolio',
      items: [
        { name: 'My Publications', href: '/publications', icon: BookOpen },
        { name: 'Progress Reports', href: '/reports', icon: BarChart3 },
      ],
    },
  ];
};

// ─── Nav Item Component ────────────────────────────────────────────────────────

function NavItem({
  name,
  href,
  icon: Icon,
  active,
  onClick,
  hoveredItem,
  setHoveredItem,
}: {
  name: string;
  href: string;
  icon: React.ElementType;
  active: boolean;
  onClick?: () => void;
  hoveredItem: string | null;
  setHoveredItem: (name: string | null) => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHoveredItem(name)}
      onMouseLeave={() => setHoveredItem(null)}
      className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors duration-200 select-none group"
    >
      {/* Sliding Backdrop Pill */}
      {hoveredItem === name && (
        <motion.span
          layoutId="sidebar-backdrop"
          className="absolute inset-0 bg-primary/5 rounded-lg z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}

      {/* Active State Indicator */}
      {active && (
        <motion.span
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-primary rounded-full z-10"
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      )}

      <Icon
        className={cn(
          'w-[18px] h-[18px] shrink-0 transition-colors duration-200 relative z-10',
          active ? 'text-primary' : 'text-textSecondary group-hover:text-primary'
        )}
      />
      <span
        className={cn(
          'truncate leading-none relative z-10 transition-colors duration-200',
          active ? 'text-primary font-bold' : 'text-textSecondary group-hover:text-black'
        )}
      >
        {name}
      </span>
      {active && (
        <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary relative z-10" />
      )}
    </Link>
  );
}

// ─── Collapsible Nav Section ─────────────────────────────────────────────────

function NavSection({ 
  label, 
  isOpen, 
  onToggle 
}: { 
  label: string; 
  isOpen: boolean; 
  onToggle: () => void 
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-textSecondary hover:text-black transition-colors select-none text-left cursor-pointer group"
    >
      <span>{label}</span>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-textSecondary" />
        ) : (
          <ChevronRight className="w-3 h-3 text-textSecondary" />
        )}
      </span>
    </button>
  );
}

// ─── Sidebar Content ──────────────────────────────────────────────────────────

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { currentUser, logout } = useStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Collapsible section states
  const [sectionsOpen, setSectionsOpen] = useState<Record<string, boolean>>({
    'Research Portal': true,
    'Scholar Portfolio': true,
    'Faculty Advisory': true,
    'Admin Console': true,
  });

  const toggleSection = (label: string) => {
    setSectionsOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const role = currentUser?.role || 'RESEARCH_SCHOLAR';
  const sections = getSidebarSections(role);

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/admin') {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="flex flex-col h-full py-5 bg-white">
      {/* Brand + Close (mobile) */}
      <div className="flex items-center justify-between px-5 mb-6">
        <Logo showText={true} size={32} />
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-textSecondary hover:bg-surface-container transition-colors cursor-pointer md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 flex flex-col gap-2">
        {sections.map((section) => {
          const isOpen = sectionsOpen[section.label] !== false;
          return (
            <div key={section.label}>
              <NavSection 
                label={section.label} 
                isOpen={isOpen} 
                onToggle={() => toggleSection(section.label)} 
              />
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-0.5 mt-1"
                  >
                    {section.items.map((item) => (
                      <NavItem
                        key={item.href + item.name}
                        {...item}
                        active={isActive(item.href)}
                        onClick={onClose}
                        hoveredItem={hoveredItem}
                        setHoveredItem={setHoveredItem}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* User mini-profile */}
      <div className="px-3 pt-3 mt-auto border-t border-borderStroke/50">
        {currentUser && (
          <div className="px-3 py-3 rounded-xl bg-surface-container-low/40 mb-3 border border-borderStroke/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-borderStroke shrink-0">
              <img
                src={currentUser.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name || 'User') + '&background=004495&color=fff&size=64'}
                alt={currentUser.name || 'User'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-black truncate leading-tight">{currentUser.name || 'Researcher'}</p>
              {role && <RoleBadge role={role} size="sm" className="mt-1" />}
            </div>
          </div>
        )}

        <Link
          href="/profile"
          onClick={onClose}
          onMouseEnter={() => setHoveredItem('profile')}
          onMouseLeave={() => setHoveredItem(null)}
          className={cn(
            'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors duration-200 mb-1',
            pathname === '/profile' ? 'text-primary font-bold' : 'text-textSecondary hover:text-black'
          )}
        >
          {hoveredItem === 'profile' && (
            <motion.span
              layoutId="sidebar-backdrop"
              className="absolute inset-0 bg-primary/5 rounded-lg z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
          {pathname === '/profile' && (
            <motion.span
              layoutId="sidebar-active-indicator"
              className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-primary rounded-full z-10"
            />
          )}
          <User className="w-[18px] h-[18px] shrink-0 relative z-10" />
          <span className="relative z-10">My Profile</span>
        </Link>

        <button
          onClick={() => { logout(); onClose?.(); }}
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
          className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-textSecondary hover:text-error transition-colors duration-200 cursor-pointer text-left"
        >
          {hoveredItem === 'logout' && (
            <motion.span
              layoutId="sidebar-backdrop"
              className="absolute inset-0 bg-error/5 rounded-lg z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
          <LogOut className="w-[18px] h-[18px] shrink-0 relative z-10" />
          <span className="relative z-10">Exit Portal</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { showMobileSidebar, setMobileSidebar } = useStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] bg-white border-r border-borderStroke h-screen sticky top-0 z-40 shrink-0 font-sans">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-50 bg-black/35 backdrop-blur-[1px]"
              onClick={() => setMobileSidebar(false)}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-[51] w-[280px] bg-white border-r border-borderStroke shadow-2xl font-sans"
            >
              <SidebarContent onClose={() => setMobileSidebar(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
