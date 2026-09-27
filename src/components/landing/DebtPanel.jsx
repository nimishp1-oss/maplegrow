import React from 'react';
import { motion } from 'framer-motion';
import DebtPaths from '@/components/shared/DebtPaths';

export default function DebtPanel() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-brand-line rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
    >
      <h2 className="font-heading font-bold text-base">The student debt picture</h2>
      <p className="text-xs text-brand-muted mt-1">U.S. student debt snapshot · illustrative comparison</p>
      <div className="font-heading font-extrabold text-[38px] tracking-tight mt-6 mb-6">
        $1.81T <small className="font-body font-medium text-xs text-brand-muted tracking-normal">estimated total student debt</small>
      </div>
      <DebtPaths />
      <p className="text-[10px] text-[#86868b] mt-6 leading-relaxed">Sample figures for illustration only; not live or verified official statistics.</p>
    </motion.article>
  );
}