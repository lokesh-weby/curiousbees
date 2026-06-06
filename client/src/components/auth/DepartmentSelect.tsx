'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { SRM_DEPARTMENTS } from '@/shared/shared-utils';

interface DepartmentSelectProps {
  facultyValue: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FACULTY_TO_DEPARTMENTS: Record<string, string[]> = {
  'eng-tech': [
    'Computing Technologies (CSE / IT / Swe)',
    'Electronics & Communication Engineering (ECE)',
    'Electrical & Electronics Engineering (EEE)',
    'Biotechnology & Bioengineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering'
  ],
  'sci-hum': [
    'Physics & Nanotechnology',
    'Chemistry & Materials Science',
    'Mathematics & Actuarial Science'
  ],
  'mgmt': [
    'School of Management (SOM)'
  ],
  'health-sci': [
    'Health Sciences & Research'
  ],
  'law': [] // General / empty placeholder
};

export default function DepartmentSelect({ 
  facultyValue, 
  value, 
  onChange, 
  error 
}: DepartmentSelectProps) {
  // Filter departments based on selected faculty
  const filteredDepartments = facultyValue 
    ? FACULTY_TO_DEPARTMENTS[facultyValue] || [] 
    : [];

  return (
    <div className="relative pt-6 text-left">
      <label 
        className={cn(
          "absolute top-0 left-0 font-label-caps text-label-caps transition-all duration-200",
          value ? "text-primary" : "text-on-surface-variant"
        )}
        htmlFor="department"
      >
        Department
      </label>
      <div className="relative flex items-center">
        <select
          id="department"
          name="department"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!facultyValue || filteredDepartments.length === 0}
          className={cn(
            "w-full input-underline text-on-surface font-body-md bg-transparent appearance-none cursor-pointer pr-8",
            error && "border-error focus:border-error"
          )}
        >
          <option value="" disabled className="bg-white text-outline">
            {!facultyValue 
              ? 'Select Faculty First' 
              : filteredDepartments.length === 0 
                ? 'No Departments Registered' 
                : 'Select Department'}
          </option>
          {filteredDepartments.map((dept) => (
            <option key={dept} value={dept} className="bg-white text-on-surface">
              {dept}
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
