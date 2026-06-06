'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-12 border-t border-outline-variant/60 bg-surface-dim dark:bg-surface-container-lowest flex flex-col md:flex-row justify-between items-center px-4 md:px-margin-desktop max-w-container-max mx-auto gap-4 select-none">
      <p className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant/80 hover:text-on-surface-variant transition-all text-xs text-center md:text-left">
        © 2024 SRMIST Research Office. Powered by CuriousBees.
      </p>
      
      <nav className="flex flex-wrap justify-center gap-6 font-body-sm text-body-sm">
        <Link 
          href="#" 
          className="text-on-surface-variant/80 hover:text-primary underline transition-all"
        >
          Institutional Policy
        </Link>
        <Link 
          href="#" 
          className="text-on-surface-variant/80 hover:text-primary underline transition-all"
        >
          Ethics Committee
        </Link>
        <Link 
          href="#" 
          className="text-on-surface-variant/80 hover:text-primary underline transition-all"
        >
          Privacy
        </Link>
        <Link 
          href="#" 
          className="text-on-surface-variant/80 hover:text-primary underline transition-all"
        >
          Contact
        </Link>
      </nav>
    </footer>
  );
}
