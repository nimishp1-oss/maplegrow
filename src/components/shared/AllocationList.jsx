import React from 'react';
import { motion } from 'framer-motion';
import { ALLOCATION } from '@/lib/finance';

export default function AllocationList({ profile }) {
  return (
    <div className="grid gap-3.5">
      {ALLOCATION.map((a) => {
        const v = Number(profile[a.key]) || 0;
        return (
          <div key={a.key} className="flex items-center gap-3 text-xs text-[#6e6e73]">
            <span className="w-28 shrink-0">{a.label}</span>
            <div className="flex-1 h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
              <motion.i className="block h-full rounded-full" style={{ background: a.color }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.7 }} />
            </div>
            <b className="w-9 text-right text-brand-ink tabular-nums">{v}%</b>
          </div>
        );
      })}
    </div>
  );
}