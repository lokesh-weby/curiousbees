'use client';

import React, { useState } from 'react';
import { Opportunity } from '@/shared/types';
import { Share2, Check, ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [isApplied, setIsApplied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsApplied(true);
    setTimeout(() => {
      alert(`Interest Sent! Your CuriousBees profile snapshot has been dispatched to ${opportunity.author?.name || 'the faculty lead'}.`);
    }, 100);
  };

  const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Determine if opportunity is less than 3 days old for "NEW" badge
  const isNew = () => {
    const created = new Date(opportunity.createdAt).getTime();
    const now = new Date().getTime();
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffDays < 3;
  };

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className="cb-card-hover p-5 md:p-6 cursor-pointer flex flex-col justify-between bg-white/95 backdrop-blur-md"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        
        {/* LEFT COLUMN */}
        <div className="text-left flex-1 min-w-0">
          
          {/* Domain and type tags */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="bg-[#004495]/2 border border-[#004495]/10 text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {opportunity.researchDomain || 'Research'}
            </span>
            <span className="bg-[#775a00]/5 border border-[#775a00]/10 text-secondary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              JRF / Ph.D.
            </span>
            {isNew() && (
              <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                NEW
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-900 mt-3 leading-snug">
            {opportunity.title}
          </h3>

          {/* Principal Investigator Row */}
          <div className="flex items-center gap-2 mt-2 select-none">
            {opportunity.author?.image ? (
              <img src={opportunity.author.image} className="w-6 h-6 rounded-full object-cover border border-slate-250" alt="" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center font-display font-bold text-primary text-[10px]">
                {opportunity.author?.name ? opportunity.author.name[0].toUpperCase() : 'PI'}
              </div>
            )}
            <span className="text-xs font-semibold text-slate-700">
              {opportunity.author?.name || 'Faculty Lead'}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              · Faculty ({opportunity.department?.split('(')[0].trim()})
            </span>
          </div>

          {/* Description preview */}
          <p className="text-slate-500 font-sans font-medium text-xs leading-relaxed mt-3 line-clamp-2">
            {opportunity.description}
          </p>

        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 self-stretch md:self-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Posted {formatDate(opportunity.createdAt)}
          </p>
          
          {isApplied ? (
            <div className="cb-status-success text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 select-none">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Interest Sent ✓</span>
            </div>
          ) : (
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Apply Interest
            </button>
          )}
        </div>

      </div>

      {/* EXPANDABLE PROJECT DETAILS */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-5 border-t border-slate-100 space-y-4 text-left select-none">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Full Role Scope & Fellowship Details
              </h4>
              <p className="text-xs text-slate-600 font-sans font-medium leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                {opportunity.description || 'No additional scope details provided by the principal investigator.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Toggle */}
      <div className="flex justify-center mt-3 pt-2 text-slate-400">
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

    </div>
  );
}
