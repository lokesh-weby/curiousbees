'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface FacultySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FACULTIES = [
  { value: 'eng-tech', label: 'Faculty of Engineering & Technology' },
  { value: 'sci-hum', label: 'Faculty of Science and Humanities' },
  { value: 'mgmt', label: 'Faculty of Management' },
  { value: 'health-sci', label: 'Faculty of Health Sciences & Research' },
  { value: 'law', label: 'School Of Law' }
];

export default function FacultySelect({ value, onChange, error }: FacultySelectProps) {
  return (
    <div className="relative pt-6 text-left">
      <label 
        className={cn(
          "absolute top-0 left-0 font-label-caps text-label-caps transition-all duration-200",
          value ? "text-primary" : "text-on-surface-variant"
        )}
        htmlFor="faculty"
      >
        Faculty
      </label>
      <div className="relative flex items-center">
        <select
          id="faculty"
          name="faculty"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full input-underline text-on-surface font-body-md bg-transparent appearance-none cursor-pointer pr-8",
            error && "border-error focus:border-error"
          )}
        >
          <option value="" disabled className="bg-white text-outline">Select Faculty</option>
          {FACULTIES.map((fac) => (
            <option key={fac.value} value={fac.value} className="bg-white text-on-surface">
              {fac.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant flex items-center">
          <ChevronDown className="w-4 h-4 text-outline" />
        </div>
      </div>
      {error && (
        <p className="text-[11px] text-error font-semibold mt-1">{error}</p>
      )}
    </div>
  );
}
