'use client';

import React, { useState } from 'react';
import { Clock, Check, X, Eye, FileText } from 'lucide-react';
import { User as UserType, CollaborationRequest } from '@/shared/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ApprovalQueueProps {
  pendingApprovals: UserType[];
  collaborationRequests: CollaborationRequest[];
  onApproveScholar: (id: string) => Promise<any>;
  onDeclineScholar: (id: string) => Promise<any>;
  onAcceptCollaboration: (id: string) => Promise<any>;
  onDeclineCollaboration: (id: string) => Promise<any>;
}

export default function ApprovalQueue({
  pendingApprovals,
  collaborationRequests,
  onApproveScholar,
  onDeclineScholar,
  onAcceptCollaboration,
  onDeclineCollaboration
}: ApprovalQueueProps) {
  // Modal state
  const [selectedItem, setSelectedItem] = useState<{
    type: 'SCHOLAR' | 'COLLABORATION';
    scholar: UserType;
    details?: string;
    opportunityTitle?: string;
  } | null>(null);

  const getInitials = (name?: string | null) => {
    if (!name) return 'AS';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleReviewScholar = (scholar: UserType) => {
    setSelectedItem({
      type: 'SCHOLAR',
      scholar,
      details: 'Requesting supervisor mapping to gain institutional intranet access and collaborate under your department guide.'
    });
  };

  const handleReviewCollaboration = (req: CollaborationRequest) => {
    if (req.scholar) {
      setSelectedItem({
        type: 'COLLABORATION',
        scholar: req.scholar as UserType,
        details: req.message || 'No custom message provided.',
        opportunityTitle: req.opportunity?.title || 'Synergy Collaboration'
      });
    }
  };

  const activeCollabs = collaborationRequests.filter((r) => r.status === 'PENDING');

  if (pendingApprovals.length === 0 && activeCollabs.length === 0) {
    return (
      <section className="bg-white border border-borderStroke rounded-xl p-8 text-center shadow-sm select-none w-full">
        <Clock className="w-9 h-9 text-textSecondary/35 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-black mb-1 font-display">
          No Pending Reviews
        </h3>
        <p className="text-xs text-textSecondary font-semibold">
          You are all caught up! Scholars and synergy proposals will appear here when they request approval.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white border border-borderStroke rounded-xl overflow-hidden shadow-sm select-none text-left w-full">
        <div className="border-b border-borderStroke p-4 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#0d3c61] flex items-center gap-2 font-display">
            <Clock className="w-4.5 h-4.5 text-[#ba1a1a] shrink-0" />
            <span>Pending Approvals Queue</span>
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Requires Action
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {/* 1. Scholar Intake Approvals */}
          {pendingApprovals.map((scholar, idx) => (
            <motion.div
              key={`scholar-app-${scholar.id}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.25 }}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/20 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/5 text-primary border border-primary/10 flex items-center justify-center font-bold text-[13px] shrink-0">
                  {getInitials(scholar.name)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-black truncate">
                    {scholar.name || scholar.email}
                  </h4>
                  <p className="text-[10px] text-textSecondary font-semibold truncate mt-0.5">
                    Dept. of {scholar.department || 'Computer Science'} • PhD Scholar
                  </p>
                  <p className="text-[11px] text-black font-semibold mt-1 truncate">
                    <span className="text-primary font-bold">Request:</span> Verify Intranet Credentials
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleReviewScholar(scholar)}
                  className="bg-white border border-borderStroke/70 text-black font-bold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5 text-textSecondary" />
                  <span>Review</span>
                </button>
                <button
                  onClick={() => onApproveScholar(scholar.id)}
                  className="bg-primary text-white font-bold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-lg hover:bg-[#004495]/95 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => onDeclineScholar(scholar.id)}
                  className="bg-white border border-rose-250/20 text-[#ba1a1a] hover:bg-rose-50/50 font-bold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Decline</span>
                </button>
              </div>
            </motion.div>
          ))}

          {/* 2. Collaboration/Synergy Requests */}
          {activeCollabs.map((req, idx) => (
            <motion.div
              key={`collab-app-${req.id}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (pendingApprovals.length + idx) * 0.05, duration: 0.25 }}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/20 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 border border-amber-250/20 flex items-center justify-center font-bold text-[13px] shrink-0">
                  {getInitials(req.scholar?.name)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-black truncate">
                    {req.scholar?.name}
                  </h4>
                  <p className="text-[10px] text-textSecondary font-semibold truncate mt-0.5">
                    PhD Candidate • {req.scholar?.department || 'Research'}
                  </p>
                  <p className="text-[11px] text-black font-semibold mt-1 truncate">
                    <span className="text-[#8a5900] font-bold">Synergy Proposal:</span>{' '}
                    {req.opportunity?.title}
                  </p>
                  {req.message && (
                    <p className="text-[11px] text-textSecondary font-medium italic border-l-2 border-borderStroke pl-2 mt-1 line-clamp-2">
                      "{req.message}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleReviewCollaboration(req)}
                  className="bg-white border border-borderStroke/70 text-black font-bold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5 text-textSecondary" />
                  <span>Review</span>
                </button>
                <button
                  onClick={() => onAcceptCollaboration(req.id)}
                  className="bg-primary text-white font-bold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-lg hover:bg-[#004495]/95 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => onDeclineCollaboration(req.id)}
                  className="bg-white border border-rose-250/20 text-[#ba1a1a] hover:bg-rose-50/50 font-bold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Decline</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Review Information Modal Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="bg-white rounded-xl border border-borderStroke shadow-2xl max-w-md w-full overflow-hidden flex flex-col font-sans"
            >
              {/* Header */}
              <div className="p-5 border-b border-borderStroke bg-slate-50/50 flex justify-between items-start">
                <div className="text-left">
                  <h3 className="text-sm font-bold text-[#0d3c61] font-display">
                    {selectedItem.type === 'SCHOLAR'
                      ? 'Review Scholar Request'
                      : 'Review Synergy Proposal'}
                  </h3>
                  <p className="text-[11px] text-textSecondary font-semibold mt-1">
                    Evaluate credentials and details before approving workspace access.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-textSecondary hover:text-black p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-grow overflow-y-auto space-y-5 text-left">
                {/* Scholar Header card */}
                <div className="flex items-center gap-3.5 bg-slate-50 p-4 rounded-xl border border-borderStroke/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-display font-bold text-sm shrink-0">
                    {getInitials(selectedItem.scholar.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-black truncate leading-tight">
                      {selectedItem.scholar.name}
                    </h4>
                    <p className="text-[10px] text-textSecondary truncate font-medium mt-0.5">
                      {selectedItem.scholar.email}
                    </p>
                    <p className="text-[10px] text-textSecondary truncate font-bold uppercase mt-1 tracking-wider">
                      Dept. of {selectedItem.scholar.department || 'N/A'} • PhD Candidate
                    </p>
                  </div>
                </div>

                {/* Scholar Bio */}
                {selectedItem.scholar.bio && (
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">
                      Scholar Bio
                    </h5>
                    <p className="text-xs text-black bg-slate-50/50 p-3 rounded-lg border border-borderStroke/40 leading-relaxed font-semibold">
                      {selectedItem.scholar.bio}
                    </p>
                  </div>
                )}

                {/* Target Opportunity */}
                {selectedItem.type === 'COLLABORATION' && selectedItem.opportunityTitle && (
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-bold text-[#8a5900] uppercase tracking-wider">
                      Target Opportunity
                    </h5>
                    <div className="bg-amber-50/30 border border-amber-200/50 rounded-lg p-3 text-[#8a5900] text-xs font-bold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#8a5900] shrink-0" />
                      <span className="truncate">{selectedItem.opportunityTitle}</span>
                    </div>
                  </div>
                )}

                {/* Message Details */}
                <div className="space-y-1.5">
                  <h5 className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">
                    Request Message
                  </h5>
                  <p className="text-xs text-textSecondary italic bg-slate-50/50 p-3 rounded-lg border-l-4 border-l-primary border border-borderStroke/45 leading-relaxed font-medium">
                    "{selectedItem.details}"
                  </p>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="p-4 border-t border-borderStroke bg-slate-50/50 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-white border border-borderStroke/70 text-black font-bold text-xs py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Close
                </button>

                {selectedItem.type === 'SCHOLAR' ? (
                  <>
                    <button
                      onClick={() => {
                        onDeclineScholar(selectedItem.scholar.id);
                        setSelectedItem(null);
                      }}
                      className="bg-white border border-rose-200 text-[#ba1a1a] hover:bg-rose-50 font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => {
                        onApproveScholar(selectedItem.scholar.id);
                        setSelectedItem(null);
                      }}
                      className="bg-primary text-white font-bold text-xs py-2 px-4 rounded-lg hover:bg-[#004495]/95 transition-colors cursor-pointer shadow-sm"
                    >
                      Approve Scholar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        const targetReq = activeCollabs.find(
                          (r) => r.scholar?.id === selectedItem.scholar.id
                        );
                        if (targetReq) {
                          onDeclineCollaboration(targetReq.id);
                        }
                        setSelectedItem(null);
                      }}
                      className="bg-white border border-rose-200 text-[#ba1a1a] hover:bg-rose-50 font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      Decline Request
                    </button>
                    <button
                      onClick={() => {
                        const targetReq = activeCollabs.find(
                          (r) => r.scholar?.id === selectedItem.scholar.id
                        );
                        if (targetReq) {
                          onAcceptCollaboration(targetReq.id);
                        }
                        setSelectedItem(null);
                      }}
                      className="bg-primary text-white font-bold text-xs py-2 px-4 rounded-lg hover:bg-[#004495]/95 transition-colors cursor-pointer shadow-sm"
                    >
                      Accept Proposal
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
