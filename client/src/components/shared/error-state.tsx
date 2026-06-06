'use client';

/**
 * components/shared/error-state.tsx
 * Consistent error/failure state for async components.
 */

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Failed to load data. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center text-center py-16 gap-3',
        'border border-error/20 rounded-xl bg-error-container/20',
        className
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center text-error">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <p className="font-display font-semibold text-sm text-on-surface">{title}</p>
      <p className="text-xs text-on-surface-variant max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-error border border-error/30 hover:bg-error-container/60 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
