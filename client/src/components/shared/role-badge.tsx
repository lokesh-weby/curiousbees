'use client';

/**
 * components/shared/role-badge.tsx
 * Standalone role badge chip extracted from Navbar.
 * Used in profile cards, user tables, and the Navbar itself.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/shared/types';

const ROLE_LABELS: Record<UserRole, string> = {
  RESEARCH_SUPERVISOR:     'Supervisor',
  RESEARCH_SCHOLAR: 'Scholar',
  INSTITUTION_ADMIN:       'Admin',
};

const ROLE_STYLES: Record<UserRole, string> = {
  INSTITUTION_ADMIN:       'bg-error-container text-on-error-container border-error/20',
  RESEARCH_SUPERVISOR:     'bg-primary-container text-on-primary-container border-primary/20',
  RESEARCH_SCHOLAR: 'bg-success-container text-on-success-container border-success/20',
};

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
  size?: 'sm' | 'md';
}

export function RoleBadge({ role, className, size = 'md' }: RoleBadgeProps) {
  const sizeClass = size === 'sm'
    ? 'px-1.5 py-0.5 text-[9px]'
    : 'px-2.5 py-0.5 text-[10px]';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-black uppercase tracking-wider border',
        sizeClass,
        ROLE_STYLES[role],
        className
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
