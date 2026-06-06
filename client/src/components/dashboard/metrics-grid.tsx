'use client';

import React from 'react';
import { Users, AlertCircle, BookOpen, Building, TrendingUp } from 'lucide-react';

interface MetricsGridProps {
  activeScholarsCount: number;
  pendingReviewsCount: number;
  totalCitations?: string;
  activeGrantsCount?: number;
}

export default function MetricsGrid({
  activeScholarsCount,
  pendingReviewsCount,
  totalCitations = '1,432',
  activeGrantsCount = 3
}: MetricsGridProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter select-none text-left">
      {/* Active Scholars Card */}
      <div className="glass-card p-stack-md rounded-xl flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-4">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Active Scholars
          </span>
          <span className="text-primary bg-primary-fixed p-2 rounded-lg shrink-0">
            <Users className="w-5 h-5" />
          </span>
        </div>
        <div>
          <span className="font-headline-xl text-headline-xl text-on-surface">
            {activeScholarsCount}
          </span>
          <div className="flex items-center gap-1 mt-1 text-secondary">
            <TrendingUp className="w-4 h-4" />
            <span className="font-label-caps text-label-caps">+2 this semester</span>
          </div>
        </div>
      </div>

      {/* Pending Reviews Card */}
      <div className="glass-card p-stack-md rounded-xl flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-4">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Pending Reviews
          </span>
          <span className="text-error bg-error-container p-2 rounded-lg shrink-0">
            <AlertCircle className="w-5 h-5 text-on-error-container" />
          </span>
        </div>
        <div>
          <span className="font-headline-xl text-headline-xl text-on-surface">
            {pendingReviewsCount}
          </span>
          <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">
            Requires immediate attention
          </p>
        </div>
      </div>

      {/* Total Citations Card */}
      <div className="glass-card p-stack-md rounded-xl flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-4">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Total Citations
          </span>
          <span className="text-secondary bg-secondary-container p-2 rounded-lg shrink-0">
            <BookOpen className="w-5 h-5 text-on-secondary-container" />
          </span>
        </div>
        <div>
          <span className="font-headline-xl text-headline-xl text-on-surface">
            {totalCitations}
          </span>
          <div className="flex items-center gap-1 mt-1 text-primary">
            <TrendingUp className="w-4 h-4" />
            <span className="font-label-caps text-label-caps">+124 this month</span>
          </div>
        </div>
      </div>

      {/* Active Grants Card */}
      <div className="glass-card p-stack-md rounded-xl flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-4">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Active Grants
          </span>
          <span className="text-tertiary bg-tertiary-fixed p-2 rounded-lg shrink-0">
            <Building className="w-5 h-5 text-on-tertiary-fixed" />
          </span>
        </div>
        <div>
          <span className="font-headline-xl text-headline-xl text-on-surface">
            {activeGrantsCount}
          </span>
          <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">
            Next milestone in 14 days
          </p>
        </div>
      </div>
    </section>
  );
}
