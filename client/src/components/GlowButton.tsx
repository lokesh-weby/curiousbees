'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'teal';
  size?: 'sm' | 'md' | 'lg';
}

export default function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: GlowButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold text-[14px] rounded-lg select-none outline-none border transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[12px] h-[32px]',
    md: 'px-5 py-2.5 h-[40px]',
    lg: 'px-7 py-3 h-[48px] text-[15px]',
  };

  const variantStyles = {
    primary: 'bg-black border-black text-white hover:bg-[#222222]',
    secondary: 'bg-white border-borderStroke text-black hover:border-black hover:bg-darkSurfaceMuted',
    ghost: 'bg-white border-black text-black hover:bg-darkSurfaceMuted',
    teal: 'bg-black border-black text-white hover:bg-[#222222]',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
