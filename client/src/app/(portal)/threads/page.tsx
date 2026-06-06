'use client';

import { useStore } from '@/store/useStore';
import ThreadCard from '@/components/ThreadCard';
import { Search, Plus, MessageSquare, Tag, RefreshCcw, X, Layers, Compass, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThreadsFeedPage() {
  const { threads, searchQuery, setSearchQuery, activeTag, setActiveTag, isLoading, fetchData } = useStore();

  // Filter threads based on search queries and pinned active tags
  const filteredThreads = threads.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = activeTag === '' || t.tags.includes(activeTag);
    
    return matchesSearch && matchesTag;
  });

  // Extract all unique tags in threads to populate a filter row
  const allUniqueTags = Array.from(
    new Set(threads.flatMap((t) => t.tags))
  );

  return (
    <div className="space-y-6 select-none text-left">
      
      {/* Upper header title row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>Collaborative Intranet Feed</span>
          </span>
          <h2 className="cb-page-title mt-1.5">
            Research Discussions & Proposals
          </h2>
          <p className="cb-page-subtitle">
            Browse open resource shares, grant proposal templates, and interdisciplinary requests across university departments.
          </p>
        </div>

        <Link
          href="/threads/create"
          className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Proposal</span>
        </Link>
      </div>

      {/* Search Input Bar & Tag Filters row */}
      <div className="cb-card p-5 bg-white/90 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search thread title, keywords or scientific focus..."
              className="cb-input pl-9 pr-9"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button 
            onClick={fetchData}
            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all flex items-center justify-center shrink-0 cursor-pointer"
            title="Sync Database"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Dynamic Tag Filter chips */}
        <div className="flex items-center space-x-3 pt-3 border-t border-slate-100 overflow-x-auto pb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center shrink-0">
            <Tag className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            Filter Fields:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTag('')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer border ${
                activeTag === '' 
                  ? 'bg-primary/5 text-primary border-primary/20' 
                  : 'bg-slate-50 text-slate-500 border-slate-200/50 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              All Topics
            </button>
            {allUniqueTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer border ${
                  activeTag === tag 
                    ? 'bg-primary/5 text-primary border-primary/20' 
                    : 'bg-slate-50 text-slate-500 border-slate-200/50 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Feed Container */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex justify-center items-center text-slate-500"
            >
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Syncing Collaborative Database...</p>
              </div>
            </motion.div>
          ) : filteredThreads.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="cb-card p-12 text-center bg-white/90 backdrop-blur-md"
            >
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-4" />
              <h4 className="text-slate-900 font-bold text-sm">No Matching Research Proposals</h4>
              <p className="text-slate-500 text-xs max-w-xs mx-auto mt-2 leading-relaxed font-semibold">
                We couldn't find any threads matching your parameters. Be the first to start a collaborative proposal!
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveTag(''); }}
                className="mt-5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 hover:border-primary/40 bg-primary/5 px-4 py-2 rounded-lg transition-all cursor-pointer active:scale-95"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 gap-6"
            >
              {filteredThreads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
