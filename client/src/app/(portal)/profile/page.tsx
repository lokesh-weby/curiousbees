'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { SRM_DEPARTMENTS } from '@/shared/shared-utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProfileSchema } from '@/shared/shared-utils';
import { UserRole } from '@/shared/types';
import { 
  BookOpen, 
  MapPin, 
  FileText, 
  Check, 
  Edit3, 
  Tag, 
  Plus, 
  X,
  Sparkles,
  GraduationCap,
  Award,
  Calendar,
  Layers,
  Search,
  Network,
  Activity,
  Download,
  Share2,
  Loader2,
  ArrowRight,
  User,
  Lock,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { currentUser, updateProfile, interestsList, roleOverride, threads, collaborators, fetchCollaborators } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser?.interests?.map((i) => i.interest?.name || '') || []
  );
  const [newInterestInput, setNewInterestInput] = useState('');
  
  // Settings Tab state
  const [activeSettingsTab, setActiveSettingsTab] = useState<'identity' | 'domains' | 'security'>('identity');

  useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  // Setup form validation via React Hook Form and Zod
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: currentUser?.name || '',
      role: currentUser?.role || 'RESEARCH_SCHOLAR',
      department: currentUser?.department || '',
      bio: currentUser?.bio || '',
    }
  });

  // Keep form in sync when currentUser loads
  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name || '',
        role: currentUser.role || 'RESEARCH_SCHOLAR',
        department: currentUser.department || '',
        bio: currentUser.bio || '',
      });
      setSelectedInterests(currentUser.interests?.map((i) => i.interest?.name || '') || []);
    }
  }, [currentUser, reset]);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      interests: selectedInterests
    };

    try {
      await updateProfile(payload);
      setIsEditing(false);
    } catch (e: any) {
      alert(`Error updating profile: ${e.message}`);
    }
  };

  const handleAddInterest = (name: string) => {
    const cleaned = name.trim();
    if (cleaned && !selectedInterests.includes(cleaned)) {
      if (selectedInterests.length >= 8) {
        alert('You can select up to 8 interests only.');
        return;
      }
      setSelectedInterests([...selectedInterests, cleaned]);
    }
    setNewInterestInput('');
  };

  const handleRemoveInterest = (name: string) => {
    setSelectedInterests(selectedInterests.filter(t => t !== name));
  };

  // Filter threads made by current user
  const userThreads = threads.filter(t => t.authorId === currentUser?.id);

  // Initials for avatar
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'CB';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // Collaborators to display on the network graph
  const graphCollaborators = collaborators
    .filter(c => c.id !== currentUser?.id)
    .slice(0, 3);

  // Fallback default network nodes if collaborators directory is empty
  const defaultNetwork = [
    { initials: 'JD', name: 'Dr. Jane Du' },
    { initials: 'AM', name: 'Dr. Alan M.' },
    { initials: 'KL', name: 'Dr. Kevin Lin' }
  ];

  const networkNodes = graphCollaborators.length >= 3 
    ? graphCollaborators.map(c => ({ initials: getInitials(c.name), name: c.name || '' }))
    : defaultNetwork;

  // Render stats based on user role
  const isFaculty = roleOverride === 'RESEARCH_SUPERVISOR';
  const citationsVal = isFaculty ? 142 : 24;
  const publicationsVal = userThreads.length > 0 ? userThreads.length : (isFaculty ? 12 : 3);
  const thirdStatName = isFaculty ? 'Active Grants' : 'Synergy Matches';
  const thirdStatVal = isFaculty ? 8 : '94%';

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      
      {/* 🚀 Profile Header Banner */}
      <div className="cb-card p-6 relative overflow-hidden bg-white/90 backdrop-blur-md text-left flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Avatar Area */}
        <div className="relative shrink-0 z-10 self-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-primary-container flex items-center justify-center relative group">
            {currentUser?.image ? (
              <img 
                src={currentUser.image} 
                alt={currentUser.name || 'User Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl sm:text-4xl font-display font-bold text-primary">
                {getInitials(currentUser?.name)}
              </span>
            )}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-primary shadow-sm">
            <Sparkles className="w-4 h-4 text-[#775a00] fill-[#fec727]/30" />
          </div>
        </div>

        {/* User Bio and Basic Information */}
        <div className="flex-1 min-w-0 z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight tracking-tight">
              {currentUser?.name || 'Academic Scholar'}
            </h2>
            <span className="px-2.5 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {isFaculty ? 'Principal Investigator' : 'Research Scholar'}
            </span>
            {currentUser?.approved && (
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3px]" />
                Verified
              </span>
            )}
          </div>
          
          <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            {currentUser?.department || 'Department of Computing Technologies'} • SRMIST
          </p>

          {/* Top 3 Research Interests Tags */}
          <div className="flex flex-wrap gap-1.5">
            {selectedInterests.slice(0, 3).map((interest) => (
              <span 
                key={interest}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200/60 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider"
              >
                <Tag className="w-3 h-3 text-slate-400" />
                {interest}
              </span>
            ))}
            {selectedInterests.length === 0 && (
              <span className="text-xs text-slate-400 italic font-semibold">
                No focus areas defined. Edit profile settings to add research tags.
              </span>
            )}
          </div>

          {/* CTA / Operations Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-primary/95 transition-all shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'View Profile' : 'Edit Settings'}</span>
            </button>
            <button 
              onClick={() => alert(`Share link generated: ${window.location.origin}/profile/${currentUser?.id || ''}`)}
              className="px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Share Profile</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Widget Panel */}
        <div className="flex md:flex-row lg:flex-col gap-4 w-full md:w-auto lg:w-48 bg-slate-50/50 border border-slate-200/50 p-4 rounded-xl text-center md:text-left justify-around shrink-0 z-10 self-stretch">
          <div className="flex-1 md:flex-initial">
            <div className="text-xl sm:text-2xl font-bold text-slate-800 leading-none">{citationsVal}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Citations</div>
          </div>
          <div className="hidden md:block w-[1px] lg:h-[1px] lg:w-full bg-slate-200" />
          <div className="flex-1 md:flex-initial">
            <div className="text-xl sm:text-2xl font-bold text-slate-800 leading-none">{publicationsVal}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Publications</div>
          </div>
          <div className="hidden md:block w-[1px] lg:h-[1px] lg:w-full bg-slate-200" />
          <div className="flex-1 md:flex-initial">
            <div className="text-xl sm:text-2xl font-bold text-slate-800 leading-none">{thirdStatVal}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{thirdStatName}</div>
          </div>
        </div>

      </div>

      {/* ⚡ Transition Panel (Bento Grid vs. Tabbed Settings Editor) */}
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="profile-display"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left"
          >
            {/* ── LEFT COLUMN: Biography & Skills Matrix ── */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* Biography Block */}
              <div className="cb-card p-5 bg-white flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <FileText className="w-4.5 h-4.5 text-primary" />
                    <span>Academic Biography</span>
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                    {currentUser?.bio || 
                      'Introduce your scientific projects, grant pipelines, and collaboration requirements. Hit Edit Settings to complete your details.'}
                  </p>
                </div>
                
                <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>Verified Researcher</span>
                  </span>
                  <span className="font-mono text-slate-500 font-medium lowercase select-text">{currentUser?.email}</span>
                </div>
              </div>

              {/* Skills Matrix / Research Domains */}
              <div className="cb-card p-5 bg-white">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5 mb-4">
                  <Award className="w-4.5 h-4.5 text-primary" />
                  <span>Skills & Proficiency Matrix</span>
                </h3>
                <div className="space-y-4">
                  {selectedInterests.length > 0 ? (
                    selectedInterests.map((interest, idx) => {
                      const proficiencies = ['90%', '85%', '75%', '60%', '50%'];
                      const labels = ['Advanced', 'Advanced', 'Proficient', 'Proficient', 'Intermediate'];
                      const profVal = proficiencies[idx] || '45%';
                      const labelVal = labels[idx] || 'Competent';
                      
                      return (
                        <div key={interest} className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                            <span className="text-slate-700">{interest}</span>
                            <span className="text-primary">{labelVal}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/55">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500" 
                              style={{ width: profVal }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400 italic font-semibold">
                      No research skills defined. Update focus tags in settings.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Collaboration Network & Publications ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Collaboration Network Panel */}
              <div className="cb-card p-5 bg-white min-h-[320px] flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Network className="w-4.5 h-4.5 text-primary" />
                    <span>Academic Collaboration Network</span>
                  </h3>
                  <Link 
                    href="/researchers"
                    className="text-primary text-[10px] font-bold uppercase tracking-wider hover:underline"
                  >
                    Find Peers
                  </Link>
                </div>
                
                {/* Network Graph Simulator Box */}
                <div className="flex-grow min-h-[200px] bg-slate-50/50 rounded-xl border border-slate-200/60 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#004495 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
                  
                  {/* Center Node (Self) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12.5 h-12.5 bg-primary text-white rounded-full flex flex-col items-center justify-center shadow-md z-10 border border-primary/20">
                    <span className="font-display font-bold text-[10px] leading-none">{getInitials(currentUser?.name)}</span>
                    <span className="text-[6px] font-bold uppercase tracking-wider mt-0.5 opacity-80">Self</span>
                  </div>

                  {/* SVG Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    <line stroke="#c3c6d6" strokeWidth="1" strokeDasharray="3 3" x1="50%" y1="50%" x2="30%" y2="25%" />
                    <line stroke="#c3c6d6" strokeWidth="1" strokeDasharray="3 3" x1="50%" y1="50%" x2="72%" y2="35%" />
                    <line stroke="#c3c6d6" strokeWidth="1" strokeDasharray="3 3" x1="50%" y1="50%" x2="42%" y2="80%" />
                  </svg>

                  {/* Node 1 */}
                  <div className="absolute top-[18%] left-[24%] w-10 h-10 bg-white text-slate-800 rounded-full flex flex-col items-center justify-center shadow border border-slate-200 z-10 hover:scale-105 transition-transform" title={networkNodes[0].name}>
                    <span className="font-display font-bold text-[9px] text-primary">{networkNodes[0].initials}</span>
                    <span className="text-[6px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-0.5 truncate max-w-[32px]">{networkNodes[0].name.split(' ')[0]}</span>
                  </div>

                  {/* Node 2 */}
                  <div className="absolute top-[28%] right-[20%] w-11 h-11 bg-white text-slate-800 rounded-full flex flex-col items-center justify-center shadow border border-slate-200 z-10 hover:scale-105 transition-transform" title={networkNodes[1].name}>
                    <span className="font-display font-bold text-[9px] text-primary">{networkNodes[1].initials}</span>
                    <span className="text-[6px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-0.5 truncate max-w-[36px]">{networkNodes[1].name.split(' ')[0]}</span>
                  </div>

                  {/* Node 3 */}
                  <div className="absolute bottom-[16%] left-[38%] w-10 h-10 bg-white text-slate-800 rounded-full flex flex-col items-center justify-center shadow border border-slate-200 z-10 hover:scale-105 transition-transform" title={networkNodes[2].name}>
                    <span className="font-display font-bold text-[9px] text-primary">{networkNodes[2].initials}</span>
                    <span className="text-[6px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-0.5 truncate max-w-[32px]">{networkNodes[2].name.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Publications & Discussion Proposals list */}
              <div className="cb-card p-5 bg-white text-left">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 mb-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-primary" />
                    <span>Scholarly Output & Proposals</span>
                  </h3>
                  <Link 
                    href="/threads" 
                    className="text-primary text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5"
                  >
                    <span>View Feed</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {userThreads.length > 0 ? (
                    userThreads.slice(0, 3).map((thread) => (
                      <div 
                        key={thread.id} 
                        className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <div className="flex gap-3 items-start">
                          <div className="w-7 h-7 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 mt-0.5">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <Link href={`/threads/${thread.id}`}>
                              <h4 className="text-xs font-bold text-slate-950 group-hover:text-primary transition-colors leading-snug truncate">
                                {thread.title}
                              </h4>
                            </Link>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Published {new Date(thread.createdAt).toLocaleDateString()} • Stage Proposal
                            </p>
                            <div className="flex gap-2 pt-1">
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-200/50 rounded-md">
                                {thread.tags?.[0] || 'General'}
                              </span>
                              <span className="text-[9px] text-primary font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/5 rounded-md">
                                {thread.comments?.length || 0} Comments
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      {/* Premium Placeholders */}
                      <div className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors group cursor-pointer">
                        <div className="flex gap-3 items-start">
                          <div className="w-7 h-7 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/10">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-950 group-hover:text-primary transition-colors leading-snug">
                              Quantum Error Correction in Synthetic DNA Sequencing
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Nature Computational Science • Published Oct 2025
                            </p>
                            <div className="flex gap-2 pt-1">
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-200/50 rounded-md">
                                Peer Reviewed
                              </span>
                              <span className="text-[9px] text-primary font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/5 rounded-md">
                                42 Citations
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors group cursor-pointer">
                        <div className="flex gap-3 items-start">
                          <div className="w-7 h-7 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/10">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-950 group-hover:text-primary transition-colors leading-snug">
                              Algorithmic Approaches to Protein Folding via Qubits
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Journal of Bioinformatics • Published May 2025
                            </p>
                            <div className="flex gap-2 pt-1">
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-200/50 rounded-md">
                                Open Access
                              </span>
                              <span className="text-[9px] text-primary font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/5 rounded-md">
                                18 Citations
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

          </motion.div>
        ) : (
          /* ── PROFILE EDITOR FORM ── */
          <motion.div
            key="profile-edit"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
          >
            {/* Left Hand Tab Navigation Menu */}
            <div className="lg:col-span-3 flex flex-col gap-1">
              {([
                { id: 'identity', label: 'Identity & Bio', icon: User },
                { id: 'domains', label: 'Research Focus', icon: Tag },
                { id: 'security', label: 'Security & Access', icon: Lock }
              ] as const).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSettingsTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSettingsTab(tab.id)}
                    className={`flex items-center space-x-2.5 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-left cursor-pointer ${
                      isActive 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Hand Settings Form Pane */}
            <div className="lg:col-span-9 cb-card bg-white p-6 min-h-[400px] flex flex-col justify-between">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-grow flex flex-col justify-between">
                
                <div className="flex-grow">
                  <AnimatePresence mode="wait">
                    
                    {/* IDENTITY TAB */}
                    {activeSettingsTab === 'identity' && (
                      <motion.div
                        key="tab-identity"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-5"
                      >
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Academic Identity</h3>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Manage your display credentials and roles</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                            <input
                              type="text"
                              {...register('name')}
                              className="cb-input"
                              placeholder="E.g. Dr. Ramesh Kumar"
                            />
                            {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.name.message as string}</p>}
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Role</label>
                            <select
                              {...register('role')}
                              className="cb-input cursor-pointer"
                            >
                              <option value="RESEARCH_SCHOLAR">PhD Research Scholar</option>
                              <option value="RESEARCH_SUPERVISOR">Verified Faculty Guide</option>
                            </select>
                            {errors.role && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.role.message as string}</p>}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Department</label>
                          <select
                            {...register('department')}
                            className="cb-input cursor-pointer"
                          >
                            <option value="">Select Department</option>
                            {SRM_DEPARTMENTS.map((dept) => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                          {errors.department && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.department.message as string}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Research Biography</label>
                          <textarea
                            rows={4}
                            {...register('bio')}
                            className="w-full bg-white border border-slate-200 rounded-lg p-3 font-sans text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-colors"
                            placeholder="Outline your research focus, lab specifications, and grant history..."
                          />
                          {errors.bio && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.bio.message as string}</p>}
                        </div>
                      </motion.div>
                    )}

                    {/* RESEARCH DOMAINS TAB */}
                    {activeSettingsTab === 'domains' && (
                      <motion.div
                        key="tab-domains"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-5"
                      >
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Research Focus Areas</h3>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Specify domains that index your node in co-author matchmaking directories</p>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selected Domains (Max 8)</label>
                          
                          {/* Pinned tags pool */}
                          <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-200/50 rounded-xl">
                            {selectedInterests.length === 0 ? (
                              <p className="text-slate-400 text-xs italic font-semibold">No domains pinned yet. Select below or add custom ones.</p>
                            ) : (
                              selectedInterests.map((interest) => (
                                <span
                                  key={interest}
                                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-primary/5 border border-primary/20 text-primary"
                                >
                                  <span>{interest}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveInterest(interest)}
                                    className="ml-1 text-primary/60 hover:text-primary p-0.5 cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))
                            )}
                          </div>

                          {/* Custom tags input */}
                          <div className="relative mt-2">
                            <input
                              type="text"
                              value={newInterestInput}
                              onChange={(e) => setNewInterestInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest(newInterestInput))}
                              placeholder="Type scientific discipline and press Enter..."
                              className="cb-input pl-8 pr-10"
                            />
                            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                            <button
                              type="button"
                              onClick={() => handleAddInterest(newInterestInput)}
                              className="absolute right-1.5 top-1.5 p-1 rounded bg-slate-100 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Suggestions panel */}
                        <div className="space-y-2 pt-3 border-t border-slate-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Recommended Fields</p>
                          <div className="flex flex-wrap gap-1.5">
                            {interestsList
                              .filter(item => !selectedInterests.includes(item))
                              .map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => handleAddInterest(tag)}
                                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-50 hover:bg-slate-100 border border-slate-200/50 text-slate-500 hover:text-primary transition-colors cursor-pointer"
                                >
                                  + {tag}
                                </button>
                              ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* SECURITY & CREDENTIALS TAB */}
                    {activeSettingsTab === 'security' && (
                      <motion.div
                        key="tab-security"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-5"
                      >
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Account Security</h3>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Secure authentication and gateway keys</p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Email</label>
                            <input
                              type="email"
                              disabled
                              value={currentUser?.email || ''}
                              className="cb-input select-all font-mono"
                            />
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Managed via SRMIST institutional identity system</p>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Clearance Status</label>
                            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 stroke-[3px]" />
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-bold text-slate-800">Clearance Node Confirmed</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Guide signatures & institutional directory synchronization complete.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

                {/* Footer Save Row */}
                <div className="flex justify-end gap-2 pt-6 mt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary/95 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Settings</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
