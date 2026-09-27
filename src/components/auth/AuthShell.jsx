import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '@/components/brand/Logo';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-brand-paper">
      <aside className="hidden lg:flex flex-col justify-between bg-brand-deep text-white p-12 relative overflow-hidden">
        <div className="absolute -right-24 -top-32 w-96 h-96 rounded-full border border-white/10 shadow-[0_0_0_40px_rgba(255,255,255,0.03),0_0_0_80px_rgba(255,255,255,0.02)]" />
        <Link to="/" className="relative"><Logo light /></Link>
        <div className="relative">
          <h2 className="font-heading text-[40px] font-extrabold leading-[1.08] tracking-tight max-w-md">
            Build your future, <span className="text-brand-lime">one decision at a time.</span>
          </h2>
          <p className="text-[#a1a1a6] mt-5 max-w-sm leading-relaxed text-sm">
            Budget, track spending, and see how a small monthly habit could shape your graduation plan.
          </p>
        </div>
        <p className="relative text-xs text-white/40">Planning illustrations only · not financial advice</p>
      </aside>
      <main className="flex items-center justify-center p-6 sm:p-10">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }} className="w-full max-w-sm">
          <Link to="/" className="inline-block lg:hidden mb-10"><Logo /></Link>
          <h1 className="font-heading text-[30px] font-extrabold tracking-tight text-brand-ink">{title}</h1>
          <p className="text-sm text-brand-muted mt-2 mb-8">{subtitle}</p>
          {children}
          {footer && <div className="mt-8 text-sm text-brand-muted text-center">{footer}</div>}
        </motion.div>
      </main>
    </div>
  );
}