'use client';

import React from 'react';
import { cn } from './utils';

interface TagPillProps {
  label: string;
  variant?: 'indigo' | 'teal' | 'violet' | 'gray' | 'danger' | 'success' | 'warning';
  className?: string;
}

export default function TagPill({
  label,
  variant = 'gray',
  className,
}: TagPillProps) {
  const getVariant = (): 'indigo' | 'teal' | 'violet' | 'gray' | 'danger' | 'success' | 'warning' => {
    if (variant !== 'gray') return variant;
    
    const l = label.toLowerCase();
    if (l.includes('ai') || l.includes('llm') || l.includes('comput') || l.includes('network') || l.includes('cs')) {
      return 'indigo';
    }
    if (l.includes('bio') || l.includes('chem') || l.includes('protein') || l.includes('immun') || l.includes('genomic')) {
      return 'teal';
    }
    if (l.includes('semicond') || l.includes('quantum') || l.includes('photon') || l.includes('vlsi') || l.includes('ece')) {
      return 'violet';
    }
    if (l.includes('fail') || l.includes('error') || l.includes('conflict')) {
      return 'danger';
    }
    return 'gray';
  };

  const activeVariant = getVariant();

  // Premium ElevenLabs Design System - Zero shadow, flat border design
  const styles = {
    indigo: 'bg-darkSurfaceMuted text-textSecondary border-borderStroke',
    teal: 'bg-darkSurfaceMuted text-textSecondary border-borderStroke',
    violet: 'bg-darkSurfaceMuted text-textSecondary border-borderStroke',
    gray: 'bg-darkSurfaceMuted text-textSecondary border-borderStroke',
    danger: 'bg-[#fff2f2] text-[#c00] border-[#fca5a5]',
    success: 'bg-[#f0fdf4] text-[#166534] border-[#86efac]',
    warning: 'bg-[#fffbeb] text-[#92400e] border-[#fcd34d]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[13px] font-sans font-medium uppercase tracking-[0.08em] border select-none',
        styles[activeVariant],
        className
      )}
    >
      {label}
    </span>
  );
}
