'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { Users, Search, UserCheck, BookOpen, ShieldAlert, Loader2, Lock, Unlock, ArrowUpDown, Award } from 'lucide-react';
import AvatarRing from '@/components/AvatarRing';

export default function AdminSupervisorsPage() {
  const router = useRouter();
  const {
    currentUser,
    adminUsers,
    fetchAdminUsers,
    suspendUserToggle,
    isLoading
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [loadSortOrder, setLoadSortOrder] = useState<'asc' | 'desc' | null>(null);

  // Security check: Only Admins can access
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

  // Filter supervisors
  const supervisors = adminUsers.filter((u) => u.role === 'RESEARCH_SUPERVISOR');
  
  // Calculate scholars under each supervisor
  const getScholarsForSupervisor = (supervisorId: string) => {
    return adminUsers.filter((u) => u.role === 'RESEARCH_SCHOLAR' && u.supervisorId === supervisorId);
  };

  const handleSuspendToggle = async (userId: string, currentSuspended: boolean) => {
    const action = currentSuspended ? 'unsuspend' : 'suspend';
    if (confirm(`Are you sure you want to ${action} this supervisor?`)) {
      try {
        await suspendUserToggle(userId, !currentSuspended);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // Perform search and sort
  let filteredSupervisors = supervisors.filter((sup) => {
    const matchesSearch =
      (sup.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sup.department || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loadSortOrder) {
    filteredSupervisors = [...filteredSupervisors].sort((a, b) => {
      const loadA = getScholarsForSupervisor(a.id).length;
      const loadB = getScholarsForSupervisor(b.id).length;
      return loadSortOrder === 'asc' ? loadA - loadB : loadB - loadA;
    });
  }

  // Calculate Metrics
  const totalSupervisorsCount = supervisors.length;
  const totalScholarsWithSupervisor = adminUsers.filter(
    (u) => u.role === 'RESEARCH_SCHOLAR' && u.supervisorId
  ).length;
  const averageLoad = totalSupervisorsCount > 0 ? (totalScholarsWithSupervisor / totalSupervisorsCount).toFixed(1) : '0';
  
  // Find supervisor with max load
  let maxLoad = 0;
  supervisors.forEach((sup) => {
    const count = getScholarsForSupervisor(sup.id).length;
    if (count > maxLoad) maxLoad = count;
  });

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
          <Award className="w-4 h-4 text-primary" />
          <span>Faculty Directory</span>
        </span>
        <h1 className="cb-page-title mt-2 font-display">Research Supervisor Management</h1>
        <p className="cb-page-subtitle">
          Monitor advisory workload, audit research alignments, track assigned scholars, and moderate supervisor status.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cb-card p-5 bg-white/95 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Supervisors</p>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">{totalSupervisorsCount}</h3>
          </div>
        </div>

        <div className="cb-card p-5 bg-white/95 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/30 text-teal-600 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Advised Scholars</p>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">{totalScholarsWithSupervisor}</h3>
          </div>
        </div>

        <div className="cb-card p-5 bg-white/95 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average Advising Load</p>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">{averageLoad} / guide</h3>
          </div>
        </div>

        <div className="cb-card p-5 bg-white/95 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Peak Advising Load</p>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">{maxLoad} scholars</h3>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="cb-card p-5 bg-white/95 backdrop-blur-md flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search supervisors, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cb-input pl-9"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
        </div>

        <button
          onClick={() => {
            if (loadSortOrder === null) setLoadSortOrder('desc');
            else if (loadSortOrder === 'desc') setLoadSortOrder('asc');
            else setLoadSortOrder(null);
          }}
          className="w-full sm:w-auto px-4 h-[42px] border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>
            {loadSortOrder === 'desc'
              ? 'Load: High to Low'
              : loadSortOrder === 'asc'
              ? 'Load: Low to High'
              : 'Sort by Advising Load'}
          </span>
        </button>
      </div>

      {/* Main List */}
      {isLoading && adminUsers.length === 0 ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filteredSupervisors.length === 0 ? (
        <div className="cb-card p-12 text-center text-slate-450 font-sans">
          <Users className="w-8 h-8 mx-auto text-slate-300 mb-3" />
          <p className="text-xs font-semibold">No supervisors found matching criteria</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block cb-card overflow-hidden bg-white/95 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="cb-table-header text-[10px] uppercase tracking-wider text-slate-450 border-b border-slate-100">
                    <th className="p-4 pl-6">Supervisor</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Advising Load</th>
                    <th className="p-4">Active Scholars</th>
                    <th className="p-4 pr-6 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {filteredSupervisors.map((sup) => {
                    const scholarsList = getScholarsForSupervisor(sup.id);
                    const loadCount = scholarsList.length;
                    
                    return (
                      <tr key={sup.id} className="cb-table-row text-xs hover:bg-slate-50/20 transition-colors">
                        <td className="p-4 pl-6 flex items-center space-x-3">
                          <AvatarRing
                            src={sup.image || undefined}
                            name={sup.name || undefined}
                            role={sup.role}
                            size="sm"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 leading-snug flex items-center gap-1.5">
                              <span>{sup.name || 'Faculty Member'}</span>
                              {sup.suspended && (
                                <span className="text-[9px] bg-red-50 text-red-700 font-extrabold uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Suspended</span>
                                </span>
                              )}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-semibold">{sup.email}</p>
                          </div>
                        </td>

                        <td className="p-4 text-slate-500 font-bold">{sup.department || 'General'}</td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{loadCount}</span>
                            <div className="w-24 bg-slate-100 rounded-full h-1.5 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  loadCount >= 4
                                    ? 'bg-rose-500'
                                    : loadCount >= 2
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min((loadCount / 5) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold">({loadCount}/5 Max)</span>
                          </div>
                        </td>

                        <td className="p-4">
                          {loadCount === 0 ? (
                            <span className="text-[10px] text-slate-400 italic">No assigned scholars</span>
                          ) : (
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {scholarsList.slice(0, 4).map((scholar) => (
                                <div key={scholar.id} className="relative group/avatar" title={scholar.name || 'Scholar'}>
                                  <AvatarRing
                                    src={scholar.image}
                                    name={scholar.name || undefined}
                                    role={scholar.role}
                                    size="sm"
                                    className="border-2 border-white dark:border-slate-900"
                                  />
                                </div>
                              ))}
                              {loadCount > 4 && (
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:border-slate-900">
                                  +{loadCount - 4}
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => handleSuspendToggle(sup.id, !!sup.suspended)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ml-auto border cursor-pointer ${
                              sup.suspended
                                ? 'bg-emerald-50 border-emerald-250 text-emerald-700 hover:bg-emerald-100/60'
                                : 'bg-red-50 border-red-200 text-red-750 hover:bg-red-100/60'
                            }`}
                          >
                            {sup.suspended ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            <span>{sup.suspended ? 'Activate' : 'Suspend'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredSupervisors.map((sup) => {
              const scholarsList = getScholarsForSupervisor(sup.id);
              const loadCount = scholarsList.length;

              return (
                <div key={sup.id} className="cb-card p-5 bg-white/95 backdrop-blur-md space-y-4">
                  <div className="flex items-center gap-3">
                    <AvatarRing
                      src={sup.image || undefined}
                      name={sup.name || undefined}
                      role={sup.role}
                      size="md"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 leading-snug flex items-center gap-1.5">
                        <span>{sup.name || 'Faculty Member'}</span>
                        {sup.suspended && (
                          <span className="text-[9px] bg-red-50 text-red-700 font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Suspended</span>
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{sup.email}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100/70 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Department:</span>
                      <span className="font-bold text-slate-700">{sup.department || 'General'}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Advising Load:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{loadCount}</span>
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              loadCount >= 4
                                ? 'bg-rose-500'
                                : loadCount >= 2
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min((loadCount / 5) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-400 font-semibold">Assigned Scholars:</span>
                      <div className="flex -space-x-1 overflow-hidden">
                        {scholarsList.slice(0, 3).map((scholar) => (
                          <AvatarRing
                            key={scholar.id}
                            src={scholar.image}
                            name={scholar.name || undefined}
                            role={scholar.role}
                            size="sm"
                            className="border border-white dark:border-slate-900"
                          />
                        ))}
                        {loadCount > 3 && (
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[9px] font-bold text-slate-500">
                            +{loadCount - 3}
                          </div>
                        )}
                        {loadCount === 0 && (
                          <span className="text-[10px] text-slate-405 italic">None</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100/70 pt-3 flex justify-end">
                    <button
                      onClick={() => handleSuspendToggle(sup.id, !!sup.suspended)}
                      className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border cursor-pointer ${
                        sup.suspended
                          ? 'bg-emerald-50 border-emerald-250 text-emerald-700 hover:bg-emerald-100/60'
                          : 'bg-red-50 border-red-200 text-red-750 hover:bg-red-100/60'
                      }`}
                    >
                      {sup.suspended ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span>{sup.suspended ? 'Activate Account' : 'Suspend Account'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}
