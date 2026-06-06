'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  theme?: 'light' | 'dark' | 'adaptive';
}

export default function Logo({ 
  className, 
  size = 40, 
  showText = false, 
  theme = 'adaptive' 
}: LogoProps) {
  // Theme stroke and fill calculations
  const strokeColor = 
    theme === 'light' 
      ? '#111827' 
      : theme === 'dark' 
        ? '#fbf8ff' 
        : 'currentColor';

  return (
    <div className={cn("flex items-center gap-stack-sm", className)}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 400 400" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer Research Network Hexagon */}
        <path 
          d="M200 40L338.564 120V280L200 360L61.4359 280V120L200 40Z" 
          stroke={strokeColor} 
          strokeWidth="1.5" 
          strokeDasharray="6 6" 
          opacity="0.2"
        />
        
        {/* Central Yellow Hexagonal Box (The Discovery Hub) */}
        <path 
          d="M200 140L251.962 170V230L200 260L148.038 230V170L200 140Z" 
          fill="#fec727" /* Stitch secondary-container Innovation Yellow */
        />
        
        {/* "C" and "B" Monogram Fusion */}
        {/* Bold "C" wrapping the left */}
        <path 
          d="M240 100H180C120 100 80 150 80 200C80 250 120 300 180 300H240" 
          stroke="#004495" /* Stitch primary blue */
          strokeWidth="20" 
          strokeLinecap="round"
        />
        
        {/* Bold "B" integrated on the right */}
        <path 
          d="M200 100H260C300 100 320 125 320 160C320 195 300 220 260 220H200M260 220C310 220 330 245 330 280C330 315 310 340 260 340H200" 
          stroke="#004495" 
          strokeWidth="20" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />

        {/* Network Nodes at Outer Vertices */}
        <circle cx="200" cy="40" r="8" fill={strokeColor} />
        <circle cx="338.564" cy="120" r="8" fill={strokeColor} />
        <circle cx="338.564" cy="280" r="8" fill={strokeColor} />
        <circle cx="200" cy="360" r="8" fill={strokeColor} />
        <circle cx="61.4359" cy="280" r="8" fill={strokeColor} />
        <circle cx="61.4359" cy="120" r="8" fill={strokeColor} />
        
        {/* Inner Connection Lines */}
        <path d="M200 140V40" stroke={strokeColor} strokeWidth="1.5" opacity="0.1" />
        <path d="M251.962 170L338.564 120" stroke={strokeColor} strokeWidth="1.5" opacity="0.1" />
        <path d="M251.962 230L338.564 280" stroke={strokeColor} strokeWidth="1.5" opacity="0.1" />
        <path d="M200 260V360" stroke={strokeColor} strokeWidth="1.5" opacity="0.1" />
        <path d="M148.038 230L61.4359 280" stroke={strokeColor} strokeWidth="1.5" opacity="0.1" />
        <path d="M148.038 170L61.4359 120" stroke={strokeColor} strokeWidth="1.5" opacity="0.1" />
      </svg>
      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-display-lg text-headline-md font-bold text-primary">
            CuriousBees
          </span>
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">
            SRMIST Research
          </span>
        </div>
      )}
    </div>
  );
}
