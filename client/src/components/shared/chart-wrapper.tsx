'use client';

/**
 * components/shared/chart-wrapper.tsx
 * Recharts-based chart card wrappers used in the analytics system.
 * Each wrapper includes a card shell, title, description, and the chart itself.
 */

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { GlassCard } from './glass-card';
import { cn } from '@/lib/utils';

// ─── Shared Types ─────────────────────────────────────────────────────────────

interface ChartCardProps {
  title: string;
  description?: string;
  height?: number;
  className?: string;
  children: React.ReactNode;
}

// ─── Chart Card Shell ─────────────────────────────────────────────────────────

function ChartCard({ title, description, height = 240, className, children }: ChartCardProps) {
  return (
    <GlassCard className={cn('flex flex-col gap-4', className)}>
      <div>
        <h4 className="cb-section-title">{title}</h4>
        {description && <p className="text-[12px] text-on-surface-variant mt-0.5">{description}</p>}
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

// ─── Shared Chart Style ───────────────────────────────────────────────────────

const sharedTooltipStyle = {
  background: '#ffffff',
  border: '1px solid rgba(195,198,214,0.4)',
  borderRadius: '8px',
  fontSize: '11px',
  fontFamily: 'Inter, sans-serif',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

const sharedAxisProps = {
  tick: { fontSize: 10, fill: '#737785', fontFamily: 'Inter, sans-serif' },
  axisLine: { stroke: '#c3c6d6', strokeOpacity: 0.4 },
  tickLine: false as const,
};

// ─── Line Chart Card ──────────────────────────────────────────────────────────

interface LineChartCardProps {
  title: string;
  description?: string;
  data: Record<string, any>[];
  lines: { key: string; label: string; color?: string }[];
  xKey: string;
  height?: number;
  className?: string;
}

export function LineChartCard({
  title,
  description,
  data,
  lines,
  xKey,
  height,
  className,
}: LineChartCardProps) {
  return (
    <ChartCard title={title} description={description} height={height} className={className}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#c3c6d6" strokeOpacity={0.3} />
        <XAxis dataKey={xKey} {...sharedAxisProps} />
        <YAxis {...sharedAxisProps} />
        <Tooltip contentStyle={sharedTooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.label}
            stroke={line.color ?? '#004495'}
            strokeWidth={2}
            dot={{ r: 3, fill: line.color ?? '#004495' }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ChartCard>
  );
}

// ─── Area Chart Card ──────────────────────────────────────────────────────────

interface AreaChartCardProps {
  title: string;
  description?: string;
  data: Record<string, any>[];
  areas: { key: string; label: string; color?: string }[];
  xKey: string;
  height?: number;
  className?: string;
}

export function AreaChartCard({
  title,
  description,
  data,
  areas,
  xKey,
  height,
  className,
}: AreaChartCardProps) {
  return (
    <ChartCard title={title} description={description} height={height} className={className}>
      <AreaChart data={data}>
        <defs>
          {areas.map((area) => (
            <linearGradient key={area.key} id={`grad-${area.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.color ?? '#004495'} stopOpacity={0.15} />
              <stop offset="95%" stopColor={area.color ?? '#004495'} stopOpacity={0.01} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#c3c6d6" strokeOpacity={0.3} />
        <XAxis dataKey={xKey} {...sharedAxisProps} />
        <YAxis {...sharedAxisProps} />
        <Tooltip contentStyle={sharedTooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }} />
        {areas.map((area) => (
          <Area
            key={area.key}
            type="monotone"
            dataKey={area.key}
            name={area.label}
            stroke={area.color ?? '#004495'}
            strokeWidth={2}
            fill={`url(#grad-${area.key})`}
          />
        ))}
      </AreaChart>
    </ChartCard>
  );
}

// ─── Bar Chart Card ───────────────────────────────────────────────────────────

interface BarChartCardProps {
  title: string;
  description?: string;
  data: Record<string, any>[];
  bars: { key: string; label: string; color?: string }[];
  xKey: string;
  height?: number;
  className?: string;
}

export function BarChartCard({
  title,
  description,
  data,
  bars,
  xKey,
  height,
  className,
}: BarChartCardProps) {
  return (
    <ChartCard title={title} description={description} height={height} className={className}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#c3c6d6" strokeOpacity={0.3} vertical={false} />
        <XAxis dataKey={xKey} {...sharedAxisProps} />
        <YAxis {...sharedAxisProps} />
        <Tooltip contentStyle={sharedTooltipStyle} cursor={{ fill: 'rgba(0,68,149,0.04)' }} />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }} />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.label}
            fill={bar.color ?? '#004495'}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ChartCard>
  );
}
