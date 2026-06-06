'use client';

/**
 * components/shared/glass-card.tsx
 * Unified glass/card primitive for all dashboards.
 *
 * Variants:
 *  - default:   white card with subtle border
 *  - glass:     frosted glass backdrop-filter
 *  - elevated:  white with stronger shadow
 *  - flat:      no shadow, border only
 */

import React from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'glass' | 'elevated' | 'flat';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-outline-variant/40 shadow-sm',
  glass: 'bg-white/88 backdrop-blur-[16px] border border-white/40 shadow-md',
  elevated: 'bg-white border border-outline-variant/30 shadow-lg',
  flat: 'bg-white border border-outline-variant/40',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export function GlassCard({
  variant = 'default',
  hoverable = false,
  padding = 'md',
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        variantStyles[variant],
        paddingStyles[padding],
        hoverable && 'transition-all duration-200 hover:border-outline-variant/80 hover:shadow-md cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
