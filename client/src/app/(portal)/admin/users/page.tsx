'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { UserCog, Search, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Lock, Unlock, Loader2 } from 'lucide-react';
import AvatarRing from '@/components/AvatarRing';

export default function AdminUsersPage() {
  const router = useRouter();
  const {
    currentUser,
    adminUsers,
    fetchAdminUsers,
    changeUserRole,
    suspendUserToggle,
    isLoading
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Guard against non-admin access
  useEffect(() => {
    if (currentUser && currentUser.role !== 'INSTITUTION_ADMIN') {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (currentUser?.role === 'INSTITUTION_ADMIN') {
      fetchAdminUsers();
    }
  }, [currentUser, fetchAdminUsers]);

  if (currentUser?.role !== 'INSTITUTION_ADMIN') {
    return null;
  }

  const handleRoleChange = async (userId: string, newRole: any) => {
    try {
      await changeUserRole(userId, newRole);
    } catch (err: any) {
      alert(`Error updating role: ${err.message}`);
    }
  };

  const handleSuspendToggle = async (userId: string, currentSuspended: boolean) => {
    const action = currentSuspended ? 'unsuspend' : 'suspend';
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await suspendUserToggle(userId, !currentSuspended);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filteredUsers = adminUsers.filter((user) => {
    const matchesSearch =
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* 🚀 Header */}
      <div className="border-b border-slate-100 pb-5">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
          <UserCog className="w-4 h-4 text-primary" />
          <span>User Moderation & Security</span>
        </span>
        <h1 className="cb-page-title mt-2 font-display">University Account Management</h1>
        <p className="cb-page-subtitle">
          Monitor user access status, toggle roles, verify scholars, and suspend/unsuspend members.
        </p>
      </div>

      {/* 🚀 Search & Filters */}
      <div className="cb-card p-5 bg-white/95 backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search name, email, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cb-input pl-9"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full px-3 h-[42px] text-xs font-semibold rounded-lg bg-white border border-slate-200 focus:outline-none transition-all cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="RESEARCH_SCHOLAR">Scholar</option>
          <option value="RESEARCH_SUPERVISOR">Supervisor</option>
          <option value="INSTITUTION_ADMIN">Admin</option>
        </select>
      </div>

      {/* 🚀 Users Table */}
      {isLoading && adminUsers.length === 0 ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block cb-card overflow-hidden bg-white/95 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="cb-table-header text-[10px] uppercase tracking-wider text-slate-450 border-b border-slate-100">
                    <th className="p-4 pl-6">User Details</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Platform Role</th>
                    <th className="p-4">Approval Status</th>
                    <th className="p-4 pr-6 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="cb-table-row text-xs hover:bg-slate-50/20 transition-colors">
                      <td className="p-4 pl-6 flex items-center space-x-3">
                        <AvatarRing
                          src={user.image || undefined}
                          name={user.name || undefined}
                          role={user.role}
                          size="sm"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 leading-snug flex items-center gap-1.5">
                            <span>{user.name || 'Academic Candidate'}</span>
                            {user.suspended && (
                              <span className="text-[9px] bg-red-50 text-red-700 font-extrabold uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Suspended</span>
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-semibold">{user.email}</p>
                        </div>
                      </td>
                      
                      <td className="p-4 text-slate-500 font-bold">{user.department || 'General'}</td>
                      
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-white border border-slate-200 rounded px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:border-slate-350 outline-none cursor-pointer"
                        >
                          <option value="RESEARCH_SCHOLAR">Scholar</option>
                          <option value="RESEARCH_SUPERVISOR">Faculty Guide</option>
                          <option value="INSTITUTION_ADMIN">Admin</option>
                        </select>
                      </td>

                      <td className="p-4">
                        {user.approved || user.role === 'RESEARCH_SUPERVISOR' || user.role === 'INSTITUTION_ADMIN' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approved</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-bold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Pending Approval</span>
                          </span>
                        )}
                      </td>

                      <td className="p-4 pr-6 text-right">
                        {user.id !== currentUser.id ? (
                          <button
                            onClick={() => handleSuspendToggle(user.id, !!user.suspended)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ml-auto border cursor-pointer ${
                              user.suspended
                                ? 'bg-emerald-50 border-emerald-250 text-emerald-700 hover:bg-emerald-100/60'
                                : 'bg-red-50 border-red-200 text-red-750 hover:bg-red-100/60'
                            }`}
                          >
                            {user.suspended ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            <span>{user.suspended ? 'Activate' : 'Suspend'}</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold italic pr-2">Self Session</span>
                        )}
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
                    <h4 className="font-bold text-slate-900 leading-snug flex items-center gap-1.5">
                      <span>{user.name || 'Academic Candidate'}</span>
                      {user.suspended && (
                        <span className="text-[9px] bg-red-50 text-red-700 font-extrabold uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Suspended</span>
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{user.email}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-450 font-semibold">Department:</span>
                    <span className="font-bold text-slate-700">{user.department || 'General'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-450 font-semibold">Approval:</span>
                    {user.approved || user.role === 'RESEARCH_SUPERVISOR' || user.role === 'INSTITUTION_ADMIN' ? (
                      <span className="text-emerald-700 font-bold">Approved</span>
                    ) : (
                      <span className="text-amber-700 font-bold">Pending Approval</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-455 font-semibold">Assign Role:</span>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-white border border-slate-250 rounded px-2.5 py-1 text-[11px] font-bold text-slate-700 outline-none cursor-pointer"
                    >
                      <option value="RESEARCH_SCHOLAR">Scholar</option>
                      <option value="RESEARCH_SUPERVISOR">Faculty Guide</option>
                      <option value="INSTITUTION_ADMIN">Admin</option>
                    </select>
                  </div>
                </div>

                {user.id !== currentUser.id && (
                  <div className="border-t border-slate-100 pt-3 flex justify-end">
                    <button
                      onClick={() => handleSuspendToggle(user.id, !!user.suspended)}
                      className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border cursor-pointer ${
                        user.suspended
                          ? 'bg-emerald-50 border-emerald-250 text-emerald-700 hover:bg-emerald-100/60'
                          : 'bg-red-50 border-red-200 text-red-750 hover:bg-red-100/60'
                      }`}
                    >
                      {user.suspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>{user.suspended ? 'Activate Account' : 'Suspend Account'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
