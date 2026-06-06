'use client';

/**
 * components/shared/dashboard-shell.tsx
 * Wraps the main content area of each dashboard page with consistent
 * vertical rhythm, spacing, and optional honeycomb background layer.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardShellProps {
  children: React.ReactNode;
  className?: string;
  withBackground?: boolean;
}

export function DashboardShell({
  children,
  className,
  withBackground = false,
}: DashboardShellProps) {
  return (
    <div
      className={cn(
        'w-full max-w-container-max mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col gap-8',
        withBackground && 'bg-honeycomb-stroke',
        className
      )}
    >
      {children}
    </div>
  );
}
