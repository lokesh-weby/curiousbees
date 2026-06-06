'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { FileSpreadsheet, Plus, Search, Check, X, FileText, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportsPage() {
  const {
    currentUser,
    reports,
    supervisors,
    fetchReports,
    submitReport,
    reviewReport,
    fetchSupervisors,
    isLoading
  } = useStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<any | null>(null);

  // Scholar Submit Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');

  // Supervisor Review Form states
  const [feedback, setFeedback] = useState('');

  const isSupervisor = currentUser?.role === 'RESEARCH_SUPERVISOR';
  const isAdmin = currentUser?.role === 'INSTITUTION_ADMIN';

  useEffect(() => {
    fetchReports();
    if (!isSupervisor && !isAdmin) {
      fetchSupervisors();
    }
  }, [isSupervisor, isAdmin, fetchReports, fetchSupervisors]);

  // Set default supervisor if user already has one assigned
  useEffect(() => {
    if (currentUser?.supervisorId) {
      setSelectedSupervisorId(currentUser.supervisorId);
    }
  }, [currentUser]);

  const handleOpenSubmit = () => {
    setTitle('');
    setDescription('');
    setEvidenceUrl('');
    setSelectedSupervisorId(currentUser?.supervisorId || '');
    setActiveReport(null);
    setIsDrawerOpen(true);
  };

  const handleOpenReview = (report: any) => {
    setActiveReport(report);
    setFeedback(report.feedback || '');
    setIsDrawerOpen(true);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedSupervisorId) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      await submitReport({
        title,
        description: description || undefined,
        evidenceUrl: evidenceUrl || undefined,
        supervisorId: selectedSupervisorId
      });
      setIsDrawerOpen(false);
    } catch (err: any) {
      alert(`Error submitting report: ${err.message}`);
    }
  };

  const handleReviewReport = async (status: 'APPROVED' | 'REJECTED' | 'NEEDS_INFO') => {
    if (!activeReport) return;
    try {
      await reviewReport(activeReport.id, status, feedback || undefined);
      setIsDrawerOpen(false);
    } catch (err: any) {
      alert(`Error reviewing report: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* 🚀 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-primary" />
            <span>Research Progress Submissions</span>
          </span>
          <h1 className="cb-page-title mt-2 font-display">Academic Progress Reports</h1>
          <p className="cb-page-subtitle">
            Submit periodic research logs or review submitted scholar evidence and milestones.
          </p>
        </div>

        {!isSupervisor && !isAdmin && (
          <button
            onClick={handleOpenSubmit}
            className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Report</span>
          </button>
        )}
      </div>

      {/* 🚀 List */}
      <div className="grid grid-cols-1 gap-4">
        {reports.length === 0 ? (
          <div className="cb-card p-12 text-center bg-white/95 backdrop-blur-md">
            <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-900 font-bold text-sm">No Progress Reports Logged</h3>
            <p className="text-slate-400 text-xs mt-1">
              {isSupervisor
                ? 'Scholars have not submitted any progress reports to your review queue yet.'
                : 'Upload your monthly or semester-based research progress reports to your supervisor.'}
            </p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="cb-card p-5 bg-white/95 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 border ${
                    report.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    report.status === 'REJECTED' ? 'bg-red-50 text-red-750 border-red-100' :
                    report.status === 'NEEDS_INFO' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-slate-50 text-slate-650 border-slate-100'
                  }`}>
                    {report.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                    {report.status === 'REJECTED' && <AlertCircle className="w-3 h-3" />}
                    {report.status === 'NEEDS_INFO' && <AlertCircle className="w-3 h-3" />}
                    <span>{report.status}</span>
                  </span>

                  <span className="text-[10px] text-slate-400 font-semibold">
                    Submitted: {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{report.title}</h3>
                {report.description && <p className="text-xs text-slate-500 font-semibold line-clamp-2">{report.description}</p>}
                
                <div className="flex items-center space-x-4 text-[10px] text-slate-400 font-bold pt-1">
                  {report.evidenceUrl && (
                    <a
                      href={report.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Document Evidence</span>
                    </a>
                  )}
                  {isSupervisor || isAdmin ? (
                    <span>By Scholar: {report.scholar?.name} ({report.scholar?.department})</span>
                  ) : (
                    <span>Supervisor Reviewer: {report.supervisor?.name}</span>
                  )}
                </div>

                {report.feedback && (
                  <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-xs text-slate-600 mt-2 flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Supervisor Feedback:</span>
                      <p className="font-medium">{report.feedback}</p>
                    </div>
                  </div>
                )}
              </div>

              {isSupervisor && report.status === 'PENDING' && (
                <button
                  onClick={() => handleOpenReview(report)}
                  className="px-3.5 py-2 border border-primary text-primary hover:bg-primary/5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer self-end md:self-center shrink-0"
                >
                  Review Report
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* 🚀 Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-lg bg-white border-l border-slate-200 z-50 p-6 shadow-2xl flex flex-col overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center space-x-2.5">
                  <FileSpreadsheet className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#0d3c61]">
                      {activeReport ? 'Review Progress Report' : 'Submit Progress Report'}
                    </h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                      Academic Intranet System
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ─── SCHOLAR FORM ─── */}
              {!activeReport ? (
                <form onSubmit={handleSubmitReport} className="space-y-4 flex-1">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                      Report Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g. Monthly Progress Report - June 2026"
                      className="cb-input"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                      Supervisor / Faculty Guide *
                    </label>
                    <select
                      value={selectedSupervisorId}
                      onChange={(e) => setSelectedSupervisorId(e.target.value)}
                      required
                      className="w-full px-3 h-[42px] text-xs font-semibold rounded-lg bg-white border border-slate-200 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="">Select Supervisor</option>
                      {supervisors.map((sv) => (
                        <option key={sv.id} value={sv.id}>
                          {sv.name} ({sv.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                      Evidence / Document Link (PDF, Drive)
                    </label>
                    <input
                      type="url"
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      placeholder="e.g. https://drive.google.com/file/d/..."
                      className="cb-input"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                      Progress Summary & Scope
                    </label>
                    <textarea
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly summarize your progress, milestones hit, and any challenges..."
                      className="w-full px-3 py-2 text-xs leading-relaxed font-sans font-semibold rounded-lg bg-white border border-slate-200 outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-655 hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* ─── SUPERVISOR REVIEW PANEL ─── */
                <div className="space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2">
                      <h4 className="font-bold text-slate-900 text-sm">{activeReport.title}</h4>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                        {activeReport.description || 'No description summary provided.'}
                      </p>
                      {activeReport.evidenceUrl && (
                        <a
                          href={activeReport.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary font-bold hover:underline block pt-1"
                        >
                          Open Submitted Evidence Documents →
                        </a>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                        Supervisor Feedback / Comments
                      </label>
                      <textarea
                        rows={5}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide corrections, guidance, or details on next steps..."
                        className="w-full px-3 py-2 text-xs leading-relaxed font-sans font-semibold rounded-lg bg-white border border-slate-200 outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-6 border-t border-slate-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReviewReport('NEEDS_INFO')}
                        className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-250 hover:border-amber-350 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Needs Info
                      </button>
                      <button
                        onClick={() => handleReviewReport('REJECTED')}
                        className="flex-1 py-2.5 bg-red-50 hover:bg-red-100/60 text-red-700 border border-red-200 hover:border-red-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Reject
                      </button>
                    </div>
                    <button
                      onClick={() => handleReviewReport('APPROVED')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-655 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer text-center"
                    >
                      Approve Report
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
