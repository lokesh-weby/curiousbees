'use client';

import React from 'react';
import { Search, Loader2, X, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  placeholder?: string;
  showFilters: boolean;
  setShowFilters: (s: boolean) => void;
  isSearching: boolean;
  hasQuery: boolean;
  clearQuery: () => void;
}

export default function SearchBar({
  query,
  setQuery,
  placeholder = "Search semantically...",
  showFilters,
  setShowFilters,
  isSearching,
  hasQuery,
  clearQuery,
}: SearchBarProps) {
  return (
    <div className="relative flex items-center bg-white border border-[#e8e5e1] rounded-2xl shadow-sm hover:border-black/20 focus-within:border-black/30 focus-within:shadow-md transition-all duration-200">
      <div className="pl-4 pr-2 shrink-0">
        {isSearching && hasQuery ? (
          <Loader2 className="w-4 h-4 text-[#61b5db] animate-spin" />
        ) : (
          <Search className="w-4 h-4 text-[#a59f97]" />
        )}
      </div>
      <input
        id="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 py-3.5 pr-4 text-sm text-black placeholder-[#a59f97] bg-transparent outline-none"
      />
      <div className="flex items-center gap-1 pr-3">
        {query && (
          <button
            onClick={clearQuery}
            className="p-1.5 rounded-lg hover:bg-[#f7f4f2] text-[#a59f97] hover:text-black transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-1.5 rounded-lg transition-colors ${
            showFilters ? 'bg-black text-white' : 'hover:bg-[#f7f4f2] text-[#a59f97]'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
