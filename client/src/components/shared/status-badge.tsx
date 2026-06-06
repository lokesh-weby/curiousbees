'use client';

/**
 * components/shared/status-badge.tsx
 * Unified status chip for all dashboards.
 * Replaces root-level StatusBadge.tsx with semantic token variants.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Info,
  Circle,
} from 'lucide-react';

export type StatusVariant =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'published'
  | 'needs_info'
  | 'active'
  | 'inactive';

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  StatusVariant,
  { label: string; icon: React.ReactNode; className: string }
> = {
  approved:   { label: 'Approved',     icon: <CheckCircle className="w-3 h-3" />,  className: 'bg-success-container text-on-success-container border border-success/20' },
  published:  { label: 'Published',    icon: <CheckCircle className="w-3 h-3" />,  className: 'bg-success-container text-on-success-container border border-success/20' },
  active:     { label: 'Active',       icon: <Circle className="w-3 h-3 fill-current" />, className: 'bg-success-container text-on-success-container border border-success/20' },
  pending:    { label: 'Pending',      icon: <Clock className="w-3 h-3" />,         className: 'bg-warning-container text-on-warning-container border border-warning/20' },
  needs_info: { label: 'Needs Info',   icon: <AlertCircle className="w-3 h-3" />,  className: 'bg-warning-container text-on-warning-container border border-warning/20' },
  warning:    { label: 'Warning',      icon: <AlertCircle className="w-3 h-3" />,  className: 'bg-warning-container text-on-warning-container border border-warning/20' },
  rejected:   { label: 'Rejected',     icon: <XCircle className="w-3 h-3" />,      className: 'bg-error-container text-on-error-container border border-error/20' },
  error:      { label: 'Error',        icon: <XCircle className="w-3 h-3" />,      className: 'bg-error-container text-on-error-container border border-error/20' },
  info:       { label: 'Info',         icon: <Info className="w-3 h-3" />,         className: 'bg-info-container text-on-info-container border border-info/20' },
  success:    { label: 'Success',      icon: <CheckCircle className="w-3 h-3" />,  className: 'bg-success-container text-on-success-container border border-success/20' },
  inactive:   { label: 'Inactive',     icon: <Circle className="w-3 h-3" />,       className: 'bg-surface-container text-on-surface-variant border border-outline-variant/40' },
};

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-[9px]',
  md: 'px-2.5 py-1 text-[10px]',
};

export function StatusBadge({
  status,
  label,
  className,
  showIcon = true,
  size = 'md',
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label ?? config.label;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider',
        sizeClasses[size],
        config.className,
        className
      )}
    >
      {showIcon && config.icon}
      <span>{displayLabel}</span>
    </span>
  );
}
