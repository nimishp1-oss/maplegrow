import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutGrid, Wallet, TrendingUp, GraduationCap } from 'lucide-react';
import Logo from '@/components/brand/Logo';

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutGrid },
  { to: '/finances', label: 'Personal finances', icon: Wallet },
  { to: '/investments', label: 'Investments', icon: TrendingUp },
  { to: '/plan', label: 'Graduation plan', icon: GraduationCap },
];

export default function Sidebar({ profile }) {
  const initials = (profile.full_name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-16 md:w-60 bg-white border-r border-brand-line px-2 md:px-4 py-6 flex flex-col">
      <Link to="/dashboard" className="px-1.5 md:px-2 mb-9"><Logo textClassName="hidden md:inline" /></Link>
      <div className="hidden md:block text-[10px] font-bold tracking-[1.2px] text-[#86868b] px-3 mb-2.5">YOUR MONEY PLAN</div>
      <nav className="grid gap-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to} to={to}
            className={({ isActive }) => `flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-brand-soft text-brand-green' : 'text-[#6e6e73] hover:bg-brand-soft hover:text-brand-green'}`}
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        <div className="hidden md:block bg-brand-sage rounded-2xl p-4 mb-4">
          <b className="font-heading text-[13px]">A little progress adds up.</b>
          <p className="text-xs text-[#6e6e73] leading-relaxed mt-1.5 mb-3">Your plan connects today's choices with the education goals ahead.</p>
          <Link to="/investments" className="inline-block bg-brand-green text-white rounded-lg px-3 py-2 text-[11px] font-bold">Explore my plan →</Link>
        </div>
        <div className="border-t border-brand-line pt-4 flex items-center justify-center md:justify-start gap-2.5 md:px-1">
          <div className="w-9 h-9 rounded-full bg-[#e8e8ed] grid place-items-center font-bold text-xs text-[#424245] shrink-0">{initials}</div>
          <div className="hidden md:block min-w-0">
            <b className="text-xs block truncate">{profile.full_name}</b>
            <small className="block text-[10px] text-brand-muted mt-0.5 truncate">{profile.school_year}</small>
          </div>
        </div>
      </div>
    </aside>
  );
}