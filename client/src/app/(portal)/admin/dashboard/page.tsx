'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  Users, 
  History, 
  UserCog, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Lock,
  LayoutDashboard
} from 'lucide-react';
import AvatarRing from '@/components/AvatarRing';

// Modular overview components
import ResearchVelocityCard from '@/components/admin/research-velocity-card';
import CollaborationsCard from '@/components/admin/collaborations-card';
import CampusDistributionChart from '@/components/admin/campus-distribution-chart';
import DataConsumptionCard from '@/components/admin/data-consumption-card';
import SystemHealthCard from '@/components/admin/system-health-card';
import AchievementsFeed from '@/components/admin/achievements-feed';

type AdminTab = 'overview' | 'users' | 'supervisors' | 'audit';

export default function AdminPage() {
  const router = useRouter();
  const { 
    currentUser, 
    adminUsers, 
    adminAuditLogs, 
    fetchAdminUsers, 
    fetchAdminAuditLogs, 
    changeUserRole, 
    isLoading 
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Guard against non-admin access
  useEffect(() => {
    if (currentUser && currentUser.role !== 'INSTITUTION_ADMIN') {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  // 2. Fetch admin data
  useEffect(() => {
    if (currentUser?.role === 'INSTITUTION_ADMIN') {
      fetchAdminUsers();
      fetchAdminAuditLogs();
    }
  }, [currentUser, fetchAdminUsers, fetchAdminAuditLogs]);

  if (currentUser?.role !== 'INSTITUTION_ADMIN') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <Lock className="w-12 h-12 text-dangerAlert" />
        <h3 className="font-display font-light text-xl text-black">Access Unauthorized</h3>
        <p className="text-xs text-textSecondary">Only university administrators can access the admin control panel.</p>
        <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold">
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Handle role modification
  const handleRoleChange = async (userId: string, newRole: any) => {
    try {
      await changeUserRole(userId, newRole);
      await fetchAdminUsers();
      await fetchAdminAuditLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveSupervisor = async (userId: string) => {
    try {
      const { apiFetch } = await import('@/lib/api-client');
      await apiFetch('/api/users/approve-supervisor', {
        method: 'PUT',
        body: JSON.stringify({ supervisorId: userId }),
      });
      await fetchAdminUsers();
      await fetchAdminAuditLogs();
    } catch (err) {
      console.error('Failed to approve supervisor:', err);
    }
  };

  const handleDeclineSupervisor = async (userId: string) => {
    try {
      const { apiFetch } = await import('@/lib/api-client');
      await apiFetch('/api/users/decline-supervisor', {
        method: 'PUT',
        body: JSON.stringify({ supervisorId: userId }),
      });
      await fetchAdminUsers();
      await fetchAdminAuditLogs();
    } catch (err) {
      console.error('Failed to decline supervisor:', err);
    }
  };

  // Filter users based on search
  const filteredUsers = adminUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'supervisors', label: 'Supervisor Approvals', icon: <UserCog className="w-4 h-4" /> },
    { id: 'users', label: 'User Moderation', icon: <Users className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Logs', icon: <History className="w-4 h-4" /> },
  ];

  const pendingSupervisors = adminUsers.filter(u => u.role === 'RESEARCH_SUPERVISOR' && (u.status === 'PENDING_ADMIN' || !u.approved));

  return (
    <div className="space-y-6 text-left font-sans select-none">
      
      {/* 🚀 HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="cb-page-title flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-primary shrink-0" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="cb-page-subtitle">
            Manage institutional user roles, audit security activity, and monitor the CuriousBees network.
          </p>
        </div>
      </div>

      {/* ⚡ SYSTEM STATS MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="cb-card p-5 flex items-center justify-between bg-white/90 backdrop-blur-md">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Members</p>
            <h4 className="text-2xl font-extrabold text-[#0d3c61] mt-1 font-display leading-none">{adminUsers.length}</h4>
          </div>
          <div className="w-9 h-9 bg-primary/5 text-primary border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="cb-card p-5 flex items-center justify-between bg-white/90 backdrop-blur-md">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faculty Supervisors</p>
            <h4 className="text-2xl font-extrabold text-[#0d3c61] mt-1 font-display leading-none">
              {adminUsers.filter(u => u.role === 'RESEARCH_SUPERVISOR').length}
            </h4>
          </div>
          <div className="w-9 h-9 bg-[#775a00]/5 text-[#775a00] border border-[#775a00]/15 rounded-lg flex items-center justify-center shrink-0">
            <UserCog className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="cb-card p-5 flex items-center justify-between bg-white/90 backdrop-blur-md">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit Operations Logged</p>
            <h4 className="text-2xl font-extrabold text-[#0d3c61] mt-1 font-display leading-none">{adminAuditLogs.length}</h4>
          </div>
          <div className="w-9 h-9 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
            <History className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* 🎛️ SUB TABS */}
      <div className="flex border-b border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 pb-3 px-4 font-bold text-[11px] uppercase tracking-wider cursor-pointer border-b-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ⚡ TAB CONTENTS */}
      <div className="min-h-[400px]">

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Full-width: Research Velocity */}
            <div className="sm:col-span-2 lg:col-span-2">
              <ResearchVelocityCard />
            </div>

            {/* System Health */}
            <div className="sm:col-span-1">
              <SystemHealthCard />
            </div>

            {/* Collaborations */}
            <div className="sm:col-span-1">
              <CollaborationsCard />
            </div>

            {/* Campus Distribution */}
            <div className="sm:col-span-1">
              <CampusDistributionChart />
            </div>

            {/* Data Consumption */}
            <div className="sm:col-span-1">
              <DataConsumptionCard />
            </div>

            {/* Full-width: Achievements Feed */}
            <div className="sm:col-span-2 lg:col-span-3">
              <AchievementsFeed />
            </div>
          </div>
        )}

        {/* ─── USERS MODERATION TAB ─── */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            
            {/* Search Input */}
            <div className="max-w-xs">
              <input
                type="text"
                placeholder="Search users name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cb-input"
              />
            </div>

            {isLoading && adminUsers.length === 0 ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block cb-card overflow-hidden bg-white/90 backdrop-blur-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="cb-table-header">
                          <th className="p-3.5 pl-4">User</th>
                          <th className="p-3.5">Department</th>
                          <th className="p-3.5">Role</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 pr-4 text-right">Moderation Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="cb-table-row text-xs">
                            <td className="p-3.5 pl-4 flex items-center space-x-2.5">
                              <AvatarRing 
                                src={user.image || undefined} 
                                name={user.name || undefined}
                                role={user.role}
                                size="sm"
                              />
                              <div>
                                <h4 className="font-bold text-slate-900 leading-snug">{user.name || 'Academic Member'}</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">{user.email}</p>
                              </div>
                            </td>
                            <td className="p-3.5 text-slate-500 font-semibold">{user.department || 'Not Configured'}</td>
                            <td className="p-3.5 font-bold text-slate-800">{user.role}</td>
                            <td className="p-3.5">
                              {user.approved || user.role === 'RESEARCH_SUPERVISOR' || user.role === 'INSTITUTION_ADMIN' ? (
                                <span className="cb-status-success text-[10px]">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Approved</span>
                                </span>
                              ) : (
                                <span className="cb-status-warning text-[10px]">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Pending Approval</span>
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 pr-4 text-right">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                className="bg-white border border-slate-200 rounded px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:border-slate-300 focus:border-primary outline-none cursor-pointer transition-colors"
                              >
                                <option value="RESEARCH_SCHOLAR">Scholar</option>
                                <option value="RESEARCH_SUPERVISOR">Faculty PI</option>
                                <option value="INSTITUTION_ADMIN">Admin</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="cb-card p-5 bg-white/95 backdrop-blur-md space-y-4">
                      <div className="flex items-center gap-3">
                        <AvatarRing 
                          src={user.image || undefined} 
                          name={user.name || undefined}
                          role={user.role}
                          size="md"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 leading-snug">{user.name || 'Academic Member'}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-450 font-semibold">Department:</span>
                          <span className="font-bold text-slate-700">{user.department || 'Not Configured'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-450 font-semibold">Status:</span>
                          {user.approved || user.role === 'RESEARCH_SUPERVISOR' || user.role === 'INSTITUTION_ADMIN' ? (
                            <span className="text-emerald-700 font-bold">Approved</span>
                          ) : (
                            <span className="text-amber-700 font-bold">Pending Approval</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-slate-450 font-semibold">Assign Role:</span>
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-white border border-slate-200 rounded px-2.5 py-1 text-[11px] font-bold text-slate-700 outline-none cursor-pointer"
                          >
                            <option value="RESEARCH_SCHOLAR">Scholar</option>
                            <option value="RESEARCH_SUPERVISOR">Faculty PI</option>
                            <option value="INSTITUTION_ADMIN">Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        )}

        {/* ─── SUPERVISOR APPROVALS TAB ─── */}
        {activeTab === 'supervisors' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#0d3c61] uppercase tracking-wider font-display">Pending Faculty Guides</h3>
            
            {isLoading && adminUsers.length === 0 ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : pendingSupervisors.length > 0 ? (
              <div className="cb-card overflow-hidden bg-white/90 backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="cb-table-header">
                        <th className="p-3.5 pl-4">Supervisor Profile</th>
                        <th className="p-3.5">Department</th>
                        <th className="p-3.5 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingSupervisors.map((user) => (
                        <tr key={user.id} className="cb-table-row text-xs">
                          <td className="p-3.5 pl-4 flex items-center space-x-2.5">
                            <AvatarRing 
                              src={user.image || undefined} 
                              name={user.name || undefined}
                              role={user.role}
                              size="sm"
                            />
                            <div>
                              <h4 className="font-bold text-slate-900 leading-snug">{user.name || 'Unknown Name'}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-3.5 text-slate-500 font-semibold">{user.department || 'Not Configured'}</td>
                          <td className="p-3.5 pr-4 text-right flex justify-end space-x-2">
                            <button
                              onClick={() => handleApproveSupervisor(user.id)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold transition flex items-center space-x-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleDeclineSupervisor(user.id)}
                              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded font-bold transition flex items-center space-x-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 flex flex-col items-center justify-center space-y-2 bg-white">
                <UserCog className="w-8 h-8 text-slate-300" />
                <span className="text-xs font-semibold">No pending supervisor requests.</span>
              </div>
            )}
          </div>
        )}

        {/* ─── AUDIT LOGS TAB ─── */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#0d3c61] uppercase tracking-wider font-display">Intranet Security Audit Trail</h3>

            {isLoading && adminAuditLogs.length === 0 ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : adminAuditLogs.length > 0 ? (
              <div className="cb-card divide-y divide-slate-100 overflow-hidden bg-white/90 backdrop-blur-md">
                {adminAuditLogs.map((log) => (
                  <div key={log.id} className="p-4 text-xs text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/40 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[9px] font-bold uppercase tracking-wider">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          User ID: {log.userId || 'System'}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold shrink-0 uppercase">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 flex flex-col items-center justify-center space-y-2 bg-white">
                <History className="w-8 h-8 text-slate-300" />
                <span className="text-xs font-semibold">No audit logs recorded yet.</span>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
