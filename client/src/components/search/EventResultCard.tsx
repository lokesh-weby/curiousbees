'use client';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Tag, Zap } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  eventType: string;
  department?: string | null;
  venue: string;
  date: string | Date;
  time: string;
  tags: string[];
  status: string;
  priority: string;
  confidence: number;
  score?: number;
  trendScore?: number;
}

const priorityColor: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
  MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
  LOW: 'bg-stone-100 text-stone-600 border-stone-200',
};

interface Props {
  result: SearchResult;
  index?: number;
  showScore?: boolean;
}

export default function EventResultCard({ result, index = 0, showScore = false }: Props) {
  const scorePercent = result.score ? Math.round(result.score * 100) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group bg-white border border-[#e8e5e1] rounded-2xl p-5 hover:border-black/20 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${priorityColor[result.priority] || priorityColor.MEDIUM}`}>
              {result.priority}
            </span>
            <span className="text-[10px] text-[#6e6e6e] bg-[#f7f4f2] border border-[#e8e5e1] px-2 py-0.5 rounded-full">
              {result.eventType}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-black leading-snug line-clamp-2 group-hover:text-black/70 transition-colors">
            {result.title}
          </h3>
        </div>

        {showScore && scorePercent !== null && (
          <div className="flex-shrink-0 flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2"
              style={{
                borderColor: scorePercent > 80 ? '#22c55e' : scorePercent > 60 ? '#f59e0b' : '#e8e5e1',
                color: scorePercent > 80 ? '#166534' : scorePercent > 60 ? '#92400e' : '#6e6e6e',
                backgroundColor: scorePercent > 80 ? '#f0fdf4' : scorePercent > 60 ? '#fffbeb' : '#f7f4f2',
              }}
            >
              {scorePercent}%
            </div>
            <span className="text-[9px] text-[#a59f97] mt-0.5">match</span>
          </div>
        )}
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-[11px] text-[#6e6e6e]">
          <Calendar className="w-3 h-3 text-[#a59f97]" />
          <span>{new Date(result.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {result.time}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#6e6e6e]">
          <MapPin className="w-3 h-3 text-[#a59f97]" />
          <span className="truncate">{result.venue}</span>
        </div>
        {result.department && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#6e6e6e]">
            <Zap className="w-3 h-3 text-[#a59f97]" />
            <span>{result.department}</span>
          </div>
        )}
      </div>

      {result.tags?.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Tag className="w-3 h-3 text-[#a59f97] shrink-0" />
          {result.tags.slice(0, 4).map(tag => (
            <span key={tag} className="text-[10px] bg-[#f7f4f2] border border-[#e8e5e1] text-[#6e6e6e] px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {result.tags.length > 4 && (
            <span className="text-[10px] text-[#a59f97]">+{result.tags.length - 4}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
