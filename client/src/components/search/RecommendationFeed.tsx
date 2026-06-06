'use client';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import EventResultCard from './EventResultCard';

async function fetchRecommendations() {
  const res = await apiFetch('/api/search/recommendations');
  if (!res.ok) return { results: [] };
  return res.json();
}

async function fetchTrending() {
  const res = await apiFetch('/api/search/trending?limit=6');
  if (!res.ok) return { results: [] };
  return res.json();
}

export default function RecommendationFeed() {
  const { data: recoData, isLoading: recoLoading } = useQuery({
    queryKey: ['search-recommendations'],
    queryFn: fetchRecommendations,
    staleTime: 60000,
  });

  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ['search-trending'],
    queryFn: fetchTrending,
    staleTime: 120000,
  });

  return (
    <div className="space-y-10">
      {/* Personalized Recommendations */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#61b5db]" />
          <h2 className="text-sm font-semibold text-black">Recommended For You</h2>
          <span className="text-[11px] text-[#a59f97] ml-auto">Based on your interests</span>
        </div>
        {recoLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 text-[#a59f97] animate-spin" />
          </div>
        ) : recoData?.results?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recoData.results.map((r: any, i: number) => (
              <EventResultCard key={r.id} result={r} index={i} showScore={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-[#e8e5e1] rounded-2xl">
            <Sparkles className="w-6 h-6 text-[#e8e5e1] mx-auto mb-2" />
            <p className="text-sm text-[#a59f97]">Set your preferences to get personalized recommendations</p>
          </div>
        )}
      </section>

      {/* Trending Now */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-black">Trending This Month</h2>
          <span className="text-[11px] text-[#a59f97] ml-auto">By tag frequency</span>
        </div>
        {trendLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 text-[#a59f97] animate-spin" />
          </div>
        ) : trendData?.results?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trendData.results.map((r: any, i: number) => (
              <EventResultCard key={r.id} result={r} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-[#e8e5e1] rounded-2xl">
            <TrendingUp className="w-6 h-6 text-[#e8e5e1] mx-auto mb-2" />
            <p className="text-sm text-[#a59f97]">No trending events this month yet</p>
          </div>
        )}
      </section>
    </div>
  );
}
