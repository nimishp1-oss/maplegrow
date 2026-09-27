import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="pt-28 sm:pt-40 pb-16 sm:pb-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto text-center"
      >
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#86868b]">Maple Grow</p>
        <h1 className="font-heading font-semibold text-[44px] sm:text-[64px] lg:text-[72px] leading-[1.05] tracking-[-0.02em] text-[#1d1d1f] mt-4">
          Your money. <span className="text-[#86868b]">In motion.</span>
        </h1>
        <p className="text-lg sm:text-xl text-[#6e6e73] leading-relaxed mt-6 max-w-xl mx-auto">
          See your budget, student debt, and investing plan in one place — and watch how small habits could grow by graduation.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
          <Link
            to="/register"
            className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm font-semibold px-7 py-3.5 transition-colors"
          >
            Create your free plan
          </Link>
          <Link to="/login" className="text-[#0071e3] hover:underline text-sm font-semibold">
            Sign in &gt;
          </Link>
        </div>
        <p className="text-xs text-[#86868b] mt-6">Sign in with Google in one click. No bank connection required.</p>
      </motion.div>
    </section>
  );
}