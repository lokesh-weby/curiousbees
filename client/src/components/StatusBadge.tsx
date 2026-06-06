'use client';

import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Clock, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export type IngestionStatus =
  | 'QUEUED'
  | 'AI_PROCESSING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'PUBLISHED'
  | 'FAILED'
  | 'IGNORED'
  | 'FILTERED'
  | 'DUPLICATE';

interface StatusBadgeProps {
  status: IngestionStatus | string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const normStatus = status.toUpperCase();

  const config = (): {
    label: string;
    classes: string;
    icon: React.ReactNode;
  } => {
    switch (normStatus) {
      case 'QUEUED':
        return {
          label: 'Queued',
          classes: 'bg-white/5 border-white/10 text-textMuted/80 animate-pulse',
          icon: <Clock className="w-3 h-3 text-textMuted mr-1" />,
        };
      case 'AI_PROCESSING':
      case 'PROCESSING':
        return {
          label: 'Extracting',
          classes: 'bg-indigoElectric/5 border-indigoElectric/20 text-indigoElectric shadow-[0_0_10px_rgba(108,99,255,0.12)]',
          icon: <Loader2 className="w-3 h-3 animate-spin mr-1 text-indigoElectric" />,
        };
      case 'SUCCESS':
      case 'PUBLISHED':
        return {
          label: 'Published',
          classes: 'bg-tealGlow/5 border-tealGlow/20 text-tealGlow shadow-[0_0_10px_rgba(0,194,178,0.12)]',
          icon: <CheckCircle2 className="w-3 h-3 text-tealGlow mr-1" />,
        };
      case 'FAILED':
        return {
          label: 'Failed',
          classes: 'bg-dangerAlert/5 border-dangerAlert/20 text-dangerAlert shadow-[0_0_10px_rgba(255,77,77,0.12)]',
          icon: <AlertCircle className="w-3 h-3 text-dangerAlert mr-1" />,
        };
      case 'IGNORED':
      case 'FILTERED':
        return {
          label: 'Filtered',
          classes: 'bg-white/5 border-white/10 text-white/30',
          icon: <EyeOff className="w-3 h-3 text-white/30 mr-1" />,
        };
      case 'DUPLICATE':
        return {
          label: 'Duplicate',
          classes: 'bg-violetRoyal/5 border-violetRoyal/20 text-violetRoyal shadow-[0_0_10px_rgba(155,89,182,0.12)]',
          icon: <AlertCircle className="w-3 h-3 text-violetRoyal mr-1" />,
        };
      default:
        return {
          label: status,
          classes: 'bg-white/5 border-white/10 text-textMuted',
          icon: null,
        };
    }
  };

  const badge = config();

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider transition-all duration-300',
        badge.classes,
        className
      )}
    >
      {badge.icon}
      {badge.label}
    </span>
  );
}
