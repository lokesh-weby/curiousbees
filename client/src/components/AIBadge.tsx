'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AIBadgeProps {
  className?: string;
  glow?: boolean;
}

export default function AIBadge({ className, glow = false }: AIBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-sans font-medium border border-borderStroke bg-darkSurfaceMuted text-textSecondary select-none gap-1.5',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-aiBlue shrink-0" />
      <span>AI Ingested</span>
    </span>
  );
}
