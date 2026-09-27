import React from 'react';
import { motion } from 'framer-motion';

export default function BarRow({ name, pct, value, color = '#0071e3' }) {
  return (
    <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_72px] sm:grid-cols-[170px_1fr_80px] items-center gap-3 text-xs">
      <span className="text-[#6e6e73] truncate">{name}</span>
      <div className="h-[7px] rounded-full bg-[#f5f5f7] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="text-right font-bold text-brand-ink tabular-nums">{value}</span>
    </div>
  );
}