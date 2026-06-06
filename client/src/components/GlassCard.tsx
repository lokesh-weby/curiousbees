'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  hoverable?: boolean;
  glowColor?: 'indigo' | 'teal' | 'none';
}

export default function GlassCard({
  children,
  hoverable = true,
  glowColor = 'none',
  className,
  ...props
}: GlassCardProps) {
  const glowClasses = {
    indigo: 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),_0_0_20px_rgba(108,99,255,0.15)] hover:border-indigoElectric/30',
    teal: 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),_0_0_20px_rgba(0,194,178,0.15)] hover:border-tealGlow/30',
    none: 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:border-white/10',
  };

  return (
    <motion.div
      whileHover={hoverable ? { y: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'relative bg-darkSurface/40 backdrop-blur-[20px] -webkit-backdrop-blur-[20px] rounded-xl border border-borderStroke p-5 shadow-[0_4px_30px_rgba(0,0,0,0.4)] inset-shadow-sm transition-all duration-300 overflow-hidden',
        hoverable && 'hover:bg-darkSurfaceMuted/70 cursor-pointer',
        hoverable && glowClasses[glowColor],
        className
      )}
      {...props}
    >
      {/* Subtle radial inner lighting mesh underlay */}
      {hoverable && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500" />
      )}
      {children}
    </motion.div>
  );
}
