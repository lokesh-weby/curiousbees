'use client';

/**
 * components/shared/dashboard-grid.tsx
 * Bento grid container with responsive column presets.
 *
 * Presets:
 *  - '2-col':  2 equal columns
 *  - '3-col':  3 equal columns
 *  - '2+1':    2 wide + 1 narrow (lg:grid-cols-3 / 2+1)
 *  - '1+2':    1 narrow + 2 wide
 *  - 'auto':   Tailwind custom via className
 */

import React from 'react';
import { cn } from '@/lib/utils';

type GridPreset = '2-col' | '3-col' | '2+1' | '1+2' | 'auto';

interface DashboardGridProps {
  children: React.ReactNode;
  preset?: GridPreset;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

const presetClasses: Record<GridPreset, string> = {
  '2-col': 'grid grid-cols-1 sm:grid-cols-2',
  '3-col': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '2+1':   'grid grid-cols-1 lg:grid-cols-3',
  '1+2':   'grid grid-cols-1 lg:grid-cols-3',
  'auto':  'grid',
};

const gapClasses = {
  sm: 'gap-3',
  md: 'gap-5',
  lg: 'gap-7',
};

export function DashboardGrid({
  children,
  preset = '3-col',
  gap = 'md',
  className,
}: DashboardGridProps) {
  return (
    <div className={cn(presetClasses[preset], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

/** Span helper to stretch a child across all columns in a DashboardGrid */
export function GridFullWidth({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('col-span-full', className)}>{children}</div>;
}

/** Span 2 columns in a 3-col or 2+1 grid */
export function GridWide({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('lg:col-span-2', className)}>{children}</div>;
}
