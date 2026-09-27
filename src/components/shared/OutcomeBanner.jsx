import React from 'react';
import { Link } from 'react-router-dom';

export default function OutcomeBanner({ title, text, stats, cta }) {
  return (
    <article className="relative overflow-hidden mt-4 bg-brand-deep rounded-2xl text-white p-6 sm:p-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))] items-center">
      <div className="absolute w-56 h-56 rounded-full border border-white/10 -right-14 -top-32 shadow-[0_0_0_28px_rgba(255,255,255,0.03),0_0_0_55px_rgba(255,255,255,0.02)] pointer-events-none" />
      <div className="relative">
        <h2 className="font-heading font-bold text-base">{title}</h2>
        <p className="text-[#a1a1a6] text-xs leading-relaxed mt-1.5">{text}</p>
      </div>
      {stats.map((s) => (
        <div key={s.label} className="relative">
          <small className="block text-[#a1a1a6] text-[11px] mb-1.5">{s.label}</small>
          <strong className="font-heading font-extrabold text-2xl tabular-nums">{s.value}</strong>
          <em className="block not-italic text-[#a1a1a6] text-[10px] mt-1">{s.note}</em>
        </div>
      ))}
      {cta && (
        <Link to={cta.to} className="relative justify-self-start bg-brand-lime text-[#1d1d1f] font-bold rounded-xl px-4 py-3 text-xs whitespace-nowrap hover:brightness-95 transition">
          {cta.label}
        </Link>
      )}
    </article>
  );
}