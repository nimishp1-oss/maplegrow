import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { money } from '@/lib/finance';

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const pct = d.total ? ((d.value / d.total) * 100).toFixed(1) : 0;
  return (
    <div className="rounded-xl bg-white/95 backdrop-blur border border-[#d2d2d7] shadow-[0_12px_40px_rgba(0,0,0,0.12)] px-3.5 py-2">
      <div className="text-xs font-semibold text-[#1d1d1f]">{d.label}</div>
      <div className="text-xs text-[#6e6e73] mt-0.5">{money(d.value)} · {pct}% of spending</div>
    </div>
  );
}

export default function CategoryPieChart({ items, total }) {
  const data = (items || []).filter((i) => i.value > 0).map((i) => ({ ...i, total }));

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
      {data.length === 0 ? (
        <p className="text-sm text-brand-muted w-full text-center py-10">Add spending to any category to see your breakdown.</p>
      ) : (
        <>
          <div className="relative w-52 h-52 shrink-0">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="label" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="#fff" strokeWidth={2} cornerRadius={6}>
                  {data.map((d) => <Cell key={d.key} fill={d.color} />)}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-content-center text-center pointer-events-none">
              <span className="font-heading font-bold text-lg text-brand-ink">{money(total)}</span>
              <small className="text-[10px] text-brand-muted">per month</small>
            </div>
          </div>
          <div className="grid gap-2.5 flex-1 min-w-0 w-full">
            {(items || []).map((i) => (
              <div key={i.key} className="flex items-center justify-between text-xs text-brand-muted">
                <span className="flex items-center gap-2 truncate">
                  <i className="w-2 h-2 rounded-[3px] shrink-0" style={{ background: i.color }} />{i.label}
                </span>
                <span className="flex items-center gap-3">
                  <span className="tabular-nums">{total ? ((i.value / total) * 100).toFixed(0) : 0}%</span>
                  <b className="text-brand-ink tabular-nums w-16 text-right">{money(i.value)}</b>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}