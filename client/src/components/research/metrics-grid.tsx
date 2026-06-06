'use client';

import React from 'react';
import { GraduationCap, Quote, FileText, FlaskConical, TrendingUp } from 'lucide-react';

interface ScholarMetricsGridProps {
  hIndex?: number;
  totalCitations?: string;
  publicationsCount?: number;
  activeProjectsCount?: number;
  milestonesProgress?: number; // percentage, e.g. 75
}

export default function ScholarMetricsGrid({
  hIndex = 24,
  totalCitations = '1,842',
  publicationsCount = 38,
  activeProjectsCount = 4,
  milestonesProgress = 75
}: ScholarMetricsGridProps) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-gutter select-none text-left">
      {/* H-Index Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <GraduationCap className="w-16 h-16 text-primary" />
        </div>
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
          H-Index
        </p>
        <p className="font-display-lg text-display-lg text-primary">{hIndex}</p>
        <div className="mt-4 flex items-center gap-1 text-secondary-container">
          <TrendingUp className="w-4 h-4 text-secondary-fixed-dim" />
          <span className="font-label-md text-label-md text-secondary-fixed-dim">+2 this year</span>
        </div>
      </div>

      {/* Total Citations Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Quote className="w-16 h-16 text-primary" />
        </div>
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
          Total Citations
        </p>
        <p className="font-display-lg text-display-lg text-on-surface">{totalCitations}</p>
        <div className="mt-4 flex items-center gap-1 text-on-surface-variant">
          <TrendingUp className="w-4 h-4 text-on-surface-variant" />
          <span className="font-label-md text-label-md">Top 5% in Faculty</span>
        </div>
      </div>

      {/* Publications Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <FileText className="w-16 h-16 text-primary" />
        </div>
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
          Publications
        </p>
        <p className="font-display-lg text-display-lg text-on-surface">{publicationsCount}</p>
        <div className="mt-4 flex items-center gap-1 text-on-surface-variant">
          <FileText className="w-4 h-4 text-on-surface-variant" />
          <span className="font-label-md text-label-md">2 under peer review</span>
        </div>
      </div>

      {/* Active Projects Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <FlaskConical className="w-16 h-16 text-primary" />
        </div>
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
          Active Projects
        </p>
        <p className="font-display-lg text-display-lg text-on-surface">{activeProjectsCount}</p>
        
        {/* Progress Bar matching Stitch */}
        <div className="mt-5 w-full bg-surface-variant h-1 rounded-full overflow-hidden">
          <div 
            className="bg-secondary-container h-full transition-all duration-300" 
            style={{ width: `${milestonesProgress}%` }}
          />
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
          {milestonesProgress}% milestones met
        </p>
      </div>
    </section>
  );
}
