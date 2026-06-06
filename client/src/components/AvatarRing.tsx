'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarRingProps {
  src?: string | null;
  name?: string;
  role?: 'RESEARCH_SUPERVISOR' | 'RESEARCH_SCHOLAR' | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AvatarRing({
  src,
  name = 'Scholar',
  role = 'RESEARCH_SCHOLAR',
  size = 'md',
  className,
}: AvatarRingProps) {
  const isFaculty = role === 'RESEARCH_SUPERVISOR';
  
  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-16 h-16 text-lg',
  };

  const ringColor = isFaculty
    ? 'border-indigoElectric shadow-[0_0_12px_rgba(108,99,255,0.25)]'
    : 'border-tealGlow shadow-[0_0_12px_rgba(0,194,178,0.25)]';

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={cn('relative shrink-0 select-none group', className)}>
      <div
        className={cn(
          'rounded-full border-2 p-[2px] transition-all duration-500 group-hover:scale-105',
          ringColor
        )}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full rounded-full object-cover bg-darkSurfaceMuted"
          />
        ) : (
          <div className={cn(
            "w-full h-full rounded-full flex items-center justify-center font-bold tracking-tighter bg-gradient-to-br text-textPrimary bg-darkSurfaceMuted",
            isFaculty ? "from-indigoElectric/20 to-violetRoyal/10" : "from-tealGlow/20 to-indigoElectric/10"
          )}>
            {initials}
          </div>
        )}
      </div>
      {/* Dynamic pulse indicator for presence online */}
      <span className={cn(
        "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-darkBg animate-pulse",
        isFaculty ? "bg-indigoElectric" : "bg-tealGlow"
      )} />
    </div>
  );
}
