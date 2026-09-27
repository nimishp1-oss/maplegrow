import React from 'react';
import { money } from '@/lib/finance';

export default function SpendingDonut({ items, total }) {
  let cursor = 0;
  const stops = items.map((i) => {
    const p = total ? (i.value / total) * 100 : 0;
    const s = `${i.color} ${cursor}% ${cursor + p}%`;
    cursor += p;
    return s;
  });
  const bg = total ? `conic-gradient(${stops.join(',')})` : '#f5f5f7';

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-28 h-28 rounded-full shrink-0" style={{ background: bg }}>
        <div className="absolute inset-[17px] rounded-full bg-white grid place-content-center text-center">
          <span className="font-heading font-bold text-[15px] text-brand-ink">{money(total)}</span>
          <small className="text-[10px] text-[#86868b]">per month</small>
        </div>
      </div>
      <div className="grid gap-2 flex-1 min-w-0">
        {items.map((i) => (
          <div key={i.key} className="flex justify-between text-xs text-[#6e6e73]">
            <span className="flex items-center gap-2 truncate">
              <i className="w-2 h-2 rounded-[3px] shrink-0" style={{ background: i.color }} />{i.short}
            </span>
            <b className="text-brand-ink tabular-nums">{money(i.value)}</b>
          </div>
        ))}
      </div>
    </div>
  );
}