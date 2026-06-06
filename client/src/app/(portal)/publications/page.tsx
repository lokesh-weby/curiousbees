'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { BookOpen, Plus, Search, Check, X, Edit3, Trash2, Calendar, FileText, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicationsPage() {
  const {
    currentUser,
    publications,
    fetchPublications,
    createPublication,
    updatePublication,
    deletePublication,
    isLoading
  } = useStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPub, setEditingPub] = useState<any | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [doi, setDoi] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState('PUBLISHED');

  const isSupervisor = currentUser?.role === 'RESEARCH_SUPERVISOR';
  const isAdmin = currentUser?.role === 'INSTITUTION_ADMIN';

  useEffect(() => {
    // If scholar, fetch only their own publications. If supervisor/admin, fetch all.
    const targetUserId = isSupervisor || isAdmin ? undefined : currentUser?.id;
    fetchPublications(targetUserId);
  }, [currentUser, isSupervisor, isAdmin, fetchPublications]);

  const handleOpenCreate = () => {
    setEditingPub(null);
    setTitle('');
    setAuthors(currentUser?.name || '');
    setDoi('');
    setPublisher('');
    setYear(new Date().getFullYear());
    setStatus('PUBLISHED');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (pub: any) => {
    setEditingPub(pub);
    setTitle(pub.title);
    setAuthors(pub.authors);
    setDoi(pub.doi || '');
    setPublisher(pub.publisher || '');
    setYear(pub.year);
    setStatus(pub.status);
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !authors || !year) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      if (editingPub) {
        await updatePublication(editingPub.id, {
          title,
          authors,
          doi: doi || undefined,
          publisher: publisher || undefined,
          year: Number(year),
          status
        });
      } else {
        await createPublication({
          title,
          authors,
          doi: doi || undefined,
          publisher: publisher || undefined,
          year: Number(year),
          status
        });
      }
      setIsDrawerOpen(false);
    } catch (err: any) {
      alert(`Error saving publication: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this publication?')) {
      try {
        await deletePublication(id);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filteredPubs = publications.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authors.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* 🚀 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Academic Publications Registry</span>
          </span>
          <h1 className="cb-page-title mt-2">Publications & Patents</h1>
          <p className="cb-page-subtitle">
            Manage your journal submissions, conference papers, and book chapters.
          </p>
        </div>

        {!isSupervisor && !isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Publication</span>
          </button>
        )}
      </div>

      {/* 🚀 Search & Filter */}
      <div className="cb-card p-4 bg-white/95 backdrop-blur-md max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search title, authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cb-input pl-9"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* 🚀 List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPubs.length === 0 ? (
          <div className="cb-card p-12 text-center bg-white/95 backdrop-blur-md">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-900 font-bold text-sm">No Publications Logged</h3>
            <p className="text-slate-400 text-xs mt-1">
              Add your peer-reviewed journals, conference manuscripts, and patents to showcase them in the directory.
            </p>
          </div>
        ) : (
          filteredPubs.map((pub) => (
            <div key={pub.id} className="cb-card p-5 bg-white/95 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                    pub.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    pub.status === 'UNDER_REVIEW' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    pub.status === 'SUBMITTED' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                    'bg-slate-50 text-slate-650 border border-slate-100'
                  }`}>
                    {pub.status.replace('_', ' ')}
                  </span>
                  {pub.doi && (
                    <span className="text-[10px] text-slate-450 flex items-center gap-1 font-semibold">
                      <Globe className="w-3 h-3" />
                      DOI: {pub.doi}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{pub.title}</h3>
                <p className="text-xs text-slate-500 font-medium">Authors: {pub.authors}</p>
                
                <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-semibold pt-1">
                  {pub.publisher && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {pub.publisher}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Year: {pub.year}
                  </span>
                  {(pub as any).user && (
                    <span className="text-primary font-bold">
                      By: {(pub as any).user.name}
                    </span>
                  )}
                </div>
              </div>

              {(pub.userId === currentUser?.id || isSupervisor || isAdmin) && (
                <div className="flex items-center space-x-2 self-end md:self-center">
                  <button
                    onClick={() => handleOpenEdit(pub)}
                    className="p-2 border border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pub.id)}
                    className="p-2 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-655 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#0d3c61]">
                      {editingPub ? 'Edit Publication' : 'Add New Publication'}
                    </h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                      Academic Intranet Logs
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

              <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. A Deep Analysis of VLSI Layout Algorithms"
                    className="cb-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                    Authors (Comma-separated) *
                  </label>
                  <input
                    type="text"
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                    required
                    placeholder="e.g. John Doe, प्रिया शर्मा"
                    className="cb-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                    DOI (Digital Object Identifier)
                  </label>
                  <input
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    placeholder="e.g. 10.1093/bioinformatics/btg239"
                    className="cb-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                    Publisher / Journal
                  </label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="e.g. IEEE Transactions, Nature Communications"
                    className="cb-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      required
                      min={1900}
                      max={new Date().getFullYear() + 2}
                      className="cb-input"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                      Status *
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 h-[42px] text-xs font-semibold rounded-lg bg-white border border-slate-200 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-650 hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingPub ? 'Update' : 'Publish'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
