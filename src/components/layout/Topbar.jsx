import React from 'react';
import { useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LABELS = { '/dashboard': 'Overview', '/finances': 'Personal finances', '/investments': 'Investments', '/plan': 'Graduation plan' };

export default function Topbar() {
  const { pathname } = useLocation();
  return (
    <header className="h-16 sm:h-[75px] border-b border-brand-line flex items-center justify-between mb-7">
      <div className="text-xs text-brand-muted">
        Maple Grow <span className="text-[#86868b] mx-1">/</span> <b className="text-brand-ink">{LABELS[pathname]}</b>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-block border border-brand-line bg-white px-3 py-2 rounded-lg text-[11px] text-[#6e6e73]">Academic year 2026–27</span>
        <button onClick={() => base44.auth.logout('/')} className="flex items-center gap-1.5 text-xs font-bold text-brand-green hover:text-brand-deep transition-colors">
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>
    </header>
  );
}