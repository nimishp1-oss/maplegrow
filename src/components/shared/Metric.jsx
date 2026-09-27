import React from 'react';

export default function Metric({ label, value, note, tone = 'up' }) {
  return (
    <article className="bg-white border border-brand-line rounded-2xl p-4 sm:p-5 shadow-[0_12px_35px_rgba(0,0,0,0.05)] min-w-0">
      <div className="text-[11px] sm:text-xs text-brand-muted truncate">{label}</div>
      <strong className="block font-heading font-extrabold text-[20px] sm:text-[26px] tracking-tight text-brand-ink mt-2.5 mb-1.5 tabular-nums">
        {value}
      </strong>
      {note && <span className={`text-[11px] ${tone === 'down' ? 'text-[#bf4800]' : 'text-brand-green'}`}>{note}</span>}
    </article>
  );
}