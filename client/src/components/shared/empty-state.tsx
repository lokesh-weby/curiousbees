'use client';

/**
 * components/shared/empty-state.tsx
 * Consistent empty state for tables, feeds, and dashboard sections.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center text-center',
        compact ? 'py-10 gap-2' : 'py-20 gap-3',
        'border border-dashed border-outline-variant/50 rounded-xl bg-surface-container-low/40',
        className
      )}
    >
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant mb-1">
          {icon}
        </div>
      )}
      <p className="font-display font-semibold text-sm text-on-surface">{title}</p>
      {description && (
        <p className="text-xs text-on-surface-variant max-w-xs">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
