'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { 
  FolderOpen, 
  CheckSquare, 
  Megaphone, 
  UploadCloud, 
  Plus, 
  Calendar, 
  User, 
  ArrowLeft,
  Loader2,
  FileText,
  X,
  Check,
  Download,
  AlertTriangle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  const { 
    currentUser, 
    activeWorkspace, 
    fetchWorkspaceDetails, 
    addWorkspaceFile, 
    addWorkspaceMilestone, 
    toggleWorkspaceMilestone, 
    addWorkspaceAnnouncement, 
    isLoading 
  } = useStore();

  // Local Form States
  const [activeTab, setActiveTab] = useState<'files' | 'milestones' | 'announcements'>('files');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [showFileModal, setShowFileModal] = useState(false);

  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneDueDate, setMilestoneDueDate] = useState('');
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);

  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceContent, setAnnounceContent] = useState('');
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceDetails(workspaceId).catch(() => {
        router.push('/workspace');
      });
    }
  }, [workspaceId, fetchWorkspaceDetails, router]);

  if (isLoading && !activeWorkspace) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Sparkles className="w-5 h-5 text-primary absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-xs text-primary font-bold uppercase tracking-wider font-mono">Secure Node Handshake</p>
          <p className="text-xs text-slate-400 font-semibold uppercase">Synchronizing research workspace credentials...</p>
        </div>
      </div>
    );
  }

  if (!activeWorkspace) {
    return (
      <div className="text-center py-12 cb-card max-w-md mx-auto my-12 p-8 space-y-5 bg-white/90 backdrop-blur-md">
        <div className="w-12 h-12 bg-red-50 text-red-600 border border-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display font-bold text-lg text-slate-900">Workspace Node Offline</h3>
          <p className="text-slate-500 text-xs font-semibold leading-relaxed">
            The requested research node does not exist or you do not have sufficient credential clearance.
          </p>
        </div>
        <button 
          onClick={() => router.push('/workspace')} 
          className="w-full py-2.5 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/95 transition-all shadow cursor-pointer"
        >
          Back to Workspaces
        </button>
      </div>
    );
  }

  // Find if current user is owner of workspace
  const userMemberRecord = activeWorkspace.members?.find(m => m.userId === currentUser?.id);
  const isOwner = userMemberRecord?.role === 'OWNER' || currentUser?.role === 'RESEARCH_SUPERVISOR' || currentUser?.role === 'INSTITUTION_ADMIN';

  // Handle file upload
  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName || !fileUrl) return;

    try {
      // Simulate size in KB
      const simulatedSize = Math.floor(Math.random() * 8000) + 500;
      await addWorkspaceFile(workspaceId, fileName, fileUrl, simulatedSize);
      setFileName('');
      setFileUrl('');
      setShowFileModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle milestone add
  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle) return;

    try {
      await addWorkspaceMilestone(workspaceId, milestoneTitle, milestoneDesc, milestoneDueDate || undefined);
      setMilestoneTitle('');
      setMilestoneDesc('');
      setMilestoneDueDate('');
      setShowMilestoneModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle announcement add
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announceTitle || !announceContent) return;

    try {
      await addWorkspaceAnnouncement(workspaceId, announceTitle, announceContent);
      setAnnounceTitle('');
      setAnnounceContent('');
      setShowAnnounceModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Get initials for member avatars
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // Progress metrics calculation
  const totalMilestones = activeWorkspace.milestones?.length || 0;
  const completedMilestones = activeWorkspace.milestones?.filter(m => m.completed).length || 0;
  const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="space-y-6 text-left select-none max-w-7xl mx-auto">
      
      {/* 🔙 BACK HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <button 
          onClick={() => router.push('/workspace')} 
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Workspaces</span>
        </button>
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Secure Research Node</span>
        </span>
      </div>

      {/* 📄 WORKSPACE HEADER DETAILS */}
      <div className="cb-card p-6 bg-white/90 backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-4 relative z-10 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-primary/5 text-primary border border-primary/15 font-label-caps text-[10px] uppercase tracking-wider font-bold">
              Active Research Lab
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              ID: {workspaceId.substring(0, 8)}
            </span>
          </div>
          
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            {activeWorkspace.title}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-3xl leading-relaxed font-medium">
            {activeWorkspace.description || 'Shared institutional workspace for research peer collaboration, file management, and milestones tracking.'}
          </p>

          {/* Members ring */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
            <span className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Research Group:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {activeWorkspace.members?.map((member) => (
                <div key={member.userId} className="flex items-center space-x-2 bg-slate-50 border border-slate-200/50 px-2.5 py-1 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center shrink-0">
                    {member.user?.image ? (
                      <img src={member.user.image} alt={member.user.name || ''} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-primary">{getInitials(member.user?.name || '')}</span>
                    )}
                  </div>
                  <div className="text-left leading-none">
                    <p className="text-xs font-bold text-slate-800">{member.user?.name}</p>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 block">
                      {member.role === 'OWNER' ? 'Principal Investigator' : 'Collaborator'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress pipeline meter */}
        <div className="cb-card p-5 bg-slate-50/50 border-slate-200/50 w-full md:w-64 relative z-10 flex flex-col justify-between self-stretch shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace Progress</span>
            <span className="text-xs font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
              />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {completedMilestones} of {totalMilestones} Milestones Completed
            </p>
          </div>
        </div>
      </div>

      {/* 🎛️ TAB TRIGGERS */}
      <div className="flex gap-1 bg-slate-100/80 border border-slate-200/50 p-1 rounded-xl max-w-md">
        {([
          { id: 'files', label: 'Files & Artifacts', icon: FileText },
          { id: 'milestones', label: 'Milestones Checklist', icon: CheckSquare },
          { id: 'announcements', label: 'Announcements', icon: Megaphone }
        ] as const).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex-1 cursor-pointer select-none ${
                isActive 
                  ? 'bg-white text-primary shadow-sm border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ⚡ TAB CONTENTS */}
      <div className="min-h-[300px] pt-2">
        <AnimatePresence mode="wait">
          
          {/* ── FILES TAB ── */}
          {activeTab === 'files' && (
            <motion.div
              key="files-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Shared Documents & Drafts</h3>
                <button 
                  onClick={() => setShowFileModal(true)} 
                  className="flex items-center space-x-1.5 px-3 py-2 bg-primary hover:bg-primary/95 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                </button>
              </div>

              {/* simulated drop zone */}
              <div 
                onClick={() => setShowFileModal(true)} 
                className="border border-dashed border-slate-300 hover:border-primary/60 bg-white hover:bg-primary/5 rounded-xl p-8 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center space-y-2.5"
              >
                <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200 border border-primary/10">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">Select Research Resource or PDF</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Drag & drop files or click here to upload</p>
                </div>
              </div>

              {activeWorkspace.files && activeWorkspace.files.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeWorkspace.files.map((file) => {
                    const nameLower = file.name.toLowerCase();
                    let fileColorClass = "bg-blue-50 text-blue-600 border-blue-100";
                    if (nameLower.endsWith('.pdf')) fileColorClass = "bg-rose-50 text-rose-600 border-rose-100";
                    else if (nameLower.endsWith('.zip') || nameLower.endsWith('.rar')) fileColorClass = "bg-amber-50 text-amber-600 border-amber-100";
                    else if (nameLower.endsWith('.csv') || nameLower.endsWith('.xlsx')) fileColorClass = "bg-emerald-50 text-emerald-600 border-emerald-100";

                    return (
                      <div 
                        key={file.id} 
                        className="cb-card p-4 flex items-start justify-between hover:border-primary/40 transition-all duration-200 group bg-white"
                      >
                        <div className="flex items-start space-x-3 text-left min-w-0">
                          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${fileColorClass}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-primary transition-colors" title={file.name}>
                              {file.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                              Uploaded by {file.uploadedBy?.name || 'Academic'} | {file.size} KB
                            </p>
                          </div>
                        </div>
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-primary hover:bg-primary hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider shrink-0 ml-2 flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Get</span>
                        </a>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 bg-white/50 flex flex-col items-center justify-center space-y-2">
                  <FolderOpen className="w-8 h-8 text-slate-300" />
                  <span className="text-xs font-semibold text-slate-500">No files or scientific proposals shared yet.</span>
                </div>
              )}
            </motion.div>
          )}

          {/* ── MILESTONES TAB ── */}
          {activeTab === 'milestones' && (
            <motion.div
              key="milestones-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Research Roadmap Checklist</h3>
                {isOwner && (
                  <button 
                    onClick={() => setShowMilestoneModal(true)} 
                    className="flex items-center space-x-1.5 px-3 py-2 bg-primary hover:bg-primary/95 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone</span>
                  </button>
                )}
              </div>

              {activeWorkspace.milestones && activeWorkspace.milestones.length > 0 ? (
                <div className="relative pl-6 border-l border-slate-200 space-y-6 ml-3 py-2 text-left">
                  {activeWorkspace.milestones.map((milestone) => {
                    const isCompleted = milestone.completed;

                    return (
                      <div key={milestone.id} className="relative">
                        {/* Timeline node */}
                        <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'border-primary bg-primary text-white scale-110' 
                            : 'border-slate-300'
                        }`}>
                          {isCompleted && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                        </div>

                        {/* Milestone info card */}
                        <div className={`cb-card p-4 relative overflow-hidden transition-all duration-200 ${
                          isCompleted 
                            ? 'border-slate-100 bg-slate-50/50 opacity-85' 
                            : 'border-slate-200 hover:border-primary/30 bg-white'
                        }`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className={`text-xs font-bold leading-tight truncate ${
                                  isCompleted ? 'line-through text-slate-400 font-semibold' : 'text-slate-900'
                                }`}>
                                  {milestone.title}
                                </h4>
                                {isCompleted ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-bold uppercase tracking-wider">
                                    Done
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[8px] font-bold uppercase tracking-wider">
                                    In Progress
                                  </span>
                                )}
                              </div>
                              {milestone.description && (
                                <p className={`text-xs leading-relaxed ${isCompleted ? 'text-slate-400' : 'text-slate-500 font-medium'}`}>
                                  {milestone.description}
                                </p>
                              )}
                              {milestone.dueDate && (
                                <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">
                                  <Calendar className="w-3.5 h-3.5 mr-1" />
                                  <span>Due {new Date(milestone.dueDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>

                            <input 
                              type="checkbox" 
                              checked={milestone.completed}
                              onChange={(e) => toggleWorkspaceMilestone(workspaceId, milestone.id, e.target.checked)}
                              className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary focus:ring-offset-0 cursor-pointer mt-0.5 shrink-0"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 bg-white/50 flex flex-col items-center justify-center space-y-2">
                  <CheckSquare className="w-8 h-8 text-slate-300" />
                  <span className="text-xs font-semibold text-slate-500">No milestone checks registered in this node.</span>
                </div>
              )}
            </motion.div>
          )}

          {/* ── ANNOUNCEMENTS TAB ── */}
          {activeTab === 'announcements' && (
            <motion.div
              key="announcements-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Group Broadcasts</h3>
                <button 
                  onClick={() => setShowAnnounceModal(true)} 
                  className="flex items-center space-x-1.5 px-3 py-2 bg-primary hover:bg-primary/95 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Post Announcement</span>
                </button>
              </div>

              {activeWorkspace.announcements && activeWorkspace.announcements.length > 0 ? (
                <div className="space-y-4">
                  {activeWorkspace.announcements.map((announce) => (
                    <div 
                      key={announce.id} 
                      className="cb-card p-5 relative overflow-hidden bg-white hover:border-slate-300 transition-all duration-200 text-left"
                    >
                      <div className="flex items-start space-x-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center shrink-0">
                          {announce.author?.image ? (
                            <img src={announce.author.image} alt={announce.author.name || ''} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[11px] font-bold text-primary">{getInitials(announce.author?.name || '')}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900">{announce.author?.name}</h4>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{new Date(announce.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-primary/5 text-primary border border-primary/10 text-[8px] font-mono font-bold uppercase tracking-wider mt-1 inline-block">
                            Synergy Broadcast
                          </span>
                          <div className="mt-3 space-y-1">
                            <h3 className="text-xs font-bold text-primary">{announce.title}</h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">{announce.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 bg-white/50 flex flex-col items-center justify-center space-y-2">
                  <Megaphone className="w-8 h-8 text-slate-300" />
                  <span className="text-xs font-semibold text-slate-500">No announcements broadcasted.</span>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── MODALS SECTION (Animated with Backdrop Blurs) ── */}
      <AnimatePresence>
        
        {/* MODAL 1: ADD FILE */}
        {showFileModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFileModal(false)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="cb-card bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4 relative z-10 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Share Research Document</h3>
                <button onClick={() => setShowFileModal(false)} className="p-1 hover:bg-slate-100 rounded transition cursor-pointer">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleUploadFile} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">File Name</label>
                  <input 
                    type="text" 
                    required
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g. LiteratureReview_v2.pdf"
                    className="cb-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Document URL</label>
                  <input 
                    type="url" 
                    required
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="e.g. https://storage.srmist.edu/files/draft.pdf"
                    className="cb-input"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowFileModal(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-primary text-white hover:bg-primary/95 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow transition cursor-pointer"
                  >
                    Upload Document
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODAL 2: ADD MILESTONE */}
        {showMilestoneModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMilestoneModal(false)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="cb-card bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4 relative z-10 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">New Research Milestone</h3>
                <button onClick={() => setShowMilestoneModal(false)} className="p-1 hover:bg-slate-100 rounded transition cursor-pointer">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleCreateMilestone} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Milestone Title</label>
                  <input 
                    type="text" 
                    required
                    value={milestoneTitle}
                    onChange={(e) => setMilestoneTitle(e.target.value)}
                    placeholder="e.g. Initial Dataset Analysis"
                    className="cb-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                  <textarea 
                    value={milestoneDesc}
                    onChange={(e) => setMilestoneDesc(e.target.value)}
                    placeholder="Outline checklist goals..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 font-sans text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-colors resize-none h-[64px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Due Date</label>
                  <input 
                    type="date" 
                    value={milestoneDueDate}
                    onChange={(e) => setMilestoneDueDate(e.target.value)}
                    className="cb-input cursor-pointer"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowMilestoneModal(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-primary text-white hover:bg-primary/95 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow transition cursor-pointer"
                  >
                    Create Milestone
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODAL 3: ADD ANNOUNCEMENT */}
        {showAnnounceModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAnnounceModal(false)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="cb-card bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4 relative z-10 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Broadcast to Group</h3>
                <button onClick={() => setShowAnnounceModal(false)} className="p-1 hover:bg-slate-100 rounded transition cursor-pointer">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject Title</label>
                  <input 
                    type="text" 
                    required
                    value={announceTitle}
                    onChange={(e) => setAnnounceTitle(e.target.value)}
                    placeholder="e.g. Schedule for Lab Review"
                    className="cb-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Content</label>
                  <textarea 
                    required
                    value={announceContent}
                    onChange={(e) => setAnnounceContent(e.target.value)}
                    placeholder="Write the announcement details..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 font-sans text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-colors resize-none h-[90px]"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowAnnounceModal(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-primary text-white hover:bg-primary/95 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow transition cursor-pointer"
                  >
                    Post Broadcast
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
