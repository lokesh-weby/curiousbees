'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Search, MessageSquare, Briefcase, Calendar, Users, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResultItem {
  id: string;
  title: string;
  category: 'Threads' | 'Opportunities' | 'Events' | 'Researchers';
  url: string;
  meta?: string;
}

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpotlightSearch({ isOpen, onClose }: SpotlightSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { threads, opportunities, events, collaborators, fetchCollaborators } = useStore();
  
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'THREADS' | 'OPPORTUNITIES' | 'EVENTS' | 'RESEARCHERS'>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
      fetchCollaborators(); // Ensure collaborators are cached
    }
  }, [isOpen, fetchCollaborators]);

  // Aggregate and filter search items
  const getFilteredResults = (): SearchResultItem[] => {
    const list: SearchResultItem[] = [];

    // 1. Threads
    threads.forEach((t) => {
      list.push({
        id: `t-${t.id}`,
        title: t.title,
        category: 'Threads',
        url: `/threads/${t.id}`,
        meta: `By ${t.author?.name || 'Scholar'} · ${t.tags.join(', ')}`,
      });
    });

    // 2. Opportunities
    opportunities.forEach((o) => {
      list.push({
        id: `o-${o.id}`,
        title: o.title,
        category: 'Opportunities',
        url: '/opportunities',
        meta: `${o.department} · PI: ${o.author?.name || 'Faculty Leads'}`,
      });
    });

    // 3. Events
    events.forEach((e) => {
      list.push({
        id: `e-${e.id}`,
        title: e.title,
        category: 'Events',
        url: '/events',
        meta: `${e.date} · ${e.venue}`,
      });
    });

    // 4. Researchers
    collaborators.forEach((c) => {
      list.push({
        id: `c-${c.id}`,
        title: c.name || 'Scholar',
        category: 'Researchers',
        url: '/researchers',
        meta: `${c.department || 'SRMIST'} · Interests: ${c.interests?.map((i: any) => i.interest?.name || '').filter(Boolean).join(', ') || 'General'}`,
      });
    });

    // Filtering by category & query
    return list.filter((item) => {
      const matchCat =
        activeCategory === 'ALL' ||
        (activeCategory === 'THREADS' && item.category === 'Threads') ||
        (activeCategory === 'OPPORTUNITIES' && item.category === 'Opportunities') ||
        (activeCategory === 'EVENTS' && item.category === 'Events') ||
        (activeCategory === 'RESEARCHERS' && item.category === 'Researchers');

      const matchQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.meta && item.meta.toLowerCase().includes(query.toLowerCase()));

      return matchCat && matchQuery;
    });
  };

  const results = getFilteredResults().slice(0, 8);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(results.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].url);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, router]);

  const categoryIcons = {
    Threads: <MessageSquare className="w-4 h-4 text-primary" />,
    Opportunities: <Briefcase className="w-4 h-4 text-amber-600" />,
    Events: <Calendar className="w-4 h-4 text-emerald-600" />,
    Researchers: <Users className="w-4 h-4 text-blue-600" />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/25 backdrop-blur-[2px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="relative w-full max-w-xl bg-white border border-borderStroke rounded-xl shadow-2xl overflow-hidden text-left flex flex-col font-sans"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-borderStroke gap-3">
              <Search className="w-4.5 h-4.5 text-textSecondary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search threads, events, workspaces, experts..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="flex-1 bg-transparent border-none text-[13.5px] text-black placeholder-textSecondary/50 outline-none select-text"
              />
              <span className="text-[9px] font-bold text-textSecondary/60 uppercase border border-borderStroke/70 bg-slate-50 px-2 py-0.5 rounded shadow-sm">
                ESC
              </span>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex px-3 py-2 border-b border-borderStroke bg-slate-50/50 gap-1.5 overflow-x-auto">
              {(['ALL', 'THREADS', 'OPPORTUNITIES', 'EVENTS', 'RESEARCHERS'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedIndex(0);
                  }}
                  className={cn(
                    'px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer',
                    activeCategory === cat
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-transparent text-textSecondary hover:text-black hover:bg-slate-100'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results Zone */}
            <div className="max-h-[320px] overflow-y-auto p-2 space-y-0.5">
              {results.length === 0 ? (
                <div className="py-10 text-center text-textSecondary space-y-1.5">
                  <Search className="w-8 h-8 opacity-20 mx-auto text-textSecondary" />
                  <p className="text-[11px] font-bold uppercase tracking-wider text-textSecondary/80">No matching results found</p>
                  <p className="text-xs text-textSecondary/50">Try refining your search keyword queries</p>
                </div>
              ) : (
                results.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        router.push(item.url);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 relative overflow-hidden',
                        isSelected ? 'bg-primary/5' : 'bg-transparent'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 z-10">
                        <div className={cn(
                          'p-1.5 rounded shrink-0 border transition-all',
                          isSelected ? 'bg-white border-primary/20 shadow-sm' : 'bg-slate-50 border-borderStroke/30'
                        )}>
                          {categoryIcons[item.category]}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className={cn(
                            'text-[13px] font-semibold leading-tight truncate transition-colors',
                            isSelected ? 'text-primary' : 'text-black'
                          )}>
                            {item.title}
                          </p>
                          {item.meta && (
                            <p className="text-[10px] text-textSecondary/60 leading-normal truncate mt-0.5 font-medium">
                              {item.meta}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 text-[9px] font-bold text-primary uppercase shrink-0 z-10">
                          <span>Open</span>
                          <CornerDownLeft className="w-3.5 h-3.5 text-primary" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Instructions Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-borderStroke bg-slate-50/50 text-[9px] font-bold text-textSecondary/60 uppercase">
              <div className="flex items-center gap-4">
                <span>↑↓ navigate</span>
                <span>⏎ select</span>
              </div>
              <span className="font-semibold text-primary">CuriousBees Spotlight Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
