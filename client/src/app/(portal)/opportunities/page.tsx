'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateOpportunitySchema, SRM_DEPARTMENTS } from '@/shared/shared-utils';
import { useStore } from '@/store/useStore';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Check, 
  ShieldAlert, 
  X,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { TagPill } from '@/shared/ui';
import GlowButton from '@/components/GlowButton';
import OpportunityCard from '@/components/OpportunityCard';

export default function OpportunitiesFeedPage() {
  const { opportunities, createOpportunity, roleOverride } = useStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Filtering states
  const [selectedDept, setSelectedDept] = useState('');
  const [searchDomain, setSearchDomain] = useState('');

  // Setup form validation
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(CreateOpportunitySchema),
    defaultValues: {
      title: '',
      description: '',
      department: '',
      researchDomain: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await createOpportunity(
        data.title,
        data.description,
        data.department,
        data.researchDomain
      );
      setIsDrawerOpen(false);
      reset(); // Clear form
    } catch (e: any) {
      alert(`Error publishing position: ${e.message}`);
    }
  };

  // Filter positions
  const filteredOpps = opportunities.filter((o) => {
    const matchesDept = !selectedDept || o.department === selectedDept;
    const matchesDomain = !searchDomain || o.researchDomain.toLowerCase().includes(searchDomain.toLowerCase());
    return matchesDept && matchesDomain;
  });

  const handleOpenDrawer = () => {
    if (roleOverride !== 'RESEARCH_SUPERVISOR') {
      alert('🔒 Access Restricted! Only verified Faculty Principal Investigators (PIs) are authorized to publish funded research opportunities. Toggle role in sandbox at sidebar bottom to test!');
      return;
    }
    setIsDrawerOpen(true);
  };
  return (
    <div className="space-y-6 relative select-none text-left">
      
      {/* 🚀 Upper Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-primary" />
            <span>Academic Portal Vacancies</span>
          </span>
          <h2 className="cb-page-title mt-2">
            Faculty Research Openings
          </h2>
          <p className="cb-page-subtitle">
            Explore funded PhD positions, research assistant slots, and interdisciplinary vacancies published by Principal Investigators.
          </p>
        </div>

        <button
          onClick={handleOpenDrawer}
          className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Opportunity</span>
        </button>
      </div>

      {/* 🚀 Dynamic Filter Controls */}
      <div className="cb-card grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white/90 backdrop-blur-md">
        
        {/* Department select filter */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter by Department</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 h-[42px] text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-800 focus:border-primary focus:ring-1 focus:ring-primary/25 focus:outline-none transition-all cursor-pointer"
          >
            <option value="">All Departments</option>
            {SRM_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept.split('(')[0]}</option>
            ))}
          </select>
        </div>

        {/* Domain text input filter */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Research Domain</label>
          <div className="relative">
            <input
              type="text"
              value={searchDomain}
              onChange={(e) => setSearchDomain(e.target.value)}
              placeholder="E.g. Reinforcement Learning, Nanomaterials..."
              className="cb-input pl-9"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
          </div>
        </div>

      </div>

      {/* 🚀 Main Feed Container */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredOpps.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="cb-card p-12 text-center bg-white/90 backdrop-blur-md"
            >
              <Briefcase className="w-8 h-8 text-slate-350 mx-auto mb-4" />
              <h4 className="text-slate-900 font-bold text-sm">No Vacancies Pinned</h4>
              <p className="text-slate-500 text-xs max-w-xs mx-auto mt-2 leading-relaxed font-semibold">
                No funded research slots match your filters at this time. Faculty leads can post JRF listings dynamically.
              </p>
            </motion.div>
          ) : (
            filteredOpps.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* 🚀 SLIDE OUT DRAWER FORM (For Faculty Creation) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50 cursor-pointer"
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-lg bg-white border-l border-slate-200 z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto text-left"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                      <GraduationCap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-[#0d3c61] leading-none">Publish Research Slot</h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Exclusive Faculty Intranet Hub</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)} 
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* 1. Title */}
                  <div className="space-y-2">
                    <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">Position Title</label>
                    <input
                      type="text"
                      {...register('title')}
                      placeholder="E.g. PhD Slot: Silicon Photonics Biosensor Integration"
                      className="cb-input"
                    />
                    {errors.title && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.title.message as string}</p>}
                  </div>

                  {/* 2. Research Domain */}
                  <div className="space-y-2">
                    <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-widest">Research Domain Keyword</label>
                    <input
                      type="text"
                      {...register('researchDomain')}
                      placeholder="E.g. Silicon Photonics"
                      className="cb-input"
                    />
                    {errors.researchDomain && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.researchDomain.message as string}</p>}
                  </div>

                  {/* 3. Department */}
                  <div className="space-y-2">
                    <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-widest">Department Node</label>
                    <select
                      {...register('department')}
                      className="w-full px-3 h-[42px] text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-850 focus:border-primary focus:ring-1 focus:ring-primary/25 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="">Select Department</option>
                      {SRM_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.department.message as string}</p>}
                  </div>

                  {/* 4. Description */}
                  <div className="space-y-2">
                    <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-widest">Scope & Stipend Details</label>
                    <textarea
                      rows={5}
                      {...register('description')}
                      placeholder="Provide funding details (e.g. SERB rates), essential credentials required, and core lab requirements..."
                      className="w-full px-3 py-2 text-xs leading-relaxed font-sans font-semibold rounded-lg bg-white border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    />
                    {errors.description && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.description.message as string}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200 active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                      ) : (
                        <>
                          <Check className="w-4 h-4 shrink-0" />
                          <span>Publish Slot</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>

              {/* Dev notice footer */}
              <div className="mt-8 bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center space-x-2.5 text-[9px] text-slate-400 uppercase font-bold">
                <ShieldAlert className="w-4 h-4 text-primary shrink-0 animate-pulse" />
                <span>Verified Faculty PIs authorized only.</span>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
