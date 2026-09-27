import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { YEARS } from '@/lib/marketData';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].sort((a, b) => b.value - a.value);
  return (
    <div className="rounded-2xl bg-white/95 backdrop-blur border border-[#d2d2d7] shadow-[0_12px_40px_rgba(0,0,0,0.14)] px-4 py-3">
      <div className="text-[11px] font-semibold text-[#86868b] tracking-wide">{label} · growth of $100</div>
      {sorted.map((p) => {
        const pct = Math.round(p.value) - 100;
        return (
          <div key={p.dataKey} className="flex items-center gap-2 text-xs mt-1.5">
            <i className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color || p.stroke }} />
            <span className="text-[#6e6e73]">{p.name}</span>
            <b className="ml-auto tabular-nums text-[#1d1d1f]">${Math.round(p.value)}</b>
            <span className={`text-[11px] font-semibold tabular-nums ${pct >= 0 ? 'text-[#34c759]' : 'text-[#ff3b30]'}`}>
              {pct >= 0 ? '+' : ''}{pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function GrowthChart({ items, activeKey }) {
  const data = YEARS.map((year, i) => ({ year, ...Object.fromEntries(items.map((it) => [it.key, it.series[i]])) }));

  return (
    <div className="h-[280px] sm:h-[340px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            {items.map((it) => (
              <linearGradient key={it.key} id={`grad-${it.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={it.color} stopOpacity={activeKey && activeKey !== it.key ? 0.05 : 0.28} />
                <stop offset="100%" stopColor={it.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} stroke="#e8e8ed" />
          <XAxis dataKey="year" tick={{ fill: '#86868b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 'auto']} tick={{ fill: '#86868b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={52} />
          <Tooltip content={<ChartTooltip />} />
          {items.map((it) => (
            <Area
              key={it.key}
              type="monotone"
              dataKey={it.key}
              name={it.ticker}
              stroke={it.color}
              strokeWidth={activeKey === it.key ? 3 : 2}
              strokeOpacity={activeKey && activeKey !== it.key ? 0.25 : 1}
              fill={`url(#grad-${it.key})`}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}