'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ShieldAlert } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { DashboardShell } from '@/components/shared/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import ApprovalQueue from '@/components/dashboard/approval-queue';

export default function ApprovalRequestsPage() {
  const router = useRouter();
  const {
    currentUser,
    pendingApprovals,
    collaborationRequests,
    fetchPendingApprovals,
    fetchCollaborationRequests,
    approveScholar,
    declineScholar,
    updateCollaborationRequest,
    isLoading
  } = useStore();

  // Guard: Only RESEARCH_SUPERVISOR can access
  useEffect(() => {
    if (currentUser && currentUser.role !== 'RESEARCH_SUPERVISOR') {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (currentUser?.role === 'RESEARCH_SUPERVISOR') {
      fetchPendingApprovals();
      fetchCollaborationRequests();
    }
  }, [currentUser, fetchPendingApprovals, fetchCollaborationRequests]);

  if (currentUser?.role !== 'RESEARCH_SUPERVISOR') {
    return null;
  }

  return (
    <DashboardShell>
      <PageHeader
        title="Scholar Intake & Synergy Approvals"
        subtitle="Manage pending supervisor mapping requests and review project synergy proposals."
        icon={<Clock className="w-5 h-5 text-[#ba1a1a]" />}
      />

      <div className="max-w-4xl mx-auto w-full pt-2">
        <ApprovalQueue
          pendingApprovals={pendingApprovals}
          collaborationRequests={collaborationRequests}
          onApproveScholar={approveScholar}
          onDeclineScholar={declineScholar}
          onAcceptCollaboration={(id) => updateCollaborationRequest(id, 'PUBLISHED')}
          onDeclineCollaboration={(id) => updateCollaborationRequest(id, 'REJECTED')}
        />
      </div>
    </DashboardShell>
  );
}
