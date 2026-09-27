import React from 'react';

export default function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-6 text-[11px] font-bold tracking-widest text-[#86868b]">
      <div className="h-px flex-1 bg-brand-line" />
      OR WITH EMAIL
      <div className="h-px flex-1 bg-brand-line" />
    </div>
  );
}