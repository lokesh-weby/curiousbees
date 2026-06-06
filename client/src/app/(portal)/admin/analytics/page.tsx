'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, Users, BookOpen, FolderOpen, Calendar, Cpu } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const SIGNUP_DATA = [
  { month: 'Jan', Scholars: 45, Supervisors: 12 },
  { month: 'Feb', Scholars: 60, Supervisors: 15 },
  { month: 'Mar', Scholars: 85, Supervisors: 22 },
  { month: 'Apr', Scholars: 110, Supervisors: 28 },
  { month: 'May', Scholars: 145, Supervisors: 32 },
  { month: 'Jun', Scholars: 190, Supervisors: 40 }
];

const DEPT_DATA = [
  { name: 'Computing', Publications: 64, Workspaces: 24 },
  { name: 'Electronics', Publications: 45, Workspaces: 18 },
  { name: 'Electrical', Publications: 28, Workspaces: 10 },
  { name: 'BioTech', Publications: 52, Workspaces: 15 },
  { name: 'Mechanical', Publications: 18, Workspaces: 8 }
];

const WORKSPACE_DATA = [
  { name: 'Completed', value: 14 },
  { name: 'Active', value: 38 },
  { name: 'Delayed', value: 5 }
];

const COLORS = ['#10b981', '#004495', '#ef4444'];

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { currentUser, adminUsers, fetchAdminUsers } = useStore();

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

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* 🚀 Header */}
      <div className="border-b border-slate-100 pb-5">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span>University Analytics Hub</span>
        </span>
        <h1 className="cb-page-title mt-2 font-display">Academic Research Telemetry</h1>
        <p className="cb-page-subtitle">
          Real-time metrics on research publications velocity, scholar workflows, and system utilization.
        </p>
      </div>

      {/* 🚀 Metrics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1 */}
        <div className="cb-card p-5 bg-white/95 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Accounts</p>
            <h4 className="text-2xl font-extrabold text-[#0d3c61] mt-1 font-display leading-none">
              {adminUsers.length}
            </h4>
          </div>
          <div className="w-10 h-10 bg-primary/5 text-primary border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="cb-card p-5 bg-white/95 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Supervisors</p>
            <h4 className="text-2xl font-extrabold text-[#0d3c61] mt-1 font-display leading-none">
              {adminUsers.filter((u) => u.role === 'RESEARCH_SUPERVISOR').length}
            </h4>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="cb-card p-5 bg-white/95 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Projects</p>
            <h4 className="text-2xl font-extrabold text-[#0d3c61] mt-1 font-display leading-none">57</h4>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg flex items-center justify-center shrink-0">
            <FolderOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="cb-card p-5 bg-white/95 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Health</p>
            <h4 className="text-2xl font-extrabold text-emerald-600 mt-1 font-display leading-none">99.9%</h4>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 🚀 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Signup Trends */}
        <div className="cb-card p-5 bg-white/95 backdrop-blur-md space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Scholar vs. Supervisor Signups</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Registration trends over the last 6 months.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SIGNUP_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScholars" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004495" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#004495" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Scholars" stroke="#004495" strokeWidth={2} fillOpacity={1} fill="url(#colorScholars)" />
                <Area type="monotone" dataKey="Supervisors" stroke="#f59e0b" strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Department outputs */}
        <div className="cb-card p-5 bg-white/95 backdrop-blur-md space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Academic Deliverables by Node</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Publications and workspaces registered per department.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Bar dataKey="Publications" fill="#004495" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Workspaces" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Project Status Distribution */}
        <div className="cb-card p-5 bg-white/95 backdrop-blur-md space-y-4 lg:col-span-2 max-w-md mx-auto w-full">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Workspace Milestone Completion</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Summary of active vs. resolved project milestones.</p>
          </div>
          <div className="h-64 flex items-center justify-center gap-6">
            <div className="h-full w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={WORKSPACE_DATA}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {WORKSPACE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {WORKSPACE_DATA.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-slate-500 font-semibold">{entry.name}:</span>
                  <span className="font-bold text-slate-800">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
