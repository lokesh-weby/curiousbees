'use client';

/**
 * components/shared/loading-skeleton.tsx
 * Unified skeleton loader variants for all dashboard sections.
 */

import React from 'react';
import { cn } from '@/lib/utils';

function SkeletonBase({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-container-high rounded',
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('cb-card p-5 space-y-3', className)}>
      <SkeletonBase className="h-3 w-20" />
      <SkeletonBase className="h-8 w-32" />
      <SkeletonBase className="h-3 w-full" />
    </div>
  );
}

export function SkeletonMetric({ className }: { className?: string }) {
  return (
    <div className={cn('cb-card p-5 flex flex-col gap-3', className)}>
      <div className="flex justify-between">
        <SkeletonBase className="h-3 w-24" />
        <SkeletonBase className="h-8 w-8 rounded-lg" />
      </div>
      <SkeletonBase className="h-9 w-28" />
      <SkeletonBase className="h-5 w-16 rounded-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('cb-card overflow-hidden', className)}>
      <div className="cb-table-header px-4 py-3 flex gap-6">
        {[40, 60, 30, 40].map((w, i) => (
          <SkeletonBase key={i} className={`h-2.5`} style={{ width: `${w}px` }} />
        ))}
      </div>
      <div className="divide-y divide-outline-variant/20">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3.5 flex gap-6 items-center">
            <SkeletonBase className="h-7 w-7 rounded-full shrink-0" />
            <SkeletonBase className="h-3 w-32" />
            <SkeletonBase className="h-3 w-24" />
            <SkeletonBase className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="cb-card p-4 flex items-center gap-3">
          <SkeletonBase className="h-9 w-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBase className="h-3 w-3/4" />
            <SkeletonBase className="h-2.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
