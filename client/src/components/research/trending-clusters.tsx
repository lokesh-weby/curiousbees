'use client';

import React from 'react';
import Link from 'next/link';
import { Network, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrendingClustersProps {
  clusters?: string[];
}

export default function TrendingClusters({
  clusters = [
    'Quantum Cognition',
    'Generative Molecular Design',
    'Neuro-symbolic AI',
    'Bio-mimetic Materials'
  ]
}: TrendingClustersProps) {
  return (
    <section className="bg-white border border-borderStroke rounded-xl p-5 shadow-sm text-left">
      <h3 className="text-sm font-bold text-[#0d3c61] mb-2 flex items-center gap-2 font-display select-none">
        <Network className="w-4.5 h-4.5 text-primary shrink-0" />
        <span>Trending Clusters</span>
      </h3>
      <p className="text-[11.5px] text-textSecondary font-semibold mb-4 select-none">
        High-growth research topics in the SRMIST network.
      </p>
      
      <div className="flex flex-wrap gap-2 select-none">
        {clusters.map((cluster, idx) => (
          <motion.div
            key={cluster}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05, duration: 0.25 }}
          >
            <Link
              href={`/search?query=${encodeURIComponent(cluster)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-borderStroke/70 hover:border-primary rounded-full text-xs font-semibold text-black hover:text-primary bg-slate-50/50 hover:bg-primary/5 cursor-pointer transition-colors"
            >
              <Hexagon className="w-3.5 h-3.5 text-primary fill-primary/10 shrink-0" />
              <span>{cluster}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
