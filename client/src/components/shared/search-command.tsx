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

interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchCommand({ isOpen, onClose }: SearchCommandProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { threads, opportunities, events, collaborators, fetchCollaborators } = useStore();
  
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'THREADS' | 'OPPORTUNITIES' | 'EVENTS' | 'RESEARCHERS'>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
      fetchCollaborators(); 
    }
  }, [isOpen, fetchCollaborators]);

  const getFilteredResults = (): SearchResultItem[] => {
    const list: SearchResultItem[] = [];

    threads.forEach((t) => {
      list.push({
        id: `t-${t.id}`,
        title: t.title,
        category: 'Threads',
        url: `/threads/${t.id}`,
        meta: `By ${t.author?.name || 'Scholar'} · ${t.tags.join(', ')}`,
      });
    });

    opportunities.forEach((o) => {
      list.push({
        id: `o-${o.id}`,
        title: o.title,
        category: 'Opportunities',
        url: '/opportunities',
        meta: `${o.department} · PI: ${o.author?.name || 'Faculty Leads'}`,
      });
    });

    events.forEach((e) => {
      list.push({
        id: `e-${e.id}`,
        title: e.title,
        category: 'Events',
        url: '/events',
        meta: `${e.date} · ${e.venue}`,
      });
    });

    collaborators.forEach((c) => {
      list.push({
        id: `c-${c.id}`,
        title: c.name || 'Scholar',
        category: 'Researchers',
        url: '/dashboard',
        meta: `${c.department || 'SRMIST'} · Interests: ${c.interests?.map((i: any) => i.interest?.name || '').filter(Boolean).join(', ') || 'General'}`,
      });
    });

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
    Opportunities: <Briefcase className="w-4 h-4 text-secondary" />,
    Events: <Calendar className="w-4 h-4 text-info" />,
    Researchers: <Users className="w-4 h-4 text-success" />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 overflow-y-auto font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-2xl bg-surface border border-outline-variant/50 rounded-xl shadow-[0_12px_36px_-4px_rgba(0,0,0,0.12)] overflow-hidden text-left"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-4 border-b border-outline-variant/30 gap-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search across CuriousBees ecosystem..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="flex-1 bg-transparent border-none text-base text-foreground placeholder:text-muted-foreground outline-none select-text"
              />
              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md uppercase tracking-wider">
                ESC
              </span>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex px-3 py-2 border-b border-outline-variant/30 bg-muted/50 gap-1.5 overflow-x-auto">
              {(['ALL', 'THREADS', 'OPPORTUNITIES', 'EVENTS', 'RESEARCHERS'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedIndex(0);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-[10px] font-display uppercase tracking-widest font-bold transition-all cursor-pointer',
                    activeCategory === cat
                      ? 'bg-surface-elevated text-foreground shadow-sm'
                      : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results Zone */}
            <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
              {results.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground space-y-2">
                  <Search className="w-10 h-10 opacity-20 mx-auto" />
                  <p className="text-xs font-bold uppercase tracking-widest">No results found</p>
                  <p className="text-[11px] opacity-80">Try refining your search keyword</p>
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
                        'flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-all duration-150',
                        isSelected ? 'bg-muted/80' : 'bg-transparent'
                      )}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="p-2 rounded-md bg-surface border border-outline-variant/30 shrink-0 shadow-sm">
                          {categoryIcons[item.category]}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-[13px] font-bold text-foreground leading-tight truncate">
                            {item.title}
                          </p>
                          {item.meta && (
                            <p className="text-[11px] text-muted-foreground leading-normal truncate mt-0.5">
                              {item.meta}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase shrink-0">
                          <span>Enter</span>
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-outline-variant/30 bg-muted/30 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-1">
                  <span className="font-sans font-normal text-[14px]">↑↓</span> navigate
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-sans font-normal text-[14px]">⏎</span> select
                </span>
              </div>
              <span className="opacity-70">CuriousBees Dashboard</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
