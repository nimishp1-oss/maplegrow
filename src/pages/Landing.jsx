import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import LandingNav from '@/components/landing/LandingNav';
import Hero from '@/components/landing/Hero';
import MarketSection from '@/components/landing/MarketSection';
import DebtPanel from '@/components/landing/DebtPanel';
import { TOP_STOCKS, TOP_ETFS } from '@/lib/marketData';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f]">
      <LandingNav />
      <main>
        <Hero />
        <MarketSection
          id="stocks"
          invert
          eyebrow="Markets"
          title="Top 5 stocks."
          subtitle="What $100 invested in the biggest names could have grown into over five years."
          items={TOP_STOCKS}
          note="Illustrative growth lines using approximate historical values, rounded for clarity. Not live market data and not investment advice."
        />
        <MarketSection
          id="etfs"
          eyebrow="Markets"
          title="Top 5 ETFs."
          subtitle="Diversified funds, visualized — from steady index staples to higher-risk innovation plays."
          items={TOP_ETFS}
          note="Illustrative growth lines using approximate historical values, rounded for clarity. Not live market data and not investment advice."
        />
        <section id="debt" className="scroll-mt-16 bg-[#f5f5f7] py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#86868b] text-center">The bigger picture</p>
              <h2 className="font-heading font-semibold text-4xl sm:text-5xl tracking-[-0.02em] text-[#1d1d1f] mt-3 text-center">
                Student debt, in context.
              </h2>
              <p className="text-lg text-[#6e6e73] mt-4 text-center max-w-2xl mx-auto">
                A clear view of what you owe is where every good plan starts.
              </p>
              <div className="max-w-xl mx-auto mt-10">
                <DebtPanel />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="bg-[#f5f5f7] border-t border-[#d2d2d7]">
        <div className="max-w-5xl mx-auto px-6 py-10 text-xs text-[#86868b] space-y-4">
          <p>
            Maple Grow shows planning illustrations for education only. Stock and ETF growth lines are approximate historical
            examples — not live quotes, forecasts, or financial advice.
          </p>
          <nav className="flex gap-6">
            <Link to="/login" className="hover:text-[#1d1d1f] transition-colors">Sign in</Link>
            <Link to="/register" className="hover:text-[#1d1d1f] transition-colors">Create account</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}