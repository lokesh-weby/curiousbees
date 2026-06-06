'use client';

/**
 * components/shared/metric-card.tsx
 * Universal metric display card used across ALL three dashboards.
 *
 * Features: animated counter, trend delta, icon, multiple accent variants.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AnimatedCounter } from './animated-counter';
import { GlassCard } from './glass-card';

type MetricVariant = 'default' | 'primary' | 'success' | 'warning' | 'info';

interface MetricCardProps {
  title: string;
  value: number | string;
  delta?: string;
  deltaType?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  variant?: MetricVariant;
  prefix?: string;
  suffix?: string;
  description?: string;
  animate?: boolean;
  className?: string;
}

const accentStyles: Record<MetricVariant, { icon: string; badge: string; card: string }> = {
  default:  { icon: 'bg-slate-100 text-slate-700 border-slate-200/50', badge: 'text-slate-700 bg-slate-100', card: 'hover:border-slate-300' },
  primary:  { icon: 'bg-primary/8 text-primary border-primary/20',     badge: 'text-primary bg-primary/5', card: 'hover:border-primary/45' },
  success:  { icon: 'bg-success-container/30 text-success border-success/20', badge: 'text-success bg-success-container/20', card: 'hover:border-success/45' },
  warning:  { icon: 'bg-warning-container/30 text-warning border-warning/20', badge: 'text-warning bg-warning-container/20', card: 'hover:border-warning/45' },
  info:     { icon: 'bg-info-container/30 text-info border-info/20', badge: 'text-info bg-info-container/20', card: 'hover:border-info/45' },
};

const deltaIcons = {
  up:      <TrendingUp className="w-3 h-3" />,
  down:    <TrendingDown className="w-3 h-3" />,
  neutral: <Minus className="w-3 h-3" />,
};

const deltaColors = {
  up:      'text-success bg-success-container/35 border border-success/15',
  down:    'text-error bg-error-container/35 border border-error/15',
  neutral: 'text-textSecondary bg-slate-100 border border-slate-200/55',
};

export function MetricCard({
  title,
  value,
  delta,
  deltaType = 'neutral',
  icon,
  variant = 'default',
  prefix = '',
  suffix = '',
  description,
  animate = true,
  className,
}: MetricCardProps) {
  const accent = accentStyles[variant];

  return (
    <GlassCard 
      className={cn(
        'relative flex flex-col justify-between gap-3 overflow-hidden border border-borderStroke/60 transition-all duration-300 hover:shadow-md hover:translate-y-[-1px]', 
        accent.card,
        className
      )}
    >
      {/* Decorative Sparkline path in the background */}
      <div className="absolute bottom-0 inset-x-0 h-8 opacity-10 overflow-hidden pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path
            d="M0 32 Q 20 12, 40 28 T 80 16 T 100 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className={cn(
              variant === 'primary' && 'text-primary',
              variant === 'success' && 'text-success',
              variant === 'warning' && 'text-[#775a00]',
              variant === 'info' && 'text-info',
              variant === 'default' && 'text-slate-400'
            )}
          />
        </svg>
      </div>

      <div className="flex items-start justify-between relative z-10">
        <p className="cb-metric-label">{title}</p>
        {icon && (
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border', accent.icon)}>
            {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
          </div>
        )}
      </div>

      <div className="space-y-1 relative z-10">
        <div className="cb-metric-value">
          {animate && typeof value === 'number' ? (
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
          ) : (
            <span>{prefix}{typeof value === 'string' ? value : value.toLocaleString()}{suffix}</span>
          )}
        </div>
        {description && (
          <p className="text-[11px] text-textSecondary font-semibold">{description}</p>
        )}
      </div>

      {delta && (
        <div className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start relative z-10', deltaColors[deltaType])}>
          {deltaIcons[deltaType]}
          <span>{delta}</span>
        </div>
      )}
    </GlassCard>
  );
}

