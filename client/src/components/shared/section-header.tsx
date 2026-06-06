'use client';

/**
 * components/shared/section-header.tsx
 * Standardized section-level header with title, description, and actions slot.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  border?: boolean;
}

export function SectionHeader({
  title,
  description,
  actions,
  className,
  border = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3',
        border && 'pb-4 border-b border-outline-variant/30',
        className
      )}
    >
      <div>
        <h3 className="cb-section-title">{title}</h3>
        {description && (
          <p className="text-[12px] text-on-surface-variant mt-0.5">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
