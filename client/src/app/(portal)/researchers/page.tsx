'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { SRM_DEPARTMENTS } from '@/shared/shared-utils';
import { 
  Users, 
  Search, 
  MapPin, 
  Sparkles, 
  X,
  Compass,
  GraduationCap,
  Award,
  BookOpen,
  Send,
  UserCheck,
  Check,
  Loader2,
  Tag,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ResearchersDiscoveryPage() {
  const { collaborators, currentUser, fetchCollaborators, isLoading, requestSupervisor } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');
  const [invitee, setInvitee] = useState<any | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);

  useEffect(() => {
    fetchCollaborators(searchQuery, selectedDept);
  }, [searchQuery, selectedDept, fetchCollaborators]);

  // Pick all query results except current user
  const researchers = collaborators.filter((u: any) => u.email !== currentUser?.email);

  // Extract all unique research focus areas from all users to populate filter suggestions
  const allUniqueInterests = Array.from(
    new Set(researchers.flatMap((r: any) => r.interests?.map((i: any) => i.interest?.name || '') || []))
  ).filter(Boolean);

  // Calculate semantic compatibility index
  const calculateCompatibility = (researcher: any) => {
    if (!currentUser || !currentUser.interests || !researcher.interests) return 60;
    
    const myInterests = currentUser.interests.map((i: any) => i.interest?.name);
    const peerInterests = researcher.interests.map((i: any) => i.interest?.name);
    
    const intersection = myInterests.filter((i: any) => peerInterests.includes(i));
    
    if (intersection.length > 0) {
      return 85 + Math.min(intersection.length * 5, 14); // High compatibility if interests overlap!
    }
    
    // Fallback: compatibility based on department similarity
    if (currentUser.department === researcher.department) {
      return 78;
    }
    
    return 65; // Base interdisciplinary score
  };

  // Filter researchers client-side for additional focus areas
  const filteredResearchers = researchers.filter((r: any) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (r.bio && r.bio.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesDept = !selectedDept || r.department === selectedDept;
    
    const researcherInterests = r.interests?.map((i: any) => i.interest?.name || '') || [];
    const matchesInterest = !selectedInterest || researcherInterests.includes(selectedInterest);
    
    return matchesSearch && matchesDept && matchesInterest;
  });

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitee) return;
    setInviteSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      alert(`Success! Synergy proposal dispatched to ${invitee.name}. You will be notified when they accept.`);
      setInviteSubmitting(false);
      setInviteMessage('');
      setInvitee(null);
    }, 1000);
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'CB';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-stack-lg relative select-none">
      
      {/* 🚀 Upper Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-outline-variant/30 pb-5 text-left">
        <div>
          <span className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-primary" />
            <span>CuriousBees Academic Network</span>
          </span>
          <h2 className="font-display-lg text-headline-xl sm:text-[32px] font-bold text-on-surface mt-1.5 tracking-tight leading-tight">
            Expert Collaborators Directory
          </h2>
          <p className="text-on-surface-variant text-xs sm:text-body-sm mt-1 leading-relaxed max-w-2xl">
            Locate research mentors, discover interdisciplinary co-authors, and request workspace alignment for peer-reviewed journal proposals.
          </p>
        </div>
        
        {/* Quick Stats Summary Indicator */}
        <div className="hidden lg:flex gap-4">
          <div className="bg-white border border-outline-variant/30 rounded-xl px-4 py-2 flex flex-col justify-center items-center">
            <span className="font-display text-lg font-bold text-primary">{researchers.length}</span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant">Scholars Online</span>
          </div>
        </div>
      </div>

      {/* 🚀 Filter Controls Bar (Stitch Academic Selects styling) */}
      <section className="glass-panel rounded-xl p-stack-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-left">
        <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-stack-md flex-1">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px] tracking-wider font-semibold pt-1">
            Filter Directory:
          </span>

          {/* Search Input field */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-outline absolute left-0 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholar name, bio keywords..."
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 pl-7 pb-2 pt-2 font-body-sm text-body-sm text-on-surface placeholder:text-outline/70 transition-colors"
            />
          </div>

          {/* Department Select */}
          <div className="relative min-w-[180px]">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 pb-2 pt-2 font-body-sm text-body-sm text-on-surface transition-colors cursor-pointer pr-8"
            >
              <option value="">All Departments</option>
              {SRM_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept.split('(')[0]}</option>
              ))}
            </select>
          </div>

          {/* Focus Domain Select */}
          <div className="relative min-w-[180px]">
            <select
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 pb-2 pt-2 font-body-sm text-body-sm text-on-surface transition-colors cursor-pointer pr-8"
            >
              <option value="">All Research Domains</option>
              {allUniqueInterests.map((interest) => (
                <option key={interest} value={interest}>#{interest}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchQuery || selectedDept || selectedInterest) && (
          <button
            onClick={() => { setSearchQuery(''); setSelectedDept(''); setSelectedInterest(''); }}
            className="text-primary hover:text-on-primary-fixed-variant text-xs font-semibold flex items-center gap-1 shrink-0 self-end md:self-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </section>

      {/* 🚀 Main Grid Feed (Stitch Glass Cards) */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Syncing directory node data...</p>
          </div>
        ) : filteredResearchers.length === 0 ? (
          <div className="glass-panel border border-outline-variant/30 rounded-xl py-20 text-center">
            <Users className="w-12 h-12 text-outline/50 mx-auto mb-4" />
            <h4 className="text-on-surface font-bold text-base">No Matching Scholars Found</h4>
            <p className="text-on-surface-variant text-xs max-w-xs mx-auto mt-2 leading-relaxed font-semibold">
              We couldn't find any researchers matching your specified parameters. Try clearing some filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDept(''); setSelectedInterest(''); }}
              className="mt-6 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-on-primary-fixed-variant transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {filteredResearchers.map((researcher) => {
              const compatibilityScore = calculateCompatibility(researcher);
              return (
                <div 
                  key={researcher.id}
                  className="glass-panel rounded-xl p-stack-md flex flex-col justify-between hover:border-primary/50 transition-all group duration-200 text-left"
                >
                  <div className="space-y-4">
                    
                    {/* Card Identity Header */}
                    <div className="flex items-start justify-between border-b border-outline-variant/20 pb-3 gap-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full overflow-hidden border border-outline-variant/30 bg-primary/5 flex items-center justify-center shrink-0">
                          {researcher.image ? (
                            <img src={researcher.image} alt={researcher.name || undefined} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-primary">{getInitials(researcher.name)}</span>
                          )}
                        </div>
                        {/* Info details */}
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                            {researcher.name}
                          </h3>
                          <div className="flex items-center flex-wrap gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold uppercase bg-surface-container text-on-surface-variant border border-outline-variant/30 leading-none">
                              {researcher.role === 'RESEARCH_SUPERVISOR' ? (
                                <>
                                  <GraduationCap className="w-2.5 h-2.5 mr-0.5" />
                                  Faculty Guide
                                </>
                              ) : (
                                <>
                                  <Award className="w-2.5 h-2.5 mr-0.5" />
                                  PhD Scholar
                                </>
                              )}
                            </span>
                            <span className="text-[10px] text-on-surface-variant font-medium flex items-center shrink-0">
                              <MapPin className="w-3 h-3 mr-0.5 text-outline" />
                              KTR Campus
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Compatibility synergy Match badge */}
                      <div className="text-right shrink-0">
                        <div className="px-2 py-1 bg-surface-container/60 border border-outline-variant/30 rounded-lg text-center shadow-sm">
                          <span className="text-[7px] font-label-caps font-bold text-on-surface-variant uppercase tracking-widest block leading-none mb-0.5">synergy</span>
                          <span className="text-xs font-mono font-bold text-primary leading-none">{compatibilityScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Department Block */}
                    <div>
                      <p className="text-[9px] font-bold text-outline uppercase tracking-wider leading-none">Academic Department</p>
                      <p className="text-xs text-on-surface font-semibold leading-normal mt-1 max-w-sm truncate">
                        🏫 {researcher.department || 'Department of Computing Technologies'}
                      </p>
                    </div>

                    {/* Bio Paragraph */}
                    <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3 min-h-[54px]">
                      {researcher.bio || 'This academic member has recently joined the portal to bootstrap their interdisciplinary research.'}
                    </p>
                  </div>

                  {/* Card Footer actions and tags */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-outline-variant/20 pt-3 mt-4 gap-3">
                    
                    {/* Tags list */}
                    <div className="flex flex-wrap gap-1">
                      {researcher.interests?.slice(0, 3).map((item: any) => (
                        <span 
                          key={item.interest?.name || item.interestId}
                          className="px-2 py-0.5 bg-surface-container-high/40 text-[10px] text-on-surface-variant rounded border border-outline-variant/30 font-semibold"
                        >
                          #{item.interest?.name || 'Research'}
                        </span>
                      ))}
                      {(!researcher.interests || researcher.interests.length === 0) && (
                        <span className="text-[10px] text-outline italic">No domains listed</span>
                      )}
                    </div>

                    {currentUser?.role === 'RESEARCH_SCHOLAR' && researcher.role === 'RESEARCH_SUPERVISOR' ? (
                      currentUser.supervisorId === researcher.id ? (
                        currentUser.approved ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 gap-1 leading-none">
                            <Check className="w-3.5 h-3.5" />
                            <span>Active Guide</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100 gap-1 leading-none animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending Approval</span>
                          </span>
                        )
                      ) : !currentUser.supervisorId ? (
                        <button
                          onClick={async () => {
                            if (confirm(`Send supervision request to ${researcher.name}?`)) {
                              try {
                                await requestSupervisor(researcher.id);
                                alert(`Supervision request sent successfully to ${researcher.name}.`);
                              } catch (err: any) {
                                alert(`Error: ${err.message || 'Failed to submit request'}`);
                              }
                            }
                          }}
                          className="px-4 py-1.5 bg-[#0d3c61] text-white hover:bg-primary rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
                        >
                          Request Supervision
                        </button>
                      ) : (
                        <button
                          disabled
                          title="You already have a supervisor or a pending request. You can change your supervisor on the pending approval page if needed."
                          className="px-4 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg text-xs font-bold transition-all shrink-0 cursor-not-allowed"
                        >
                          Request Supervision
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => setInvitee(researcher)}
                        className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shrink-0 self-end sm:self-auto font-bold"
                      >
                        Invite
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🚀 Synergy proposal modal drawer (Bottom-up slider matching Stitch Spec) */}
      <AnimatePresence>
        {invitee && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setInvitee(null)}
              className="fixed inset-0 bg-black/60 z-50 cursor-pointer backdrop-blur-sm"
            />
            
            {/* Slide-out Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-white border-t border-outline-variant rounded-t-2xl p-6 shadow-2xl flex flex-col space-y-5 text-left max-w-xl mx-auto"
            >
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-on-surface leading-none">Synergy Proposal</h3>
                    <p className="text-[9px] text-outline font-bold uppercase mt-1">Intranet Workspace Collaboration</p>
                  </div>
                </div>
                <button 
                  onClick={() => setInvitee(null)}
                  className="p-1 rounded-full hover:bg-surface-container-high transition cursor-pointer"
                >
                  <X className="w-4 h-4 text-outline" />
                </button>
              </div>

              {/* Sheet Form */}
              <form onSubmit={handleSendInvite} className="space-y-4">
                
                {/* Invitee Recipient details */}
                <div className="p-4 bg-surface-container-low border border-outline-variant/30 rounded-xl flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 bg-primary/5 flex items-center justify-center">
                    {invitee.image ? (
                      <img src={invitee.image} alt={invitee.name || undefined} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-primary">{getInitials(invitee.name)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface leading-none">{invitee.name}</h4>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-1 truncate max-w-[320px]">
                      🏫 {invitee.department || 'Department of Computing Technologies'}
                    </p>
                  </div>
                </div>

                {/* Textarea Proposal Message */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Synergy Message</label>
                  <textarea
                    rows={4}
                    required
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder="Hi Doctor, I reviewed your genomic computational models biography. We have high-throughput server transceivers ready in our department and would love to align on a joint SERB core grant proposal..."
                    className="w-full bg-transparent border border-outline-variant rounded-lg p-3 font-sans text-body-sm leading-relaxed text-on-surface placeholder:text-outline/70 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-colors"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setInvitee(null)}
                    className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteSubmitting}
                    className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow disabled:opacity-50"
                  >
                    {inviteSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 shrink-0" />
                        <span>Send Synergy Proposal</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
