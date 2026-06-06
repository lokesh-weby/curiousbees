'use client';

import React from 'react';
import Link from 'next/link';
import { Network, UserPlus } from 'lucide-react';
import { User } from '@/shared/types';
import { motion } from 'framer-motion';

interface CollaborationMatchingProps {
  collaborators: User[];
  onInviteCollaborator: (name: string) => void;
}

export default function CollaborationMatching({
  collaborators,
  onInviteCollaborator
}: CollaborationMatchingProps) {
  
  // Custom mock collaborators to match high fidelity Stitch visuals when DB has no matches
  const mockMatches = [
    {
      name: 'Dr. Elias Vance',
      department: 'Cognitive Neuroscience',
      matchScore: '92% Match',
      tag: 'Neural Nets',
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuACmnRmND37XuryzG3gehMlY9w2bBapj_AG-rrZMJFpx3rPnjoepnOPOyyjymgtgQjazRTLUmgSMx6eYth54q6TM9MfZGJOHDRKYNRw2phwRd1A8c0Xfy5CfvzQv4a85-ZrnhT0nFYfBC5-Gz4j06kKPLk5M81i3JJkv8Hzt1IQzvNbNvJod3vGkt3qb9gdgS132SQ3FLdko4gcdk5L7HcbHq0RjQ32fFxJ11XBweK_spXsEYL9rugwW9wCHc8B7fHPHdifPQfVWtZ6"
    },
    {
      name: 'Dr. Sarah Lin',
      department: 'Computational Biology',
      matchScore: '88% Match',
      tag: 'Genomics',
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhotPj-RkthtKKDLP4am8pJVBideZ2ln9SoWoHXShRVgTUOiMMpuCncpp2Am3mmuY44sjbsJGTuai2iSUSpT-dX4OdS5UYcfai-sjlL1nYbYGQ0Re990b3Lc4sxWcYqchb0YFAj51rZK69w8Qx8fTrz7EKwu9xw9WXFE4Qca0q5oq8SU_4SBIgJbqgvksiiGQapuLpPPb7pyGpS5foUlCOvgJ-utJJMUmwg1GtXilfvmxa9aZkaml3DvDGtVw483WrboeTijNtz6l_"
    }
  ];

  // Map database collaborators. If there are researchers, display the top 2.
  const displayCollaborators = collaborators.length > 0
    ? collaborators.slice(0, 2).map((collab, idx) => ({
        name: collab.name || 'Scholar Researcher',
        department: collab.department || 'SRMIST Research Office',
        matchScore: idx === 0 ? '92% Match' : '88% Match',
        tag: collab.interests?.[0]?.interest?.name || 'Topological Insulators',
        image: collab.image || (idx === 0 ? mockMatches[0].image : mockMatches[1].image)
      }))
    : mockMatches;

  return (
    <section className="bg-white border border-borderStroke rounded-xl p-5 shadow-sm text-left w-full select-none">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-bold text-[#0d3c61] flex items-center gap-2 font-display">
          <Network className="w-4.5 h-4.5 text-primary shrink-0" />
          <span>Collaboration Matching</span>
        </h3>
        <Link href="/researchers" className="text-primary font-bold text-xs hover:underline inline-flex items-center gap-0.5">
          <span>Roster network</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayCollaborators.map((collab, idx) => (
          <motion.div
            key={collab.name}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            className="border border-borderStroke/60 rounded-xl p-4 flex items-start gap-3.5 hover:border-primary/40 hover:bg-slate-50/20 transition-all text-left"
          >
            <div className="relative shrink-0">
              <img
                alt="Researcher"
                className="w-10 h-10 rounded-full object-cover border border-borderStroke"
                src={collab.image}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-black truncate leading-tight">
                {collab.name}
              </h4>
              <p className="text-[10px] text-textSecondary font-semibold truncate mt-1">
                {collab.department}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className="px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0">
                  {collab.matchScore}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-textSecondary border border-borderStroke/30 rounded-full text-[9px] font-bold uppercase tracking-wider truncate max-w-[90px]">
                  {collab.tag}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => onInviteCollaborator(collab.name)}
              className="bg-slate-50 hover:bg-primary hover:text-white border border-borderStroke/65 hover:border-primary text-textSecondary w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-95 shadow-sm"
              title="Dispatched Synergy request"
            >
              <UserPlus className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
