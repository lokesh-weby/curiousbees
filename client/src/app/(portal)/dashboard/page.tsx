'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import {
  GraduationCap,
  FileText,
  FlaskConical,
  BookOpen,
  Calendar as CalendarIcon,
  FolderOpen,
  Briefcase,
  Megaphone,
  Bell,
  Activity,
  Plus,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { DashboardShell } from '@/components/shared/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { MetricCard } from '@/components/shared/metric-card';
import AvatarRing from '@/components/AvatarRing';

export default function DashboardPage() {
  const router = useRouter();
  const {
    currentUser,
    threads,
    opportunities,
    workspaces,
    publications,
    reports,
    events,
    notifications,
    myScholars,
    fetchData,
    fetchWorkspaces,
    fetchPublications,
    fetchReports,
    fetchEvents,
    fetchNotifications,
    fetchMyScholars,
  } = useStore();

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchData(); // Fetch Threads & Opportunities
    fetchWorkspaces();
    fetchPublications(currentUser?.role === 'RESEARCH_SUPERVISOR' ? undefined : currentUser?.id);
    fetchReports();
    fetchEvents();
    fetchNotifications();
    if (currentUser?.role === 'RESEARCH_SUPERVISOR') {
      fetchMyScholars();
    }
  }, [
    currentUser,
    fetchData,
    fetchWorkspaces,
    fetchPublications,
    fetchReports,
    fetchEvents,
    fetchNotifications,
    fetchMyScholars
  ]);

  const isSupervisor = currentUser?.role === 'RESEARCH_SUPERVISOR';
  const roleName = isSupervisor ? 'Faculty Supervisor' : 'Research Scholar';

  // ─── Metrics Calculation ──────────────────────────────────────────────────
  const activeScholarsCount = myScholars.length;
  const pendingReviewsCount = reports.filter((r) => r.status === 'PENDING').length;
  const scholarPubsCount = publications.length;

  // ─── Mini Calendar Grid Logic ─────────────────────────────────────────────
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const daysArray = [
    ...Array(firstDayIndex).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1)
  ];

  // Helper to check if a day has events
  const hasEventOnDay = (day: number | null) => {
    if (!day) return false;
    const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(ev => ev.date === targetDateStr);
  };

  return (
    <DashboardShell>
      
      {/* 🚀 1. WELCOME SECTION */}
      <div className="cb-card p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/15 text-[10px] font-bold uppercase tracking-wider">
            {roleName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Welcome back, {currentUser?.name?.split(' ')[0] || 'Academic'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl leading-relaxed">
            CuriousBees Intranet is online. Access your publications database, oversee active milestones, and discover synergy opportunities.
          </p>
        </div>
        
        {/* Profile Snapshot card */}
        {currentUser && (
          <div className="bg-white/80 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3 shrink-0 relative z-10 w-full md:w-auto shadow-sm">
            <AvatarRing
              src={currentUser.image}
              name={currentUser.name || undefined}
              role={currentUser.role}
              size="md"
            />
            <div className="text-left min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{currentUser.name}</h4>
              <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[150px]">{currentUser.email}</p>
              <p className="text-[9px] text-primary font-bold uppercase tracking-wider mt-1">{currentUser.department || 'SRM Intranet'}</p>
            </div>
          </div>
        )}
      </div>

      {/* 🚀 2. RESEARCH ANALYTICS (METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {isSupervisor ? (
          <>
            <MetricCard
              title="Supervised Scholars"
              value={activeScholarsCount}
              icon={<GraduationCap className="w-4.5 h-4.5 text-primary" />}
              variant="primary"
              delta="+1 new scholar"
              deltaType="up"
            />
            <MetricCard
              title="Reports Pending Review"
              value={pendingReviewsCount}
              icon={<ClipboardList className="w-4.5 h-4.5 text-amber-500" />}
              variant={pendingReviewsCount > 0 ? 'warning' : 'success'}
              description="Needs grading validation"
            />
            <MetricCard
              title="Campus Citation Index"
              value="1,432"
              icon={<BookOpen className="w-4.5 h-4.5 text-indigo-500" />}
              variant="info"
              delta="+128 citations"
              deltaType="up"
            />
          </>
        ) : (
          <>
            <MetricCard
              title="Publications Count"
              value={scholarPubsCount}
              icon={<BookOpen className="w-4.5 h-4.5 text-primary" />}
              variant="primary"
              delta="+2 this semester"
              deltaType="up"
            />
            <MetricCard
              title="Submitted Reports"
              value={reports.length}
              icon={<ClipboardList className="w-4.5 h-4.5 text-indigo-500" />}
              variant="info"
              description="Periodic progress logs"
            />
            <MetricCard
              title="Academic H-Index"
              value="24"
              icon={<TrendingUp className="w-4.5 h-4.5 text-emerald-500" />}
              variant="success"
              delta="+3 H-Index delta"
              deltaType="up"
            />
          </>
        )}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2): Content Feeds */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 🚀 3. ACTIVE WORKSPACES */}
          <div className="cb-card bg-white/95 backdrop-blur-md p-5 space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-primary" />
                <span>My Active Workspaces</span>
              </h3>
              <Link href="/workspace" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {workspaces.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                You are not mapped to any active research workspaces yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {workspaces.slice(0, 4).map((ws) => {
                  const total = ws.milestones?.length || 0;
                  const completed = ws.milestones?.filter(m => m.completed).length || 0;
                  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <Link key={ws.id} href={`/workspace/${ws.id}`} className="group">
                      <div className="p-4 border border-slate-200 hover:border-primary rounded-xl hover:bg-slate-50/30 transition-all space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{ws.title}</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                            <span>Milestones</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 🚀 4. RESEARCH OPPORTUNITIES */}
          <div className="cb-card bg-white/95 backdrop-blur-md p-5 space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-primary" />
                <span>Latest Opportunities</span>
              </h3>
              <Link href="/opportunities" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {opportunities.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs font-medium">
                No active vacancies listed in this university node.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {opportunities.slice(0, 3).map((opp) => (
                  <div key={opp.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{opp.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">{opp.department} • {opp.researchDomain}</p>
                    </div>
                    <Link href="/opportunities" className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-primary text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors">
                      Apply
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🚀 5. RECENT PUBLICATIONS */}
          <div className="cb-card bg-white/95 backdrop-blur-md p-5 space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Recent Publications</span>
              </h3>
              <Link href="/publications" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {publications.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs font-medium">
                No publications logged in your account registry yet.
              </div>
            ) : (
              <div className="space-y-3">
                {publications.slice(0, 3).map((pub) => (
                  <div key={pub.id} className="p-3 bg-slate-50/50 border border-slate-200/50 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">{pub.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{pub.authors} ({pub.year}) • {pub.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Span 1): Sidebar Widget Board */}
        <div className="space-y-6">
          
          {/* 🚀 10. QUICK ACTIONS */}
          <div className="cb-card bg-white/95 backdrop-blur-md p-5 space-y-4 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span>Workspace Quick Actions</span>
            </h3>
            <div className="flex flex-col gap-2">
              {isSupervisor ? (
                <>
                  <Link href="/opportunities" className="w-full">
                    <button className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Post Opportunity</span>
                    </button>
                  </Link>
                  <Link href="/events" className="w-full">
                    <button className="w-full py-2.5 bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Schedule Event</span>
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/publications" className="w-full">
                    <button className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Publication</span>
                    </button>
                  </Link>
                  <Link href="/reports" className="w-full">
                    <button className="w-full py-2.5 bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Submit Progress Log</span>
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* 🚀 9. CALENDAR WIDGET & 3. UPCOMING EVENTS */}
          <div className="cb-card bg-white/95 backdrop-blur-md p-5 space-y-4 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <span>Calendar & Deadlines</span>
            </h3>

            {/* Mini Calendar Monthly grid */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
              <div className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                {monthName} {year}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[9px] text-slate-400 mb-1">
                {dayNames.map(d => <span key={d}>{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-700">
                {daysArray.map((day, idx) => {
                  if (day === null) return <span key={`empty-${idx}`} />;
                  const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                  const hasEvents = hasEventOnDay(day);

                  return (
                    <div 
                      key={`day-${day}`} 
                      className={`relative w-6 h-6 flex items-center justify-center rounded-full mx-auto ${
                        isToday 
                          ? 'bg-primary text-white scale-110 shadow-sm' 
                          : hasEvents 
                          ? 'bg-primary/5 text-primary border border-primary/20' 
                          : 'hover:bg-slate-100 cursor-pointer'
                      }`}
                    >
                      <span>{day}</span>
                      {hasEvents && !isToday && (
                        <span className="absolute bottom-0.5 w-1 h-1 bg-primary rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Events snippet */}
            <div className="space-y-2.5">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Upcoming Schedule</p>
              {events.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No scheduled calendar events.</p>
              ) : (
                events.slice(0, 2).map((ev) => (
                  <div key={ev.id} className="text-xs flex gap-2 items-start leading-snug">
                    <span className="px-2 py-0.5 rounded bg-primary/5 text-primary text-[9px] font-mono font-bold shrink-0">{ev.date.substring(5)}</span>
                    <span className="font-semibold text-slate-700 truncate">{ev.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 🚀 7. RECENT REPORTS */}
          <div className="cb-card bg-white/95 backdrop-blur-md p-5 space-y-4 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <FileText className="w-4 h-4 text-primary" />
              <span>Progress Log Status</span>
            </h3>

            {isSupervisor ? (
              <div className="space-y-2.5">
                {reports.filter(r => r.status === 'PENDING').length === 0 ? (
                  <p className="text-xs text-slate-400 italic font-medium">No reports waiting in review queue.</p>
                ) : (
                  reports.filter(r => r.status === 'PENDING').slice(0, 3).map((report) => (
                    <div key={report.id} className="text-xs border border-slate-200 rounded-xl p-3 flex justify-between items-center gap-3">
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{report.title}</h4>
                        <p className="text-[9px] text-slate-400 font-semibold truncate">By: {report.scholar?.name}</p>
                      </div>
                      <Link href="/reports" className="text-[9px] font-bold text-primary uppercase shrink-0">
                        Grade
                      </Link>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {reports.length === 0 ? (
                  <p className="text-xs text-slate-400 italic font-medium">No progress logs submitted yet.</p>
                ) : (
                  reports.slice(0, 3).map((report) => (
                    <div key={report.id} className="text-xs border border-slate-200 rounded-xl p-3 flex justify-between items-center gap-2">
                      <span className="font-bold text-slate-800 truncate pr-2">{report.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0 ${
                        report.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                        report.status === 'REJECTED' ? 'bg-red-50 text-red-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 🚀 8. NOTIFICATIONS & 11. RECENT ACTIVITY FEED */}
          <div className="cb-card bg-white/95 backdrop-blur-md p-5 space-y-4 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Bell className="w-4 h-4 text-primary" />
              <span>Activity & Broadcasts</span>
            </h3>

            {/* Notification logs snippet */}
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No recent push alerts.</p>
              ) : (
                notifications.slice(0, 3).map((noti) => (
                  <div key={noti.id} className="text-xs flex gap-2 items-start leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-700 line-clamp-1">{noti.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 font-medium">{noti.body}</p>
                      <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block pt-0.5">{new Date(noti.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 🚀 12. ANNOUNCEMENTS */}
          <div className="cb-card bg-white/95 backdrop-blur-md p-5 space-y-4 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Megaphone className="w-4 h-4 text-primary" />
              <span>Announcements Board</span>
            </h3>

            <div className="bg-amber-50/30 border border-amber-250/20 p-4 rounded-xl text-left space-y-2">
              <h4 className="text-xs font-bold text-amber-800 leading-snug flex items-center gap-1">
                <Megaphone className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
                <span>Intranet Academic Notice</span>
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                Please complete your monthly progress log reports and publish co-authored journal DOIs before the upcoming semester committee audit review.
              </p>
            </div>
          </div>

        </div>

      </div>

    </DashboardShell>
  );
}
